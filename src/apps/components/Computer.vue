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
@use "sass:math";

$window-width: 320px;
$window-height: 480px;
.computer {
  width: $window-width;
  height: $window-height;
  top: calc(50% - #{math.div($window-height, 2)});
  left: calc(50% - #{math.div($window-width, 2)});
}
</style>