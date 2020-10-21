<template>
  <div class="bigbox">
    <el-form
      ref="form"
      :model="addFormData"
      :rules="rules"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="问题类型" prop="questionType">
        <el-select
          v-model="addFormData.questionType"
          placeholder="请选择"
          style="width:45%"
          @change="getQuestionData"
        >
          <el-option
            v-for="item in questionTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="整改时间" prop="days">
        <el-select v-model="addFormData.days" placeholder="请选择" style="width:45%">
          <el-option label="1" value="1"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="5" value="5"></el-option>
          <el-option label="7" value="7"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <questionTransfer ref="questionTransfer" :questionType="addFormData.questionType"></questionTransfer>

    <div class="footer">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="goBack">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  projectQuestionInformSave,
  projectQuestionInformUpdate,
  projectQuestionInformDetail,
  qualityQuestionDetailByProjectId,
} from "@/http/api.js";
export default {
  data() {
    return {
      token: "",
      userid: "",
      projectId: "",
      id: "",

      addFormData: {
        
      },

      questionTypeList: [],

      rules: {
        questionType: [
          { required: true, message: "请选择问题类型", trigger: "blur" },
        ],
        days: [
          { required: true, message: "请选择整改时间", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.projectId = userInfo.currProjectId;
    this.addFormData.projectName = userInfo.currProjectName;

    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetail();
    }

    this.questionTypeList = this.commonData.questionTypeList;
  },
  methods: {
    /**
     * 获取穿梭框问题列表数据
     * params: none
     * create by gzy
     * date:2020.09.07
     */
    async getQuestionData(questionType) {
      this.selectData = [];
      let param = {
        token: this.token,
        userid: this.userid,
        questionType,
        projectId: this.projectId,
        pageNum: 1,
        pageSize: 10000,
      };

      let res = await qualityQuestionDetailByProjectId(param);
      res.data.data.forEach((item) => {
        item.key = item.id;
        item.showText = "(" + item.mergePostion + ")" + item.content;
      });
      this.$refs["questionTransfer"].questionData = res.data.data;
      this.$refs["questionTransfer"].selectData = [];
    },

    /**
     * 保存
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.$refs["questionTransfer"].selectData.length === 0) {
            this.$message({ type: "error", message: "请选择问题" });
            return false;
          }
          let param = {
            token: this.token,
            userid: this.userid,
            projectId: this.projectId,
            projectName: this.addFormData.projectName,

            formType: "4",
            state: "1",
            days: this.addFormData.days,
            questionType: this.addFormData.questionType,
            questionIds: this.$refs["questionTransfer"].selectData.join(","),
          };

          if (this.$route.query.id) {
            param.id = this.$route.query.id;
            projectQuestionInformUpdate(param).then((res) => {
              if (res.data.status == 0) {
                this.$router.push({
                  path: "/supervisionNotice/add",
                  query: {
                    id: param.id,
                  },
                });
              }
            });
          } else {
            projectQuestionInformSave(param).then((res) => {
              if (res.data.status == 0) {
                this.$router.push({
                  path: "/supervisionNotice/add",
                  query: {
                    id: res.data.data,
                  },
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },

    /**
     * 获取详情
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    async getDetail() {
      let param = { token: this.token, userid: this.userid, id: this.id };

      let res = await projectQuestionInformDetail(param);
      if (res.data.status == 0) {
        this.addFormData = res.data.data;
        await this.getQuestionData(this.addFormData.questionType);
        this.$refs[
          "questionTransfer"
        ].selectData = this.addFormData.questionIds
          .substring(0, this.addFormData.questionIds.lastIndexOf(","))
          .split(",");
      }
    },

    /**
     * 返回上一页
     * params: none
     * create by gzy
     * date:2020.09.07
     */
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.bigbox {
  padding: 40px;
  padding-bottom: 0px;
}

.footer {
  width: 770px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>