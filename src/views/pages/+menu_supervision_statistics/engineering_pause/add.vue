<template>
  <div class="bigbox">
    <el-form
      ref="form"
      :model="updateFormData"
      :rules="rules"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="项目名称">
        <el-input v-model="updateFormData.projectName" style="width:45%" disabled></el-input>
      </el-form-item>
      <el-form-item label="致" prop="unitIds">
        <el-select
          v-model="updateFormData.unitIds"
          multiple
          placeholder="请选择"
          style="width:45%"
          popper-class="unitIds"
        >
          <el-option
            class="pro-options"
            v-for="item in options"
            :key="item.unitId"
            :label="item.name"
            :value="item.unitId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div>
      工程暂停单内容
      <el-button style="margin-left:554px" @click="goQuestionSelect">填写内容</el-button>
    </div>

    <div class="content">
      <div>于 {{ detailData.cause }} 原因</div>
      <div>现通知你方于 {{ detailData.stopTime | transformDate3 }} 起，暂停 {{detailData.position}} 部位 {{ detailData.process }} 施工，并按下述要求做好后续工作。</div>
      <div>
        要求：
        <div style="white-space: pre-wrap;">{{ detailData.requirement }}</div>
      </div>
    </div>

    <div class="footer">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="goBack" v-if="!id">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  projectQuestionInformUpdate,
  projectQuestionInformDetail,
  unitListNothing,
} from "@/http/api.js";
export default {
  data() {
    return {
      token: "",
      userid: "",
      projectId: "",

      id: "",

      updateFormData: {
        projectName: "",
        unitIds: [],
        questionIds: [],
      },

      detailData: {},

      options: [],

      rules: {
        unitIds: [
          { required: true, message: "请选择通知单位", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.updateFormData.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;

    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getunitIdsList();
      this.getDetail();
    }
  },
  methods: {
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
        this.detailData = res.data.data;

        this.updateFormData.questionIds = res.data.data.questionIds;
        this.updateFormData.projectName = res.data.data.projectName;
        if (res.data.data.unitIds != "") {
          this.updateFormData.unitIds = res.data.data.unitIds.split(",");
        }
      }
    },

    /**
     * 获取施工单位
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    async getunitIdsList() {
      let param = {
        token: this.token,
        userid: this.userid,
        projectId: this.projectId,
        pageNum: 1,
        pageSize: 10000,
        queryType: "1",
      };

      let res = await unitListNothing(param);

      let arr = res.data.data.list;
      let obj = {};
      arr = arr.reduce((item, next) => {
        if (!obj[next.unitId]) {
          item.push(next);
          obj[next.unitId] = true;
        }
        return item;
      }, []);

      if (res.data.status == 0) {
        this.options = arr;
      }
    },

    /**
     * 问题选择跳转
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    goQuestionSelect() {
      let query = {};
      if (this.$route.query.id) {
        query.id = this.$route.query.id;
      }

      this.$router.push({
        path: "/engineeringPause/select",
        query,
      });
    },

    /**
     * 保存
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    save() {
      if (!this.id) {
        this.$message({ type: "error", message: "请先填写工程暂停单内容" });
        return false;
      }
      if (this.updateFormData.unitIds.length == 0) {
        this.$message({ type: "error", message: "请选择通知单位" });
        return false;
      }

      let param = {
        id: this.$route.query.id,
        token: this.token,
        userid: this.userid,

        unitIds: this.updateFormData.unitIds.join(","),
        questionIds: this.updateFormData.questionIds,
      };

      projectQuestionInformUpdate(param).then((res) => {
        if (res.data.status == 0) {
          this.$router.push({
            path: "/engineeringPause/detail",
            query: {
              id: param.id,
              isAdd: true,
            },
          });
        }
      });
    },

    /**
     * 返回上一页
     * params: none
     * create by gzy
     * date:2020.09.07
     */
    goBack() {
      this.$router.push({
        path: "/engineeringPause/list",
      });
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
  width: 770px;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #000;
  border-radius: 10px;
}

.pro-options {
  width: 49%;
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

.footer {
  width: 770px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>