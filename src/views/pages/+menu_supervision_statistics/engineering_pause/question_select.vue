<template>
  <div class="bigbox">
    <el-form
      ref="form"
      :model="addFormData"
      :rules="rules"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="项目名称">
        <el-input v-model="addFormData.projectName" style="width:45%" disabled></el-input>
      </el-form-item>
      <el-form-item label="填写原因" prop="cause">
        <el-input type="textarea" :rows="2" v-model="addFormData.cause" style="width:45%"></el-input>
      </el-form-item>
      <el-form-item label="选择时间" prop="stopTime">
        <el-date-picker
          v-model="addFormData.stopTime"
          value-format="timestamp"
          type="datetime"
          placeholder="选择日期时间"
          style="width:45%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="选择部位" prop="positionType">
        <el-select
          v-model="addFormData.positionType"
          placeholder="请选择"
          style="width:45%"
          @change="selectChange($event, 'positionType')"
        >
          <el-option label="现场全部" value="1"></el-option>
          <el-option label="地下室" value="2"></el-option>
          <el-option label="楼栋" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区块楼栋" prop="positionMark" v-if="positionMarkShow">
        <el-select
          v-model="addFormData.positionMark"
          placeholder="请选择"
          style="width:45%"
          @change="selectChange($event, 'positionMark')"
        >
          <el-option label="全部" value="全部"></el-option>
          <el-option
            v-for="(item,index) in positionMarkList"
            :key="index"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择工序" prop="process" v-if="processShow">
        <el-select v-model="addFormData.process" clearable placeholder="请选择" style="width:45%">
          <el-option
            v-for="(item,index) in this.commonData.processList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="填写要求" prop="requirement">
        <el-input type="textarea" :rows="2" v-model="addFormData.requirement" style="width:45%"></el-input>
      </el-form-item>
    </el-form>

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
  baseListNothing,
  getBuildList,
} from "@/http/api.js";
export default {
  data() {
    return {
      addFormData: {
        projectName: "",
        cause: "",
        stopTime: "",
        requirement: "",

        positionType: "",
        positionMark: "",
        process: "",
      },
      positionMarkShow: false,
      processShow: false,

      positionMarkList: [],

      rules: {
        cause: [{ required: true, message: "请填写原因", trigger: "blur" }],
        stopTime: [{ required: true, message: "请选择时间", trigger: "blur" }],
        requirement: [
          { required: true, message: "请填写要求", trigger: "blur" },
        ],
        positionType: [
          { required: true, message: "请选择部位", trigger: "blur" },
        ],
        positionMark: [
          { required: false, message: "请选择区块楼栋", trigger: "blur" },
        ],
        process: [{ required: false, message: "请选择工序", trigger: "blur" }],
      },
    };
  },
  watch: {
    "addFormData.positionType"(value) {
      if (value != 1) {
        this.rules.positionMark[0].required = true;
        this.positionMarkShow = true;
      } else {
        this.positionMarkShow = false;
        this.processShow = false;
      }
    },
    "addFormData.positionMark"(value) {
      if (value != 1 && value != "") {
        // this.rules.process[0].required = true;
        this.processShow = true;
      } else {
        this.processShow = false;
      }
    },
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
  },
  methods: {
    /**
     * 保存
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let param = {
            token: this.token,
            userid: this.userid,
            projectId: this.projectId,
            projectName: this.addFormData.projectName,

            formType: "2",

            cause: this.addFormData.cause,
            stopTime: this.addFormData.stopTime.toString(),
            requirement: this.addFormData.requirement,

            positionType: this.addFormData.positionType,
            positionMark: this.addFormData.positionMark,
            process: this.addFormData.process,
          };

          param.positionMark == "" ? "全部" : param.positionMark;

          if (this.$route.query.id) {
            param.id = this.$route.query.id;
            projectQuestionInformUpdate(param).then((res) => {
              if (res.data.status == 0) {
                this.$router.push({
                  path: "/engineeringPause/add",
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
                  path: "/engineeringPause/add",
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
        setTimeout(() => {
          this.addFormData.positionMark = res.data.data.positionMark;
          this.addFormData.process = res.data.data.process;
        }, 100);

        await this.getPositionMarkList(this.addFormData.positionType);
      }
    },

    /**
     * 选项切换
     * params: none
     * create by gzy
     * date:2020.09.07
     */
    selectChange($event, item) {
      if (item == "positionType") {
        this.getPositionMarkList($event);
        this.addFormData.positionMark = "";
        this.addFormData.process = "";
      } else if (item == "positionMark") {
        this.addFormData.process = "";
      }
    },

    /**
     * 获取区块楼栋
     * params: none
     * create by gzy
     * date:2020.09.07
     */
    async getPositionMarkList(item) {
      this.positionMarkList = [];

      let param = {
        token: this.token,
        userid: this.userid,
        projectId: this.projectId,
        pageNum: 1,
        pageSize: 10000,
        type: "1",
      };

      if (item == 2) {
        // 地下室
        let res = await baseListNothing(param);
        this.positionMarkList = res.data.data.list.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      } else if (item == 3) {
        // 楼栋
        let res = await getBuildList(param);
        this.positionMarkList = res.data.data.map((item) => {
          return {
            value: item.id,
            label: item.number,
          };
        });
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