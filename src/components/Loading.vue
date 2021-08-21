<template>
  <div class="loading">
    <img src="/images/loading.png" alt="加载中">
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
@keyframes loading {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0);
  }
}

.loading {
  position: absolute;
  content: "";
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  background-color: whitesmoke;

  display: flex;
  justify-content: center;
  align-items: center;

  $img-size: 240px;

  img {
    width: $img-size;
    height: $img-size;
    animation: loading 2s ease-in-out infinite forwards;
  }
}
</style>