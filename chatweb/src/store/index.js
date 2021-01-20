import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        me: null,
        socket: null,
        login_status: false,
        friend_add: [],
        ischat: false
    },
    mutations: {
        user(state, user) {
            state.me = user
        },
        socket(state, socket) {
            state.socket = socket
        },
        friend_add(state,data) {
            state.friend_add.push(data)
        },
        ischat(state) {
            state.ischat = true
        },
        dischat(state) {
            state.ischat = false
        }
    },
    actions: {}
})

export default store