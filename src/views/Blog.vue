<template>
  <div class="blog">
    <BlogNavbar :show="showNavbar" :shadow="showNavbarShadow" />
    <BlogHeader />
  </div>
</template>

<script setup>
import BlogNavbar from '../components/BlogNavbar.vue'
import BlogHeader from '../components/BlogHeader.vue'
import { ref } from 'vue'

const showNavbar = ref(true)
const showNavbarShadow = ref(false)
</script>

<style scoped lang="scss">
.blog {
  background-color: whitesmoke;
  width: 100%;
  min-height: 100%;
}
</style>
