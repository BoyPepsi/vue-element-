<template>
  <div class="header">
    <div class="logo">监理综合信息管理平台</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <span @click="checked" class="pro-name">{{proName}}</span>
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <div class="user-avator">
          <img src="../../assets/images/3.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="editPassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="showModel"
      width="30%"
      :before-close="handleClose"
      :append-to-body="true"
      center
    >
      <el-form :model="form" :rules="rule" ref="form" label-width="100px">
        <el-form-item label="名称:" prop="name">
          <el-input maxlength="30" v-model="form.name" style="width:76%" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="phone">
          <el-input maxlength="20" v-model.number="form.phone" style="width:76%" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="form.password" type="password" style="width:76%"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="checkPass">
          <el-input v-model="form.checkPass" type="password" style="width:76%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitButton" size="mini">提 交</el-button>
      </span>
    </el-dialog>

    <el-container>
      <el-dialog
        title="请选择项目"
        center
        :visible.sync="dialogVisible"
        width="1300px"
        height="auto"
        :append-to-body="true"
        :before-close="handleCloseChoose"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :show-close="false"
      >
        <div class="choose-pro-box">
          <el-carousel :interval="5000" :initial-index="1" trigger="click" height="560px">
            <el-carousel-item class="carousel-item" v-for="(item, i) in swiperProList" :key="i">
              <div
                class="pro-item"
                v-for="(ele,index) in item"
                :key="index"
                @click="choose(ele.id,ele.name)"
              >
                <img :src="ele.url" alt />
                <div class="pro-name">{{ele.name}}</div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import {
  logout,
  updateUser,
  proList,
  detailPro,
  listByids
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (this.form.checkPass !== "") {
        this.$refs.form.validateField("checkPass");
      }
      callback();
    };
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      collapse: false,
      fullscreen: false,
      name: "",
      message: 2,
      showModel: false,
      form: {
        name: "",
        phone: "",
        password: "",
        checkPass: "",
        token: "",
        userid: "",
        id: ""
      },
      rule: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur", required: true }
        ]
      },
      id: "", //所选项目id
      dialogVisible: true,
      modal: false,
      token: "",
      userid: "",
      isAdmin: "",
      proList: [], //项目列表
      swiperProList: [],
      proName: "",
      initialIndex: 0 //轮播默认索引
    };
  },
  computed: {
    username() {
      let username = this.$store.state.userInfo.name;

      return username ? username : this.name;
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      const _this = this;
      if (command == "loginout") {
        let userinfo = this.$store.state.userInfo;
        logout({
          token: userinfo.token,
          userid: userinfo.id
        })
          .then(res => {
            sessionStorage.clear();
            _this.$router.replace("/");
          })
          .catch(err => {
            this.$message({ type: "error", message: "服务器响应失败!" });
          });
      } else if (command === "editPassword") {
        let userInfo = _this.$store.state.userInfo;
        _this.form.name = userInfo.name;
        _this.form.phone = userInfo.phone;
        _this.form.userid = userInfo.id;
        _this.form.id = userInfo.id;
        _this.form.token = userInfo.token;
        _this.showModel = true;
      }
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    handleClose() {
      this.showModel = false;
      // 取消清空
      this.$refs.form.resetFields();
    },
    submitButton() {
      this.$refs.form.validate(valid => {
        if (valid === true) {
          updateUser(this.form)
            .then(res => {
              if (res.data.status === "0") {
                this.$message({ type: "success", message: "修改成功" });
                this.form.name = "";
                this.form.phone = "";
                this.form.password = "";
                this.form.checkPass = "";
                this.form.token = "";
                this.form.userid = "";
                this.form.id = "";
                this.handleClose();
                this.$router.push("/");
              } else {
                judgeErroCode(res.data.status, res.data.message);
              }
            })
            .catch(er => {
              this.$message({ type: "error", message: "服务器响应失败..." });
            });
        }
      });
    },

    checked() {
      this.dialogVisible = true;
      let userInfo = this.$store.state.userInfo;
      let params = {
        userid: userInfo.id,
        token: userInfo.token,
        projectids: userInfo.projects,
        pageNum: 1,
        pageSize: 100
      };
      listByids(params).then(res => {
        this.swiperProList = this.arrToTwoDim(6, res.data.data);
      });
    },

    // 普通用户的项目列表
    getListAuto() {
      let userInfo = this.$store.state.userInfo;
      if (userInfo.isAdmin !== 1) {
        if (userInfo.projects.length > 0) {
          let params = {
            userid: userInfo.id,
            token: userInfo.token,
            projectids: userInfo.projects,
            pageNum: 1,
            pageSize: 100
          };
          listByids(params).then(res => {
            this.swiperProList = this.arrToTwoDim(6, res.data.data);
          });
          this.dialogVisible = true;
        } else {
          this.dialogVisible = false;
        }
      } else {
        this.dialogVisible = false;
      }
    },

    /**
     * 一维数组，转化为二维数组
     * params:num,arr
     * create by CaoHuimin
     * date:2020-7-5
     */
    arrToTwoDim(num, arr) {
      // 一维数组转换为二维数组
      const iconsArr = []; // 声明数组
      if (arr && arr.length > 0) {
        arr.forEach((item, index) => {
        const page = Math.floor(index / num); // 计算该元素为第几个素组内
        if (!iconsArr[page]) {
          // 判断是否存在
          iconsArr[page] = [];
        }
        iconsArr[page].push(item);
      });
      }
      return iconsArr;
    },

    choose(proId, proName) {
      let updateParams = {
        id: this.$store.state.userInfo.id,
        projectId: proId,
        token: this.$store.state.userInfo.token,
        userid: this.$store.state.userInfo.id
      };
      this.dialogVisible = false;
      updateUser(updateParams).then(res => {
        if (res.data.status == 0) {
          let userInfo = this.$store.state.userInfo;
          userInfo.currProjectId = proId;
          userInfo.currProjectName = proName;
          this.$store.commit("SAVE_USERINFO", userInfo);
          this.proName = this.$store.state.userInfo.currProjectName;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      });
    },

    handleCloseChoose() {
      this.dialogVisible = false;
    }
  },
  created() {
    let userInfo = this.$store.state.userInfo;;
    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.isAdmin = userInfo.isAdmin;
    this.proName = userInfo.currProjectName;
    this.getListAuto(); //获取当前登录用户的projectid
    if (this.proName) {
      this.dialogVisible = false;
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 280px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.el-carousel__item .pro-item {
  width: 340px;
  height: 260px;
  border-radius: 7px;
  margin-top: 10px;
  position: relative;
  cursor: pointer;
  img {
    width: 340px;
    height: 260px;
    border-radius: 7px;
  }
  .pro-name {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    text-align: center;
    font-size: 15px;
    line-height: 32px;
    border-bottom-right-radius: 7px;
    border-bottom-left-radius: 7px;
  }
}

.el-carousel__item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.choose-pro {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
.pro-name {
  font-size: 16px;
  cursor: pointer;
}


</style>
