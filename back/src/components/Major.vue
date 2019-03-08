<template>
    <div class="index">
        <div class="header">
            <p class="brand">后台管理系统</p>
            <div class="nav">
                <a href="/web" title="首页"><span class="icon-home"></span></a>
                <a title="登出" @click="loginOut"><span class="icon icon-switch"></span></a>
            </div>
        </div>
        <div class="flexBox">
            <div class="menu">
                <p><router-link :to="{name:'index'}"><i class="icon-newspaper"></i>总览</router-link></p>
                <p><router-link :to="{name:'category'}"><i class="icon-pie-chart"></i>分类管理</router-link></p>
                <p><router-link :to="{name:'article'}"><i class="icon-books"></i>文章管理</router-link></p>
                <p><router-link :to="{name:'comment'}"><i class="icon-bubble" style="font-size: 1.25rem;"></i>评论管理</router-link></p>
                <p><router-link :to="{name:'users'}"><i class="icon-user" style="font-size: 1.4rem;"></i>用户列表</router-link></p>
                <p><router-link :to="{name:'links'}"><i class="icon-link"></i>友情链接</router-link></p>
                <p><router-link :to="{name:'config'}"><i class="icon-cog"></i>网站配置</router-link></p>
            </div>
            <keep-alive><router-view class="main"></router-view></keep-alive>
        </div>
        <footer>Copyright 2017 Design by XiongMao</footer>
    </div>
</template>

<script>
import bkUtils from "@/resource/js/bkUtils.js";
export default {
    name : 'major',
    mounted () {
        //未操作页面自动退出登录
        let timer;
        window.onmousemove = function(){
            clearTimeout(timer);
            timer = setTimeout(() => {
                bkUtils.setCookie('token', '', -1);
            }, 20*60*1000);
        }
    },
    computed : {
        path(){
            return this.$route.path;
        }
    },
    methods : {
        loginOut(){
            bkUtils.setCookie('token', '', -1);
            window.location.reload();
        },
        tokenFresh(){
            this.$ajax({
                method : 'post',
                url : '/api/fresh',
                headers : {
                    token : bkUtils.getCookie('token')
                }
            }).then((res) => {
                if(res.data.resultCode == 200){
                    this.freshed = true;
                    let newtoken = res.headers.authorization.split('Bearer ')[1];
                    bkUtils.setCookie('token', newtoken);
                }
            });
        }
    }
}
</script>

