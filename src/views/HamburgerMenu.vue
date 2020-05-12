<template>
    <button class="hamburger_menu hamburger_menu-default"
            :class="{
                  'hamburger_menu-closer': isClose
            }"
            @click="handleClick"
    >
      <span class="filler"/>
    </button>
</template>
<script>
export default {
  name: 'HamburgerMenu',
  props: ['isClose'],
  methods: {
    handleClick(e) {
      this.$emit('click', e);
    },
  },
};
</script>
<style>
    .hamburger_menu {
        margin: 20px;
    }
</style>
