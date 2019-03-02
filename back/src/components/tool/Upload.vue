<template>
    <div class="photos" v-if="render">
        <p :class="{'grey':url}">
            <img :src="url" v-if="url" />
            <i class="icon-image" v-if="!url"></i>
            <input type="file" @change="upload()" ref="file" />
        </p>
        <span class="cancel" v-if="url" @click="cancel('def_thumb')">取消</span>
        <span class="tips" v-if="!url && formateSize">请上传{{formateSize}}以内的 jpg, jpeg, png, gif 格式的图片</span>
    </div>
</template>

<script>
export default {
    props : {
        url : String,
        size : String,
        field : String
    },
    data () {
        return {
            limit : ''
        }
    },
    computed : {
        formateSize(){
            if(!/^\d+([k|m]b?)?$/gi.test(this.size)) return '';
            let num = this.size.replace(/[a-z]/gi, '');
            if(/m/gi.test(this.size)){
                this.limit = parseInt(num) * 1024;
                return num + 'Mb';
            }else{
                this.limit = parseInt(num);
                return num + 'kb';
            }
        }
    },
    methods : {
        upload(){
            let file = this.$refs.file, img = file.files[0], type = ['jpg', 'jpeg', 'png', 'gif'];
            if(!img) return;
            if(type.indexOf(img.type.split('/')[1]) < 0){
                file.value = '';
                this.$layer.msg('缩略图只支持上传图片！', () => {
                    this.$layer.closeAll();
                });
                return;
            }
            if(this.limit && img.size/1024 > this.limit){
                file.value = '';
                this.$layer.msg('图片大小不能超过' + this.size + 'kb！', () => {
                    this.$layer.closeAll();
                });
                return;
            }

            if(this.field){
                this.$emit('uploadFile', img, this.field);
            }else{
                this.$emit('uploadFile', img);
            }
        },
        cancel(){
            this.$refs.file.value = '';
            if(this.field){
                this.$emit('cancelUpload', this.field);
            }else{
                this.$emit('cancelUpload');
            }
        }
    }
}
</script>

<style lang="scss">
.photos{
    position: relative; overflow: hidden; font-size: 0;
    p{
        float: left; overflow: hidden; position: relative; text-align: center;
        background: #fff; border: 1px solid #e1e1e1; border-radius: 3px;
        img{vertical-align: top;}
        i{font-size: 2.7rem; color: #6ff; vertical-align: middle;}
        input{position: absolute; left: 0; top: 0; z-index: 1; width: 100%; height: 100%; opacity: 0; cursor: pointer;}
    }
    .cancel, .tips{position: absolute; bottom: 0; font-size: 12px; line-height: 24px;}
    .cancel{color: #3498db; cursor: pointer;}
    .tips{color: #aaa;}
}
</style>
