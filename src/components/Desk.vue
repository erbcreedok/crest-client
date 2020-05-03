<template>
  <div class="desk">
    <div class="desk-card_wrapper"
         v-for="card in cards"
         :key="card.id"
    >
      <Card v-bind="card"/>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card.vue';

export default {
  name: 'desk',
  components: { Card },
  props: ['cards'],
};
</script>

<style lang="less">
  .desk {
    position: fixed;
    width: 100px;
    height: 100px;
    top:0; left: 0; bottom: 0; right: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    &-card_wrapper {
      width: 50px;
      margin-right: -35px;
    }
  }
</style>
