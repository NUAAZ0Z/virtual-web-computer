<template>
  <Window class="issue-blog" :config="config"></Window>
</template>

<script setup>
import Window from '../../components/Window.vue'

const props = defineProps({
  config: Object,
})
</script>

<style scoped lang="scss">

</style>