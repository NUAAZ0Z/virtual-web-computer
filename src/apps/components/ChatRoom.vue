<template>
  <Window :config="config">
    <div class="chatroom-body" :class="{'chat-content-active':chatActive}">
      <div class="group-contacts">
        <div class="create-group">
          <input v-model="inputRoomName" type="text" placeholder="请输入房间名称">
          <button @click="createRoom">
            创建
          </button>
        </div>
        <div class="group-list">
          <span class="group-list-tip">群聊列表</span>
          <div v-for="room in chatroomList" :key="room._id" class="group-item" @click="onRoomClicked(room)">
            <span class="group-name">{{ room.name }}</span>
          </div>
        </div>
      </div>
      <div v-show="currentRoom.id && chatActive" class="chat-content">
        <div class="chat-title">
          <li class="icon-button go-back-btn" @click="onBackClicked">
            <i class="iconfont icon-arrow-left"></i>
          </li>
          <span class="room-name">{{ currentRoom.name }}</span>
        </div>
        <div class="chat-message">
          <ChatMessage
            v-for="message in chatMessages" :key="message._id" :from="message.sender"
            :msg="message.content" :type="message.type || 'chat'" :left="userSessionId!==message.sender"
          />
        </div>
        <div class="chat-editor">
          <textarea
            v-model="inputMsg" placeholder="在此输入...Enter 发送" aria-multiline="true"
            @keyup.enter="sendMsg"
          />
          <div class="send-btn" @click="sendMsg">
            发送
          </div>
        </div>
      </div>
    </div>
  </Window>
</template>

<script setup>
import Window from '../../components/Window.vue'
import ChatMessage from '../../components/ChatMessage.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { createSocket, SESSION_ID_KEY } from '../../common/chatroom-socket'

defineProps({
  config: Object,
})

let socket = null
let userSessionId = localStorage.getItem(SESSION_ID_KEY)
const chatActive = ref(false)
const chatroomList = ref([])
const chatMessages = ref([])
const inputMsg = ref('')
const inputRoomName = ref('')

// 当前房间
const currentRoom = reactive({
  id: null,
  name: null,
})

const onRoomClicked = room => {
  chatActive.value = true

  const { _id: roomId, name } = room
  if (currentRoom.id !== roomId) {
    currentRoom.id = roomId
    currentRoom.name = name

    // 加入房间，服务端进行广播
    socket.emit('room:join', {
      roomId,
      sessionId: userSessionId,
    })

    // 拉取历史消息
    socket.emit('message:fetch', {
      roomId,
    })
  }
}

const onBackClicked = () => {
  chatActive.value = false
}

// 处理服务端向客户端发送的初始化信息
const onSocketInit = (payload) => {
  console.log(payload)
  const { rooms, sessionId } = payload
  if (sessionId) {
    localStorage.setItem(SESSION_ID_KEY, sessionId)
    userSessionId = sessionId
  }
  if (rooms) {
    chatroomList.value = rooms
  }
}

// 处理一般群聊消息
const onSocketMessage = (payload) => {
  console.log(payload)
  const { roomId, type, content, sender, sendAt, _id } = payload
  if (roomId === currentRoom.id) {
    chatMessages.value = [
      ...chatMessages.value,
      {
        type,
        content,
        sender,
        _id,
        sendAt,
      },
    ]
  }
}

// 处理消息历史拉取结果
const onMessageFetchResult = (payload) => {
  const { roomId, messages } = payload
  console.log(payload)

  chatMessages.value = []
  if (roomId === currentRoom.id) {
    if (messages) {
      chatMessages.value = messages
    }
  }
}

// 监听消息列表，当有新消息时跳到末尾
watch(chatMessages, () => {
  setTimeout(() => {
    const container = document.querySelector('.chat-message')
    container.scrollTop = container.scrollHeight
  }, 200) // 延时不立即执行，待 DOM 更新之后
}, { immediate: false })

// 发送群聊消息
const sendMsg = () => {
  if (inputMsg.value !== '') {
    socket.emit('message:append', {
      roomId: currentRoom.id,
      content: inputMsg.value,
      sessionId: userSessionId,
    })
    inputMsg.value = ''
  }
}

// 创建房间
const createRoom = () => {
  if (inputRoomName.value !== '') {
    socket.emit('room:create', {
      name: inputRoomName.value,
    })
    inputRoomName.value = ''
  }
}

// 处理房间创建成功的消息
const onRoomCreateResult = (payload) => {
  chatroomList.value = [payload, ...chatroomList.value]
}

onMounted(() => {
  socket = createSocket()
  socket.on('init', onSocketInit)
  socket.on('message', onSocketMessage)
  socket.on('message:fetch:result', onMessageFetchResult)
  socket.on('room:create:result', onRoomCreateResult)
})
</script>

<style scoped lang="scss">
@import "../../assets/style/mixin";

$border: 1px solid rgba(black, .05);

::v-deep(.window-body) {
  position: relative;
}

.group-item {
  width: 100%;
  height: 48px;
  padding: 12px;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-top: $border;
  cursor: pointer;

  &:hover {
    background-color: whitesmoke;
  }
}

.chatroom-body {
  @include gen-absolute(0, 0, 0, 0);
  display: flex;
  flex-direction: row;
  align-items: stretch;

  .group-contacts {
    flex: 0 0 256px;
    background-color: whitesmoke;
    border-right: $border;


    .create-group {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 4px;
      padding: 12px;

      height: 56px;

      input {
        flex: 1;
        outline: none;
        border: none;
        border-bottom-left-radius: 12px;
        border-top-left-radius: 12px;
        text-indent: 12px;
      }

      button {
        flex: 0 0 56px;
        border: none;
        border-bottom-right-radius: 12px;
        border-top-right-radius: 12px;
        background-color: #2683F5;
        color: white;
      }
    }

    .group-list {
      overflow-y: scroll;

      &::-webkit-scrollbar {
        width: 0;
      }

      &-tip {
        padding: 0 12px;
        font-size: 14px;

      }
    }
  }

  .chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .chat-title {
      height: 48px;
      border-top: $border;
      border-bottom: $border;
      background-color: white;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 0 12px;

      .go-back-btn {
        display: none;
      }
    }

    .chat-message {
      flex: 1;
      overflow-y: scroll;

      &::-webkit-scrollbar {
        width: 0;
      }
    }

    .chat-editor {
      flex: 0 0 120px;
      border-top: $border;
      background-color: white;
      position: relative;

      textarea {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        padding: 12px;
      }

      .send-btn {
        position: absolute;
        right: 24px;
        bottom: 24px;

        width: 96px;
        height: 30px;
        border: $border;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        background-color: white;
        border-radius: 4px;

        &:hover {
          background-color: whitesmoke;
        }
      }
    }
  }
}

@include media('<desktop') {
  .chat-content-active {
    transform: translateX(-100%);
  }

  .chatroom-body {
    flex-wrap: nowrap;
    transition: all .2s ease-out;

    .group-contacts {
      flex: 0 0 100%;
      background-color: whitesmoke;
    }

    .chat-content {
      flex: 0 0 100%;

      .chat-title {
        padding: 0;

        .go-back-btn {
          display: inline-block !important;
        }
      }
    }
  }
}
</style>