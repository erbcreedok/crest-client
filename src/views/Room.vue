<template>
  <div class="room">
    <div class="room_info">
      #{{id}} <button class="room_invite_button" @click="saveUriToClipboard">invite</button>
    </div>
    <Players :players="opponents" :admin-id="adminId"/>
    <Desk v-if="game" :cards="game.desk"/>
    <PlayerController v-if="socket" :socket="socket" :adminId="adminId"/>
  </div>
</template>

<script>
import io from 'socket.io-client';
import getServerUri from '@/scripts/getServerUri';
import Players from '@/components/Players.vue';
import PlayerController from '@/components/PlayerController.vue';
import Desk from '@/components/Desk.vue';
import saveToClipboard from '@/scripts/saveToClipboard';

export default {
  name: 'Room',
  components: { Desk, PlayerController, Players },
  props: ['id'],
  data() {
    return {
      socket: null,
      players: [],
      state: null,
      game: null,
      adminId: null,
    };
  },
  mounted() {
    this.connectToRoom();
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    opponents() {
      const userIndex = this.players.findIndex((player) => this.user && player.id === this.user.id);
      if (userIndex === -1) {
        return this.players;
      }
      return [...this.players.slice(userIndex + 1), ...this.players.slice(0, userIndex)];
    },
  },
  methods: {
    saveUriToClipboard() {
      const uri = window.location.href;
      saveToClipboard(uri);
      this.$notify('Link copied to your clipboard');
    },
    connectToRoom() {
      this.socket = io.connect(`${getServerUri(3333)}?room=${this.id}&user=${this.user.id}`);
      this.socket.on('connect', this.handleSocketConnect);
      this.listenSocket();
    },
    handleRoomUpdate({
      players,
      state,
      game,
      adminId,
    }) {
      this.players = players;
      this.state = state;
      this.game = game;
      this.adminId = adminId;
    },
    handleSocketConnect() {
      this.getRoomData();
    },
    getRoomData() {
      this.socket.emit('get room data', this.handleRoomUpdate);
    },
    listenSocket() {
      this.socket.on('exception', (message) => {
        console.error('exception', message);
        this.$notify({ type: 'error', text: message });
      });
      this.socket.on('room update', this.handleRoomUpdate);
    },
  },
};
</script>

<style>
  .room {
    height: 100vh;
    width: 100vw;
    background: rgb(17,83,0);
    background: radial-gradient(circle, rgba(36,124,6,1) 0%, rgba(17,83,0,1) 100%);
  }
  .room_info {
    color: white;
    font-size: 20px;
    position: fixed;
    top: 10px;left: 10px;right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }
  .room_invite_button {
    color: white;
    background: #1646ff;
    border-radius: 4px;
    font-size: 14px;
    padding: 8px 12px;
  }
</style>
