<template>
  <div class="room">
    ROOM {{id}}
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'Room',
  props: ['id'],
  data() {
    return {
      socket: null,
    };
  },
  mounted() {
    this.connectToRoom();
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    connectToRoom() {
      this.socket = io.connect(`http://localhost:3333?room=${this.id}&user=${this.user.id}`);
      this.socket.on('connect', this.handleSocketConnect);
      this.listenSocket();
    },
    handleSocketConnect(...args) {
      console.log('connected', ...args);
    },
    listenSocket() {
      this.socket.on('exception', (...args) => {
        console.log('exception', ...args);
      });
    },
  },
};
</script>
