<template>
  <ul v-show="show" class="desktop-right-menu" :style="rightMenuStyle" @click.stop="emits('update:show', false)">
    <li v-for="(config, index) in menus" :key="index" class="menu-item" @click="config.func">
      <span>{{ config.text }}</span>
    </li>
  </ul>
</template>

<script setup>
import { ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  show: Boolean,
  position: Object,
  menus: Array,
})
const emits = defineEmits([
  'update:show',
])
const store = useStore()

const rightMenuStyle = ref({})

const { show, position, menus } = toRefs(props)

const padding = 4
const menuWidth = 240 + padding * 2
const menuHeight = padding + (36 + padding) * menus.value.length
watch(position, pos => {
  const whVar = {
    '--height': menuHeight + 'px',
    '--width': menuWidth + 'px',
  }
  const { clientX, clientY } = pos
  let top, left, right, bottom
  if (clientX + menuWidth > document.body.clientWidth) {
    right = (document.body.clientWidth - clientX - padding) + 'px'
  } else {
    left = (clientX + padding) + 'px'
  }

  if (clientY + menuHeight > document.body.clientHeight) {
    bottom = (document.body.clientHeight - clientY - padding) + 'px'
  } else {
    top = (clientY + padding) + 'px'
  }
  rightMenuStyle.value = { ...whVar, top, left, right, bottom }
})
</script>

<style scoped lang="scss">
@import "../assets/style/mixin";

$padding: 4px;
$item-width: 240px;
$item-height: 36px;
$border-radius: 8px;

@keyframes menu-in {
  0% {
    opacity: 0;
    height: 0;
    width: 0;
  }

  100% {
    opacity: 1;
    height: var(--height);
    width: var(--width);
  }
}

.desktop-right-menu {

  @include gen-absolute(auto, auto, auto, auto);
  background-color: #eff2f5;
  border-radius: $border-radius;
  padding: 0 $padding;
  animation: menu-in .1s ease-out;
  overflow: hidden;
  opacity: 1;
  width: $item-width + $padding * 2;
  z-index: 99999999;
  box-shadow: 0 0 6px 6px rgb(black, 0.02);
  font-weight: bold;

  .menu-item {
    height: $item-height;
    min-width: $item-width;
    line-height: $item-height;
    font-size: 16px;
    padding-left: 12px;
    margin: $padding 0;
    transition: background-color .2s ease-out;
    border-radius: $border-radius;
    user-select: none;

    .iconfont {
      margin-right: $padding * 2;
    }

    &:hover {
      background-color: rgba(black, .05);
    }
  }
}
</style>
