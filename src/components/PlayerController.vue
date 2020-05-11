<template>
  <div class="player_controller">
    <template v-if="player.state === 'wait'">
      <div class="player_controller-ready_controller">
        <span class="player_controller-ready_state">
          {{isReady ? 'You ready' : 'Waiting'}}
        </span>
        <button class="player_controller-ready_button"
                :class="{
                    'player_controller-ready_button-success': !isReady,
                    'player_controller-ready_button-danger': isReady,
                }"
                @click="setReadyState(!isReady)"
        >
          {{isReady ? 'Wait' : 'Ready'}}
        </button>
        <button class="player_controller-ready_button player_controller-ready_button-success"
                v-if="isReady && player.id === adminId"
                @click="startGame"
        >
          Go!
        </button>
      </div>
    </template>
    <template v-else>
      <button v-if="player.state === 'turn'"
              class="player_controller-take_card"
              @click="takeCard"
      >
        Take card
      </button>
      <PlayerHand v-if="player && player.cards"
                  :cards="player.cards"
                  :is-turn="player.state === 'turn'"
                  @cardmove="sendCard"
      />
    </template>
  </div>
</template>

<script>
import PlayerHand from '@/components/PlayerHand.vue';

export default {
  name: 'player-controller',
  components: { PlayerHand },
  props: ['socket', 'adminId'],
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
    startGame() {
      this.socket.emit('start room game');
    },
  },
};
</script>

<style lang="less">
  .player_controller {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    padding: 0 20px;
    &-ready_controller {
      display: flex;
      height: 100px;
      align-items: center;
      justify-content: center;
    }
    &-ready_state {
      color: white;
      line-height: 100px;
    }
    &-ready_button {
      display: block;
      width: 80px;
      height: 80px;
      margin: 0 20px;
      border-radius: 50%;
      font-size: 24px;
      &-success {
        background: darkblue;
        color: white;
      }
      &-danger {
        background: red;
        color: white;
      }
    }
    &-take_card {
      width: 80px;
      position: absolute;
      top: -70px;
      height: 40px;
      left: 0; right: 0;
      margin: auto;
      background: white;
      color: black;
      border-radius: 20px;
    }
  }
</style>
