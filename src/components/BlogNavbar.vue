<template>
  <nav class="blog-navbar blog-navbar-expand" :class="{'blog-navbar-hidden': !show, 'blog-navbar-shadow': shadow}">
    <div class="navbar-detail">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link :to="ROUTE_BLOG" class="navbar-brand">
            🏠首页
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="ROUTE_DESKTOP">
            🖥️桌面
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="ROUTE_BLOG">
            📂归档
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="ROUTE_BLOG">
            📓分类
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="ROUTE_BLOG">
            👒关于
          </router-link>
        </li>
      </ul>
      <ul class="nav-tools">
      </ul>
    </div>
    <div class="navbar-brief"></div>
  </nav>
</template>

<script setup>
import { toRefs } from 'vue'
import { ROUTE_BLOG, ROUTE_DESKTOP } from '../router/route.name'

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  shadow: {
    type: Boolean,
    default: false,
  },
})

const { show, shadow } = toRefs(props)
// show.value = true
</script>

<style scoped lang="scss">
@import "../assets/style/var";
@import "../assets/style/mixin";

$height: 48px;

@keyframes blog-navbar-in {
  0% {
    top: -$height;
  }
  100% {
    top: 30px;
  }
}

.blog-navbar {
  position: fixed;
  top: 30px;
  left: 0;
  right: 0;
  margin: auto;
  width: 1000px;
  height: $height;
  transition: all ease-out .5s;
  font-size: 1rem;
  padding: 0 $height * 0.5;
  border-radius: $height;
  box-shadow: none;
  animation: blog-navbar-in ease-out .5s;
  color: white;
  text-shadow: 0 0 3px $text-shadow-color;

  &::before {
    @include gen-absolute(0, 0, 0, 0);
    @include blur-bg();
    border-radius: $height;
    //margin: -3.9996px;
    z-index: -1;
  }

  @include media('<desktop', '>=tablet') {
    width: 720px;
  }

  @include media('<tablet') {
    width: 80%;
  }

  &-hidden {
    top: -$height;
  }

  &-shadow {
    .navbar-content {
      box-shadow: 0 0 10px rgb(0, 0, 0, 0.07) !important;
    }
  }

  .navbar-detail,
  .navbar-brief {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  @include media('<tablet') {
    .navbar-detail {
      display: none;
    }
  }

  @include media('>=tablet') {
    .navbar-brief {
      display: none;
    }
  }

  .nav-list {
    height: 100%;
    justify-content: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: bold;

    .nav-item {
      display: inline-block;
      margin: 0 12px;
    }
  }
}
</style>
