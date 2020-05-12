<template>
  <div class="player_emoji_gallery">
<!--    <div class="tabs">-->
<!--      <div v-for="tab in tabs"-->
<!--           :key="tab"-->
<!--           class="tab"-->
<!--           :class="{'tab-selected': selected===tab}"-->
<!--           @click="selected=tab"-->
<!--      >-->
<!--        {{tab}}-->
<!--      </div>-->
<!--    </div>-->
    <div class="tabs">
      <div class="tab tab-selected">{{selected}}</div>
    </div>
    <hamburger-menu @click="$emit('close')" class="closer" :is-close="true"/>
    <div class="avatars scroll_page" v-if="selected==='avatars'">
      <div class="emoji_block"
           v-for="avatar in avatars"
           :key="avatar"
           @click="setAvatar(avatar)"
      >{{avatar}}</div>
    </div>
    <div class="emotions scroll_page" v-if="selected==='emotions'">
      <div class="emoji_block"
           v-for="emotion in emotions"
           :key="emotion"
           @click="setEmotion(emotion)"
      >{{emotion}}</div>
    </div>
  </div>
</template>
<script>
import HamburgerMenu from '@/views/HamburgerMenu.vue';
import client from '../client/client';

let avatars = [];
let emotions = [];
export default {
  name: 'playerEmojiGallery',
  components: { HamburgerMenu },
  props: ['selected'],
  data() {
    return {
      avatars: [],
      emotions: [],
      tabs: ['emotions', 'avatars'],
    };
  },
  methods: {
    setAvatar(emoji) {
      this.$emit('setAvatar', emoji);
    },
    setEmotion(emoji) {
      this.$emit('setEmotion', emoji);
    },
    loadAvatars() {
      if (avatars.length) {
        this.avatars = avatars;
        return;
      }
      client.get('avatars').then(({ data }) => {
        console.log(data);
        avatars = data;
        this.avatars = data;
      });
    },
    loadEmotions() {
      if (avatars.length) {
        this.emotions = emotions;
        return;
      }
      client.get('emotions').then(({ data }) => {
        emotions = data;
        this.emotions = data;
      });
    },
  },
  mounted() {
    this.loadAvatars();
    this.loadEmotions();
  },
};
</script>
<style lang="less" scoped>
  .player_emoji_gallery {
    z-index: 2000;
    position: fixed;
    top: 0;left: 0;right: 0;bottom: 0;
    background: black;
  }
  .closer {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .tabs {
    display: flex;
    flex-wrap: nowrap;
  }
  .tab {
    font-size: 24px;
    font-weight: bold;
    width: 100%;
    text-align: center;
    padding: 20px 10px;
    border-bottom: 1px solid white;
    border-right: 1px solid white;
    background: #3d3d3d;
    color: #efefef;
    box-shadow: inset 0 0 20px rgb(0,0,0);
    &:last-child {
      border-right: none;
    }
    &-selected {
      background: black;
      color: white;
      box-shadow: none;
      border-bottom: none;
    }
  }
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
  .scroll_page {
    max-height: 100%;
    overflow: scroll;
    text-align: justify;
    padding: 50px 0 100px;
    box-sizing: border-box;
    user-select: none;
  }
</style>
