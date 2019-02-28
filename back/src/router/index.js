import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/home',
            redirect: '/'
        },
        {
            path: '/article',
            name: 'article'
        }
    ]
})
