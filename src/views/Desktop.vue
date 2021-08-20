<template>
  <div class="desktop">
    <DesktopGrid />
    <component :is="app.component" v-for="app in appMounted" :key="app.name" :config="getAppConfig(app)" />
    <DesktopDock />
    <div class="desktop-bg" />
    <transition name="fade">
      <div v-if="!bgLoaded" class="loading">
        <img src="/images/loading.png" alt="加载中">
      </div>
    </transition>
  </div>
</template>

<script setup>
import DesktopGrid from '../components/DesktopGrid.vue'
import DesktopDock from '../components/DesktopDock.vue'
import Loading from '../components/Loading.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
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

// 等待桌面背景图加载完毕再真正显示桌面内容
!(() => {
  const img = new Image()
  img.src = bgImgUrl
  img.onload = () => {
    bgLoaded.value = true
  }
  img.onerror = () => {
    loadingFailed.value = true
  }
})()
</script>

<style scoped lang="scss">
@import "../assets/style/mixin";

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

@keyframes loading {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0);
  }
}

.loading {
  position: absolute;
  content: "";
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  background-color: whitesmoke;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 360px;
    height: 360px;
    animation: loading 2s ease-in-out infinite forwards;

    @include tablet {
      width: 480px;
      height: 480px;
    }
  }
}
</style>