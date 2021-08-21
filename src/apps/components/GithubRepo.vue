<template>
  <Window class="repo" :config="config">
    <div class="window-content-container">
      <div class="header">
        <div class="left-option">
          <div v-show="showBackButton" class="icon-button" @click="backToParent">
            <i class="iconfont icon-arrow-left"></i>
          </div>
          <div class="icon-button">
            <i class="iconfont icon-apps"></i>
          </div>
        </div>
        <div class="repo-name">
          {{ owner + '/' + repo }}
        </div>
        <div class="right-option">
          <div class="icon-button">
            <i class="iconfont icon-search"></i>
          </div>
        </div>
      </div>
      <div class="repo-main">
        <transition name="fade">
          <Loading v-if="loading" />
          <div v-else class="files">
            <Loading v-if="loading" />
            <div v-for="file in files" :key="file.name" class="file-item" @click="onFileItemClicked(file)">
              <div class="file-icon icon-button">
                <i v-if="file.type==='dir'" class="iconfont icon-folder" />
                <i v-else class="iconfont icon-file" />
              </div>
              <div class="file-info">
                {{ file.name }}
              </div>
              <div class="file-operation icon-button">
                <i v-if="file.type==='dir'" class="iconfont icon-arrow-right" />
                <i v-else class="iconfont icon-arrow-down" @click="downloadFile(file)" />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </Window>
</template>

<script setup>
import Window from '../../components/Window.vue'
import Loading from '../../components/Loading.vue'
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
      console.log(owner.value, repo.value)
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
  }
}

const downloadFile = (file) => {
  FileSaver.saveAs(file.download_url, file.name)
}
</script>

<style scoped lang="scss">
@use "sass:math";
@import "../../assets/style/var";

$window-width: 378px;
$window-height: 756px;

$header-height: 42px;
.repo {
  width: $window-width;
  height: $window-height;
  top: calc(50% - #{math.div($window-height, 2)});
  left: calc(50% - #{math.div($window-width, 2)});

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

    .left-option,
    .right-option {
      position: absolute;
      top: 0;
      bottom: 0;
    }

    .repo-name {
      width: 100%;
      text-align: center;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0 $header-height*2;
    }

    .left-option {
      left: 0;
    }

    .right-option {
      right: 0;
    }
  }

  .repo-main {
    $distance: 4px;
    height: calc(100% - #{$header-height});
    overflow: auto;
    padding: $distance $distance*2;
    position: relative;

    &::-webkit-scrollbar {
      width: 0;
    }

    .file-item {
      min-height: $header-height;
      width: 100%;
      float: left;
      margin: $distance 0;
      border-radius: $distance;
      background-color: white;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .file-info {
        flex: 1;
        font-size: 14px;
      }

      .iconfont {
        font-size: 20px !important;
      }
    }
  }
}
</style>