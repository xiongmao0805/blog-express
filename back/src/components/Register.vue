<template>
  <div class="log-reg register">
    <slot></slot>
    <div class="wrap">
      <h1>
        <b>注册</b>
        <span>已有帐号，前往 <router-link to="login">登录</router-link></span>
      </h1>
      <p class="errortip">
        <b class="errors" v-show="errors.has('username')">{{errors.first('username')}}</b>
        <b class="errors" v-show="!errors.has('username') && errors.has('password')">{{errors.first('password')}}</b>
        <b class="errors" v-show="!errors.has('username') && !errors.has('password') && errors.has('confirm')">{{errors.first('confirm')}}</b>
      </p>
      <div class="input" @click="focus">
        <span class="icon icon-user"></span>
        <input type="text" name="username" ref="username" autocomplete="off" v-model="username" v-validate="'required|min:2|max:30|regex:^[a-zA-Z0-9一-龥_]+$'" maxlength="30">
        <span class="tips" v-show="username.length <= 0">用户名</span>
        <span class="icon-check-alt" v-show="nameEnable"></span>
      </div>
      <div class="input" @click="focus">
        <span class="icon icon-lock"></span>
        <input type="password" name="password" autocomplete="off" v-model="password" v-validate="'required|min:6|max:30'" maxlength="30">
        <span class="tips" v-show="password.length <= 0">密码</span>
      </div>
      <div class="input" @click="focus">
        <span class="icon icon-lock"></span>
        <input type="password" name="confirm" autocomplete="off" v-model="confirm" @blur="testConfirm">
        <span class="tips" v-show="confirm.length <= 0">重复密码</span>
      </div>
      <button type="submit" @click="register">Register</button>
    </div>
  </div>
</template>

<script>
import { getCookie } from "@/resource/js/utils.js";
import veeForm from "@/resource/js/formValidate.js"

export default {
  name: "register",
  data() {
    return {
      username: "",
      password: "",
      confirm: "",
      nameEnable: false,
      checkState: false,
      timer: "",
      flag: false
    };
  },
  created() {
    //var ptn = /^[a-zA-Z]+[\w-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[\w-]+[a-zA-Z0-9]+(\.[a-zA-Z]+){1,2}$/i; 邮箱格式验证正则
    if (getCookie("token") && getCookie("userid")) this.$router.replace("/admin");
  },
  mounted() {
      console.log(veeForm)
    window.onkeyup = e => {
      if (this.$route.name != "register") return;
      if (e.keyCode == 13) this.register();
    };
  },
  watch: {
    // 验证用户名是否可用
    username(val, oldval) {
      if (!/^[\w一-龥]{2,30}$/g.test(val)) return;
      if (this.timer) clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        if (this.checkState) return;
        this.checkState = true;
        if (this.errors.has("username")) this.errors.remove("username");

        this.$ajax({
          method: "get",
          url: window.location.origin + "/api/getUserByName/" + val
        }).then(res => {
          this.checkState = false;
          if (res.data.length <= 0) {
            this.nameEnable = true;
          } else {
            this.nameEnable = false;
          }
        }).catch(err => {
          this.checkState = false;
        });
      }, 800);
    }
  },
  methods: {
    focus(e) {
      this.$refs.username.focus();
    },
    testConfirm() {
      if (!this.password) return;
      if (this.confirm != this.password) {
        let rule = {
          field: "confirm",
          msg: "密码不一致",
          rule: "match",
          scope: null
        };
        this.errors.items.push(rule);
      }
    },
    register() {
      if (!this.username || !this.password) return;
      if (this.checkState) return;
      if (!this.nameEnable) {
        let rule = {
          field: "username",
          msg: "用户名已存在",
          rule: "match",
          scope: null
        };
        this.errors.items.push(rule);
      }
      this.testConfirm();
      if (this.errors.items.length > 0) return;

      if (this.flag) return;
      this.flag = true;
      this.$ajax({
        method: "post",
        url: window.location.origin + "/api/register",
        data: {
          username: this.username,
          password: this.password
        }
      }).then(res => {
        this.$layer.msg(res.data.msg, () => {
          this.$layer.closeAll();
          this.$router.push("/admin/login");
          this.flag = false;
        });
      }).catch(err => {
        var msg = err.response.data.msg
        msg = msg ? msg : '失败';
        this.$layer.msg(msg, () => {
          this.$layer.closeAll();
          this.flag = false;
        });
      });
    }
  }
};
</script>

<style lang="scss">
@import "../resource/css/log_reg.scss";
.register {
  .wrap {
    h1 {
      font-size: 3rem;
      line-height: 5rem;
      margin-bottom: 1rem;
      span {
        float: right;
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.75);
        line-height: 1rem;
        margin-top: 3rem;
        a {
          color: #fff;
        }
      }
    }
    @include common();
  }
}
</style>