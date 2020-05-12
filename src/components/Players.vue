<template>
  <div class="players">
    <div v-for="(player, index) in players"
         :key="player.id"
         class="player_wrapper"
         :style="calculatePlayerPosition(index, players.length)"
    >
      <Player v-bind="player" :is-admin="player.id === adminId" :socket="socket"/>
    </div>
  </div>
</template>

<script>
import Player from '@/components/Player.vue';

export default {
  name: 'Players',
  components: { Player },
  props: ['players', 'adminId', 'socket'],
  methods: {
    calculatePlayerPosition(index, total) {
      const degree = 180 / (total + 1);
      const rotate = (degree * (index + 1)) - 90;
      return { transform: `rotate(${rotate}deg)` };
    },
  },
};
</script>

<style lang="less">
  .players {
    display: flex;
    width: 100%;
    height: 1px;
    padding-bottom: 50%;
    position: relative;
    justify-content: center;
    padding-top: 20px;
    overflow: hidden;
  }
  .player_wrapper {
    height: 100%;
    position: absolute;
    transform-origin: bottom center;
  }
</style>
