<template>
  <Window class="explorer" :config="config"></Window>
</template>

<script setup>
import Window from '../../components/Window.vue'

defineProps({
  config: Object,
})
</script>

<style scoped lang="scss">
@use "sass:math";

$window-width: 378px;
$window-height: 756px;
.explorer {
  width: $window-width;
  height: $window-height;
  top: calc(50% - #{math.div($window-height, 2)});
  left: calc(50% - #{math.div($window-width, 2)});
}
</style>