<template>
  <div class="bigbox">
    <el-form ref="form" :model="addFormData" label-width="80px" label-position="left">
      <el-form-item label="检查阶段">
        <el-select v-model="addFormData.tagType" placeholder="请选择" style="width:45%">
          <el-option
            v-for="item in tagTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查分项">
        <el-select v-model="addFormData.questionType" placeholder="请选择" style="width:45%" multiple>
          <el-option
            class="pro-options"
            v-for="item in questionTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-button style="margin-left:670px;margin-bottom:20px" @click="searchQuestionData">查询问题</el-button>

    <questionTransfer ref="questionTransfer" :questionType="addFormData.questionType"></questionTransfer>

    <div style="margin-top:20px">处理情况</div>
    <el-input
      class="textarea"
      :autosize="{ minRows: 4, maxRows: 10}"
      resize="none"
      type="textarea"
      v-model="addFormData.textarea"
    ></el-input>

    <div class="footer">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="goBack">取消</el-button>
    </div>
  </div>
</template>

<script>
import { projectQuestionInformSave } from "@/http/api.js";
export default {
  data() {
    return {
      addFormData: {
        projectName: "",

        tagType: "",
        questionType: [],

        textarea: "",
      },

      questionTypeList: [],
      tagTypeList: [],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.projectId = userInfo.currProjectId;
    this.addFormData.projectName = userInfo.currProjectName;

    this.questionTypeList = this.commonData.questionTypeList;
    this.tagTypeList = this.commonData.tagTypeList;
    // this.$refs["questionTransfer"].questionData = res.data.data;
    //   this.$refs["questionTransfer"].selectData = [];
  },
  methods: {
    /**
     * 保存
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    save() {
      this.$router.push({
        path: "/sideStationSecord/add",
        query: {
          id: "123",
        },
      });

      // this.$refs["form"].validate((valid) => {
      //   if (valid) {
      //     if (this.$refs["questionTransfer"].selectData.length === 0) {
      //       this.$message({ type: "error", message: "请选择问题" });
      //       return false;
      //     }
      //     let param = {
      //       token: this.token,
      //       userid: this.userid,
      //       projectId: this.projectId,
      //       projectName: this.addFormData.projectName,

      //       formType: "1",
      //       tagType: this.addFormData.tagType,
      //       questionType: this.addFormData.questionType,
      //       questionIds: this.$refs["questionTransfer"].selectData.join(","),
      //     };

      //     projectQuestionInformSave(param).then((res) => {
      //       console.log(res.data);
      //       if (res.data.status == 0) {
      //         this.$router.push({
      //           path: "/sideStationSecord/add",
      //           query: {
      //             id: res.data.data,
      //           },
      //         });
      //       }
      //     });
      //   } else {
      //     return false;
      //   }
      // });
    },

    /**
     * 根据问题类型查询问题列表
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    searchQuestionData() {
      let param = {
        tagType: this.addFormData.tagType,
        questionType: this.addFormData.questionType,
      };
      console.log(param);
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

.pro-options {
  width: 30%;
  float: left;
  margin-bottom: 5px;
  margin-left: 5px;
  text-align: center;
  font-size: 14px;
  line-height: 34px;
  color: #333;
  .selected::after {
    position: absolute;
    left: 20px;
  }
}

.textarea {
  width: 770px;
  margin: 20px 0;
}

.footer {
  width: 770px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>