<template>
  <router-view />
</template>

<script setup>
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md

import Bowser from 'bowser'
import { provide } from 'vue'

const deviceInfo = Bowser.parse(window.navigator.userAgent)
provide('deviceInfo', deviceInfo)

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100vw;
  position: relative;
}
</style>
