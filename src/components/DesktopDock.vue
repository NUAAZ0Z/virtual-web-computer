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
          {{ dateInfo.hourAndMinute }}
        </span>
        <span>
          {{ dateInfo.localeDateString }}
        </span>
        <div class="dock-tooltip">
          {{ dateInfo.localeString }}
        </div>
      </div>
      <DockEntryArea :apps="appAtDockTray" />
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { APP_AT_DOCK_CENTER, APP_AT_DOCK_LAUNCHER, APP_AT_DOCK_TRAY } from '../store/getter.type'
import { useStore } from 'vuex'
import DockEntryArea from './DockEntryArea.vue'

const date = ref(new Date())
let timer

const dateInfo = computed(() => {
      const d = date.value
      return {
        hourAndMinute: d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0'),
        localeDateString: d.toLocaleDateString(),
        localeString: d.toLocaleString(),
      }
    },
)

onMounted(() => {
  timer = setInterval(() => {
    date.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const store = useStore()
const appAtDockLauncher = computed(() => store.getters[APP_AT_DOCK_LAUNCHER])
const appAtDockCenter = computed(() => store.getters[APP_AT_DOCK_CENTER])
const appAtDockTray = computed(() => store.getters[APP_AT_DOCK_TRAY])

const deviceInfo = inject('deviceInfo')
</script>

<style scoped lang="scss">
@import "../assets/style/var";
@import "../assets/style/mixin";

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
  animation: dock-in .8s ease-out;
  z-index: 9999;

  @include media('<tablet') {
    // Dock在手机端被窗口覆盖，其他类型设备上Dock常显，Dock的z-index高于Window
    z-index: 999;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    @include blur-bg();
    border-radius: $dock-border-radius;
    margin: -$dock-margin * 0.3333;
    z-index: -1;
  }

  .right,
  .center,
  .left {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  @include media('<tablet') {
    .left,
    .right {
      display: none;
    }
  }

  .left {
    justify-content: flex-start;
    @include gen-absolute(0, auto, 0, 0);
  }

  .center {
    padding: 0;

    @include media('>=tablet') {
      padding: 0 160px;
    }
  }

  .right {
    justify-content: flex-end;
    @include gen-absolute(0, 0, 0, auto);
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
