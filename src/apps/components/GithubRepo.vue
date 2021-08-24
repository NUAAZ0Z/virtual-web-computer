<template>
  <Window class="github-repo" :config="config">
    <div class="header">
      <ul class="left-options">
        <li v-show="showBackButton" class="icon-button" @click="backToParent">
          <i class="iconfont icon-arrow-left"></i>
        </li>
        <li class="icon-button" @click="showRepoModal=true">
          <i class="iconfont icon-apps"></i>
        </li>
      </ul>
      <div class="repo-name">
        {{ owner + '/' + repo }}
      </div>
      <ul class="right-options">
        <li class="icon-button" @click="showSearchModal=true">
          <i class="iconfont icon-search"></i>
        </li>
      </ul>
    </div>
    <div class="main-container">
      <transition name="fade">
        <Loading v-if="loading" />
        <ul v-else class="files">
          <li v-for="file in files" :key="file.name" class="file-item" @click="onFileItemClicked(file)">
            <span class="file-icon icon-button">
              <i v-if="file.type==='dir'" class="iconfont icon-folder" />
              <i v-else class="iconfont icon-file" />
            </span>
            <span class="file-info">
              {{ file.name }}
            </span>
            <span class="file-operation icon-button">
              <i v-if="file.type==='dir'" class="iconfont icon-arrow-right" />
              <i v-else class="iconfont icon-arrow-down" @click="downloadFile(file)" />
            </span>
          </li>
        </ul>
      </transition>
    </div>
    <WindowModal v-model:show-modal="showRepoModal" title="切换仓库">
      <ul>
        <li v-for="r in props.config.repos" :key="r.owner+r.repo" class="repo-item" @click="onRepoChosen(r)">
          <div class="repo-icon icon-button">
            <i class="iconfont icon-github"></i>
          </div>
          <div class="repo-info">
            {{ r.owner + '/' + r.repo }}
          </div>
        </li>
      </ul>
    </WindowModal>
    <WindowModal v-model:show-modal="showSearchModal" title="搜索文件">
      搜索
    </WindowModal>
    <WindowModal v-model:show-modal="showFileDetailModal" title="文件详情">
      文件详情
    </WindowModal>
  </Window>
</template>

<script setup>
import Window from '../../components/Window.vue'
import Loading from '../../components/Loading.vue'
import WindowModal from '../../components/WindowModal.vue'
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { getContent } from '../../common/github-api'
import FileSaver from 'file-saver'

const props = defineProps({
  config: Object,
})

const owner = ref('')
const repo = ref('')
const path = ref('')
const files = ref([])
const loading = ref(true)
const showRepoModal = ref(false)
const showSearchModal = ref(false)
const showFileDetailModal = ref(false)

const initParams = () => {
  owner.value = props.config.repos[0].owner
  repo.value = props.config.repos[0].repo
}

onBeforeMount(() => {
  initParams()
})

const fetchContents = async () => {
  loading.value = true
  const res = await getContent({
    owner: owner.value,
    repo: repo.value,
    path: path.value,
  })
  if (res) {
    files.value = res.data.sort((a, b) => {
      const ad = a.type === 'dir'
      const bd = b.type === 'dir'
      if ((ad && bd) || (!ad && !bd)) {
        return a.name.localeCompare(b.name)//同时为文件或文件夹，按照名字来排序
      } else if (ad) {
        return -1
      } else {
        return 1
      }
    })
  }
  loading.value = false
}

watch([owner, repo, path], () => {
      fetchContents()
    }, {flush: 'post'},
    // flush = 'post' 同一个方法里同时改变监听源，监听器只会执行一次
)

const showBackButton = computed(() => path.value !== '' && path.value !== '/')
const backToParent = () => {
  const last = path.value.lastIndexOf('/')
  if (last > -1) {
    path.value = path.value.slice(0, last)
  }
}
const onFileItemClicked = (file) => {
  if (file.type === 'dir') {
    path.value += `/${file.name}`
  } else {
    showFileDetailModal.value = true
  }
}

const downloadFile = (file) => {
  // 镜像加速
  const url = `https://ghproxy.com/${file.download_url}`
  FileSaver.saveAs(url, file.name)
}

const onRepoChosen = (config) => {
  owner.value = config.owner
  repo.value = config.repo
  path.value = ''
  showRepoModal.value = false
}
</script>

<style scoped lang="scss">
@import "../../assets/style/var";
@import "../../assets/style/mixin";

$header-height: 42px;

.github-repo {
  @include media('<=tablet') {
    $size-var: 84vh;
    --window-width: #{$size-var * 0.5};
    --window-height: #{$size-var};
  }
  width: var(--window-width);
  height: var(--window-height);
  top: calc(#{$desktop-grid-height} * 0.5 - var(--window-height) * 0.5);
  left: calc(50% - var(--window-width) * 0.5);

  ::v-deep(.window-body) {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .icon-button {
    $button-margin: 4px;
    $button-size: $header-height - $button-margin * 2;
    display: inline-block;
    width: $button-size;
    height: $button-size;
    text-align: center;
    margin: $button-margin;
    border-radius: $button-size;
    line-height: $button-size;

    &:hover {
      background-color: rgba(black, 0.1);
    }
  }

  .header {
    height: $header-height;
    background-color: white;
    font-size: 16px;
    font-weight: bold;
    line-height: $header-height;
    position: relative;
    text-align: center;

    .left-options,
    .right-options {
      position: absolute;
      top: 0;
      bottom: 0;
    }

    .repo-name {
      width: 100%;
      text-align: center;
      display: inline-block;
      @include single-line-ellipsis();
      padding: 0 $header-height*2;
    }

    .left-options {
      left: 0;
    }

    .right-options {
      right: 0;
    }
  }

  $spacing: 8px;

  .main-container {
    height: calc(100% - #{$header-height});
    overflow: scroll;
    padding: 0 $spacing;
    position: relative;

    &::-webkit-scrollbar {
      width: 0;
    }

    .file-item {
      min-height: $header-height;
      width: 100%;
      margin: $spacing 0;
      border-radius: $spacing;
      background-color: white;
      @include gen-flex(row, center, center);
      user-select: none;

      .file-info {
        flex: 1;
        font-size: 14px;
      }

      .iconfont {
        font-size: 20px !important;
      }
    }
  }

  .repo-item {
    @include gen-flex(row, flex-start, center);

    &:active {
      background-color: rgba(black, .1);
    }

    .repo-icon {
      text-align: center;

      .iconfont {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
</style>