import Vue from 'vue';
import VuejsDialog from 'vuejs-dialog';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.use(VuejsDialog);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
