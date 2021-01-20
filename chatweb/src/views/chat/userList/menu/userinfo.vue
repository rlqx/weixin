<template>
  <div class="usermenu">
    <div class="avater" @click="userquit">
      <img :src="$store.state.me.headerimg" alt="">
      <span>{{ $store.state.me.username }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "usermenu",
  methods: {
    userquit() {
      console.log()
      this.$router.replace({
        path: '/chat'
      })
    }
  }
}
</script>

<style scoped>
.usermenu {
  width: 100vw;
  height: 100vh;
  background-image: url("../../../../assets/bg.png");
}

.avater {
  display: flex;
  align-items: center;
}

.avater img {
  max-width: 20vw;
  border-radius: 20%;
}

.avater span {
  font-size: 7vw;
  font-weight: 700;
}
</style>