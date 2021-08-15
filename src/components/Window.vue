<template>
  <div class="window">
    <div class="title-bar">
      <div class="icon">
        <img :src="'/icons/uos/' + config.icon" alt="" />
      </div>
      <div class="title">
        <span>{{ config.title }}</span>
      </div>
      <div class="switch">
        <div v-if="config.enableMenu" class="menu">
          <i class="iconfont icon-menu"></i>
        </div>
        <div v-if="!config.disableMinimize" class="minimize" @click.stop="minimizeWindow">
          <i class="iconfont icon-minimize"></i>
        </div>
        <div v-if="windowStatus===WINDOW_NORMAL && config.enableMaximize" class="maximize" @click.stop="maximizeWindow">
          <i class="iconfont icon-maximize"></i>
        </div>
        <div v-if="windowStatus===WINDOW_MAXIMIZED && config.enableMaximize" class="un-maximize"
             @click.stop="unMaximizeWindow"
        >
          <i class="iconfont icon-unmaximize"></i>
        </div>
        <div class="close" @click.stop="killApp(config.name)">
          <i class="iconfont icon-close"></i>
        </div>
      </div>
    </div>
    <div class="content"></div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { UNMOUNT_APP } from '../store/mutation.type'
import {
  useWindowStateManager,
  WINDOW_NORMAL,
  WINDOW_MINIMIZED,
  WINDOW_MAXIMIZED,
} from '../common/window-state-manager'

defineProps({
  config: Object,
})

const store = useStore()
const killApp = (appName) => {
  store.commit(UNMOUNT_APP, appName)
}

const {windowStatus, minimizeWindow, maximizeWindow, unMaximizeWindow} = useWindowStateManager()

</script>

<style scoped lang="scss">

</style>