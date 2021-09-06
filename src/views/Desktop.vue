<template>
  <div class="desktop" @contextmenu.prevent @mouseup.right="onRightMouseUp" @mouseup.left="showRightClickMenu=false">
    <DesktopGrid />
    <component :is="app.component" v-for="app in appMounted" :key="app.name" :config="getAppConfig(app)" />
    <DesktopDock />
    <div class="desktop-bg" :style="{'backgroundImage': desktopBg}" />
    <transition name="fade">
      <DefaultTip v-if="!bgLoaded" type="loading" />
    </transition>
    <DesktopRightMenu v-model:show="showRightClickMenu" :event="rightClickEvent" />
  </div>
</template>

<script setup>
import DefaultTip from '../components/DefaultTip.vue'
import DesktopDock from '../components/DesktopDock.vue'
import DesktopGrid from '../components/DesktopGrid.vue'
import DesktopRightMenu from '../components/DesktopRightMenu.vue'
import { useStore } from 'vuex'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { APP_MOUNTED } from '../store/getter.type'
import { useAppManager } from '../common/app-manager'
import { CURRENT_WALLPAPER } from '../store/state.type'

const store = useStore()
const { initializeAppState } = useAppManager()
const appMounted = computed(() => store.getters[APP_MOUNTED])
const wallpaper = computed(() => store.getters[CURRENT_WALLPAPER])
const bgLoaded = ref(false)
const loadingFailed = ref(false)
const showRightClickMenu = ref(false)
const rightClickEvent = ref({})

const getAppConfig = (app) => {
  const copy = { ...app }
  delete copy.component
  return copy
}

const desktopBg = computed(() => `url("${wallpaper.value}")`)

const initializeBg = () => {
  // 等待桌面背景图加载完毕再真正显示桌面内容
  bgLoaded.value = false
  const img = new Image()
  img.src = wallpaper.value
  img.onload = () => {
    bgLoaded.value = true
  }
  img.onerror = () => {
    loadingFailed.value = true
  }
}

onBeforeMount(async () => {
  // 进入时，在壁纸加载完成前显示加载状态
  initializeBg()
  // 根据查询参数初始化App状态
  await initializeAppState()
})

const onRightMouseUp = (e) => {
  rightClickEvent.value = e
  showRightClickMenu.value = true
}

watch(wallpaper, async () => {
  initializeBg()
})
</script>

<style scoped lang="scss">

.desktop {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;

  .desktop-bg {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: -1;
  }
}

</style>
