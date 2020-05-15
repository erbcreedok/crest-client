<template>
  <div class="player_emotion_controller">
      <div class="emoji_block"
           v-for="emotion in emotions"
           :key="emotion"
           @click="setEmotion(emotion)"
      >{{emotion}}</div>
  </div>
</template>

<script>
import client from '../client/client';

let emotions = [];
export default {
  name: 'PlayerEmotionController',
  data() {
    return {
      emotions: [],
    };
  },
  methods: {
    loadEmotions() {
      if (emotions.length) {
        this.emotions = emotions;
        return;
      }
      client.get('emotions').then(({ data }) => {
        emotions = data;
        this.emotions = data;
      });
    },
    setEmotion(emoji) {
      this.$emit('setEmotion', emoji);
    },
  },
  mounted() {
    this.loadEmotions();
  },
};
</script>

<style lang="less" scoped>
  .player_emotion_controller {
    position: absolute;
    bottom: 70px;
    white-space: nowrap;
    z-index: 100;
    user-select: none;
    overflow: scroll;
    width: 100%;
    left: 0;
    right: 0;
    .emoji_block {
      display: inline-block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      padding: 10px;
      text-align: center;
      font-size: 50px;
      cursor: pointer;
    }
  }
</style>
