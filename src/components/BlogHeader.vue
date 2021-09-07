<template>
  <header class="blog-header" :style="{'backgroundImage': 'url(' + wallpaper + ')'}">
    <div class="title-box">
      <h1>{{ title }}</h1>
    </div>
  </header>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { CURRENT_WALLPAPER } from '../store/state.type'

const store = useStore()
const wallpaper = computed(() => store.getters[CURRENT_WALLPAPER])
const title = ref('📚 标题')
</script>

<style scoped lang="scss">
@import "../assets/style/var";
@import "../assets/style/mixin";

.blog-header {
  height: 40vh;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  @include gen-flex(row, center, center);
  color: white;

  .title-box {
    text-shadow: 0 0 4px #1c1f21;
  }
}
</style>
