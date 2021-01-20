import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from "./store";
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import Toast from 'muse-ui-toast';
import setting from "@/views/login/Toast/Toast.config";
import http from "@/request/http";


Vue.config.productionTip = false
Vue.use(http)
Vue.use(MuseUI);
Vue.use(Toast, setting);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
