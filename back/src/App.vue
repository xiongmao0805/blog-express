<template>
    <div id="app">
        <router-view @freshCookie="freshCookie">
            <img src="./resource/images/bg.jpg" alt="" ref="bg" class="bg" :style="pk/pg >= rate ? fullBg1 : fullBg2" />
        </router-view>
    </div>
</template>

<script>
import {setCookie, getCookie} from '@/resource/js/common.js'
export default {
    name : 'admin',
    data () {
        return {
            token : getCookie('token'),
            userid : getCookie('userid'),
            level : getCookie('level'),
            pk : document.body.clientWidth,
            pg : document.body.clientHeight,
            rate : 1920/1080,
            fullBg1 : {width : '100%', height : 'auto'},
            fullBg2 : {width : 'auto', height : '100%'}
        }
    },
    created () {
        if((!this.token || !this.userid) && this.$route.name != 'register') this.$router.replace('/admin/login');
        if(this.token && this.level > 1) this.$router.replace('/web');
    },
    mounted () {
        window.onresize = () => {
            this.pk = document.body.clientWidth;
            this.pg = document.body.clientHeight;
        }
    },
    watch : {
        $route(to, from){
            if(!getCookie('token')){
                setCookie('userid', '', -1);
                setCookie('level', '', -1);
                if(this.$route.name != 'register') this.$router.replace('/admin/login');
            }
            if(getCookie('token') && getCookie('level') > 1) this.$router.replace('/web');
        }
    },
    methods : {
        freshCookie(){
            this.token = getCookie('token');
        }
    }
}
</script>

<style lang="scss">
body{color: #333;}
.notify{  //重置layer样式
    .notify-msg{line-height: 48px !important;}
    .notify-alert h2.notice-title{text-align: center; padding-left: 0 !important;}
    .notify-content{padding: 20px 20px 10px !important;}
    .notify-btns{padding: 0 8px 10px !important;}
    .btn-small{border-radius: 3px !important; padding: 5px 10px !important; margin-left: 10px !important;}
}
#app{
    position: relative; overflow: hidden; font-size: 1.1rem; width: 100%; height: 100vh;
    .log-reg{
        position: absolute; left: 0; top: 0; z-index: 1; overflow: hidden; color: #fff; width: 100%; height: 100vh;
        .bg{position: relative; left: 50%; transform: translateX(-50%);}
        .wrap{position: absolute; left: 50%; top: 50%; overflow: hidden; width: 300px; transform: translate(-50%, -60%);}
    }
}
</style>