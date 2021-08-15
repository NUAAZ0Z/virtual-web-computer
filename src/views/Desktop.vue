<template>
  <DesktopGrid />
  <DesktopDock />
  <div class="desktop-bg" />
</template>

<script setup>
import DesktopGrid from '../components/DesktopGrid.vue'
import DesktopDock from '../components/DesktopDock.vue'
</script>

<style scoped lang="scss">
.desktop-bg {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: url("https://images.unsplash.com/photo-1512273222628-4daea6e55abb") center no-repeat;
  background-size: cover;
  z-index: -1;
}
</style>