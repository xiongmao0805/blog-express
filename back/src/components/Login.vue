<template>
  <div class="log-reg login">
    <slot></slot>
    <div class="wrap">
      <h1>Welcome</h1>
      <p class="errortip">
        <b class="errors" v-show="errors.has('username')">{{errors.first('username')}}</b>
        <b class="errors" v-show="!errors.has('username') && errors.has('password')">{{errors.first('password')}}</b>
      </p>
      <div class="input" @click="focus">
        <span class="icon icon-user"></span>
        <input type="text" name="username" ref="username"autocomplete="off" v-model="username" v-validate="'required|min:2|max:30|regex:^[a-zA-Z0-9一-龥_]+$'" maxlength="30" style="padding-right: 20px;">
        <span class="tips" v-show="username.length <= 0">用户名</span>
        <span class="icon-check-alt" v-show="nameEnable"></span>
      </div>
      <div class="input" @click="focus">
        <span class="icon icon-lock"></span>
        <input type="password" name="password" autocomplete="off" v-model="password" v-validate="'required|min:6|max:30'" maxlength="30">
        <span class="tips" v-show="password.length <= 0">密码</span>
      </div>
      <button type="login" @click="login">Login</button>
      <div class="bottom">
        <a href="/web" class="back">前往首页</a>
        <router-link to="register">注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie, setCookie } from "@/resource/js/utils.js";

export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
      nameEnable: false,
      checkState: false,
      timer: "",
      flag: false
    };
  },
  created() {
    if (getCookie("token") && getCookie("userid")) this.$router.replace("/admin");
  },
  mounted() {
    window.onkeyup = e => {
      if (this.$route.name != "login") return;
      if (e.keyCode == 13) this.login();
    };
  },
  watch: {
    username(val, oldval) {
      if (!/^[\w一-龥]{2,30}$/g.test(val)) return;
      if (this.timer) clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        if (!val) return;
        if (this.checkState) return;
        this.checkState = true;
        if (this.errors.has("username")) this.errors.remove("username");

        this.$ajax({
          method: "get",
          url: window.location.origin + "/api/getUserByName/" + val
        }).then(res => {
          this.checkState = false;
          if (res.data.length > 0) {
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
    login() {
      if (!this.username || !this.password) return;
      if (this.checkState) return;
      if (!this.nameEnable) {
        let rule = {
          field: "username",
          msg: "用户名不存在",
          rule: "match",
          scope: null
        };
        this.errors.items.push(rule);
      }
      if (this.errors.items.length > 0) return;

      if (this.flag) return;
      this.flag = true;
      this.$ajax({
        method: "post",
        url: window.location.origin + "/api/login",
        data: {
          username: this.username,
          password: this.password
        }
      }).then(res => {
        setCookie("token", res.data.token);
        setCookie("userid", res.data.userid);
        setCookie("level", res.data.level);
        this.$emit("freshCookie");
        this.flag = false;
        if (res.data.level == 1) {
          this.$router.push("/admin");
        } else {
          this.$router.push("/web");
        }
      }).catch(err => {
        this.$layer.msg("登录失败", () => {
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
.login {
  .wrap {
    h1 {
      font-size: 3rem;
      text-align: center;
      line-height: 5rem;
    }
    @include common();
    .bottom {
      text-align: right;
      margin-top: 1rem;
      a {
        font-size: 1rem;
        color: #fff;
        padding: 0 5px;
      }
      .back {
        float: left;
      }
    }
  }
}
</style>