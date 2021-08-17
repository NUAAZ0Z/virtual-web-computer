<template>
  <DesktopGrid />
  <component :is="app.component" v-for="app in appMounted" :key="app.name" :config="getAppConfig(app)" />
  <DesktopDock />
  <div class="desktop-bg" />
</template>

<script setup>
import DesktopGrid from '../components/DesktopGrid.vue'
import DesktopDock from '../components/DesktopDock.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { APP_MOUNTED } from '../store/getter.type'

const store = useStore()
const appMounted = computed(() => store.getters[APP_MOUNTED])

const getAppConfig = (app) => {
  const copy = {...app}
  delete copy.component
  return copy
}
</script>

<style scoped lang="scss">
.desktop-bg {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: url("https://images.unsplash.com/photo-1512273222628-4daea6e55abb?w=1920&q=90&auto=format") center no-repeat;
  background-size: cover;
  z-index: -1;
}
</style>