<style lang="scss">
.index{
    overflow: hidden; width: 100%; height: 100vh;
    .header{
        display: flex; position: relative; z-index: 1; flex-direction: row;
        color: #fff; width: 100%; height: 5rem; line-height: 5rem; background: #333;
        .brand{flex: 0 0 270px; font-size: 1.8rem; text-align: center;}
        .nav{
            flex: auto; text-align: right; padding-right: 1.2rem;
            a{
                display: inline-block; text-align: center; font-size: 1.2rem; color: #fff; width: 3.5rem; height: 100%; cursor: pointer;
                &:hover{background: rgba(0,0,0,.25);}
                span{vertical-align: middle;}
            }
        }
    }
    .flexBox{
        display: flex; flex-direction: row; overflow: hidden; width: 100%; height: calc(100vh - 7.5rem); background: #f8f8f8;
        .menu{
            flex: 0 0 270px; overflow-x: hidden; overflow-y: visible; background: #ed5a5a;
            p{
                font-size: 1.1rem; height: 4rem; line-height: 4rem;
                a{
                    position: relative; display: block; color: #fff; padding-left: 5.3rem; border-top: 1px solid rgba(255,255,255,.2);
                    i{position: absolute; left: 3.6rem; top: 50%; font-size: 1.3rem; transform: translateY(-50%);}
                    &.active{background: rgba(0,0,0,.1);}
                }
            }
        }
        .main{
            flex: auto; position: relative; overflow: hidden;
            .loading{
                position: absolute; left: 0; top: 0; z-index: 888; width: 100%; height: 100%; background: #fff;
                img{position: absolute; left: 50%; top: 45%; transform: translate3d(-50%, -50%, 0)}
            }
            .section{
                overflow-x: hidden; overflow-y: visible; height: calc(100% - 5rem); padding: 1.5rem 2rem 3rem;
                h1{
                    position: relative; font-size: 1.1rem; color: #333; line-height: 3rem; padding-left: 1.6rem; border-bottom: 1px solid #ccc; clear: both;
                    .icon{position: absolute; left: 0; top: 50%; font-size: 1.3rem; color: #7a7a7a; transform: translateY(-50%);}
                    span{
                        float: right; font-size: 1rem; color: #47a4e9; margin-right: 10px; cursor: pointer;
                        i{font-size: 0.9rem; margin-right: 5px;}
                    }
                }
                .search{
                    float: right; position: relative; overflow: hidden; height: 30px; padding-right: 50px;
                    p{
                        position: relative; height: 28px; padding-right: 28px; background: #fff; border: 1px solid #d5d5d5; border-radius: 3px;
                        input{font-size: 13px; width: 100%; height: 28px; line-height: 28px; text-indent: 5px;}
                        i{
                            position: absolute; right: 0; top: 0; font-size: 1.1rem; color: #47a4e9; text-align: center; width: 27px; height: 28px; line-height: 28px; cursor: pointer;
                            
                        }
                    }
                    .cancel{
                        display: inline-block; position: absolute; right: 0; top: 0; color: red; text-align: right; cursor: pointer;
                        .icon-cross{font-size: 12px; color: red; margin-right: 3px;}
                    }
                }
                .list{
                    overflow: hidden; color: #555; width: 100%; margin-top: 2rem;
                    &.init{transition: opacity .3s ease;}
                    &.init-enter, &.init-leave-active{opacity: 0;}
                    &.result{opacity: 1; transition: all .3s ease; left: 0;}
                    &.result-enter, &.result-leave-active{opacity: 0;}
                    &.slide{
                        display: none; opacity: 0;
                        &.show{opacity: 1;}
                    }
                    table{width: 100%;}
                    tr{
                        border-bottom: 1px solid #f8f8f8;
                        th{
                            font-size: 1rem; font-weight: normal; color: #222; line-height: 1.2rem; padding: 1rem 5px; border-left: 1px solid #f8f8f8;
                            &:first-child{border: none;}
                        }
                        td{
                            font-size: 0.9rem; text-align: center; line-height: 1.4rem; padding: 0.8rem 5px; border-left: 1px solid #f0f0f0; word-break: break-all;
                            &.datetime{font-size: 12px;}
                            &:first-child{border: none;}
                            .modify{display: inline-block; color: #fafafa; width: 3.6rem; height: 2rem; line-height: 2rem; margin-right: 10px; background: #47a4e9; border: 1px solid #3498db; border-radius: 3px; cursor: pointer; transition: all ease .2s;}
                            .modify:hover{background: #3498db;}
                            .delete{display: inline-block; color: #fafafa; width: 3.6rem; height: 2rem; line-height: 2rem; background: #ed5a5a; border: 1px solid #d75050; border-radius: 3px; cursor: pointer; transition: all ease .2s;}
                            .delete:hover{background: #d75050;}
                        }
                        &:nth-child(odd){
                            background: #f0f0f0;
                            td{border-left: 1px solid #f8f8f8; &:first-child{border: none;}}
                        }
                        &.title{background: #ddd; border: none; border-bottom: 1px solid #f8f8f8;}
                        &.empty{
                            overflow: hidden; text-align: center; color: #999;
                            span{font-size: 1rem; color: #47a4e9;}
                        }
                    }
                }
            }
            .handle{
                position: absolute; left: 0; top: 0; right: 0; z-index: 999; overflow-x: hidden; overflow-y: visible;
                min-width: 650px; height: calc(100% - 5rem); background: #f8f8f8; padding: 1.5rem 2rem 3rem;
                transition: all .3s ease-in;
                &.slide-enter,&.slide-leave-active{transform: translateX(100%);}
                .head{
                    position: relative; font-size: 1.1rem; color: #666; line-height: 3rem; padding-left: 1.5rem; border-bottom: 1px solid #ccc; clear: both;
                    .icon{position: absolute; left: 0; top: 50%; font-size: 1rem; color: #999; transform: translateY(-50%);}
                    .icon-quill{font-size: 1.1rem; color: #888; font-weight: bold;}
                    a{
                        float: right; font-size: 1rem; color: #47a4e9; margin-right: 10px; cursor: pointer;
                        span{font-size: 0.9rem; margin-right: 5px;}
                    }
                }
                .form{
                    overflow: hidden; font-size: 1rem; color: #666; margin-top: 1rem;
                    .item{
                        position: relative; min-height: 2rem; line-height: 2rem; border-top: 1px solid #ddd; padding: 0.9rem 0 0.9rem 120px;
                        &:first-child{border: none;}
                        .left{position: absolute; left: 0;top: 1rem; display: inline-block; text-align: right; width: 100px;}
                        .right{
                            #add,#modify{
                                color: #fafafa; height: 2.7rem; line-height: 2.6rem; width: 8rem; background: #47a4e9;border: 1px solid #3498db; border-radius: 3px; cursor: pointer; transition: all ease .2s;
                                &:hover{background: #3498db;}
                            }
                            select{min-width: 150px; height: 2rem; line-height: 2rem; border-color: #ddd;}
                            input[type='text']{
                                width: 188px; height: 2rem; line-height: 2rem; border: 1px solid #ddd; padding: 0 5px; border-radius: 3px;
                                &.small{width: 48px;}
                                &.middle{width: calc(50% - 2px); min-width: 288px;}
                                &.large{width: calc(80% - 2px); min-width: 488px;}
                            }
                            input[type='radio']{vertical-align: middle; margin-top: -1px; cursor: pointer;}
                            label{margin: 0 20px 0 5px; cursor: pointer;}
                            textarea{
                                width: calc(80% - 2px); max-width: calc(80% - 2px); min-height: calc(10rem - 12px); padding: 5px; border-color: #ddd;
                                &.large{width: calc(100% - 12px); max-width: calc(100% - 12px);}
                            }
                        }
                        .tags{
                            position: relative;
                            p{
                                margin-top: 10px;
                                &:first-child{margin-top: 0;}
                                .delete{font-size: 13px; color: red; margin-left: 5px; vertical-align: middle; cursor: pointer;}
                            }
                            .multi{position: absolute; right: 1rem; top: 0; font-size: 13px; color: #47a4e9; cursor: pointer;}
                            .errors{margin-left: 0;}
                        }
                        .errors{color: red; font-size: 12px; margin-left: 5px;}
                    }
                }
            }
        }
    }
    footer{font-size: 12px; color: white; text-align: center; height: 2.5rem; line-height: 2.5rem; background: #393535;}
}
</style>
