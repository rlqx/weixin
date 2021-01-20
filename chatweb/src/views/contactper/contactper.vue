<template>
  <div class="contactper">
    <mu-list>
      <mu-sub-header>好友请求({{ $store.state.friend_add.length }})</mu-sub-header>
      <div v-for="(item,index) in $store.state.friend_add" :key="index">
        <hr>
        <mu-list-item avatar button :ripple="false">
          <mu-list-item-action>
            <mu-avatar>
              <img :src="item.headerimg" alt="">
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-title>{{ item.username }}</mu-list-item-title>
          <mu-list-item-action @click="added_friends(item)">
            <mu-icon value="person_add"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
      </div>
    </mu-list>
  </div>
</template>

<script>
export default {
  name: "contactper",
  data() {
    return {
    }
  },
  methods: {
    added_friends(add_user) {
      let self_user = this.$store.state.me
      this.$store.state.socket.emit('cfm_add', {add_user,self_user})
    }
  }
}
</script>

<style scoped>

</style>