<template>
  <div>
    <template v-if="player.state === 'wait'">
      <button v-if="!isReady" @click="setReadyState(true)">I'm ready</button>
      <button v-if="isReady" @click="setReadyState(false)">I'm not ready</button>
    </template>
    <template v-else>
      <template v-if="player.state === 'idle'">
        <span v-for="card in sortedCards" :key="card.id">
          <Card v-bind="card" style="display: inline-block; width: 50px"/>
        </span>
      </template>
      <template v-if="player.state === 'turn'">
        <Card v-for="card in sortedCards" :key="card.id"
              v-bind="card"
              style="cursor: pointer; display: inline-block; margin: 0 5px; width: 50px"
              @click="sendCard(card)"/>
        <div>
          <button @click="takeCard">Take card</button>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import Card from '@/components/Card.vue';
import sortCards from '@/scripts/sortCards';

export default {
  name: 'player-controller',
  components: { Card },
  props: ['socket'],
  data() {
    return {
    };
  },
  computed: {
    player() {
      return this.$store.state.user;
    },
    isReady() {
      return this.player.isReady;
    },
    sortedCards() {
      return !this.player ? [] : sortCards(this.player.cards);
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
    sendCard(card) {
      console.log(card);
      this.socket.emit('send card', card.id);
    },
    takeCard() {
      this.socket.emit('take card');
    },
  },
};
</script>
