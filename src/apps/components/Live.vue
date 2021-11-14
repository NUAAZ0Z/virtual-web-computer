<template>
  <Window class="live" :config="config">
    <div class="window-content-header">
      <ul v-show="scene!==CHOOSE_SCENE" class="left-options">
        <li class="icon-button" @click="gotoChooseScene">
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
          <video ref="videoPublisherEle" autoplay></video>
          <ul class="video-controls">
            <li class="control-item" title="设置" @click="showSettingModal=true">
              <i class="iconfont icon-wrench"></i>
            </li>
            <li class="control-item play-or-pause" title="开始/停止" @click="startOrStopPublish">
              <i class="iconfont" :class="publishing ? 'icon-pause':'icon-play'"></i>
            </li>
            <li class="control-item" title="网页全屏">
              <i class="iconfont icon-expand-arrows-alt"></i>
            </li>
          </ul>
        </div>

        <div v-else class="playlist-scene">
          <div v-if="liveStreams.length!==0" class="playlist">
            <div class="title">正在直播</div>
            <div class="video-list">
              <div v-for="stream in liveStreams" :key="stream.id" class="video-item" @click="setVideoToPlay(stream)">
                <div>{{ stream.app }}/{{ stream.name }}</div>
                <div>在线人数 ：{{ stream.clients }}</div>
              </div>
            </div>
          </div>
          <div v-if="historyStreams.length!==0" class="playlist">
            <div class="title">历史点播</div>
            <div class="video-list">
              <div v-for="stream in historyStreams" :key="stream.url" class="video-item"
                   @click="setVideoToPlay(stream)"
              >
                <div>{{ stream.app }}/{{ stream.stream }}</div>
                <div>{{ stream.url.split('/').slice(-2).join('/') }}</div>
              </div>
            </div>
          </div>
          <DefaultTip v-if="liveStreams.length===0 && historyStreams.length===0" type="no-data" />
        </div>
      </transition>
    </div>

    <div v-show="scene===PLAY_SCENE" class="play-scene">
      <video ref="videoPlayerEle" autoplay controls></video>
      <ul class="video-controls">
        <li class="control-item" title="关闭" @click="hideVideoPlayer">
          <i class="iconfont icon-close"></i>
        </li>
        <li class="control-item play-or-pause" title="开始/停止" @click="playOrPauseVideo">
          <i class="iconfont" :class="playing ? 'icon-pause':'icon-play'"></i>
        </li>
        <li class="control-item" title="网页全屏">
          <i class="iconfont icon-expand-arrows-alt"></i>
        </li>
      </ul>
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
      <div class="config-live-path">
        <div class="input-block">
          <label for="liveApp"> App </label>
          <input id="liveApp" v-model="liveApp" type="text" placeholder="live">
        </div>
        <div class="input-block">
          <label for="liveStream"> Stream </label>
          <input id="liveStream" v-model="liveStream" type="text" placeholder="webrtc">
        </div>
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
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import { createRtcPlayer, createRtcPublisher, srsApi } from '../../common/srs'

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
const videoPublisherEle = ref(null)
const videoPlayerEle = ref(null)
defineExpose({
  videoPublisherEle,
  videoPlayerEle,
})

const scene = ref(CHOOSE_SCENE)
const showSettingModal = ref(false)

const publishing = ref(false)
const playing = ref(false)
const liveConstraints = reactive({
  audio: true,
  video: true,
})
const liveStreams = ref([])
const historyStreams = ref([])

const liveApp = ref('live')
const liveStream = ref('webrtc')

const videoWatching = ref(null)

let rtcPublisher = null
let rtcPlayer = null
// let flvPlayer = null

onBeforeUnmount(() => {
  rtcPublisher && rtcPublisher.drop()
  rtcPlayer && rtcPlayer.drop()
})

const onSettingConfirm = async () => {
  showSettingModal.value = false
}

const gotoChooseScene = async () => {
  rtcPublisher && rtcPublisher.drop()
  rtcPublisher = null
  scene.value = CHOOSE_SCENE
}

