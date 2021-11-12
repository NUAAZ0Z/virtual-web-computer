<template>
  <Window class="github-repo" :config="config">
    <div class="window-content-header">
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
        <DefaultTip v-if="loading" type="loading" />
        <DefaultTip v-else-if="loadingFailed" type="data-error" :on-click="fetchContents" />
        <DefaultTip v-else-if="files.length===0" type="no-data" />
        <ul v-else class="files">
          <li v-for="file in files" :key="file.name" class="file-item" @click="onFileItemClicked(file)">
            <span class="file-icon icon-no-hover">
              <i v-if="file.type==='dir'" class="iconfont icon-folder" />
              <i v-else class="iconfont icon-file" />
            </span>
            <span class="file-info">
              {{ file.name }}
            </span>
            <span class="file-operation icon-button">
              <i v-if="file.type==='dir'" class="iconfont icon-arrow-right" />
              <i v-else class="iconfont icon-arrow-down" @click.stop="downloadFile(file)" />
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
  </Window>
</template>

<script setup>
import Window from '../../components/Window.vue'
import DefaultTip from '../../components/DefaultTip.vue'
import WindowModal from '../../components/WindowModal.vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { getContent } from '../../common/github-api'
import FileSaver from 'file-saver'
import { api as viewerApi } from 'v-viewer'

const props = defineProps({
  config: Object,
})

const owner = ref('')
const repo = ref('')
const path = ref('')
const files = ref([])
const loading = ref(true)
const loadingFailed = ref(false)
const showRepoModal = ref(false)
const showSearchModal = ref(false)
let images = []

onBeforeMount(() => {
  owner.value = props.config.repos[0].owner
  repo.value = props.config.repos[0].repo
})

const isImage = (filename) => /\.(jpg|jpeg|png|GIF|JPG|PNG|svg|webp)$/.test(filename)

const fetchContents = async () => {
  loading.value = true
  loadingFailed.value = false
  files.value = []
  const res = await getContent({
    owner: owner.value,
    repo: repo.value,
    path: path.value,
  })
  if (res.data) {
    // 获取文件成功
    // 对文件按照文件名进行排序
    const sortedResult = res.data.sort((a, b) => {
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
    // 筛选出文件里面的图片
    let imageIndex = -1
    images = []
    files.value = sortedResult.map(f => {
      if (isImage(f.name)) {
        images.push('https://ghproxy.com/' + f.download_url)
        imageIndex++
        return { ...f, imageIndex }
      }
      return { ...f }
    })
  } else {
    // 加载数据失败
    loadingFailed.value = true
  }
  loading.value = false
}

watch([owner, repo, path], () => {
      fetchContents()
    }, { flush: 'post' },
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
    if (isImage(file.name)) {
      viewerApi({
        options: {
          initialViewIndex: file.imageIndex,
          zIndex: 999999,
        },
        images,
      })
    }
  }
}

const downloadFile = (file) => {
  // 镜像加速
  const url = 'https://ghproxy.com/' + file.download_url
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
  ::v-deep(.window-body) {
    width: 100%;
    height: 100%;
    position: relative;
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

    @include media('>=desktop') {
      .files {
        @include gen-flex(row, flex-start, stretch);
        flex-wrap: wrap;
        width: fit-content;

        .file-item {
          flex-direction: column;
          width: 110px;
          min-height: 144px;
          margin: $spacing $spacing * 0.5;
          text-align: center;
          word-break: break-word;

          .file-icon {
            @include circle-icon(68px, 32px);
          }

          .file-info {
            padding: $spacing;
          }
        }
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

  .image-preview {
    text-align: center;

    img {
      width: auto;
      height: 320px;
      object-fit: contain;
    }
  }
}
</style>