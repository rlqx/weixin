<template>
  <div class="addfridens">
    <mu-button icon @click="$router.replace({path:'chat'})">
      <mu-icon value="chevron_left"></mu-icon>
    </mu-button>
    <div class="addusers">
      <mu-container fluid>
        <mu-text-field @input="search_hide" @keydown.enter="find_friends" v-model="key" label="User ID" label-float
                       icon="search"></mu-text-field>
        <mu-button @click="find_friends" class="btn" round>搜索</mu-button>
      </mu-container>
    </div>
    <div class="search_result">
      <mu-list v-show="ishow">
        <mu-sub-header>查询结果({{ friends_list.length }})</mu-sub-header>
        <div v-for="(item,index) in friends_list" :key="index">
          <hr>
          <mu-list-item avatar button :ripple="false">
            <mu-list-item-action>
              <mu-avatar>
                <img :src="item.headerimg" alt="">
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-title>{{ item.username }}</mu-list-item-title>
            <mu-list-item-action @click="add_friends(item)">
              <mu-icon value="person_add"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
        </div>
      </mu-list>
    </div>
  </div>
</template>

<script>

export default {
  name: "addfriends",
  data() {
    return {
      key: '',
      friends_list: [],
      ishow: false
    }
  },
  methods: {
    //添加好友的时候用uid搜索用户
    find_friends() {
      let search_data = this.key
      this.$http.get('search?key=' + search_data).then(res => {
        console.log(res)
        this.ishow = true
        this.friends_list = res.data
        console.log(this.friends_list)
      }).catch(err => {
        console.log(err)
      })
    },
    //查找到想加好友的用户之后添加好友
    //利用v-for直接获取当前选择的item
    add_friends(user) {
      let self_uid = this.$store.state.me.uid
      let friend_uid = user.uid
      console.log(user)
      //发送post请求到后端
      this.$http.post('add_friend', {
        self_uid, friend_uid
      }).then(res => {
        console.log(res)
        if (res.data === 'added') {
          this.$toast.info('已经是好友了');
        } else if (res.data === 'repeat') {
          this.$toast.warning('好友请求已经发送过了')
        } else if (res.data === 'err') {
          this.$toast.error('不能添加自己为好友')
        } else if (res.data === 'success') {
          this.$store.state.socket.emit('add_friend', {
            touid: friend_uid,
            fromuse: this.$store.state.me
          })
          this.$toast.success('好友请求发送成功')
        }
      })
    },
    search_hide() {
      this.ishow = false
    }
  }
}
</script>

<style scoped lang="less">
.addfridens {
  margin-top: 5vh;
}

.addfridens .addusers {
  text-align: start;

  .btn {
    width: auto;
  }
}

.mu-raised-button .mu-button-wrapper {
  padding: 0 !important;
}
</style>