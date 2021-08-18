<template>
  <div v-if="loading" class="loading-wrapper">
    <div v-if="marquee" class="loading-marquee-container">
      <div class="loading-marquee"></div>
    </div>
    <div v-else class="loading-progress-container">
      <div class="loading-progress" :style="loadingProgressStyle"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  marquee: {
    type: Boolean,
    default: () => false,
  },
  progress: {
    type: Number,
    default: () => 25,
  },
  loading: {
    type: Boolean,
    default: () => true,
  },
})

const loadingProgressStyle = {
  width: props.progress + '%',
}
</script>

<style lang="scss">
@import "../assets/style/var";

$progress-background-size: 0.8rem;

@keyframes progress-marquee {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: $progress-background-size 0;
  }
}

@mixin progress-thumb {
  border-radius: 8px;
  box-shadow: $window-shadow;
  background-color: rgba(0, 0, 0.4);
  background-image: linear-gradient(45deg, hsla(0, 0%, 100%, .6) 25%, transparent 0, transparent 50%, hsla(0, 0%, 100%, .6) 0, hsla(0, 0%, 100%, .6) 75%, transparent 0, transparent);
  background-size: $progress-background-size $progress-background-size;
}

.loading-wrapper {
  position: fixed;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 60vw;
  height: 14px;
  background-color: rgba($window-background-color, .3);
  backdrop-filter: blur(8px);
  z-index: 9999999;
  box-shadow: 0 0 10px 4px rgb(#b28fce, .1);
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, .8);

  .loading-progress-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 4px;

    .loading-progress {
      height: 100%;
      width: 100%;
      transition: width .1s linear;
      @include progress-thumb();
    }
  }

  .loading-marquee-container {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;

    .loading-marquee {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      @include progress-thumb();
      width: calc(100% - 12px);
      height: calc(100% - 6px);
      margin: auto;
      animation: progress-marquee 0.15s linear infinite;
    }
  }
}
</style>
