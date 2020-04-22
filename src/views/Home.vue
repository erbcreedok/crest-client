<template>
  <Signin @userFetched="setUser"/>
</template>

<script>
import Signin from '@/views/Signin.vue';
import client from '../client/client';

export default {
  name: 'Home',
  components: { Signin },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    getUser() {
      return client.get('user').then((res) => res.data);
    },
    setUser(user) {
      if (!user) {
        return;
      }
      this.$store.commit('setUser', user);
      this.$router.push({ name: 'Room', params: { id: user.room } });
    },
  },
  mounted() {
    this.getUser().then((user) => {
      if (!user) {
        return;
      }
      this.$dialog
        .confirm(`Are you ${user.name}?`, { okText: 'Yes', cancelText: 'No' })
        .then(() => this.setUser(user));
    });
  },
};

</script>
