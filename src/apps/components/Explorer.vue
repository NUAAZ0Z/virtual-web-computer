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

</style>