<template>
  <div>
    <div class="userlist">
      <div v-if="$store.state.me != null" class="nav">
        <div class="headerimg" @click="usermenu" :class="{offline: !$store.state.login_status}">
          <img :src="$store.state.me.headerimg" alt="">
        </div>
        <div class="title">
          <span>{{ $store.state.me.username }}</span>
        </div>
        <div class="more">
          <mu-menu slot="right" :open.sync="open">
            <mu-button icon>+</mu-button>
            <mu-list slot="content">
              <mu-list-item button @click="create_group">
                <mu-list-item-content>
                  <mu-list-item-title>创建群组</mu-list-item-title>
                </mu-list-item-content>
              </mu-list-item>
              <mu-list-item button @click="add_friend">
                <mu-list-item-content>
                  <mu-list-item-title>添加好友/群</mu-list-item-title>
                </mu-list-item-content>
              </mu-list-item>
              <mu-list-item button @click="scan_code">
                <mu-list-item-content>
                  <mu-list-item-title>扫一扫</mu-list-item-title>
                </mu-list-item-content>
              </mu-list-item>
            </mu-list>
          </mu-menu>
        </div>
      </div>
      <div class="users">
        <div class="useritem" @click="chooseuser(item)" v-for="(item,index) in users" :key="index">
          <div class="left" :class="{offline: item.isonline===null, unread: unreadlist.indexOf(item.uid)!== -1}">
            <img :src="item.headerimg" alt="">
          </div>

          <div class="right">
            <span class="username">{{ item.username }}</span>
            <span class="msg"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "userList",
  props: ['users', 'chooseuser', 'unreadlist'],
  data() {
    return {
      open: false,
    }
  },
  methods: {
    usermenu() {
    },
    create_group() {
      console.log('创建群组')
      this.open = false
    },
    add_friend() {
      console.log('添加好友/群')
      this.$router.replace({
        path: '/addfriends'
      })
      this.open = false
    },
    scan_code() {
      console.log('扫一扫')
      this.open = false
    }
  },
  mounted() {
    console.log('aaa')
  },
  computed: {
    friends() {

    }
  }
}
</script>

<style scoped>
.unread {
  position: relative;
}

.unread::before {
  position: absolute;
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  bottom: 5px;
  right: 5px;
}

.useritem {
  display: flex;
  height: 80px;
  align-items: center;
  padding: 0 10px;
  background-color: transparent;;
  border-bottom: 1px solid #eee;
}

/*.useritem {*/
/*  display: flex;*/
/*  height: 80px;*/
/*  align-items: center;*/
/*  padding: 0 10px;*/
/*  background: #cccccc;*/
/*  border-bottom: 1px solid #eee;*/
/*}*/

.useritem .right {
  padding: 0 10px;
}

.useritem .left img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.headerimg {
  width: 50px;
  height: 50px;
  margin: 0 10px;
}

.headerimg img {
  filter: grayscale(0);
  width: 50px;
  height: 50px;
  border-radius: 20%;
  display: flex;
}

.offline {
  -webkit-filter: grayscale(1) !important;
  filter: grayscale(1) !important;
}

/*.nav {*/
/*  width: 100vw;*/
/*  height: 80px;*/
/*  background: skyblue;*/
/*  display: flex;*/
/*  align-items: center;*/
/*  justify-content: space-between;*/
/*}*/

.nav {
  width: 100vw;
  height: 80px;
  background-color: transparent;
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, .3);
  overflow: scroll;
}

.nav .title {
  font-weight: 700;
  font-size: 7vw;
}

.nav .more {
  position: absolute;
  right: 5vw;
  top: 10px;
  font-size: 9vw;
}

.mu-icon-button {
  font-size: 35px;
}

/*.userlist {*/
/*  width: 100vw;*/
/*  height: 100vh;*/
/*  overflow: scroll;*/
/*  background-color: #f5f6fa;*/
/*}*/
.userlist {
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  background-image: url("../../../assets/bg.png");
  position: absolute;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}
</style>