const startPublish = async () => {
  rtcPublisher = createRtcPublisher('live', 'webrtc')
  await rtcPublisher.publish(liveConstraints)

  // 当流终止时
  rtcPublisher.stream.getTracks().forEach(track => {
    track.onended = stopPublish
  })

  videoPublisherEle.value.srcObject = rtcPublisher.stream

  videoPublisherEle.value.play()
}

const stopPublish = () => {
  rtcPublisher && rtcPublisher.drop()
  rtcPublisher = null
  videoPublisherEle.value.pause()
  publishing.value = false
}

const startOrStopPublish = async () => {
  if (publishing.value) {
    stopPublish()
    publishing.value = false
  } else {
    await startPublish()
    publishing.value = true
  }
}

const fetchLiveStreams = async () => {
  const res = await srsApi.fetchLives()
  const { data } = res
  if (data) {
    liveStreams.value = data.streams.filter(s => s.publish && s.publish.active)
  }
}

const fetchHistoryStream = async () => {
  const res = await srsApi.fetchHistories()
  const { data } = res
  if (data) {
    historyStreams.value = data
  }
}

const setVideoToPlay = (stream) => {
  videoWatching.value = stream
  scene.value = PLAY_SCENE
}

const playOrPauseVideo = async () => {
  if (playing.value) {
    playing.value = false
    videoPlayerEle.value.pause()
  } else {
    playing.value = true
    videoPlayerEle.value.play()
  }
}

const hideVideoPlayer = () => {
  const { app, name, url } = videoWatching.value
  if (!url) {
    // 观看的是直播
    rtcPlayer && rtcPlayer.drop()
    rtcPlayer = null
    videoPlayerEle.value.pause()
  }
  scene.value = PLAYLIST_SCENE
}

watch(scene, (newVal) => {
  const s = newVal.valueOf()
  switch (s) {
    case PLAYLIST_SCENE: {
      fetchLiveStreams()
      fetchHistoryStream()
      break
    }
    case PLAY_SCENE: {
      // 如果是观看直播, name值有效，如果是录播url值有效
      const { app, name, url } = videoWatching.value
      if (url) {
        videoPlayerEle.value.src = url
      } else {
        rtcPlayer = createRtcPlayer(app, name);
        (async () => {
          await rtcPlayer.play()
          videoPlayerEle.value.srcObject = rtcPlayer.stream
        })()
      }
      videoPlayerEle.value.play()
      videoPlayerEle.value.onplay = () => {
        playing.value = true
      }
      videoPlayerEle.value.onpause = () => {
        playing.value = false
      }
      break
    }
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
  position: relative;
}

.window-content-main {
  width: 100%;
  flex: 1 auto;
  height: 0;
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
    height: 0;
  }
}

.video-controls {
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

.playlist-scene {
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }

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
        width: 300px;

        background-color: white;
        border-radius: 6px;
        margin-top: 12px;
        padding: 4px 12px;
      }
    }
  }
}

.play-scene {
  @include gen-absolute(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: white;

  video {
    height: auto !important;
    width: 100% !important;
    object-fit: fill;
    flex: 1 auto;
  }

  @include media('>=desktop') {
    video {
      height: auto !important;
      width: 80% !important;
      object-fit: fill;
    }
  }
}

.config-checkboxes {
  padding: 12px;
  text-align: center;
}

.config-live-path {
  padding-bottom: 12px;

  .input-block {
    text-align: center;
    width: 320px;
    margin: 12px auto 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: 32px;
    line-height: 32px;
  }

  label {
    text-align: right;
    width: 80px;
    display: inline-block;
    background-color: #0081FF;
    border-bottom-left-radius: 16px;
    border-top-left-radius: 16px;
    color: white;
    padding-right: 12px;
  }

  input {
    flex: 1 auto;
    vertical-align: top;
    height: 32px;
    border-bottom-right-radius: 16px;
    border-top-right-radius: 16px;
    background-color: rgba(black, .1);
    border: none;
    padding-left: 12px;
  }
}

.save-config {
  text-align: center;
  @include gen-flex(row, center, center);
  padding-bottom: 12px;

  button {
    width: 108px;
    height: 36px;
    border: none;
    border-radius: 18px;
    background-color: wheat;

    &:active {
      border: 2px rgb(118, 118, 118) solid;
    }
  }
}
</style>
