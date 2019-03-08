<template>
  <div id="app">
    <router-view @freshCookie="freshCookie">
      <img src="./resource/images/login_bg.jpg" class="login_bg">
    </router-view>
  </div>
</template>

<script>
import bkUtils from "@/resource/js/bkUtils.js";
export default {
  name: "admin",
  data() {
    return {
      token: bkUtils.getCookie("token"),
      userid: bkUtils.getCookie("userid"),
      level: bkUtils.getCookie("level")
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
      if (!bkUtils.getCookie("token")) {
        bkUtils.setCookie("userid", "", -1);
        bkUtils.setCookie("level", "", -1);

        if (this.$route.name == "register") return;
        this.$router.replace("/admin/login");
        return;
      }
      if (bkUtils.getCookie("level") > 1) this.$router.replace("/web");
    }
  },
  methods: {
    freshCookie() {
      this.token = bkUtils.getCookie("token");
    }
  }
};
</script>

<style lang="scss">
body {
  color: #333;
}
.notify {
  //重置layer样式
  .notify-msg {
    line-height: 48px !important;
  }
  .notify-alert h2.notice-title {
    text-align: center;
    padding-left: 0 !important;
  }
  .notify-content {
    padding: 20px 20px 10px !important;
  }
  .notify-btns {
    padding: 0 8px 10px !important;
  }
  .btn-small {
    border-radius: 3px !important;
    padding: 5px 10px !important;
    margin-left: 10px !important;
  }
}
#app {
  position: relative;
  overflow: hidden;
  font-size: 1.1rem;
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
</style>