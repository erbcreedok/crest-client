<template>
  <div id="app">
    <router-view/>
    <span style="opacity: 0.3; font-size: 8px; position: fixed; bottom: 0;">
      version: {{version}}
    </span>
    <notifications position="bottom center"/>
  </div>
</template>

<script>
import './style/main.less';
import { version } from '../package.json';

export default {
  data() {
    return {
      version,
    };
  },
};
</script>
