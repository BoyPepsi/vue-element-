<template>
  <div class="basement-safe-add-question">
    <div id="basement-week" >
      <el-form :model="addCheckForm" :rules="rule" ref="addCheckForm" label-width="140px">
        <el-row class="row-item">
          <el-form-item prop="questionCode" label="检查项目:">
            <el-select
              placeholder="请选择"
              v-model="addCheckForm.questionCode"
              style="width:76%"
              @change="projectCodeChange"
            >
              <el-option
                v-for="item in projectList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <!-- <el-row>
          <el-form-item prop="questionCode" label="检查分项:">
            <el-select
              @change="questionCodeChange"
              placeholder="请选择"
              v-model="addCheckForm.questionCode"
              style="width:76%"
            >
              <el-option
                v-for="item in childList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row> -->
      </el-form>
    </div>
    <div class="add-question" v-if="questionCode.length > 0">
      <addQuestionsNew :code="questionCode" ref="addQuestion" :showOtherPostion="true"></addQuestionsNew>
    </div>
    <div class="action-btn">
      <el-button size="medium" type="default" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getDictionarieList, maintableSavequeuecache } from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    return {
      code: "",
      userid: "",
      token: "",
      addCheckForm: {
        projectCode: "",
        questionCode: "",
      },
      rule: {
        projectCode: [
          { required: true, message: "请选择检查项目", trigger: "change" },
        ],
        questionCode: [
          { required: true, message: "请选择检查分项", trigger: "change" },
        ],
      },
      projectList: [],
    //   childList: [],
      questionCode: "",
      content: [],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    if (this.$route.query) {
      this.code = this.$route.query.code;
      this.getSelectList(this.code, "projectList");
    }
  },
  methods: {
    async save() {
      this.$refs.addCheckForm.validate((valid) => {
        if (valid == false) {
          this.$message({ type: "error", message: "请填写必填项" });
          return false;
        }
      });
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
            item.code = this.addCheckForm.questionCode;
            // item.tCode = this.addCheckForm.questionCode;
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

    projectCodeChange(code) {
      this.questionCode = code;
    },

    questionCodeChange(code) {
      this.questionCode = code;
    },

    /**
     * 获取下拉数据
     * params：code
     * create by YuXiong
     * date:2020-6-28
     */
    async getSelectList(code, list) {
      this[list] = [];
      let params = {
        pcode: code,
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
  },
};
</script>

<style lang="less" scoped>
#basement-week {
  margin-top: 40px;
  width: 600px;
}
.add-question {
  margin: 40px;
}
.action-btn {
  width: 400px;
  margin: 20px auto;
}


</style>