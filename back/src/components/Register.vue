<template>
    <div class="log-reg register">
        <slot></slot>
        <div class="wrap">
            <h1>注册 <span>已有帐号，前往 <router-link to="login">登录</router-link></span></h1>
            <p class="errortip">
                <b class="errors" v-show="errors.has('username')">{{errors.first('username')}}</b>
                <b class="errors" v-show="!errors.has('username') && errors.has('password')">{{errors.first('password')}}</b>
                <b class="errors" v-show="!errors.has('username') && !errors.has('password') && errors.has('repwd')">{{errors.first('repwd')}}</b>
            </p>
            <div class="input" @click="focus">
                <span class="icon icon-user"></span>
                <input type="text" name="username" autocomplete="off" v-model="username" v-validate="'required|min:2|max:30|regex:^[a-zA-Z0-9一-龥_]+$'" maxlength="30" />
                <span class="tips" v-show="username.length <= 0">用户名</span>
                <span class="icon-check-alt" v-show="nameAvalible"></span>
            </div>
            <div class="input" @click="focus">
                <span class="icon icon-lock"></span>
                <input type="password" name="password" autocomplete="off" v-model="password" v-validate="'required|min:6|max:30'" maxlength="30" />
                <span class="tips" v-show="password.length <= 0">密码</span>
            </div>
            <div class="input" @click="focus">
                <span class="icon icon-lock"></span>
                <input type="password" name="repwd" autocomplete="off" v-model="repwd" @blur="testPwd" />
                <span class="tips" v-show="repwd.length <= 0">重复密码</span>
            </div>
            <button type="submit" @click="register">Register</button>
        </div>
    </div>
</template>

<script>
import {getCookie} from '@/resource/js/common.js'

export default {
    name : 'register',
    data () {
        return {
            username : '',
            password : '',
            repwd : '',
            nameAvalible : false,
            checkingName : false,
            timer : '',
            inputBg : 'rgba(255,255,255,.3)',
            flag : false
        }
    },
    created () {
        //var ptn = /^[a-zA-Z]+[\w-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[\w-]+[a-zA-Z0-9]+(\.[a-zA-Z]+){1,2}$/i; 邮箱格式验证正则
        if( (getCookie('token') && getCookie('userid')) ) this.$router.push('/admin');
    },
    mounted () {
        window.onkeyup = (e) => {
            if(this.$route.name != 'register') return;
            if(e.keyCode == 13){
                this.register();
            }
        }
    },
    watch : {
        username(val, oldval){
            if(!/^[\w一-龥]{2,30}$/g.test(val)) return;
            if(this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if(!val) return;
                if(this.checkingName) return;
                this.checkingName = true;
                if(this.errors.has('username')) this.errors.remove('username');
                
                this.$ajax({
                    method : 'get',
                    url : window.location.origin + '/api/check/' + val
                }).then((res) => {
                    this.checkingName = false;
                    if(res.data.count <= 0){
                        this.nameAvalible = true;
                    }else{
                        this.nameAvalible = false;
                    }
                }).catch((err) => {
                    this.checkingName = false;
                });
            },500);
        }
    },
    methods : {
        focus(e){
            let input = e.target.parentNode.getElementsByTagName('input')[0];
            input.focus();
        },
        testPwd(){
            if(this.repwd != this.password && !this.errors.has('repwd')){
                let rule = {
                    field : "repwd",
                    msg : "密码不一致",
                    rule : "match",
                    scope : null
                }
                this.errors.items.push(rule);
            }
        },
        register(){
            if(!this.username || !this.password) return;
            this.testPwd();
            if(this.checkingName) return;
            if(!this.nameAvalible){
                let rule = {
                    field : "username",
                    msg : "用户名已存在",
                    rule : "match",
                    scope : null
                }
                this.errors.items.push(rule);
            }
            if(this.errors.items.length > 0) return;
            
            if(this.flag) return;
            this.flag = true;
            this.$ajax({
                method : 'post',
                url : window.location.origin + '/api/register',
                data : {
                    'username' : this.username,
                    'password' : this.password
                }
            }).then((res) => {
                if(res.data.resultCode == 200){
                    this.$layer.msg(res.data.resultMsg, () => {
                        this.$layer.closeAll();
                        this.$router.push('/admin/login');
                        this.flag = false;
                    });
                }else{
                    let msg = (typeof res.data.resultMsg == 'object') ? res.data.resultMsg[0] : res.data.resultMsg;
                    this.$layer.msg(msg, () => {
                        this.$layer.closeAll();
                        this.flag = false;
                    });
                }
            }).catch((err) => {
                this.$layer.msg('注册失败', () => {
                    this.$layer.closeAll();
                    this.flag = false;
                });
            });
        }
    }
}
</script>

<style lang="scss">
@import "../resource/css/log_reg.scss";
.register{
    .wrap{
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