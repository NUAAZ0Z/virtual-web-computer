<template>
  <div class="desktop">
    <DesktopGrid />
    <component :is="app.component" v-for="app in appMounted" :key="app.name" :config="getAppConfig(app)" />
    <DesktopDock />
    <div class="desktop-bg" />
    <transition name="fade">
      <DefaultTip v-if="!bgLoaded" type="loading" />
    </transition>
  </div>
</template>

<script setup>
import DesktopGrid from '../components/DesktopGrid.vue'
import DesktopDock from '../components/DesktopDock.vue'
import DefaultTip from '../components/DefaultTip.vue'
import { useStore } from 'vuex'
import { computed, onBeforeMount, ref } from 'vue'
import { APP_MOUNTED } from '../store/getter.type'

const store = useStore()
const appMounted = computed(() => store.getters[APP_MOUNTED])
const bgLoaded = ref(false)
const loadingFailed = ref(false)

const getAppConfig = (app) => {
  const copy = {...app}
  delete copy.component
  return copy
}

const bgImgUrl = 'https://images.unsplash.com/photo-1512273222628-4daea6e55abb?w=1920&q=90&auto=format'
const desktopBg = `url("${bgImgUrl}") center no-repeat`

onBeforeMount(() => {
  // 等待桌面背景图加载完毕再真正显示桌面内容
  const img = new Image()
  img.src = bgImgUrl
  img.onload = () => {
    bgLoaded.value = true
  }
  img.onerror = () => {
    loadingFailed.value = true
  }
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
    background: v-bind(desktopBg);
    background-size: cover;
    z-index: -1;
  }
}

</style>