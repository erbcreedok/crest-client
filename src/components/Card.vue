<template>
  <div class="card" @click="emitClick">
    <img :src="imageSrc" alt="" style="width: 100%;">
  </div>
</template>
<script>
export default {
  name: 'card',
  props: ['id', 'suit', 'value'],
  computed: {
    imageSrc() {
      return `/img/cards/${this.id}.jpg`;
    },
  },
  methods: {
    emitClick() {
      this.$emit('click');
    },
  },
};
</script>
