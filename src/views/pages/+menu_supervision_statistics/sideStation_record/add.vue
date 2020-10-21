<template>
  <div class="bigbox">
    <el-form ref="form" :model="addFormData" label-width="130px" label-position="left">
      <el-form-item label="项目名称">
        <el-input v-model="addFormData.projectName" style="width:45%" disabled></el-input>
      </el-form-item>
      <el-form-item label="旁站开始时间">
        <el-date-picker
          v-model="addFormData.startTime"
          value-format="timestamp"
          style="width:45%"
          type="datetime"
          placeholder="旁站开始时间"
          :picker-options="pickerStartDate"
          :disabled="$route.query.id"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="旁站结束时间">
        <el-date-picker
          v-model="addFormData.endTime"
          value-format="timestamp"
          style="width:45%"
          type="datetime"
          placeholder="旁站结束时间"
          :picker-options="pickerEndDate"
          :disabled="$route.query.id"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="旁站关键部位/工序">
        <el-input v-model="addFormData.textarea" style="width:45%" disabled></el-input>
      </el-form-item>
      <el-form-item label="施工单位">
        <el-input v-model="addFormData.textarea" style="width:45%" disabled></el-input>
      </el-form-item>
    </el-form>

    <div>旁站关键部位/工序施工情况</div>
    <el-input
      class="textarea"
      :autosize="{ minRows: 4, maxRows: 10}"
      resize="none"
      type="textarea"
      v-model="addFormData.textarea"
      readonly
    ></el-input>

    <div>
      旁站问题及处理情况
      <el-button style="margin-left:550px" @click="goQuestionSelect">填写内容</el-button>
    </div>
    <div class="content">
      <div>问题列表</div>
      <div>123</div>
      <div>处理情况</div>
      <div>456</div>
    </div>

    <div class="footer">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="goBack" v-if="!id">取消</el-button>
    </div>
  </div>
</template>

<script>
import {} from "@/http/api.js";
export default {
  data() {
    return {
      token: "",
      userid: "",
      projectId: "",

      mainId: "",

      addFormData: {
        projectName: "",

        startTime: "",
        endTime: "",

        textarea: "",
      },

      options: [],

      pickerStartDate: {
        disabledDate: (time) => {
          if (this.addFormData.endTime) {
            let secondNum = 30 * 24 * 60 * 60 * 1000;
            return (
              time.getTime() > this.addFormData.endTime + secondNum ||
              time.getTime() < this.addFormData.endTime - secondNum
            );
          }
        },
      },
      pickerEndDate: {
        disabledDate: (time) => {
          if (this.addFormData.startTime) {
            let secondNum = 30 * 24 * 60 * 60 * 1000;
            return (
              time.getTime() < this.addFormData.startTime ||
              time.getTime() > this.addFormData.startTime + secondNum
            );
          }
        },
      },
    };
  },
  watch: {
    "addFormData.startTime"(value) {
      if (value == null) {
        this.addFormData.startTime = "";
      }
    },
    "addFormData.endTime"(value) {
      if (value == null) {
        this.addFormData.endTime = "";
      }
    },
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.addFormData.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;

    if (this.$route.query.mainId) {
      this.mainId = this.$route.query.mainId;
    }
  },
  methods: {
    /**
     * 问题选择跳转
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    goQuestionSelect() {
      if (this.addFormData.startTime == "" || this.addFormData.endTime == "") {
        this.$message({ type: "error", message: "填写内容前请先填写时间" });
        return false;
      }

      this.$confirm(
        "开始填写内容后时间无法修改，请确认时间是否填写正确",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        let query = {
          startTime: this.addFormData.startTime,
          endTime: this.addFormData.endTime,
        };
        this.$router.push({
          path: "/sideStationSecord/select",
          query,
        });
      });
    },

    /**
     * 问题详情跳转
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    save() {
      if (!this.id) {
        this.$message({ type: "error", message: "请先填写旁站记录内容" });
        return false;
      }
      this.$router.push({
        path: "/sideStationSecord/detail",
        query: {
          isAdd: true,
        },
      });
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

.content {
  box-sizing: border-box;
  width: 795px;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #000;
  border-radius: 10px;
}

.textarea {
  width: 795px;
  margin: 20px 0;
}

.footer {
  width: 795px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>