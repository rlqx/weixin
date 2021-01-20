<template>
  <div class="registered">
    <div class="logo">
      <img src="../../assets/logo.png" alt="">
      <span>QQ</span>
    </div>
    <mu-container>
      <mu-form ref="form" :model="validateForm" class="mu-demo-form">
        <mu-form-item prop="username" :rules="usernameRules">
          <mu-text-field color="blue" prefix="昵称：" v-model="validateForm.username" prop="username">
          </mu-text-field>
        </mu-form-item>
        <mu-form-item prop="userid" :rules="useridRules">
          <mu-text-field color="blue" prefix="账号：" v-model="validateForm.userid"
                         prop="userid"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="password" :rules="passwordRules">
          <mu-text-field color="blue" prefix="密码：" type="password" v-model="validateForm.password"
                         prop="password" required autocomplete='tel'></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="confirm" :rules="confirmRules">
          <mu-text-field color="blue" prefix="确认密码：" type="password" v-model="validateForm.confirm"
                         prop="confirm" required autocomplete='tel'></mu-text-field>
        </mu-form-item>
        <mu-flex class="flex-wrapper" justify-content="center">
          <mu-button id="btn" class="btn">注册</mu-button>
        </mu-flex>
      </mu-form>
    </mu-container>
  </div>
</template>

<script>
import throttling from "@/modules/throttling";

export default {
  name: "registered",
  data() {
    return {
      validateForm: {
        username: '',
        userid: '',
        password: '',
        confirm: ''
      },
      usernameRules: [
        {validate: (val) => !!val, message: '请输入昵称'}
      ],
      useridRules: [
        {validate: (val) => !!val, message: '必须输入账号'},
        {validate: (val) => val.length >= 3, message: '账号长度大于3'}
      ],
      passwordRules: [
        {validate: (val) => !!val, message: '必须填写密码'},
        {validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10'}
      ],
      confirmRules: [
        {validate: (val) => !!val, message: '必须确认密码'},
        {validate: (val) => val === this.validateForm.password, message: '两次密码不一致'}
      ]
    }
  },
  mounted() {
    let button = document.getElementById('btn')
    button.addEventListener('click',throttling(this.registered,2000))
  },
  methods: {
    registered() {
      let user = this.validateForm
        this.$refs.form.validate().then(async (result) => {
          console.log('form valid: ', result)
          if (result) {
            await this.$http.post('/registered', {
              user
            }).then(res => {
              console.log(res)
              if (res.data === 'repeat') {
                this.$toast.info('账号已存在')
              }else if (res.data === 'success'){
                this.$toast.success('注册成功')
                this.$router.replace({
                  path: '/'
                })
              }
            }).catch(err=>{
              console.log(err)
            })
          }
        })
    },
  },
  clear() {
    this.$refs.form.clear()
    this.validateForm = {
      userid: '',
      password: '',
      confirm: ''
    }
  },

}
</script>

<style scoped>
.btn {
  color: #0000008a;
  background: transparent;
  padding: 32px 64px;
  border-radius: 6px;
  text-align: center;
  display: inline-block;
  font-size: 32px;
  margin: 40px 2px;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
}

.mu-demo-form {

}

.registered {
  position: absolute;
  background-image: url("../../assets/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
}

.registered .logo {
  position: relative;
  top: 50px;
  color: #ffffff;
  font-size: 32px;
  line-height: 30px;
}

.registered .logo span {
  position: absolute;
  line-height: 40px;
}

.mu-demo-form {
  margin-top: 10vh;
  width: 100%;
  max-width: 460px;
}

.registered .logo img {
  width: 10vw;
}
</style>