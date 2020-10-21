<template>
  <div id="loginPage">
    <div class="login_class">
      <div class="ms-title">欢迎登陆</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="phone">
          <el-input v-model="ruleForm.phone" maxlength="11" placeholder="请输入手机号:">
            <template slot="prepend">
              <i class="el-icon-user"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            placeholder="请输入密码"
            @keyup.enter.native="submitForm"
            auto-complete="new-password"
          >
            <template slot="prepend">
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-checkbox v-model="ruleForm.rememberMe">是否记住密码</el-checkbox>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLogin } from "@/http/api.js";
// import { initRoleRouter } from "@/router/index.js";

export default {
  phone: "login",
  data() {
    return {
      ruleForm: {
        phone: "",
        password: "",
        rememberMe: false, // 记住密码
      },
      rules: {
        phone: [{ required: true, message: "请输入手机号:", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      flag: true,
    };
  },
  created() {
    if (localStorage.getItem("loginInfo")) {
      this.ruleForm.phone = JSON.parse(localStorage.getItem("loginInfo")).phone;
      this.ruleForm.password = JSON.parse(
        localStorage.getItem("loginInfo")
      ).password;
    }
  },
  mounted() {
    if (this.flag) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", function () {
        history.pushState(null, null, document.URL);
      });
    }
  },
  destroyed() {
    this.flag = false;
  },
  methods: {
    // 登陆
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          getLogin(this.ruleForm)
            .then((res) => {
              if (res.data.status === "100005") {
                this.$message({ type: "warning", message: res.data.message });
                return;
              }
              res.data.data.sysAdmin.token = res.data.data.token;
              let localStorageLoginParams = {
                phone: this.ruleForm.phone,
                password: "",
              };
              if (this.ruleForm.rememberMe === true) {
                localStorageLoginParams.password = this.ruleForm.password;
              } else {
                localStorageLoginParams.password = "";
              }
              let menuList = this.getMenuArray(res.data.data.menuList);
              let permsArr = [];
              if (res.data.data.permsList.length > 0) {
                res.data.data.permsList.forEach((item) => {
                  permsArr.push(item.perms);
                });
              }
              // let menuList = this.getRoleRouterPath(res.data.data.menuList);
              this.$store.commit("SAVE_USERINFO", res.data.data.sysAdmin);
              this.$store.commit("RECEIVE_MENU_LIST", menuList);
              this.$store.commit("LOGIN_INFO", localStorageLoginParams);
              this.$store.commit("PERMS_LIST", permsArr);
              // 初始化权限路由
              // initRoleRouter();
              this.$router.push("/home");
              // this.$router.push({ path: "/choose"})
            })
            .catch((err) => console.log(err));
        } else {
          this.$message({ type: "error", message: "请输入账号或密码!" });
          return;
        }
      });
    },
    getRoleRouterPath(list) {
      if (list.length > 0) {
        let arr = [];
        list.forEach((item) => {
          let obj = {};
          obj.name = item.name;
          obj.iocn = "";
          obj.children = [];
          obj.path = item.url;
          obj.isShow = true;
          if (item.children.length > 0) {
            item.children.forEach((childItem) => {
              let childObj = {};
              childObj.perms = [];
              childObj.path = childItem.url;
              childObj.name = childItem.name;
              childObj.meta = { title: childItem.name };
              childObj.isShow = true;
              if (childItem.children.length > 0) {
                childItem.children.forEach((thirdItem) => {
                  let thirdObj = {};
                  thirdObj.perms = [];
                  thirdObj.name = thirdItem.name;
                  thirdObj.path = thirdItem.url;
                  thirdObj.meta = { title: thirdItem.name };
                  thirdObj.isShow = false;
                  let index = thirdItem.perms.lastIndexOf(":");
                  let str = thirdItem.perms.substring(
                    index + 1,
                    thirdItem.perms.length
                  );
                  childObj.perms.push(thirdItem.perms.match(str)[0]);
                  if (thirdItem.children.length > 0) {
                    thirdItem.children.forEach((forthItem) => {
                      let index = forthItem.perms.lastIndexOf(":");
                      let str = forthItem.perms.substring(
                        index + 1,
                        forthItem.perms.length
                      );
                      thirdObj.perms.push(forthItem.perms.match(str)[0]);
                    });
                  }
                  obj.children.push(thirdObj);
                });
              }
              obj.children.push(childObj);
            });
          }
          arr.push(obj);
        });
        return arr;
      }
    },

    getMenuArray(tree, arr) {
      if (!tree) return false;
      for (let i in tree) {
        if (tree[i].type > 2) {
          delete tree[i];
        }
        if (tree[i] && tree[i].children && tree[i].children.length > 0) {
          this.getMenuArray(tree[i].children);
        }
      }
      return tree;
    },
  },
};
</script>

<style scoped lang="less">
#loginPage {
  width: 100%;
  height: 100vh;
  background-image: url("~@/assets/images/login_bg.jpg");
  position: relative;
  background-repeat: no-repeat;
  .login_class {
    position: absolute;
    right: 160px;
    top: 50%;
    width: 350px;
    transform: translateY(-60%);
    border-radius: 5px;
    // background: rgba(255, 255, 255, 0.3);
    background: #fff;
    overflow: hidden;
    .ms-title {
      border-bottom: 1px solid #e8eaec;
      padding: 14px 16px;
      line-height: 1;
    }
  }
  .login-btn {
    text-align: center;
    button {
      width: 100%;
      height: 36px;
      margin-bottom: 10px;
    }
  }
  /deep/ .el-checkbox {
    margin-bottom: 10px;
  }
}
.ms-content {
  padding: 30px 30px;
}
/deep/ .el-checkbox ::after {
  transition: none !important;
}
</style>