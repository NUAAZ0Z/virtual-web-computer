<template>
  <div
    class="window" :style="windowStyle" :class="[windowStatusClass,windowDraggedClass]"
    @click.stop="onWindowClicked" @mouseup.right.stop
  >
    <div class="window-title-bar" :class="{'window-title-bar-transparent': config.transparentTitleBar}">
      <img class="icon" :src="'/icons/apps/' + config.icon" alt="" />
      <div class="title">
        <span>{{ config.title }}</span>
      </div>
      <div
        class="drag-area" @mousedown="onMouseOrTouchDown" @mouseup="onMouseOrTouchUp"
        @touchstart="onMouseOrTouchDown" @touchend="onMouseOrTouchUp"
      />
      <div class="switch">
        <div v-if="config.enableMenu" class="menu">
          <i class="iconfont icon-menu"></i>
        </div>
        <div v-if="!config.disableMinimize" class="minimize" @click.stop="minimizeWindow">
          <i class="iconfont icon-minimize"></i>
        </div>
        <div
          v-if="windowStatus===WINDOW_NORMAL && config.enableMaximize" class="maximize"
          @click.stop="maximizeWindow"
        >
          <i class="iconfont icon-maximize"></i>
        </div>
        <div
          v-if="windowStatus===WINDOW_MAXIMIZED && config.enableMaximize" class="un-maximize"
          @click.stop="unMaximizeWindow"
        >
          <i class="iconfont icon-unmaximize"></i>
        </div>
        <div class="close" @click.stop="killApp(config.name)">
          <i class="iconfont icon-close"></i>
        </div>
      </div>
    </div>
    <div class="window-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { MOUNT_APP } from '../store/mutation.type'
