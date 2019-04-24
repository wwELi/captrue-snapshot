<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <captrue></captrue>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import captrue from './components/captrue.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    captrue
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
    width: 100vw;
    margin: 0;
    height: 100vh;
    top: 0;
    position: absolute;
}
</style>
