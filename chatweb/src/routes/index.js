import Vue from 'vue'
import VueRouter from 'vue-router'
import chat from "@/views/chat/chat";
import login from "@/views/login/login";
import registered from "@/views/registered/registered";
import addfriends from "@/views/chat/userList/menu/addfriends";
import contactper from "@/views/contactper/contactper";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: login
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/chat',
        component: chat
    },
    {
        path: '/registered',
        component: registered
    },
    {
        path: '/addfriends',
        component: addfriends
    },
    {
        path: '/contactper',
        component: contactper
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router