<template>
  <div id="first-finishing-addquestion">
    <div class="item-select">
      <el-form :model="addCheckForm" :disabled="true"  ref="addCheckForm" label-width="100px">
        <el-row class="row-item">
          <el-form-item label="项目名称:">
            <el-input :disabled="true" v-model="projectName" style="width:76%"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item prop="code" label="检查分项:">
            <el-select
              placeholder="请选择"
              v-model="addCheckForm.code"
              style="width:76%"
              :disabled="true"
            >
              <el-option
                v-for="item in checkBranchCodeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item prop="bidUnitId" label="施工单位:">
            <el-input
              placeholder="请选择"
              :disabled="true"
              v-model="addCheckForm.bidUnit"
              style="width:76%"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item prop="buildId" label="楼栋:">
            <el-select
              filterable
              placeholder="请选择楼栋"
              v-model="addCheckForm.buildId"
              style="width:76%"
            >
              <el-option
                v-for="item in buildingList"
                :key="item.id"
                :label="item.number"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        
      </el-form>
    </div>

    <div class="add-question">
      <addQuestionsNew :code="code" ref="addQuestion" :showOtherPostion="true"></addQuestionsNew>
    </div>

    <div class="action-btn">
      <el-button size="medium" type="default" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import {
  getDictionarieList,
  getBuildList,
  maintableSavequeuecache,
  maintableSyncdbtocache
}
from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    return {
      projectName: "",
      projectId: "",
      code: "",
      addCheckForm: {
        code: "",
        bidUnit: "",
        bidUnitId: "",
      },
      checkBranchCodeList: [],
      buildingList: [],
      content : [],
      mainId : '',
    };
  },
  created(){
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;

    // 查询本地存储表单数据
    if (localStorage.getItem("SAVFORMDATA")) {
      this.addCheckForm = JSON.parse(localStorage.getItem("SAVFORMDATA"));
      this.getBuildingList();
    }
    if (this.$route.query) {
      this.addCheckForm.code = this.$route.query.code;
      this.code = this.$route.query.code;
      if (this.$route.query.mainId) {
        //当前用户进行修改操作
        this.mainId = this.$route.query.mainId;
        this.syncdbtocache();
      }
    }
    this.getSelectList("04010103", "checkBranchCodeList");
  },
  methods : {


    // 将数据库缓存同步
    async syncdbtocache() {
      let params = {
        code: this.code,
        mainId: this.mainId,
        userId: this.userid,
        token: this.token,
      };
      let res = await maintableSyncdbtocache(params);
      if (res.data.status == "0") {
        console.log("缓存和数据库同步成功");
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },


    // 保存问题---存缓存
    async save(){
      this.content = [];
      let checkList = this.$refs["addQuestion"].checkList;
      let otherList = this.$refs["addQuestion"].otherList;
      if (checkList.length > 0) {
        checkList.map((item) => {
          if (item.isChecked == true) {
            item.code = item.tCode;
            item.tpostion = item.tPostion;
            this.content.push(item);
          }
        });
      }
      if (otherList.length > 0) {
        otherList.map((item) => {
          if (item.isChecked == true) {
            item.code = this.code;
            item.tpostion = item.tPostion;
            this.content.push(item);
          }
        });
      }
      let params = {
        code: this.code,
        content: JSON.stringify(this.content),
      };
      try {
        let res = await maintableSavequeuecache(params);
        if (res.data.status == "0") {
          this.$message({ type: "success", message: "添加问题成功" });
          this.$router.go(-1);
        } else {
          this.$message({ type: "error", message: res.data.message });
        }
      } catch (error) {
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    // 根据项目获取楼栋列表
    async getBuildingList() {
      let params = {
        pageSize: 10000,
        pageNum: 1,
        token: this.token,
        userid: this.userid,
        projectid: this.projectId,
      };
      try {
        let res = await getBuildList(params);
        if (res.data.status === "0") {
          this.buildingList = res.data.data;
        }
      } catch (error) {
        this.$message({ type: "error", message: "获取数据异常" });
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    /**
     * 获取下拉数据
     * params：code
     * create by CaoHuimin
     * date:2020-8-17
     */
    async getSelectList(code, list) {
      this[list] = [];
      let params = {
        pcode: code,
        token: this.token,
        userId: this.userid,
        pageNum: 1,
        pageSize: 10000,
      };
      try {
        let res = await getDictionarieList(params);
        if (res.data.status === "0") {
          this[list] = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this[list] = [];
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    // 返回
    goBack() {
      this.$router.go(-1);
    },
  }
};
</script>


<style scoped lang='less'>
.upload-demo {
  text-align: right;
}
.quality-inspect-save {
  padding-bottom: 60px;
}
.list-item {
  width: 1200px;
  margin: 40px 0 0 40px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 20px;
  .row-item {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .item-button {
    width: 120px;
    height: 30px;
    padding: 0;
  }
  .right {
    text-align: right;
  }
}
.red-span {
  color: #f00;
}
.row-upload {
  margin: 20px 0 0 0;
  overflow: hidden;
  padding-right: 20px;
}
.row-button {
  width: 1200px;
  text-align: center;
  margin-top: 60px;
  padding-bottom: 60px;
  button {
    margin-right: 20px;
  }
}
/deep/ textarea {
  height: 80px;
}
.item-select {
  width: 600px;
  margin: 40px 0 0 40px;
  .row-item {
    margin-top: 20px;
    span {
      width: 140px;
      display: inline-block;
      color: #999;
      font-size: 14px;
    }
  }
}
/deep/ .el-checkbox,
.el-checkbox__input {
  white-space: normal;
  word-break: break-all;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/deep/ input[type="number"] {
  -moz-appearance: textfield;
}
.plus {
  margin: 40px 0 0 40px;
  font-size: 24px;
}
.action-btn {
  width: 400px;
  margin: 20px auto;
}
.add-question {
  margin: 40px;
}
</style>