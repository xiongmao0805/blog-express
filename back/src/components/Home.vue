<template>
    <div class="home">
        <h1>数据总览</h1>
        <ul>
            <li class="users">
                <span class="icon-users"></span><strong>{{count}}</strong>
                <p>用户 / users</p>
            </li>
            <li class="views">
                <span class="icon"></span><strong>{{views}}</strong>
                <p>访问量 / views</p>
            </li>
            <li class="articles">
                <span class="icon"></span><strong>{{articleCount}}</strong>
                <p>文章数 / articles</p>
            </li>
            <li class="replies">
                <span class="icon"></span><strong>{{replyCount}}</strong>
                <p>评论数 / replies</p>
            </li>
        </ul>
        <h1>系统基本信息</h1>
        <div class="info">
            <p><b>系统版本</b><span>{{version}}</span></p>
            <p><b>上传大小限制</b><span>{{uploadLimit}}</span></p>
            <p><b>北京时间</b><span>{{date}}</span></p>
        </div>
    </div>
</template>

<script>
import {getCookie, formatDate} from '@/resource/js/common.js'
export default {
    name: 'hello',
    data () {
        return {
            count : '',
            views : '',
            articleCount : '',
            replyCount : 0,
        }
    },
    created () {
        let userid = getCookie('userid');
        let token = getCookie('token');
        this.$ajax({
            type : 'get',
            url : '/api/user/' + userid + '?token=' + token
        }).then((res) => {
            let datas = res.data;
            this.count = datas.count;
            this.views = datas.data.views;
            this.articleCount = datas.articleCount;
        });
    },
    computed: {
        version(){
            return this.$store.state.common.version;
        },
        uploadLimit(){
            return this.$store.state.common.uploadLimit;
        },
        date(){
            return formatDate();
        }
    }
}
</script>

<style lang="scss">
.home{
    margin-top: 3rem; padding: 0 2rem;
    h1{font-size: 1.1rem; color: #666; line-height: 2rem; clear: both;}
    ul{
        margin: 1rem 0;
        li{
            position: relative; float: left; color: #fff; text-align: right; width: 20rem; height: 5.4rem; background: #fff;
            padding: 3rem 2rem 2.4rem 0; margin: 0 2rem 2rem 0; border: 1px solid #eee; border-top-color: #ccc; border-radius: 3px;
            transition: all .15s ease;
            &.users{background: #a0d5cd;}
            &.views{background: #a5ccd7;}
            &.articles{background: #e6bcbb;}
            &.replies{background: #dccca4;}
            &:hover{box-shadow: 0px 2px 5px #ddd;}
            span{position: absolute; left: 1rem; top: 50%; font-size: 5rem; color: rgba(255,255,255,.35); margin-top: -2.5rem;}
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
