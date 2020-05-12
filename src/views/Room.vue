<template>
  <div class="room">
    <div class="room_info">
      <span style="opacity: .3">#{{id}}</span>
      <div class="room_controller_wrapper">
        <HamburgerMenu :is-close="showSidebar"
                       @click="showSidebar = !showSidebar"
                       class="room_controller_toggle"
        />
      </div>
      <room-controller v-if="showSidebar" :room-id="id" :admin-id="adminId" :socket="socket"/>
    </div>
    <Players :players="opponents" :admin-id="adminId" :socket="socket"/>
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
import RoomController from '@/components/RoomController.vue';
import HamburgerMenu from '@/views/HamburgerMenu.vue';

export default {
  name: 'Room',
  components: {
    HamburgerMenu,
    RoomController,
    Desk,
    PlayerController,
    Players,
  },
  props: ['id'],
  data() {
    return {
      socket: null,
      players: [],
      state: null,
      game: null,
      adminId: null,
      showSidebar: false,
    };
  },
  mounted() {
    this.connectToRoom();
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    activeUsers() {
      return this.players.filter((player) => player.isReady || player.isConnected);
    },
    opponents() {
      const userIndex = this.activeUsers
        .findIndex((player) => this.user && player.id === this.user.id);
      if (userIndex === -1) {
        return this.activeUsers;
      }
      return [...this.activeUsers.slice(userIndex + 1), ...this.activeUsers.slice(0, userIndex)];
    },
  },
  methods: {
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
</style>
