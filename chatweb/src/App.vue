<template>
  <div id="app">
    <keep-alive include="chat">
      <router-view></router-view>
    </keep-alive>
    <div class="btmnav" v-if="$store.state.me&&!$store.state.ischat">
      <mu-bottom-nav :value.sync="shift">
        <mu-bottom-nav-item to="/chat" value="massage" title="消息" icon="mode_comment"></mu-bottom-nav-item>
        <mu-bottom-nav-item to="/contactper" value="contactper" title="联系人" icon="person_pin"></mu-bottom-nav-item>
        <mu-bottom-nav-item value="mine" title="我的" icon="face"></mu-bottom-nav-item>
      </mu-bottom-nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      shift: 'massage'
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

body {
  margin-left: 0 !important;
  overflow: hidden;
}

#app .btmnav {
  position: absolute;
  bottom: 0;
  width: 100vw;
  background: transparent;
}
</style>
