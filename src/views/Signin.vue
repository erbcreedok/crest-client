<template>
  <div class="home">
    Welcome to the Crest online! <br/>
    <br/>
    <form @submit.prevent="handleSubmit">
      <span v-if="error" style="color: red"> {{error}}</span><br/>
      <label for="name">Enter your name</label>
      <input required id="name" name="name" type="text" v-model="name"/><br/>

      <label for="room">Enter room code</label>
      <input id="room" name="room" type="text" v-model="room"/><br/>

      <button type="submit">{{room ? 'Присоединиться' :'Начать игру'}}</button>
      <br/>
      <button type="button" v-if="room && name" @click="playAsOld">Войти как {{name}}</button>
    </form>
  </div>
</template>
<script>
import client from '../client/client';

export default {
  name: 'Signin',
  props: ['defRoom'],
  data() {
    return {
      name: '',
      room: this.defRoom,
      error: '',
    };
  },
  methods: {
    handleSubmit() {
      client.post('user', { name: this.name, room: this.room }).then((res) => {
        this.$emit('userFetched', res.data);
      }).catch((err) => {
        this.error = err.response.data.message;
      });
    },
    playAsOld() {
      client.post('old_user', { name: this.name, room: this.room }).then((res) => {
        this.$emit('userFetched', res.data);
      }).catch((err) => {
        this.error = err.response.data.message;
      });
    },
  },
};
</script>
