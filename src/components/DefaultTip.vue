<template>
  <div v-if="type==='loading'" class="loading" @click="onClick">
    <img src="../assets/images/loading.png" alt="加载中">
  </div>
  <div v-else-if="type==='no-data'" class="no-data" @click="onClick">
    <img src="../assets/images/no-data.png" alt="无数据">
  </div>
  <div v-else-if="type==='data-error'" class="data-error" @click="onClick">
    <img src="../assets/images/data-error.png" alt="加载失败">
  </div>
</template>

<script setup>
const props = defineProps({
  type: String,
  onClick: Function,
})
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

.loading,
.no-data,
.data-error{
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
  }
}

.loading img {
  animation: loading 2s ease-in-out infinite forwards;
}
</style>