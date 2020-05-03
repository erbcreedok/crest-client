import Vue from 'vue';
import VuejsDialog from 'vuejs-dialog';
import Vue2TouchEvents from 'vue2-touch-events';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.use(VuejsDialog);
Vue.use(Vue2TouchEvents, {
  disableClick: true,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
