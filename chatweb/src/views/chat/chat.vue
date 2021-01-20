<template>
  <div id="chat">
    <div class="cover" v-if="isdisplay">
      <div class="mask_layer"></div>
      <div class="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="main" v-show="!isdisplay">
      <user-list v-if="!$store.state.ischat" :users="users" :chooseuser="chooseuser"
                 :unreadlist="unreadlist"></user-list>
      <chat-user v-else :touser="touser" :newmsg="newmsg" :back="back"></chat-user>
    </div>
  </div>
</template>

<script>
import userList from "@/views/chat/userList/userList";
import chatUser from "@/views/chat/chatUser/chatUser";
import userinfo from "@/views/chat/userList/menu/userinfo";

export default {
  name: 'chat',
  components: {
    userList,
    chatUser,
    userinfo,
  },
  data() {
    return {
      isdisplay: true,
      userlist: [],
      users: [],
      touser: null,
      unreadlist: [],
      newmsg: null,
      group: [],
    }
  },
  methods: {
    chooseuser(user) {
      this.touser = user
      this.$store.commit('ischat')
      let index = this.unreadlist.indexOf(user.uid)
      this.unreadlist.splice(index, 1)
    },
    back() {
      this.$store.commit('dischat')
    }
  },
  mounted() {
    console.log('组件挂载完成')
    setTimeout(() => {
      this.isdisplay = false
    }, 1000)
    //  监听登录成功，设置为true
    if (this.$store.state.socket) {
      //监听登录事件
      this.$store.state.socket.on('login', data => {
        if (data.state === 'ok') {
          this.$store.state.login_status = true
          this.$store.state.socket.on('users', data => {
            this.users = data
          })
        }
      })
      //监听退出事件
      this.$store.state.socket.on('logout', data => {
        console.log(data)
        this.$store.state.login_status = false
        this.$store.state.socket.disconnect()
      })
      //监听断开连接事件
      this.$store.state.socket.on('disconnect', data => {
        console.log(data.content)
      })
      //监听未读消息
      this.$store.state.socket.on('unreadMsg', data => {
        // console.log('unreadMsg')
        // console.log(data)
        data.forEach((item, index) => {
          //设置未读的红点
          this.unreadlist.push(item.from)
          let strKey = 'chat-user-' + this.$store.state.me.uid + '-' + item.from;
          //先解析本地存储的数据，在添加
          //console.log(localStorage[strKey])
          localStorage[strKey] = localStorage[strKey] ? localStorage[strKey] : '[]';
          let newArr = JSON.parse(localStorage[strKey]);
          newArr.push(item)
          localStorage[strKey] = JSON.stringify(newArr);
        })
      })
      //监听未接收的好友请求
      this.$store.state.socket.on('unaccept', data => {
        this.$store.state.friend_add.push(data)
      })
      //监听接收群
      this.$store.state.socket.on('group', data => {
        this.group = data
      })
      //监听接收消息
      this.$store.state.socket.on('accept', msg => {
        console.log('监听到接收指令')
        if (this.$store.state.ischat === true) {
          if ((this.touser.uid === msg.from) || (this.touser.isgroup === true)) {
            this.newmsg = msg
          }
        } else {
          let strKey = 'chat-user-' + this.$store.state.me.uid + '-' + msg.from;
          localStorage[strKey] = localStorage[strKey] ? localStorage[strKey] : '[]';
          let newArr = JSON.parse(localStorage[strKey]);
          newArr.push(msg)
          localStorage[strKey] = JSON.stringify(newArr);
          this.unreadlist.push(msg.from)
        }
      })
      this.$store.state.socket.on('readded', data => {
        this.$store.commit('friend_add', data)
        console.log(data)
      })
    }
  }
}
</script>

<style>
.cover {
  position: absolute;
}

.cover .mask_layer {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 165, 0, 0.3);
  z-index: 777;
}

.cover .loading {
  display: flex;
  position: absolute;
  width: 80px;
  height: 40px;
  margin: 30vh auto 0;
  z-index: 1000;
  justify-content: space-around;
  left: calc((100vw - 80px) / 2);
}

.cover .loading span {
  display: inline-block;
  width: 8px;
  height: 100%;
  border-radius: 4px;
  background: lightcoral;
  -webkit-animation: load 1s ease infinite;
}

@-webkit-keyframes load {
  0%, 100% {
    height: 40px;
    background: lightcoral;
  }
  50% {
    height: 70px;
    margin: -15px 0;
    background: lightyellow;
  }
}

.loading span:nth-child(2) {
  -webkit-animation-delay: 0.2s;
}

.loading span:nth-child(3) {
  -webkit-animation-delay: 0.4s;
}

.loading span:nth-child(4) {
  -webkit-animation-delay: 0.6s;
}

.loading span:nth-child(5) {
  -webkit-animation-delay: 0.8s;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
}

h1 {
  position: absolute;
  left: 117px;
  color: #87Ceeb;
  z-index: -1;
}
</style>
