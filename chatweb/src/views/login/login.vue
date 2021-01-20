<template>
  <div class="login">
    <div class="logo" @click="register">
      <img src="../../assets/1655.png" alt="">
      <span></span>
    </div>
    <mu-container>
      <mu-form ref="form" :model="validateForm" class="mu-demo-form">
        <mu-form-item prop="userid" :rules="useridRules">
          <mu-text-field placeholder="请输入账号" v-model="validateForm.userid"
                         prop="userid"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="password" :rules="passwordRules">
          <mu-text-field placeholder="请输入密码" type="password" v-model="validateForm.password"
                         prop="password"></mu-text-field>
        </mu-form-item>
        <mu-flex class="flex-wrapper" justify-content="center">
          <mu-button class="btn1" @click="submit">登录</mu-button>
          <mu-button class="btn1" @click="clear">重置</mu-button>
        </mu-flex>
      </mu-form>
    </mu-container>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: "login",
  data() {
    return {
      visibility: false,
      useridRules: [
        {validate: (val) => !!val, message: '必须输入账号'},
        {validate: (val) => val.length >= 3, message: '账号长度大于3'}
      ],
      passwordRules: [
        {validate: (val) => !!val, message: '必须填写密码'},
        {validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10'}
      ],
      validateForm: {
        userid: '',
        password: '',
      }
    }
  },
  methods: {
    submit() {
      let user = this.validateForm
      this.$refs.form.validate().then(async (result) => {
        console.log('form valid: ', result)
        if (result) {
          await this.$http.post('/login', {
            user
          }).then(res => {
            if (res.data !== 'err') {
              this.$toast.success('登录成功');
              let socket = io.connect('http://192.168.0.110:3000/')
              this.$store.commit('socket',socket)
              this.$store.commit('user', res.data.user)
              localStorage.me = JSON.stringify(this.$store.state.me)
              socket.emit('login', this.$store.state.me)
              this.$router.replace({
                path: '/chat'
              })
            } else {
              this.$toast.info('账号或密码错误');
            }
          })
        }
      })
    },
    clear() {
      this.$refs.form.clear()
      this.validateForm = {
        userid: '',
        password: '',
      }
    },
    register() {
      this.$router.push({
        path: '/registered'
      })
    }
  }
}
</script>

<style scoped>
.btn1 {
  color: #eeeeee;
  background: transparent;
  padding: 16px 32px;
  border-radius: 6px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  margin: 71px 2px;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
}

.login {
  position: absolute;
  background-image: url("../../assets/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
}

.login .logo {
  position: relative;
  text-align: center;
  top: 50px;
  line-height: 30px;
}

/*.login .logo span {*/
/*  position: absolute;*/
/*  line-height: 40px;*/
/*}*/

.login .logo img {
  width: 60vw;
}

.mu-demo-form {
  margin-top: 13vh;
  width: 100%;
  max-width: 460px;
}
</style>