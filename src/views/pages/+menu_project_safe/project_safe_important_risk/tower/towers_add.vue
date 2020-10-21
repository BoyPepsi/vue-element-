<template>
  <div class="tower-add">
    <div class="item-select">
      <el-form :model="addCheckForm" :rules="rule" ref="addCheckForm" label-width="130px">
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
        <el-row class="row-item" v-if="!(code  == '0402020306' || code == '0402020305')">
          <el-form-item prop="leaseUnit" label="租赁单位:">
            <el-input :disabled="itemId.length > 0" v-model="addCheckForm.leaseUnit" style="width:76%"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item" v-if="!(code  == '0402020306' || code == '0402020305')">
          <el-form-item prop="installUnit" label="安装单位:">
            <el-input :disabled="itemId.length > 0" v-model="addCheckForm.installUnit" style="width:76%"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item" v-if="code !== '0402020305'">
          <el-form-item prop="liftNum" label="塔吊编号:">
            <el-input :disabled="itemId.length > 0" v-model="addCheckForm.liftNum" style="width:76%"></el-input>
          </el-form-item>
        </el-row>
        
        <el-row class="row-item">
          <el-form-item prop="model" label="型号:">
            <el-input :disabled="itemId.length > 0" v-model="addCheckForm.model" style="width:76%"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item" v-if="code == '0402020307'">
          <el-form-item label="进场日期:" prop="joinTime">
            <el-date-picker
              v-model="addCheckForm.joinTime"
              type="date"
              :editable="false"
              placeholder
              class="start-time"
              value-format="timestamp"
            />
          </el-form-item>
        </el-row>
        <el-row class="row-item" v-if="code == '0402020307'">
          <el-form-item label="出场时间:" prop="outTime">
            <el-date-picker
              v-model="addCheckForm.outTime"
              type="date"
              :editable="false"
              placeholder
              class="start-time"
              value-format="timestamp"
            />
          </el-form-item>
        </el-row>
        <el-row class="row-item" v-if="code =='0402020301'">
          <el-form-item label="加节顶升高度范围:" prop="hightArea">
            <el-input :disabled="itemId.length > 0" placeholder v-model="addCheckForm.hightArea" style="width:76%"></el-input>
          </el-form-item>
        </el-row>

        <el-row class="row-item" v-if="code =='0402020301'">
          <el-form-item label="第几道扶墙杆:" prop="wallRod">
            <el-input :disabled="itemId.length > 0" placeholder v-model="addCheckForm.wallRod" style="width:76%"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item" v-if="code == '0402020307'">
          <el-form-item label="合格证:">
            <span style="color:red">*</span>
            <div style="float:left">
              <upload-file ref="file" fileaccept=".JPG, .PNG, .GIF, .JPEG,.jpg,.png,.gif,jpeg"></upload-file>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="add-question">
      <addQuestionsNew :code="code" ref="addQuestion" :showOtherPostion="false"></addQuestionsNew>
    </div>
    <el-row>
      <div class="action-btn">
        <el-button size="medium" type="default" @click="goBack">返回</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="save"
          v-if="action == 'add'"
        >保存</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="update"
          v-if="action == 'update'"
        >保存更新</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import {
  getDictionarieList,
  getBuildUnit,
  maintableAdd,
  maintableList,
  maintableUpdate,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import { getDate } from "@/utils/transformDate.js";
export default {
  data() {
    return {
      token: "",
      userid: "",
      projectName: "",
      projectId: "",
      code: "",
      addCheckForm: {
        code: "",
        bidUnit: "",
        bidUnitId: "",
        leaseUnit: "",
        installUnit: "",
        liftNum: "",
        model: "",
        joinTime: "",
        outTime: "",
        hightArea: "",
        wallRod: "",
        fileList: [],
      },
      checkBranchCodeList: [],
      rule: {
        towerNum: [
          { required: true, message: "请输入必填项", trigger: "change" },
        ],
        liftNum: [
          { required: true, message: "请输入必填项", trigger: "change" },
        ],
        installUnit: [
          { required: true, message: "请输入必填项", trigger: "change" },
        ],
        hightArea: [
          { required: true, message: "请输入必填项", trigger: "change" },
        ],
        wallRod: [
          { required: true, message: "请输入必填项", trigger: "change" },
        ],
        joinTime: [
          { required: true, message: "请选择进场日期", trigger: "change" },
        ],
        outTime: [
          { required: true, message: "请选择出厂时间", trigger: "change" },
        ],
        leaseUnit: [
          { required: true, message: "请输入必填项", trigger: "change" },
        ],
      },
      action: "",
      itemId: "",
      tableList: [],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;
    this.getSelectList("04020203", "checkBranchCodeList");
    if (this.$route.query) {
      this.code = this.$route.query.code;
      this.addCheckForm.code = this.$route.query.code;
      this.action = this.$route.query.action;
    }
    this.getbidUnit();
    if (this.$route.query.id) {
      this.itemId = this.$route.query.id;
      this.getData();
    }
  },
  methods: {
    /**
     * 修改
     * params：params
     * create by Caohuimin
     * date:2020-9-8
     */
    update() {
      this.$refs.addCheckForm.validate((valid) => {
        if (valid == true) {
          let params = {
            bidUnitId: this.addCheckForm.bidUnitId,
            isMain: 1,
            isMany: 0,
            isQuestion: "0",
            otherQuestionInfo: [],
            projectId: this.projectId,
            questionInfo: [],
            leaseUnit: this.addCheckForm.leaseUnit,
            installUnit: this.addCheckForm.installUnit,
            liftNum: this.addCheckForm.liftNum,
            model: this.addCheckForm.model,
            tcode: this.code,
            token: this.token,
            userId: this.userid,
            status: "1",
            joinTime: this.addCheckForm.joinTime,
            outTime: this.addCheckForm.outTime,
            hightArea: this.addCheckForm.hightArea,
            wallRod: this.addCheckForm.wallRod,
            qualifiedUrl: this.addCheckForm.fileList,
            tableList: this.tableList,
            tableId: this.itemId,
          };

          let checkList = this.$refs["addQuestion"].checkList;
          let checkedArr = checkList.filter((item) => item.isChecked === true);
          let otherList = this.$refs["addQuestion"].otherList;
          let otheredArr = otherList.filter((item) => item.isChecked == true);
          this.tableList = [...checkedArr, ...otheredArr];
          params.tableList = this.tableList;

          if (this.code == "0402020307") {
            this.addCheckForm.fileList = this.$refs["file"].fileList;
            params.qualifiedUrl = this.$refs["file"].fileList;
          }

          if (
            this.code == "0402020307" &&
            this.addCheckForm.fileList.length < 1
          ) {
            this.$message({ type: "error", message: "必须上传合格证" });
            return;
          }
          if (this.tableList.length > 0) {
            params.status = '0';
            params.isQuestion = "1";
          }
          maintableUpdate(params).then((res) => {
            if (res.data.status == "0") {
              this.$message({ type: "success", message: "修改成功" });
              this.$router.push({
                path: "/importantRiskTowers/detail",
                query: {
                  id: res.data.data.tableId,
                  code: this.code,
                  action: "affirm",
                },
              });
            } else {
              this.$message({ type: "error", message: res.data.message });
            }
          });
        } else {
          this.$message({ type: "error", message: "你填写必填项" });
        }
      });
    },

    /**
     * 获取回选数据
     * params：params
     * create by Caohuimin
     * date:2020-9-8
     */
    async getData() {
      let params = {
        code: this.code,
        pageNum: 1,
        pageSize: 10,
        token: this.token,
        userid: this.userid,
        parentId: this.itemId,
      };
      let res = await maintableList(params);
      if (res.data.status == "0") {
        if (res.data.data && res.data.data.headParam.length > 0) {
          this.addCheckForm = this.$formMap(
            res.data.data.headParam,
            this.addCheckForm
          );
          this.projectName = res.data.data.projectName;
          this.projectId = res.data.data.projectId;
          let item = res.data.data.publiList[0];
          // this.$refs['file'].fileList =
          res.data.data.headParam.map((item) => {
            if (item.key == "qualifiedUrl") {
              this.$refs["file"].fileList = JSON.parse(item.name);
              this.addCheckForm.fileList = JSON.parse(item.name);
            }
          });

          this.$refs["addQuestion"].checkedArr = item.quessVOList;
          if (item.otherquessVOList.length > 0) {
            item.otherquessVOList.forEach((ele) => {
              ele.isChecked = true;
            });
            this.$refs["addQuestion"].otherList = item.otherquessVOList;
          }
          this.$refs[
            "addQuestion"
          ].qualified = this.qustionStatus = item.bodyParam.find(
            (item) => item.key === "status"
          ).value;
          this.tableList = [
            ...res.data.data.publiList[0].quessVOList,
            ...res.data.data.publiList[0].otherquessVOList,
          ];
        }
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    /**
     * 保存
     * params:params,
     * create by caohuimin
     * date:2020.09.09
     */
    save() {
      this.$refs.addCheckForm.validate((valid) => {
        if (valid == true) {
          let params = {
            bidUnitId: this.addCheckForm.bidUnitId,
            isMain: 1,
            isMany: 0,
            isQuestion: "0",
            otherQuestionInfo: this.$refs["addQuestion"].otherList.filter(
              (item) => item.isChecked === true
            ),
            projectId: this.projectId,
            questionInfo: [],
            leaseUnit: this.addCheckForm.leaseUnit,
            installUnit: this.addCheckForm.installUnit,
            liftNum: this.addCheckForm.liftNum,
            model: this.addCheckForm.model,
            tcode: this.code,
            token: this.token,
            userId: this.userid,
            status: "1",
            joinTime: this.addCheckForm.joinTime,
            outTime: this.addCheckForm.outTime,
            hightArea: this.addCheckForm.hightArea,
            wallRod: this.addCheckForm.wallRod,
            qualifiedUrl: this.addCheckForm.fileList,
          };
          if (this.code == "0402020307") {
            if (this.$refs["file"].fileList.length > 0) {
              params.qualifiedUrl = this.$refs["file"].fileList;
              this.addCheckForm.fileList = this.$refs["file"].fileList;
            }
          }

          let checkList = this.$refs["addQuestion"].checkList;
          let checkedArr = checkList.filter((item) => item.isChecked === true);
          params.questionInfo = checkedArr;

          if (
            params.otherQuestionInfo.length > 0 ||
            params.questionInfo.length > 0
          ) {
            params.isQuestion = "1";
            params.status = "0";
          }
          if (
            this.code == "0402020307" &&
            this.addCheckForm.fileList.length < 1
          ) {
            this.$message({ type: "error", message: "必须上传合格证" });
            return;
          }
          maintableAdd(params)
            .then((res) => {
              if (res.data.status == "0") {
                this.$router.push({
                  path: "/importantRiskTowers/detail",
                  query: {
                    id: res.data.data.tableId,
                    code: this.code,
                    action: "affirm",
                  },
                });
              } else {
                this.$message({ type: "error", message: res.data.message });
              }
            })
            .catch((error) => {});
        } else {
          this.$message({ type: "error", message: "你填写必填项" });
        }
      });
    },

    /**
     * 获取施工单位
     * params：projectId
     * create by Caohuimin
     * date:2020-9-8
     */
    async getbidUnit() {
      let params = {
        projectId: this.projectId,
        token: this.token,
        userId: this.userid,
      };
      let res = await getBuildUnit(params);
      if (res.data.status == "0") {
        this.addCheckForm.bidUnit = res.data.data[0].name;
        this.addCheckForm.bidUnitId = res.data.data[0].id;
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    /**
     * 获取下拉数据
     * params：code
     * create by YuXiong
     * date:2020-6-29
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
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>



<style scoped lang='less'>
#lift-add {
  margin: 40px;
}
.upload-demo {
  text-align: right;
}
.wrap {
  width: 100%;
  height: 400px;
  overflow-y: auto;
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
  width: 600px;
  text-align: center;
  margin-top: 60px;
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
.table {
  margin: 40px;
}
.status {
  margin-top: 20px;
  color: #606266;
}
.red {
  color: red;
}
.action-btn {
  width: 400px;
  margin: 20px auto;
}
.add-question {
  margin: 0 40px;
}
</style>