<template>
    <div id="app">
        <img src="../../resource/images/bg.jpg" alt="" class="bg" :style="pk/pg > rate ? styleBg1 : styleBg2" />
        <div class="login">
            <h1>注册 <span>已有帐号，前往 <a href="login.html">登录</a></span></h1>
            <span class="testResult">{{errortip}}</span>
            <p @click="focus">
                <span class="icon icon-user"></span>
                <input type="text" name="username" autocomplete="off" v-model="username" @keyup="testName" @keydown="keydown" />
                <span class="tips" v-show="username.length <= 0">用户名</span>
                <span class="icon-check-circle" v-show="checkname"></span>
            </p>
            <p @click="focus">
                <span class="icon icon-lock"></span>
                <input type="password" name="password" autocomplete="off" v-model="password" @keydown="keydown" />
                <span class="tips" v-show="password.length <= 0">密码</span>
            </p>
            <button type="submit" @click="register">Register</button>
        </div>
    </div>
</template>

<script>
import {test, bgStyle} from '@/resource/js/log_reg.js'
import {getCookie} from '@/resource/js/common.js'
export default {
    name: 'register',
    data () {
        return {
            username : '',
            password : '',
            checkname : false,
            errortip : '',
            timer : '',
            pk : document.body.clientWidth,
            pg : document.body.clientHeight,
            rate : 1920/1080,
            styleBg1 : {width : '100%', height : 'auto'},
            styleBg2 : {width : 'auto', height : '100%'},
            inputBg : 'rgba(255,255,255,.3)'
        }
    },
    created (){
        if(getCookie('token')) window.location.href = '/';
    },
    mounted () {
        bgStyle(this);
        //var ptn = /^([a-zA-Z]+[\w-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[\w-]+[a-zA-Z0-9]+(\.[a-zA-Z]+){1,2})$/i;
    },
    computed: {
        testInfo(){
            return test(this.username, this.password);
        },
    },
    methods: {
        register(){
            if(!this.testInfo.code){
                this.errortip = this.testInfo.msg;
                return;
            }
            if(!this.checkname){
                this.testName();
                return;
            }
            this.$ajax({
                method : 'post',
                url : 'api/register',
                data : {
                    'username' : this.username,
                    'password' : this.password
                }
            }).then((res) => {
                if(res.data.resultCode == 200){
                    window.location.href = 'login.html'
                }else{
                    this.$layer.msg(this.data.resultMsg, () => {
                        this.$layer.closeAll();
                    });
                }
            }).catch((err) => {
                this.$layer.msg('注册失败', () => {
                    this.$layer.closeAll();
                });
            });
        },
        focus(e){
            let input = e.target.parentNode.getElementsByTagName('input')[0];
            input.focus();
        },
        keydown(e){
            if(!this.testInfo.code){
                if( (this.testInfo.position == 1 && e.target.name == 'username') || (this.testInfo.position == 2 && e.target.name == 'password') ){
                    this.errortip = '';
                }
            }
        },
        testName(){
            if(this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if(!/^[一-龥\w]{2,15}$/.test(this.username)) return;
                this.$ajax({
                    method : 'get',
                    url : 'api/check/' + this.username
                }).then((res) => {
                    if(res.data.count <= 0){
                        this.checkname = true;
                    }else{
                        this.errortip = '用户名已存在';
                    }
                });
            },500);
        }
    }
}
</script>

<style lang="scss">
@import "../../resource/css/log_reg.scss";

.notify-msg{line-height: 48px;}
#app{
    position: relative; overflow: hidden; color: #fff; width: 100%; height: 100vh;
    .bg{position: relative; left: 50%; transform: translateX(-50%);}
    .login{
        position: absolute; left: 50%; top: 50%; overflow: hidden; width: 300px; transform: translate(-50%, -60%);
        h1{
            font-size: 3rem; line-height: 5rem; margin-bottom: 1rem;
            span{
                float: right; font-size: 1rem; color: rgba(255,255,255,.75); line-height: 1rem; margin-top: 3rem;
                a{color: #fff;}
            }
        }
        @include common();
    }
}
</style>