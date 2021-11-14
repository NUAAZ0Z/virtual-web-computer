<template>
  <header
    class="blog-header" :style="{'backgroundImage': 'url(' + wallpaper + ')'}"
    @contextmenu.prevent @mouseup.right="onRightMouseUp" @mouseup.left="showRightClickWidget=false"
  >
    <div class="title-box">
      <h1>{{ title }}</h1>
    </div>
  </header>
  <RightClickMenu v-model:show="showRightClickWidget" :position="clickPosition" :menus="menus" />
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { CURRENT_WALLPAPER } from '../store/state.type'
import RightClickMenu from './RightClickMenu.vue'
import { SWITCH_WALLPAPER } from '../store/mutation.type'
import { useRightClick } from '../common/right-click'

const store = useStore()
const wallpaper = computed(() => store.getters[CURRENT_WALLPAPER])
const title = ref('📚 标题')

const { showRightClickWidget, onRightMouseUp, clickPosition } = useRightClick()
const menus = [
  {
    text: '🔄 刷新',
    func: () => {
      location.reload()
    },
  },
  {
    text: '🖼️ 切换壁纸',
    func: () => {
      store.commit(SWITCH_WALLPAPER)
    },
  },
]
</script>

<style scoped lang="scss">
@import "../assets/style/var";
@import "../assets/style/mixin";

.blog-header {
  height: 25rem;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  @include gen-flex(row, center, center);
  color: white;
  transition: all ease-out .3s;

  @include media('<=tablet') {
    height: 20rem;
  }

  .title-box {
    text-shadow: 0 0 4px #1c1f21;
    animation: fadeInUp ease-out .5s;
  }
}
</style>
