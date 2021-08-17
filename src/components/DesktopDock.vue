<template>
  <div class="desktop-dock">
    <div class="left">
      <DockEntryArea :apps="appAtDockLauncher" />
      <div class="dock-divider" />
    </div>
    <div class="center">
      <DockEntryArea :apps="appAtDockCenter" />
    </div>
    <div class="right">
      <div class="dock-divider" />
      <div class="dock-time dock-entry">
        <span>
          {{ date.getHours().toString().padStart(2, '0') }}:{{ date.getMinutes().toString().padStart(2, '0') }}
        </span>
        <span>
          {{ date.toLocaleDateString() }}
        </span>
        <div class="dock-tooltip">
          {{ date.toLocaleString() }}
        </div>
      </div>
      <DockEntryArea :apps="appAtDockTray" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { APP_AT_DOCK_CENTER, APP_AT_DOCK_LAUNCHER, APP_AT_DOCK_TRAY } from '../store/getter.type'
import { useStore } from 'vuex'
import DockEntryArea from './DockEntryArea.vue'

const date = ref(new Date())
let timer

onMounted(() => {
  timer = setInterval(() => {
    date.value = new Date()
  })
})

onUnmounted(() => {
  clearInterval(timer)
})

const store = useStore()
const appAtDockLauncher = computed(() => store.getters[APP_AT_DOCK_LAUNCHER])
const appAtDockCenter = computed(() => store.getters[APP_AT_DOCK_CENTER])
const appAtDockTray = computed(() => store.getters[APP_AT_DOCK_TRAY])
</script>

<style scoped lang="scss">
@use "sass:math";
@import "../assets/var";

@keyframes dock-in {
  0% {
    bottom: -$dock-margin * 4 - $dock-height;
  }
  100% {
    bottom: $dock-margin;
  }
}

.desktop-dock {
  position: fixed;
  margin: $dock-margin;
  bottom: 0;
  right: 0;
  left: 0;
  height: $dock-height;
  border-radius: $dock-border-radius;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  animation: dock-in .8s ease-out;
  z-index: 999999;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    backdrop-filter: blur(8px);
    background-color: rgba(#c2e9fb, .3);
    border-radius: $dock-border-radius;
    margin: math.div(-$dock-margin, 3);
    z-index: -1;
  }

  .right,
  .center,
  .left {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  //.left,
  //.right {
  //  min-width: 144px;
  //  max-width: 360px;
  //}

  .left {
    justify-content: flex-start;
  }

  .center {
    flex: 1;
  }

  .right {
    justify-content: flex-end;
  }

  .dock-divider {
    height: 42px;
    width: 0;
    border: 1px solid hsla(0, 0%, 100%, 0.3);
  }
}

.dock-time {
  display: flex;
  width: 72px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 14px;
  font-weight: bold;
}
</style>