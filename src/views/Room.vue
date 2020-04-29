<template>
  <div class="room">
    ROOM {{id}}<br/>
    Room status: {{state}}<br/>
    <PlayerController v-if="socket" :socket="socket"/>
    <Player v-for="player in players" :key="player.id" v-bind="player"/>
    <div v-if="game && game.desk">
      <Card v-for="card in game.desk"
            :key="card.id"
            v-bind="card"
            style="display: inline-block; width: 50px;"/>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import Card from '@/components/Card.vue';
import Player from '@/components/Player.vue';
import PlayerController from '@/components/PlayerController.vue';
import getServerUri from '@/scripts/getServerUri';

export default {
  name: 'Room',
  components: { PlayerController, Player, Card },
  props: ['id'],
  data() {
    return {
      socket: null,
      players: [],
      state: null,
      game: null,
    };
  },
  mounted() {
    this.connectToRoom();
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    connectToRoom() {
      this.socket = io.connect(`${getServerUri(3333)}?room=${this.id}&user=${this.user.id}`);
      this.socket.on('connect', this.handleSocketConnect);
      this.listenSocket();
    },
    handleRoomUpdate({ players, state, game }) {
      this.players = players;
      this.state = state;
      this.game = game;
    },
    handleSocketConnect() {
      this.getRoomData();
    },
    getRoomData() {
      this.socket.emit('get room data', this.handleRoomUpdate);
    },
    listenSocket() {
      this.socket.on('exception', (...args) => {
        console.error('exception', ...args);
      });
      this.socket.on('room update', this.handleRoomUpdate);
    },
  },
};
</script>
