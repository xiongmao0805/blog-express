<template>
    <div>
        <div class="loading" v-show="!loaded"><img src="../../resource/images/loading.gif" /></div>
        <div class="section category">
            <h1><i class="icon icon-pie-chart"></i>分类列表<span class="add-icon" @click="add"><i class="icon-plus"></i>添加分类</span></h1>
            <table class="list">
                <tr class="title">
                    <th width="90px">名称</th>
                    <th width="160px">标题</th>
                    <th>描述</th>
                    <th width="100px">标签</th>
                    <th width="140px">操作</th>
                </tr>
                <tr class="empty" v-if="lists.length <= 0"><td colspan="5">{{tips}}</td></tr>
                <tr v-if="lists.length > 0" v-for="(list, index) in lists">
                    <td v-text="list.name"></td>
                    <td v-text="list.title"></td>
                    <td class="desc" v-html="list.desc"></td>
                    <td class="tags"><p v-if="list.tags"><span v-for="(tag, i) in list.tags"><br v-if="i!=0" />{{tag}}</span></p></td>
                    <td><span class="modify" @click="modify(list)">修改</span><span class="delete" @click="deleteList(list.id)">删除</span></td>
                </tr>
            </table>
        </div>
        <transition name="slide"><router-view class="handle" :info="info" @update="getList"></router-view></transition>
    </div>
</template>

<script>
import {deleteList} from '@/resource/js/common.js'

export default {
    name : 'category',
    data () {
        return {
            lists : '',
            info : '',
            tips : '一个分类也没有，快去新建一个吧！',
            deleteFlag : false,
            loaded : false
        }
    },
    created () {
        this.getList();
    },
    methods : {
        getList(){
            this.$ajax({
                method : 'get',
                url : '/api/category',
            }).then((res) => {
                res.data.forEach(list => {
                    if(list.tags) list.tags = list.tags.split(',');
                });
                this.lists = res.data;
                this.loaded = true;
            }).catch((err) => {
                this.loaded = true;
                this.tips = '数据获取失败，请刷新后再试！';
            });
        },
        add(){
            if(!this.loaded) return;
            this.$router.push('category/add');
        },
        modify(list){
            this.info = list;
            this.$router.push('category/modify/' + list.id);
        },
        deleteList(id){
            let url = '/api/category/delete/' + id, str = '分类';
            deleteList(this, url, str);
        }
    }
}
</script>

<style lang="scss">
.category .list .desc{text-align: left!important; padding: 0.8rem 10px!important;}
.banner{
    p{
        width: 384px; height: 80px; line-height: 80px;
        img{max-width: 384px; max-height: 80px;}
        input{width: 386px; height: 82px;}
    }
    .cancel, .tips{left: 396px;}
}
.poster{
    p{
        width: 240px; height: 120px; line-height: 120px;
        img{max-width: 240px; max-height: 120px;}
        input{width: 242px; height: 122px;}
    }
    .cancel, .tips{left: 252px;}
}
.def_thumb{
    p{
        width: 100px; height: 80px; line-height: 80px;
        img{max-width: 100px; max-height: 80px;}
        i{font-size: 2.4rem;}
        input{width: 102px; height: 82px;}
    }
    .cancel, .tips{left: 112px;}
}
</style>
