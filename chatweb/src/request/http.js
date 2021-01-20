import axios from 'axios'

export default  {
    install: function (Vue) {
        //新建一个axios实例
        //设置拦截器
        //添加Vue实例方法
        Vue.prototype.$http = axios.create({
            baseURL: 'http://192.168.0.110:3000/api'
        })
    }
}