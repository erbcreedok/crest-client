<template>
  <div class="player_controller" :style="{zIndex: showEmojiGallery ? '1000' : '1'}">
    <div class="player_controller_avatar">
      <div class="player_state"
           :class="{
              'player_state-is_turn': player.state === 'turn',
           }"
           @click="showEmojiGallery = true">
        {{player.emoji}}
      </div>
      <player-emoji-gallery v-if="showEmojiGallery"
                            @setAvatar="changeAvatar"
                            @setEmotion="sendEmotion"
                            :selected="player.isReady ? 'emotions' : 'avatars'"
                            @close="showEmojiGallery = false"
      />
    </div>
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
import PlayerEmojiGallery from '@/components/PlayerEmojiGallery.vue';

export default {
  name: 'player-controller',
  components: { PlayerEmojiGallery, PlayerHand },
  props: ['socket', 'adminId'],
  data() {
    return {
      showEmojiGallery: false,
    };
  },
  computed: {
    player() {
      return this.$store.state.user;
    },
    isReady() {
      return this.player.isReady;
    },
    playerState() {
      if (!this.player.isConnected) {
        return 'Offline';
      }
      if (!this.player.isReady) {
        return 'Waiting';
      }
      return 'Ready';
    },
  },
  mounted() {
    this.getPlayerState();
    this.listenSocket();
  },
  methods: {
    changeAvatar(avatar) {
      this.socket.emit('change avatar', avatar, (player) => {
        this.updateUserState(player);
        this.showEmojiGallery = false;
      });
    },
    sendEmotion(emotion) {
      this.socket.emit('emote', emotion);
    },
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
      padding: 0;
      text-align: center;
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
    .player_controller_avatar {
      position: relative;
    }
    .player_state {
      position: absolute;
      left: 10px;
      top: -65px;
      width: 70px;
      height: 70px;
      font-size: 45px;
      line-height: 70px;
      &-is_turn {
        border: 5px solid white;
        background: rgba(22, 70, 255, 0.33);
        box-shadow: 0 0 30px 10px #1646ff;
      }
    }
  }
</style>