import {
  useWindowStateManager,
  WINDOW_NORMAL,
  WINDOW_MINIMIZED,
  WINDOW_MAXIMIZED,
} from '../common/window-state-manager'
import { computed, inject, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { ACTIVE_APP } from '../store/state.type'
import { useAppManager } from '../common/app-manager'

const props = defineProps({
  config: Object,
})
const {
  windowStatus,
  oldWindowStatus,
  minimizeWindow,
  maximizeWindow,
  unMaximizeWindow,
  updateZIndex,
} = useWindowStateManager()
const { unmountApp } = useAppManager()
const windowStyle = reactive({
  backgroundColor: props.config.bgColor,
  zIndex: updateZIndex(),
  top: undefined,
  left: undefined,
})

const deviceInfo = inject('deviceInfo')
const isDesktop = deviceInfo.platform.type === 'desktop'

// 窗口状态类绑定，手机端默认窗口最大化
const windowStatusClass = ref('')
const store = useStore()
const activeApp = computed(() => store.state.apps[ACTIVE_APP])

// 关闭应用
const killApp = (appName) => {
  // 关闭时需要在当前窗口状态追加样式类，否则会造成抖动，比如最大化时关闭，窗口会恢复默认大小造成画面抖动
  windowStatusClass.value = `${windowStatusClass.value} window-closed`
  // 在窗口关闭动画结束后再卸载
  setTimeout(() => {
    // store.commit(UNMOUNT_APP, appName)
    unmountApp(appName)
  }, 200)
}

// 监视窗口状态，更换样式类
watch(windowStatus, value => {
  if (value === WINDOW_MAXIMIZED) {
    windowStatusClass.value = 'window-maximized'
  } else if (value === WINDOW_MINIMIZED) {
    windowStatusClass.value = 'window-minimized'
  } else {
    windowStatusClass.value = ''
  }
})
// 监视当前活跃的应用，如果是当前应用，则让窗口状态恢复，如最小化后重新打开
watch(activeApp, val => {
  if (props.config.name === val) {
    windowStatus.value = oldWindowStatus.value
    windowStyle.zIndex = updateZIndex()
  }
})

const onWindowClicked = () => {
  windowStyle.zIndex = updateZIndex()
  // 通过mountApp使得窗口
  store.commit(MOUNT_APP, props.config.name)
}

// 当浏览器调整大小时，清除行内样式，让所有窗口回归中央
const onBrowserWindowResized = () => {
  windowStyle.left = undefined
  windowStyle.top = undefined
}

onMounted(() => {
  window.addEventListener('resize', onBrowserWindowResized)
})

onUnmounted(() => {
  window.removeEventListener('resize', onBrowserWindowResized)
})

//////////////////////////////// Drag Begin //////////////////////////
let shiftX, shiftY, windowWidth, windowHeight, clientWidth, clientHeight

const windowDraggedClass = ref('')

const onMouseMove = (event) => {
  let left, top
  if (event.touches) {
    // 触摸拖动
    left = event.touches[0].pageX - shiftX
    top = event.touches[0].pageY - shiftY
  } else {
    // 鼠标拖动
    left = event.pageX - shiftX
    top = event.pageY - shiftY
  }
  // 防止超出屏幕区域
  if (left < 0 || top < 0) {
    return
  }
  if (left + windowWidth > clientWidth || top + windowHeight > clientHeight) {
    return
  }
  windowStyle.left = `${left}px`
  windowStyle.top = `${top}px`
}

const onMouseOrTouchDown = (event) => {
  event.preventDefault()

  windowStyle.zIndex = updateZIndex()
  windowDraggedClass.value = 'window-dragged'
  // 当前窗口的根节点
  const windowElement = event.target.parentElement.parentElement
  const computedStyle = window.getComputedStyle(windowElement)
  // *1 将字符串转化为数字
  const left = computedStyle.left.slice(0, -2) * 1
  const top = computedStyle.top.slice(0, -2) * 1
  windowHeight = computedStyle.height.slice(0, -2) * 1
  windowWidth = computedStyle.width.slice(0, -2) * 1
  clientWidth = document.body.clientWidth
  clientHeight = document.body.clientHeight

  if (event.touches) {
    // 触摸拖动
    shiftX = event.touches[0].clientX - left
    shiftY = event.touches[0].clientY - top
  } else {
    // 鼠标拖动
    shiftX = event.clientX - left
    shiftY = event.clientY - top
  }

  if (isDesktop) {
    window.addEventListener('mousemove', onMouseMove)
  } else {
    window.addEventListener('touchmove', onMouseMove, { passive: true })
  }
}

const onMouseOrTouchUp = () => {
  windowDraggedClass.value = ''
  if (isDesktop) {
    window.removeEventListener('mousemove', onMouseMove)
  } else {
    window.removeEventListener('touchmove', onMouseMove, false)
  }
}
//////////////////////////////// Drag End //////////////////////////
</script>

<style scoped lang="scss">
@import "../assets/style/var";
@import "../assets/style/mixin";

@keyframes window-in {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes window-close {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes window-minimize {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
    bottom: $dock-height + $dock-margin;
  }
}

.window {
  --window-height: #{$window-default-height};
  --window-width: #{$window-default-width};
  position: absolute;
  top: calc(#{$desktop-grid-height} * 0.5 - var(--window-height) * 0.5);
  left: calc(50% - var(--window-width) * 0.5);
  background-color: $window-background-color;
  width: var(--window-width);
  height: var(--window-height);
  border-radius: $window-border-radius;
  box-shadow: $window-shadow;
  animation: window-in .3s cubic-bezier(0, 1, 0, 1);
  transition: all .5s cubic-bezier(0, 1, 0, 1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  opacity: 1;
  overflow: hidden;
  //消除transition，否则每次位置更新都需要动画过度渲染，导致拖拽不跟手
  &-dragged {
    transition: none ! important;
  }

  @include media('<=desktop', '>=tablet') {
    $size-var: 84vh;
    --window-width: #{$size-var * 0.5};
    --window-height: #{$size-var};
  }

  @include media('<tablet') {
    border-radius: 0;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;

    .window-title-bar {
      border-top-right-radius: 0 !important;
      border-top-left-radius: 0 !important;
    }
  }
}

.window-closed {
  animation: window-close .2s ease-in forwards;
}

.window-minimized {
  animation: window-close .2s ease-in forwards;
  margin: unset;
}

.window-maximized {
  left: $window-maximized-margin !important;
  top: $window-maximized-margin !important;
  width: calc(100% - #{$window-maximized-margin * 2}) !important;
  // 4px 是因为Dock的蒙层的margin为-4px，需要避开这区域
  height: calc(100% - #{$dock-height + $dock-margin + $window-maximized-margin * 2 + 4px}) !important;
}

.window .window-title-bar {
  user-select: none;
  height: $window-title-height;
  width: 100%;
  background-color: white;
  border-top-right-radius: $window-border-radius;
  border-top-left-radius: $window-border-radius;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  text-shadow: 0 0 1px black;
  flex: 0 0 $window-title-height;

  &-transparent {
    background: transparent !important;
  }

  .icon {
    width: 28px;
    margin-left: $window-border-radius;
    height: 28px;
    object-fit: cover;

    &:hover {
      filter: contrast(200%);
    }
  }

  .title {
    text-align: left;
    font-size: 14px;
    line-height: $window-title-height;
    padding: 0 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .drag-area {
    flex: 1;
    cursor: move;
    height: 100%;
  }

  .switch {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-content: center;
    border-top-right-radius: $window-border-radius;
    height: 100%;

    > div {
      display: flex;
      justify-content: center;
      align-content: center;
      width: 48px;
      flex-direction: column;
      text-align: center;
    }

    > div:last-child {
      border-top-right-radius: $window-border-radius;
    }

    > div:hover {
      background-color: #F8F8F8;
      font-weight: bold;
    }

    @include media('<tablet') {
      .maximize,
      .minimize,
      .un-maximize {
        display: none;
      }
    }
  }
}

.window-body {
  flex: 1;
  overflow: hidden;
  height: 0;
}
</style>
