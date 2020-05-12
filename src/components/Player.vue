<template>
  <div class="player_block"
       :class="{
          'player_block-turn': state==='turn',
          'player_block-offline': !isConnected,
          'player_block-not_ready': !isReady,
       }"
  >
    <img v-if="isAdmin" :src="crownImg" alt="admin" class="player_admin"/>
    <div class="player_state">
      {{emoji}}
    </div>
    <span class="player_name">{{name}}</span>
    <div class="player_hands">
      <div v-for="card of cardsCount"
           :key="card"
           class="card_back"
           :style="{
             backgroundImage: `url(${cardBackImg})`,
              ...calculateCardStyle(card, cardsCount),
           }"
      />
      <div class="card_back card_back_animation card_back_animation-take"
           :class="{ 'card_back_animation-take-play': animate==='take' }"
           :style="{ backgroundImage: `url(${cardBackImg})` }"
      />
      <div class="card_back card_back_animation card_back_animation-move"
           :class="{ 'card_back_animation-move-play': animate==='move' }"
           :style="{ backgroundImage: `url(${cardBackImg})` }"
      />
    </div>
    <div class="player_emotions">
      <div class="player_emotion" v-for="emotion in emotions" :key="emotion.id">
        {{emotion.value}}
      </div>
    </div>
  </div>
</template>

<script>
import cardBackImg from '../assets/cards/back.jpg';
import crownImg from '../assets/crown.png';

export default {
  name: 'Player',
  props: ['socket', 'id', 'name', 'state', 'emoji', 'cardsCount', 'isReady', 'isConnected', 'firstWinCount', 'loseCount', 'isAdmin'],
  data() {
    return {
      cardBackImg,
      crownImg,
      animationTimeout: null,
      animate: false,
      emotions: [],
    };
  },
  computed: {
    playerState() {
      if (!this.isConnected) {
        return 'Offline';
      }
      if (!this.isReady) {
        return 'Waiting';
      }
      return 'Ready';
    },
  },
  watch: {
    cardsCount(to, from) {
      clearTimeout(this.animationTimeout);
      if (from > to) {
        this.animate = 'move';
      } else {
        this.animate = 'take';
      }
      this.animationTimeout = setTimeout(() => {
        this.animate = false;
      }, 300);
    },
  },
  methods: {
    calculateCardStyle(index, total) {
      const degree = -30 / (total + 1);
      const rotate = (degree * index) + 15;
      return {
        transform: `rotate(${rotate}deg)`,
      };
    },
    listenSocket() {
      this.socket.on('emote', (playerId, emotion) => {
        if (this.id === playerId) {
          const id = (new Date()).getTime().toString();
          this.emotions.push({
            id,
            value: emotion,
          });
          setTimeout(() => {
            const e = [...this.emotions];
            const index = e.findIndex((em) => em.id === id);
            if (index !== -1) {
              e.splice(index, 1);
              this.emotions = [...e];
            }
          }, 1500);
        }
      });
    },
  },
  mounted() {
    this.listenSocket();
  },
};
</script>

<style lang="less">
  .player_block {
    display: block;
    width: 90px;
    &-turn {
      .player_state {
        box-shadow: 0 0 30px 10px #1646ff;
        border: 3px solid white;
      }
    }
    &-offline {
      opacity: .5;
      pointer-events: none;
      filter: grayscale(1);
    }
    &-not_ready {
      opacity: .5;
      pointer-events: none;
    }
  }
  .player_state {
    display: block;
    box-sizing: border-box;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    border-radius: 100%;
    border: 1px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,.1);
    text-shadow: 0 0 10px rgba(0, 0, 0, 1);
    color: white;
    font-size: 40px;
    text-align: center;
    line-height: 50px;
  }
  .player_admin {
    position: absolute;
    display: block;
    top: -13px;
    left: 20px;
    width: 24px;
    transform: rotate(-25deg);
  }
  .player_name {
    font-size: 14px;
    color: white;
    display: block;
    text-align: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 3px rgb(0,0,0);
  }
  .player_hands {
    height: 40px;
    position: relative;
  }
  .player_emotions {
    .player_emotion {
      width: 40px;
      text-align: center;
      font-size: 50px;
      position: absolute;
      top: 30px;
      left: 0;
      right: 0;
      margin: 0 auto;
      text-shadow: 0 0 10px black;
      animation: emojiScale .5s ease-out both;
    }
    @keyframes emojiScale {
      from {
        transform: scale(.4) translateY(0);
      }
      to {
        transform: scale(1) translateY(60px);
      }
    }
  }
  .card_back {
    top: 0;left: 0;
    right: 0;bottom: 0;
    display: block;
    margin: auto;
    position: absolute;
    flex-grow: 0;
    width: 21px;
    height: 30px;
    background-size: cover;
    transform-origin: 7px -60px;
    transition: .2s ease-in-out;
    &_animation {
      transform-origin: center;
      transition: transform .3s;
      opacity: 0;
      &-take {
        transform: translateY(150px) scale(2) rotate(0deg);
        &-play {
          opacity: 1;
          transform: translateY(0px) rotate(720deg);
        }
      }
      &-move {
        transform: translateY(0px) rotate(720deg);
        &-play {
          opacity: 1;
          transform: translateY(150px) scale(2) rotate(0deg);
        }
      }
    }
  }
</style>
