<template>
  <div>
    <hr>
    Player: {{ name }}<br>
    Status: {{ state }}<br>
    Cards count: {{ cardsCount }}<br>
    Stats: {{ firstWinCount }} / {{loseCount}}<br>
    {{isConnected ? 'connected' : 'disconnected'}}<br>
    {{isReady ? 'ready' : 'not ready'}}
    <hr>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: ['id', 'name', 'state', 'cardsCount', 'isReady', 'isConnected', 'firstWinCount', 'loseCount'],
};
</script>
