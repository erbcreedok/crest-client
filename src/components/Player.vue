<template>
  <div class="player_block"
       :class="{
          'player_block-turn': state==='turn',
          'player_block-offline': !isConnected,
       }"
  >
    <img v-if="isAdmin" :src="crownImg" alt="admin" class="player_admin"/>
    <div class="player_state">
      {{playerState}}
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
    </div>
  </div>
</template>

<script>
import cardBackImg from '../assets/cards/back.jpg';
import crownImg from '../assets/crown.png';

export default {
  name: 'Player',
  props: ['id', 'name', 'state', 'cardsCount', 'isReady', 'isConnected', 'firstWinCount', 'loseCount', 'isAdmin'],
  data() {
    return {
      cardBackImg,
      crownImg,
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
  methods: {
    calculateCardStyle(index, total) {
      const degree = -30 / (total + 1);
      const rotate = (degree * index) + 15;
      return {
        transform: `rotate(${rotate}deg)`,
      };
    },
  },
};
</script>

<style lang="less">
  .player_block {
    display: block;
    width: 90px;
    &-turn {
      .player_state {
        box-shadow: 0 0 30px 1px #1646ff;
        border: 3px solid white;
      }
    }
    &-offline {
      opacity: .5;
      pointer-events: none;
      filter: grayscale(1);
    }
  }
  .player_state {
    display: block;
    box-sizing: border-box;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    border-radius: 100%;
    background: gray;
    border: 1px solid #131313;
    box-shadow: 0 2px 5px rgba(0,0,0,.1);
    color: white;
    font-size: 10px;
    text-align: center;
    line-height: 46px;
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
  }
</style>
