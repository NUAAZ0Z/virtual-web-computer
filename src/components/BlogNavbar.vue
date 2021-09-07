<template>
  <nav class="blog-navbar blog-navbar-expand" :class="{'blog-navbar-hidden': !show, 'blog-navbar-shadow': shadow}">
    <div class="navbar-detail">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="blog" class="navbar-brand">
            🏠首页
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="desktop">
            🖥️桌面
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="blog">
            📂归档
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="blog">
            📓分类
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="blog">
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

a {
  text-decoration: none;
  color: $black-text-color;
}

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
  color: black;
  background-color: white;
  padding: 0 $height * 0.5;
  border-radius: $height;
  box-shadow: none;
  animation: blog-navbar-in ease-out .5s;

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
