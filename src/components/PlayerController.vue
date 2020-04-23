<template>
  <div>
    <button v-if="!isReady" @click="setReadyState(true)">I'm ready</button>
    <button v-if="isReady" @click="setReadyState(false)">I'm not ready</button>
  </div>
</template>

<script>
export default {
  name: 'player-controller',
  props: ['socket'],
  computed: {
    player() {
      return this.$store.state.user;
    },
    isReady() {
      return this.player.isReady;
    },
  },
  mounted() {
    this.getPlayerState();
    this.listenSocket();
  },
  methods: {
    updateUserState(player) {
      this.$store.commit('setUser', player);
    },
    getPlayerState() {
      this.socket.emit('get player data', (player) => {
        this.updateUserState(player);
      });
    },
    listenSocket() {
      this.socket.on('player update', (data) => {
        const p = { ...this.player, ...data };
        this.updateUserState(p);
      });
    },
    setReadyState(data) {
      this.socket.emit('set player ready state', data, (player) => {
        this.updateUserState(player);
      });
    },
  },
};
</script>
