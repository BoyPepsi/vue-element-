<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
// import { initRoleRouter } from '@/router/index.js';

export default {
  name: 'app',
    // 刷新页面
    provide(){
      return{
        reload:this.reload
      }
    },
  data() {
    return {
      isRouterAlive:true
    };
  },
  created() {
    // initRoleRouter();
  },
   methods:{
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      })
    }
  }
}
</script>

<style>
#app {
  width: 100%;
}
</style>
