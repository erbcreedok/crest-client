<template>
  <div class="room_controller">
    <div v-if="user">Player: {{user.name}}</div>
    Room: #{{roomId}}
    <ul class="room_menu">
      <li @click="saveUriToClipboard">Copy invite link</li>
      <li v-if="isAdmin" @click="startRestart">Restart Game</li>
    </ul>
  </div>
</template>

<script>
import saveToClipboard from '@/scripts/saveToClipboard';

export default {
  name: 'room-controller',
  props: ['socket', 'adminId', 'roomId'],
  methods: {
    saveUriToClipboard() {
      const uri = window.location.href;
      saveToClipboard(uri);
      this.$notify('Link copied to your clipboard');
    },
    startRestart() {
      this.socket.emit('finish game');
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isAdmin() {
      return this.user && this.user.id === this.adminId;
    },
  },
};
</script>

<style lang="less">
  .room_controller {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #131313;
    color: white;
    padding: 20px 10px;
  }
  .room_menu {
    margin-top: 30px;
    list-style: none;
    padding: 0;
    li {
      display: block;
      padding: 10px 5px;
      border-top: 1px solid #ededed;
      cursor: pointer;
      transition: .2s;
      &:hover {
        background: rgba(255,255,255,.2);
        transition: 0s;
      }
      &:last-child {
        border-bottom: 1px solid #ededed;
      }
    }
  }
  .room_controller_toggle {
    position: relative;
    z-index: 1001;
  }
</style>
