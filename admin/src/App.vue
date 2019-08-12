<template>
  <div id="app">
    <router-view @freshCookie="freshCookie">
      <img src="./source/images/login_bg.jpg" class="login_bg" />
    </router-view>
  </div>
</template>

<script>
import { getCookie, setCookie } from "@/utils/utils.js";
export default {
  name: 'admin',
  data() {
    return {
      token: getCookie("token"),
      userid: getCookie("userid"),
      level: getCookie("level")
    };
  },
  created() {
    if (this.token && this.userid) {
      if (this.level > 1) this.$router.replace("/web");
      return;
    }
    if (this.$route.name == "register") return;
    this.$router.replace("/admin/login");
  },
  watch: {
    $route(to, from) {
      if (!getCookie("token")) {
        setCookie("userid", "", -1);
        setCookie("level", "", -1);

        if (this.$route.name == "register") return;
        this.$router.replace("/admin/login");
        return;
      }
      if (getCookie("level") > 1) this.$router.replace("/web");
    }
  },
  methods: {
    freshCookie() {
      this.token = getCookie("token");
    }
  }
}
</script>

<style lang="scss">
@import "./source/css/reset.scss";
@include reset();

body {
  color: #333;
  #app {
    position: relative;
    overflow: hidden;
    font-size: 14px;
    width: 100%;
    height: 100vh;
    .log-reg {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      overflow: hidden;
      color: #fff;
      width: 100%;
      height: 100vh;
      .login_bg {
        position: relative;
        left: 50%;
        top: 50%;
        min-width: 100%;
        min-height: 100%;
        transform: translate(-50%, -50%);
      }
      .wrap {
        position: absolute;
        left: 50%;
        top: 50%;
        overflow: hidden;
        width: 300px;
        transform: translate(-50%, -60%);
      }
    }
  }
}
</style>
