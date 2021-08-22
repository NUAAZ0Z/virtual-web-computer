<template>
  <Window class="computer" :config="config">
  </Window>
</template>

<script setup>
import Window from '../../components/Window.vue'

defineProps({
  config: Object,
})
</script>

<style scoped lang="scss">
@import "../../assets/style/var";

$window-width: 320px;
$window-height: 480px;
.computer {
  width: $window-width;
  height: $window-height;
  top: calc(#{$desktop-grid-height} * 0.5 - #{$window-height*0.5});
  left: calc(50% - #{$window-width} * 0.5);
}
</style>