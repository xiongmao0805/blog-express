<template>
    <div id="app">
        <div class="header">
            <p class="brand">后台管理系统</p>
            <div class="nav">
                <a href="" title="首页" class="frontend"><span class="icon-home"></span></a>
                <div>
                    <p><img src="../../resource/images/avatar.png" alt="" /><span class="username">千霖</span></p>
                    <router-link to="" title="用户信息" class="frontend"><span class="icon icon-user"></span></router-link>
                    <a href="" title="登出" class="frontend"><span class="icon icon-upload"></span></a>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="menu">
                <div class="scroller">
                    <p><router-link :to="{path:'/home'}" :class="{'active':$route.path.length<=1}">总览</router-link></p>
                    <p><router-link :to="{path:'/article'}">文章管理</router-link></p>
                    <p><router-link :to="{path:'/category'}">分类管理</router-link></p>
                    <p><router-link :to="{path:'/comment'}">评论管理</router-link></p>
                    <p><router-link :to="{path:'/user'}">用户管理</router-link></p>
                    <p><router-link :to="{path:'/links'}">友情链接</router-link></p>
                    <p><router-link :to="{path:'/navs'}">导航管理</router-link></p>
                    <p><router-link :to="{path:'/config'}">网站配置</router-link></p>
                </div>
            </div>
            <div class="content">
                <div class="scroller">
                    <keep-alive><router-view></router-view></keep-alive>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getCookie} from '@/resource/js/common.js'

export default {
    name: 'admin',
    created(){
        let token = getCookie('token');
        if(!token) window.location.href = 'login.html';
        
    }
}
</script>

<style lang="scss">
body{color: #333;}
#app{
    position: relative; overflow: hidden; font-size: 1.1rem; width: 100%; height: 100vh;
    .header{
        display: flex; position: relative; z-index: 1; flex-direction: row;
        color: #fff; width: 100%; height: 5rem; line-height: 5rem; background: #005044;
        a{
            display: inline-block; text-align: center; font-size: 1.2rem; color: #fff; width: 4rem; height: 100%;
            &:hover{background: rgba(0,0,0,.2);}
        }
        .brand{flex: 0 0 270px; font-size: 1.8rem; text-align: center;}
        .nav{
            flex: auto;
            .icon-home{vertical-align: middle;}
            div{
                position: relative; float: right; text-align: right; min-width: 100px; height: 100%; margin-right: 10px;
                p{
                    float: left; margin-right: 1.5rem;
                    img{width: 3rem; height: 3rem; vertical-align: middle; border-radius: 100%; margin-right: 6px;}
                    .username{font-size: 1rem;}
                }
                a{float: left;}
            }
        }
    }
    .main{
        display: flex; flex-direction: row; overflow: hidden; width: 100%; height: 100%; background: #f8f8f8;
        .menu{
            flex: 0 0 270px; overflow: hidden; background: #00d1b2;
            p{
                font-size: 1.1rem; height: 4rem; line-height: 4rem;
                a{
                    display: block; color: #fff; padding-left: 50px; border-top: 1px solid rgba(255,255,255,.3);
                    &.active{background: rgba(0,0,0,.15);}
                }
            }
        }
        .content{
            flex: auto; overflow: hidden;
            .scroller{overflow: hidden; min-height: 100%;}
        }
    }
}
</style>