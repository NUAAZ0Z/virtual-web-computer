<template>
  <transition name="fade">
    <div v-show="showModal" class="grey-mask" @click="emits('update:show-modal', false)"></div>
  </transition>
  <div class="window-modal" :class="{'window-modal-activated': showModal}">
    <div class="modal-title">
      {{ props.title }}
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  showModal: Boolean,
  title: String,
})

const emits = defineEmits(['update:show-modal'])
</script>

<style scoped lang="scss">
@import "../assets/style/var";
@import "../assets/style/mixin";

.grey-mask {
  @include absolute-full();
  background-color: rgba(black, .2);
}

.window-modal {
  @include gen-absolute(100%, 0, auto, 0);
  background-color: white;
  transition: all .2s ease-out;
  max-height: 540px;
  overflow: auto;
  padding: 8px 0;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  user-select: none;

  &-activated {
    transform: translateY(-100%);
  }

  .modal-title {
    font-size: 13px;
    padding: 4px 16px;
  }
}
</style>