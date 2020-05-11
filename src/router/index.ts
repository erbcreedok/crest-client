import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '../store';
import Home from '../views/Home.vue';
import Room from '../views/Room.vue';
import RoomOld from '../views/RoomOld.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true,
  },
  {
    path: '/defRoom:defRoom',
    name: 'DefRoom',
    component: Home,
    props: true,
  },
  {
    path: '/room:id',
    name: 'Room',
    component: Room,
    props: true,
    beforeEnter: (to, from, next) => {
      if (store.state.user) {
        next();
      } else {
        next({ name: 'DefRoom', params: { defRoom: to.params.id } });
      }
    },
  },
  {
    path: '/devroom:id',
    name: 'RoomOld',
    component: RoomOld,
    props: true,
    beforeEnter: (to, from, next) => {
      if (store.state.user) {
        next();
      } else {
        next({ name: 'Home' });
      }
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
