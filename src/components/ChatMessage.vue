<template>
  <div>
    <div v-if="type==='chat'" class="chat-dialog">
      <div v-if="left" class="avatar-left">
        {{ from.toString().substr(6, 2) }}
      </div>
      <div class="msg-box" :class="{'msg-right':!left,'msg-left':left}">
        <span class="msg-from">{{ from.toString().substr(6) }}</span>
        <div class="msg-content">
          <p>
            {{ msg }}
          </p>
        </div>
      </div>
      <div v-if="!left" class="avatar-right">
        {{ from.toString().substr(6, 2) }}
      </div>
    </div>
    <div v-else>
      <div class="chat-tip">
        <span class="tip-wrap">
          {{ msg }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  left: Boolean,
  msg: String,
  from: String,
  type: String,
})
</script>

<style lang="scss" scoped>
.chat-dialog {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.msg-box {
  flex: 1;
  margin-top: 12px;
  margin-bottom: 12px;
  min-height: 36px;
  display: flex;
  flex-direction: column;
}

.msg-from {
  color: #6A7796;
  font-size: 14px;
}

.msg-content {
  height: 100%;
  border-radius: 12px;
  max-width: 60%;
  min-width: 48px;
  /*line-height: 36px;*/
  min-height: 36px;
  padding: 8px;
  text-align: center;
}

.msg-from {
  font-size: 11px;
  margin-bottom: 2px;
}

.msg-content p {
  word-wrap: break-word;
  word-break: break-all;
}

.msg-right {
  justify-content: flex-start;
  align-items: flex-end;

  .msg-content {
    float: right;
    background-color: #2683F5;
    color: white;
  }
}

.msg-left {
  justify-content: flex-start;
  align-items: flex-start;

  .msg-content {
    float: left;
    background-color: #eee;
    color: black;
  }
}

.avatar-left,
.avatar-right {
  height: 42px;
  width: 42px;
  margin: 12px;
  border-radius: 42px;
  background-color: antiquewhite;
  font-size: 14px;
  line-height: 42px;
  text-align: center;
}

.avatar-right {
  background-color: goldenrod;
}

.chat-tip {
  text-align: center;
  padding: 6px 6px 8px;
}

.tip-wrap {
  color: gray;
  background-color: rgba(0, 0, 0, 0.15);
  text-align: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
}

</style>