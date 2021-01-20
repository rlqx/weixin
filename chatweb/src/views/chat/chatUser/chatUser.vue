<template>
  <div class="chatuser">
    <div class="header">
      <span class="back" @click="back"><</span>
      <div>{{ touser.username }}</div>
    </div>
    <div  class="chatlist">
      <div class="chatitem" v-for="(item,index) in chatlist" :key="index"
           :class="{self:$store.state.me.uid===item.from}">
        <div class="header">
          <img :src="item.headerimg" alt="头像">
        </div>
        <div class="chatcontent">
          {{ item.content }}
        </div>
      </div>
    </div>
    <div class="inputcom">
      <label>
        <input type="text" v-model="inputData" @keydown.enter="sendEvent">
        <button :class="{active: this.inputData !== ''}" id="sendbtn" @click="sendEvent">发送</button>
      </label>
    </div>
  </div>
</template>

<script>

export default {
  name: "chatUser",
  props: ['touser', 'back', 'newmsg'],
  data() {
    return {
      chatlist: [],
      inputData: ""
    }
  },
  methods: {
    sendEvent() {
      let msg = {
        from: this.$store.state.me.uid,
        to: this.touser.uid,
        content: this.inputData,
        time: new Date().getTime(),
        headerimg: this.$store.state.me.headerimg
      }
      if (this.inputData === "") {
      } else {
        //发送到服务端
        this.$store.state.socket.emit('sendMsg', msg)
        this.chatlist.push(msg)
        console.log(this.chatlist)
        //保存聊天记录到本地
        this.saveStorage()
        this.inputData = ""
      }
    },
    saveStorage() {
      let strKey = 'chat-user-' + this.$store.state.me.uid + '-' + this.touser.uid
      localStorage[strKey] = JSON.stringify(this.chatlist)
    },
    getStorage() {
      let strKey = 'chat-user-' + this.$store.state.me.uid + '-' + this.touser.uid;
      localStorage[strKey] = localStorage[strKey] ? localStorage[strKey] : '[]';
      this.chatlist = JSON.parse(localStorage[strKey])
    },
    toBottom() {
      let chatbox = document.querySelector('.chatlist')
      chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight
    },
  },

  beforeMount() {
    console.log("获取聊天记录")
    console.log(this.touser)
    this.getStorage()
  },
  mounted() {
    this.toBottom()
  },
  updated() {
    this.toBottom()
  },
  watch: {
    newmsg(val) {
      this.chatlist.push(val)
      this.saveStorage()
    }
  }
}
</script>

<style scoped>
.chatitem {
  display: flex;
  margin: 0 10px;
}

.chatitem.self {
  flex-direction: row-reverse;
  justify-content: flex-start;
}

.chatitem .header img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.chatitem .chatcontent {
  background: #ffffff;
  border-radius: 5px;
  margin: 8px;
  font-size: 12px;
  color: #000000;
  padding: 5px;
  position: relative;
}

.chatitem.self .chatcontent {
  background: #1abaff;
  border-radius: 5px;
  margin: 8px;
  font-size: 12px;
  color: #ffffff;
  padding: 5px;
  position: relative;
}

.chatitem .chatcontent::before {

  display: block;
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border-right: 5px solid #ffffff;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  top: 8px;
  left: -4px;
}

.chatitem.self .chatcontent::before {
  display: block;
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border-left: 5px solid #00B7FF;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  top: 8px;
  right: -4px;
  left: initial;
  border-right: initial;
}

.chatuser .back {
  width: 20vw;
  height: 10vh;
  line-height: 80px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
}

.chatuser > .header {
  position: relative;
  font-size: 6vw;
  font-weight: 900;
  text-align: center;
  background-color: transparent;
  height: 80px;
  line-height: 80px;
  box-shadow: 0 1px 1px 1px rgba(0,0,0,.3);
}

/*.chatuser > .header {*/
/*  font-size: 18px;*/
/*  font-weight: 900;*/
/*  text-align: center;*/
/*  background: skyblue;*/
/*  height: 40px;*/
/*  line-height: 40px;*/
/*}*/

.chatlist {
  flex: 1;
  overflow: scroll;
}

.chatuser .inputcom {
  height: 50px;
  display: flex;
  background-color: transparent;
  justify-content: space-around;
  margin-bottom: 5vh;
}

/*.chatuser .inputcom {*/
/*  height: 50px;*/
/*  display: flex;*/
/*  background: #f5f6fa;*/
/*  justify-content: space-around;*/
/*  margin-bottom: 5vh;*/
/*}*/

.chatuser .inputcom input {
  width: 70vw;
  height: 40px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #ccc;
  margin: 0 5px;
}

.chatuser .inputcom button {
  width: 20vw;
  height: 40px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #ccc;
  margin: 0 5px;
  background-color: #B3B8C2;
  color: #7B7F87;
}

.active {
  background-color: #007AFF !important;
  color: #ffffff !important;
}

.chatuser {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-image: url("../../../assets/bg.png");
}

/*.chatuser {*/
/*  width: 100vw;*/
/*  height: 100vh;*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  position: absolute;*/
/*  left: 0;*/
/*  right: 0;*/
/*  top: 0;*/
/*  bottom: 0;*/
/*  background: #f5f6fa;*/
/*}*/
</style>