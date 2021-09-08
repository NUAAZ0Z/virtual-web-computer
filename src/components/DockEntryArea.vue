<template>
  <div v-for="app in apps" :key="app.name"
       class="dock-entry" @click.stop="mountApp(app)"
  >
    <img :src="'/icons/apps/' + app.icon" alt="图标">
    <div class="dock-tooltip">
      {{ app.title }}
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useAppManager } from '../common/app-manager'

defineProps({
      apps: Array,
    },
)
const store = useStore()
const { mountApp } = useAppManager()
</script>

<style lang="scss">
@import "../assets/style/var";

.dock-entry {
  position: relative;
  width: 48px;
  height: 48px;
  margin: $dock-entry-margin;

  &:hover {
    filter: contrast(200%);

    .dock-tooltip {
      opacity: 1;
    }
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: fill;
  }

  .dock-tooltip {
    user-select: none;
    opacity: 0;
    position: absolute;
    font-size: 12px;
    bottom: $dock-height + $dock-margin;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: $dock-tooltip-background-color;
    white-space: nowrap;
    padding: 6px 16px;
    border-radius: $dock-border-radius;
    transition-delay: .6s;

    &:after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translate(-50%);
      height: 0;
      width: 0;
      border-left: $dock-margin * 0.8 solid transparent;
      border-right: $dock-margin * 0.8 solid transparent;
      border-top: $dock-margin solid $dock-tooltip-background-color;
    }
  }
}
</style>
