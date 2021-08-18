<template>
  <div class="desktop-grid">
    <div v-for="app in appAtDesktop"
         :key="app.name"
         class="desktop-entry"
         @click="onEntryClicked(app.name)"
         @dblclick="launchApp(app.name)"
    >
      <img class="icon" :src="'/icons/uos/' + app.icon" alt="图标">
      <div class="label">
        {{ app.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { MOUNT_APP } from '../store/mutation.type'
import { computed, inject } from 'vue'
import { APP_AT_DESKTOP } from '../store/getter.type'

const store = useStore()
const launchApp = (appName) => {
  store.commit(MOUNT_APP, appName)
}
const appAtDesktop = computed(() => store.getters[APP_AT_DESKTOP])

const deviceInfo = inject('deviceInfo')

const notDesktop = deviceInfo.platform.type === 'desktop'
const onEntryClicked = (appName) => {
  if (!notDesktop) {
    launchApp(appName)
  }
}

</script>

<style scoped lang="scss">
@use "sass:math";
@import "../assets/var";

$factor: 0.8;
$desktop-entry-width: 72px;
$desktop-entry-height: 108px;

.desktop-grid {
  display: grid;
  padding: $desktop-entry-gap;
  grid-template-columns: repeat(auto-fill, $desktop-entry-width);
  grid-template-rows: repeat(auto-fill, $desktop-entry-height);
  grid-auto-flow: column;
  grid-column-gap: $desktop-entry-gap;
  width: 100%;
  height: calc(100% - #{$dock-margin*2} - #{$dock-height});

  .desktop-entry {
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    padding: 12px;
    font-weight: bold;

    &:hover {
      .icon {
        filter: contrast(200%);
      }

      background-color: rgba($highlight-color, 20%);
    }

    &:active {
      background-color: rgba($highlight-color, 40%);
    }

    .icon {
      height: 48px;
      width: 48px;
      background-repeat: no-repeat;
      background-size: cover;
      object-fit: cover;
    }

    .label {
      width: $desktop-entry-width;
      color: white;
      font-size: 13px;
      text-align: center;
      overflow: hidden;
      word-break: break-all;
      hyphens: manual;
      overflow-wrap: break-word;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-shadow: 0 0 4px black;
    }
  }
}
</style>