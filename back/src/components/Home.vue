<template>
    <div>
        <div class="loading" v-show="!loaded"><img src="../resource/images/loading.gif" /></div>
        <div class="section home">
            <h1><i class="icon icon-newspaper"></i>数据总览</h1>
            <ul>
                <li class="users">
                    <span class="icon-users"></span><strong>{{userCount}}</strong>
                    <p>用户 / users</p>
                </li>
                <li class="views">
                    <span class="icon-eye" style="font-size: 5.2rem;"></span><strong>{{viewsCount}}</strong>
                    <p>访问量 / views</p>
                </li>
                <li class="articles">
                    <span class="icon-books"></span><strong>{{articleCount}}</strong>
                    <p>文章数 / articles</p>
                </li>
                <li class="replies">
                    <span class="icon-bubble" style="color: rgba(255,255,255,.4)"></span><strong>{{replyCount}}</strong>
                    <p>评论数 / replies</p>
                </li>
            </ul>
            <h1><i class="icon icon-file-text2" style="font-size: 1.2rem; color: #666;"></i>系统基本信息</h1>
            <div class="info">
                <p><b>系统版本</b><span>{{version}}</span></p>
                <p><b>上传大小限制</b><span>{{uploadLimit}}</span></p>
                <p><b>北京时间</b><span>{{date}}</span></p>
            </div>
        </div>
    </div>
</template>

<script>
import {getCookie, formatDate} from '@/resource/js/common.js'

export default {
    name : 'home',
    data () {
        return {
            token : getCookie('token'),
            userid : getCookie('userid'),
            userCount : 0,
            viewsCount : 0,
            articleCount : 0,
            replyCount : 0,
            version : '',
            date : formatDate(),
            loaded : false
        }
    },
    created () {        
        this.getDatas();
    },
    watch : {
        $route(to, from){
            if(to.name == 'index') this.getDatas();
        }
    },
    computed : {
        uploadLimit(){
            return this.$store.state.common.uploadLimit;
        }
    },
    methods : {
        getDatas(){
            this.$ajax({
                type : 'get',
                url : '/api/pandect',
                headers : {
                    token : this.token
                }
            }).then((res) => {
                let datas = res.data;
                this.userCount = datas.userCount;
                this.viewsCount = eval(datas.viewsCount.map(el => {return el.views}).join('+'));
                this.articleCount = datas.articleCount;
                this.replyCount = datas.replyCount;
                this.version = datas.version;
                this.loaded = true;
            }).catch((err) => {
                this.loaded = true;
                this.$layer.msg('数据获取失败', () => {
                    this.$layer.closeAll();
                });
            });
        }
    }
}
</script>

<style lang="scss">
.home{
    ul{
        margin: 1rem 0;
        li{
            position: relative; float: left; color: #fff; text-align: right; width: 20rem; height: 5.4rem; background: #fff;
            padding: 3rem 2rem 2.4rem 0; margin: 0 2rem 2rem 0; border: 1px solid #eee; border-top-color: #ccc; border-radius: 3px;
            transition: all .15s ease;
            &.users{background: #ed5a5a;}
            &.views{background: #47a4e9;}
            &.articles{background: #00b17d;}
            &.replies{background: #ffb94a;}
            &:hover{box-shadow: 0px 2px 5px #ddd;}
            span{position: absolute; left: 2.4rem; top: 50%; font-size: 5rem; color: rgba(255,255,255,.35); margin-top: -2.5rem;}
            strong{display: inline-block; font-size: 3rem; height: 3rem; line-height: 3rem; }
            p{font-size: 1.1rem; line-height: 2.4rem;}
        }
    }
    .info{
        overflow: hidden; padding-top: 1rem;
        p{
            font-size: 1rem; height: 3rem; line-height: 3rem;
            b{display: inline-block; text-align: right; width: 9rem; padding-right: 1rem; border-right: 1px solid #e5e5e5;}
            span{margin-left: 1rem;}
            &:nth-child(even){
                background: #eee;
                b{border-color: #fff;}
            }
        }
    }
}
</style>
