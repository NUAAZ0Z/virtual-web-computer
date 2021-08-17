<template>
  <div class="window" :style="windowStyle" :class="[windowStatusClass,windowDraggedClass]"
       @click.stop="onWindowClicked"
  >
    <div class="title-bar" :class="{'title-bar-transparent': config.transparentTitleBar}">
      <img class="icon" :src="'/icons/uos/' + config.icon" alt="" />
      <div class="title">
        <span>{{ config.title }}</span>
      </div>
      <div class="drag-area" @mousedown="onMouseDown" @mouseup="onMouseUp" />
      <div class="switch">
        <div v-if="config.enableMenu" class="menu">
          <i class="iconfont icon-menu"></i>
        </div>
        <div v-if="!config.disableMinimize && notMobile" class="minimize" @click.stop="minimizeWindow">
          <i class="iconfont icon-minimize"></i>
        </div>
        <div v-if="windowStatus===WINDOW_NORMAL && config.enableMaximize && notMobile" class="maximize"
             @click.stop="maximizeWindow"
        >
          <i class="iconfont icon-maximize"></i>
        </div>
        <div v-if="windowStatus===WINDOW_MAXIMIZED && config.enableMaximize && notMobile" class="un-maximize"
             @click.stop="unMaximizeWindow"
        >
          <i class="iconfont icon-unmaximize"></i>
        </div>
        <div class="close" @click.stop="killApp(config.name)">
          <i class="iconfont icon-close"></i>
        </div>
      </div>
    </div>
    <div class="content"></div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { MOUNT_APP, UNMOUNT_APP } from '../store/mutation.type'
import {
  useWindowStateManager,
  WINDOW_NORMAL,
  WINDOW_MINIMIZED,
  WINDOW_MAXIMIZED,
} from '../common/window-state-manager'
import { computed, inject, reactive, ref, watch } from 'vue'
import { ACTIVE_APP } from '../store/state.type'

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
const windowStyle = reactive({
  backgroundColor: props.config.bgColor,
  zIndex: updateZIndex(),
  top: undefined,
  left: undefined,
})

const deviceInfo = inject('deviceInfo')
const isMobile = deviceInfo.platform.type === 'mobile'
const notMobile = !isMobile

// 窗口状态类绑定，手机端默认窗口最大化
const windowStatusClass = ref(!!isMobile ? 'window-maximized-mobile' : '')
const store = useStore()
const activeApp = computed(() => store.state.apps[ACTIVE_APP])

// 关闭应用
const killApp = (appName) => {
  windowStatusClass.value = 'window-closed'
  // 在窗口关闭动画结束后再卸载
  setTimeout(() => {
    store.commit(UNMOUNT_APP, appName)
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
  store.commit(MOUNT_APP, props.config.name)
}

//////////////////////////////// Drag Begin //////////////////////////
let shiftX, shiftY, windowWidth, windowHeight, clientWidth, clientHeight

const windowDraggedClass = ref('')

const onMouseMove = (event) => {
  const left = event.pageX - shiftX
  const top = event.pageY - shiftY
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

const onMouseDown = (event) => {
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

  shiftX = event.clientX - left
  shiftY = event.clientY - top

  window.addEventListener('mousemove', onMouseMove)
}

const onMouseUp = () => {
  windowDraggedClass.value = ''
  window.removeEventListener('mousemove', onMouseMove)
}
//////////////////////////////// Drag End //////////////////////////
</script>

<style scoped lang="scss">
@use "sass:math";
@import "../assets/var";

@keyframes window-in {
  0% {
    transform: scale(0.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes window-close {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

@keyframes window-minimize {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(0);
    bottom: $dock-height + $dock-margin;
  }
}

.window {
  position: absolute;
  opacity: 1;
  top: calc(50% - #{math.div($window-default-height, 2)});
  left: calc(50% - #{math.div($window-default-width, 2)});
  background-color: $window-background-color;
  width: $window-default-width;
  height: $window-default-height;
  //max-height: calc(100% - #{$dock-height + $dock-margin * 2});
  border-radius: $window-border-radius;
  box-shadow: $window-shadow;
  animation: window-in .2s ease-out;
  transition: all .1s ease-out;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  //消除transition，否则每次位置更新都需要动画过度渲染，导致拖拽不跟手
  &-dragged {
    transition: none ! important;
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
  height: calc(100% - #{$dock-height + $dock-margin * 2 + $window-maximized-margin * 2}) !important;

  &-mobile {
    left: $window-maximized-margin !important;
    top: $window-maximized-margin !important;
    width: calc(100% - #{$window-maximized-margin * 2}) !important;
    height: calc(100% - #{$window-maximized-margin * 2}) !important;
  }
}

.window .title-bar {
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
  }
}
</style>