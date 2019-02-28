<template>
    <div id="app">
        <img src="../../resource/images/bg.jpg" alt="" class="bg" :style="pk/pg > rate ? styleBg1 : styleBg2" />
        <div class="login">
            <h1>Welcome</h1>
            <span class="testResult">{{errortip}}</span>
            <p @click="focus">
                <span class="icon icon-user"></span>
                <input type="text" name="username" autocomplete="off" v-model="username" @keyup="testName" @keydown="keydown" style="padding-right: 20px;" />
                <span class="tips" v-show="username.length <= 0">用户名</span>
                <span class="icon-check-circle" v-show="checkname"></span>
            </p>
            <p @click="focus">
                <span class="icon icon-lock"></span>
                <input type="password" name="password" autocomplete="off" v-model="password" @keydown="keydown" />
                <span class="tips" v-show="password.length <= 0">密码</span>
            </p>
            <button type="login" @click="login">Login</button>
            <div><a href="" class="back">返回首页</a><a href="register.html">注册</a></div>
        </div>
    </div>
</template>

<script>
import {test, setCookie, bgStyle} from '@/resource/js/log_reg.js'
import {getCookie} from '@/resource/js/common.js'
export default {
    name: 'login',
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
    },
    computed: {
        testInfo(){
            return test(this.username, this.password);
        },
        host(){
            return window.location.origin;
        }
    },
    methods: {
        login(){
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
                url : this.host + '/api/login',
                data : {
                    'username' : this.username,
                    'password' : this.password
                }
            }).then((res) => {
                if(res.data.resultCode == 200){
                    setCookie('token', res.data.token);
                    setCookie('userid', res.data.userid);
                    if(res.data.level == 1){
                        window.location.href = '/';
                    }else{

                    }                    
                }else{
                    this.$layer.msg(res.data.resultMsg, () => {
                        this.password = '';
                        this.$layer.closeAll();
                    });
                }
            }).catch((err) => {
                this.$layer.msg('登录失败', () => {
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
                    url : this.host + '/api/check/' + this.username
                }).then((res) => {
                    if(res.data.count >= 1){
                        this.checkname = true;
                    }else{
                        this.errortip = '用户名不存在';
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
        h1{font-size: 3rem; text-align: center; line-height: 5rem;}
        @include common();
        div{
            text-align: right; margin-top: 1rem;
            a{font-size: 1rem; color: #fff; padding: 0 5px;}
            .back{float: left;}
        }
    }
}
</style>