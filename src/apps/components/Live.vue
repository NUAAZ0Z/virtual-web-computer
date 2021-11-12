<template>
  <Window class="live" :config="config">
    <div class="window-content-header">
      <ul v-show="scene!==CHOOSE_SCENE" class="left-options">
        <li class="icon-button" @click="scene=CHOOSE_SCENE">
          <i class="iconfont icon-arrow-left"></i>
        </li>
      </ul>
      <div class="repo-name">
        {{ title[scene] }}
      </div>
    </div>
    <div class="window-content-main">
      <transition name="fade">
        <div v-if="scene===CHOOSE_SCENE" class="choose-scene">
          <div class="scene-choice" @click="scene=PUBLISH_SCENE">
            <span>直播推流</span>
          </div>
          <div class="scene-choice" @click="scene=PLAYLIST_SCENE">
            <span>收看/点播</span>
          </div>
        </div>

        <div v-else-if="scene===PUBLISH_SCENE" class="publish-scene">
          <video ref="videoPublishingEle" autoplay></video>
          <ul class="publish-controls" title="设置">
            <li class="control-item" @click="showSettingModal=true">
              <i class="iconfont icon-wrench"></i>
            </li>
            <div class="control-item play-or-pause" title="开始/停止" @click="startOrStopPublish">
              <i class="iconfont" :class="publishing ? 'icon-pause':'icon-play'"></i>
            </div>
            <div class="control-item" title="网页全屏">
              <i class="iconfont icon-expand-arrows-alt"></i>
            </div>
          </ul>
        </div>

        <div v-else-if="scene===PLAYLIST_SCENE" class="playlist-scene">
          <div v-if="liveStreams.length!==0" class="playlist">
            <div class="title">正在直播</div>
            <div class="video-list">
              <div v-for="stream in liveStreams" :key="stream.id" class="video-item">
                <div>{{ stream.app }}/{{ stream.name }}</div>
                <div>在线人数 ：{{ stream.clients }}</div>
              </div>
            </div>
          </div>
          <div v-if="historyStreams.length!==0" class="playlist">
            <div class="title">历史点播</div>
            <div class="video-list">

            </div>
          </div>
          <DefaultTip v-if="liveStreams.length===0 && historyStreams.length===0" type="no-data" />
        </div>
        <div v-else class="play-scene"></div>
      </transition>
    </div>

    <WindowModal v-model:show-modal="showSettingModal" title="直播设置">
      <div class="config-checkboxes">
        <label>
          <input v-model="liveConstraints.audio" type="checkbox">
          录制音频
        </label>
        <label>
          <input v-model="liveConstraints.video" type="checkbox">
          录制视频
        </label>
      </div>
      <div class="save-config">
        <button @click="onSettingConfirm">
          确定
        </button>
      </div>
    </WindowModal>
  </Window>
</template>

<script setup>
import Window from '../../components/Window.vue'
import WindowModal from '../../components/WindowModal.vue'
import DefaultTip from '../../components/DefaultTip.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { createPublisher, srsApi } from '../../common/srs'

const CHOOSE_SCENE = 1
const PUBLISH_SCENE = 1 << 1
const PLAY_SCENE = 1 << 2
const PLAYLIST_SCENE = 1 << 3
const title = {
  [CHOOSE_SCENE]: '选择场景',
  [PUBLISH_SCENE]: '直播推流',
  [PLAY_SCENE]: '播放',
  [PLAYLIST_SCENE]: '播放列表',
}

defineProps({
  config: Object,
})
// 绑定video元素
const videoPublishingEle = ref(null)

defineExpose({
  videoPublishing: videoPublishingEle,
})

const scene = ref(CHOOSE_SCENE)
const showSettingModal = ref(false)

const publishing = ref(false)
const liveConstraints = reactive({
  audio: true,
  video: true,
})
const liveStreams = ref([])
const historyStreams = ref([])


let publisher = null
let player = null

const onSettingConfirm = async () => {
  showSettingModal.value = false
}

const startOrStopPublish = () => {
  if (publishing.value) {
    publisher.drop()
    videoPublishingEle.value.pause()
    publishing.value = false
    publisher = null

  } else {
    publisher = createPublisher('live', 'wetrtc')
    const constraints = {}
    Object.assign(constraints, liveConstraints)
    if (liveConstraints.video) {
      constraints.video = {}
      const videoElStyle = window.getComputedStyle(videoPublishingEle.value)
      constraints.video = {
        height: parseInt(videoElStyle['height']),
        width: parseInt(videoElStyle['width']),
      }
    }
    publisher.publish(constraints)

    videoPublishingEle.value.srcObject = publisher.stream

    videoPublishingEle.value.play()
    publishing.value = true
  }
}

const fetchStreamList = async () => {
  const res = await srsApi.fetchStreams()
  console.log(res)
  const { data } = res
  if (data) {
    liveStreams.value = data.streams.filter(s => s.publish && s.publish.active)
  }
}

watch(scene, newVal => {
  if (newVal.valueOf() === PLAYLIST_SCENE) {
    fetchStreamList()
  }
})
</script>

<style scoped lang="scss">
@import "../../assets/style/mixin";

::v-deep(.window-body) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.window-content-main {
  width: 100%;
  flex: 1 auto;
}

.choose-scene,
.publish-scene,
.playlist-scene,
.play-scene {
  width: 100%;
  height: 100%;
  position: relative;
}

.choose-scene {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: wrap;
  align-content: center;

  .scene-choice {
    background-color: white;
    border-radius: 12px;
    height: 150px;
    width: 200px;
    margin: 12px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    &:active {
      border: 2px rgba(blue, .5) solid;
    }
  }
}

.publish-scene {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  video {
    flex: 1;
    background-color: rgba(black, .1);
    object-fit: fill;
  }

  .publish-controls {
    background-color: white;
    width: 100%;
    text-align: center;
    padding: 12px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    $item-size: 3rem;


    .control-item {
      display: inline-block;
      @include circle-icon(3rem, 1.5rem);
      margin: 0 24px;
      cursor: pointer;
      transition: background-color .2s ease;
    }

    .play-or-pause {
      @include circle-icon(3.6rem, 1.8rem);
      color: white;
      background-image: radial-gradient(circle, rgba(purple, .7), rgba(purple, .3));
    }
  }
}

.playlist-scene {
  .playlist {
    padding: 12px 6px;

    .video-list {
      display: flex;
      flex-direction: row;
      flex-flow: wrap;
    }

    .video-item {
      width: 100%;
      background-color: white;
      border-radius: 6px;
      padding: 4px 12px;
      margin: 12px 6px 0;
      cursor: pointer;
      transition: background-color .3s ease;

      &:active {
        background-color: rgba(black, .1);
      }
    }

    @include media(">=desktop") {
      .video-item {
        width: 240px;

        background-color: white;
        border-radius: 6px;
        margin-top: 12px;
        padding: 4px 12px;
      }
    }
  }
}

.config-checkboxes {
  padding: 12px;
  text-align: center;
}

.save-config {
  text-align: center;
  @include gen-flex(row, center, center);

  button {
    width: 108px;
    height: 36px;
    border: none;
    border-radius: 18px;

    &:active {
      border: 2px rgb(118, 118, 118) solid;
    }
  }
}
</style>
