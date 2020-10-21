<template>
  <div id="quality-inspect-save">
    <div class="item-select">
      <el-form :model="addCheckForm" :rules="rule" ref="addCheckForm" label-width="100px">
        <el-row class="row-item">
          <el-form-item label="项目名称:">
            <el-input :disabled="true" v-model="projectName" style="width:76%"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item prop="bidBasementId" label="地下室区块:">
            <el-select
              placeholder="请选择"
              style="width:76%"
              v-model="addCheckForm.bidBasementId"
              :disabled="tableId.length > 0"
              @change="changeBaseMent"
            >
              <el-option
                v-for="item in baseMentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row class="row-item">
          <el-form-item prop="bidUnitId" label="施工单位:">
            <el-select
              placeholder="请选择"
              style="width:76%"
              v-model="addCheckForm.bidUnitId"
              :disabled="true"
            >
              <el-option
                v-for="item in unitList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row class="row-item">
          <el-form-item prop="checkChildCode" label="检查子项:">
            <el-select
              placeholder="请选择"
              v-model="checkChildCode"
              style="width:76%"
              :disabled="true"
            >
              <el-option
                v-for="item in checkedChildList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="add-questions-wrap">
      <addQuestionsNew
        :code="checkChildCode"
        ref="addQuestion"
        :showOtherPostion="false"
        v-if="checkChildCode.length > 0 && checkChildCode != '04010201020303' "
      ></addQuestionsNew>
      <div v-if="checkChildCode == '04010201020303'">
        <addInputList :inputLists="inputLists" ref="inputLists"></addInputList>
      </div>
    </div>

    <el-form class="info">
      <el-row>
        <h3>验收信息</h3>
      </el-row>
      <div class="accept-img">
        <acceptanceImage ref="acceptanceImage"></acceptanceImage>
      </div>
    </el-form>

    <div class="btn-box">
      <el-row class="row-item row-button">
        <el-button size="medium" type="primary" @click="save">保存</el-button>
        <el-button size="medium" @click="cancel">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  maintableRebarcheckitem,
  maintableAdd,
  maintableUpdate,
  maintableList,
  getFloorByBuild,
  getbasementList,
  getFloors,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import addQustions from "@/components/addQuestions/add_questions.vue";
export default {
  name: "acceptanceRaftRebarAdd",
  data() {
    return {
      token: "",
      userid: "",
      code: "",
      projectName: "",
      projectId: "",
      tableId: "",
      mainId: "",
      checkChildCode: "",
      addCheckForm: {
        bidBasementId: "",
        bidUnitId: "",
      },
      baseMentList: [],
      unitList: [],
      checkedChildList: [],
      rule: {
        bidBasementId: [
          { required: true, message: "请选择地下室", trigger: "change" },
        ],
        bidUnitId: [
          { required: true, message: "请选择施工单位", trigger: "change" },
        ],
      },
      inputLists: [],
      timer: "",
      review: "",
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;
    if (this.$route.query) {
      this.code = this.$route.query.code;
    }
    if (this.$route.query.tableId) {
      this.tableId = this.$route.query.tableId;
      this.getChcekedData();
    }
    if (this.$route.query.mainId) {
      this.mainId = this.$route.query.mainId;
    }
    if (this.$route.query.review) {
      this.review = this.$route.query.review;
    }
    this.getBaseMentList();
    this.getCheckStep();
    this.inputLists = JSON.parse(
      JSON.stringify(this.commonData.rafBarBaselMeasured)
    );
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    /**
     * 获取地下室列表
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    async getBaseMentList() {
      let params = {
        projectid: this.projectId,
      };
      let res = await getbasementList(params);
      if (res.data.status === "0") {
        this.baseMentList = res.data.data;
      } else {
        this.baseMentList = [];
      }
    },
    /**
     * 获取施工单位列表
     * params：code
     * create by YuXiong
     * date:2020-7-1
     */
    async getUnitList(bid) {
      this.unitList = [];
      let params = {
        baseMentId: bid,
        projectId: this.projectId,
        kind: "1",
      };
      try {
        let res = await getFloors(params);
        if (res.data.status === "0") {
          this.unitList = res.data.data.unitlist;
          this.addCheckForm.bidUnitId = this.unitList[0].id;
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this.unitList = [];
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    /**
     * 获取检查到第几项
     * params:none
     * create by YuXiong
     * date:2020-7-7
     */
    async getCheckStep() {
      let params = {
        tableId: this.tableId,
        mainId: this.mainId,
      };
      let res = await maintableRebarcheckitem(params);
      if (res.data.status === "0") {
        this.checkedChildList = res.data.data;
        this.checkChildCode = res.data.data[0].code;
      } else {
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    /**
     * 获取回选数据
     * params:none
     * create by YuXiong
     * date:2020-7-7
     */
    async getChcekedData() {
      let params = {
        pageNum: 1,
        pageSize: 100,
        parentId: this.tableId,
        mainId: this.mainId,
      };
      let res = await maintableList(params);
      if (res.data.status === "0") {
        if (res.data.data && res.data.data.headParam.length > 0) {
          this.addCheckForm = this.$formMap(
            res.data.data.headParam,
            this.addCheckForm
          );
          this.getBaseMentList();
          this.getUnitList(this.addCheckForm.bidBasementId);
          if (this.mainId.length > 0) {
            let dataObject = res.data.data.publiList[0];
            this.timer = setTimeout(() => {
              if (this.$refs["addQuestion"]) {
                this.$refs["addQuestion"].checkedArr = dataObject.quessVOList;
              }
            }, 300);

            if (dataObject.otherquessVOList.length > 0) {
              dataObject.otherquessVOList.forEach((item) => {
                item.isChecked = true;
              });
              this.$refs["addQuestion"].otherList = dataObject.otherquessVOList;
            }
            let infoList = res.data.data.publiList[0].bodyParam;

            //  验收照片---数据
            if (this.$refs["acceptanceImage"]) {
              this.$refs["acceptanceImage"].fileList = infoList.find(
                (item) => item.key === "checkInfo"
              ).fileList;
            }
            // 实测--列表
            if (infoList.find((item) => item.key === "baseSpace")) {
              this.inputLists = JSON.parse(
                infoList.find((item) => item.key === "baseSpace").value
              );
            }

            //  问题列表---数据
            if (this.$refs["addQuestion"]) {
              this.$refs[
                "addQuestion"
              ].qualified = this.qustionStatus = infoList.find(
                (item) => item.key === "status"
              ).value;
            }

            //  实测--状态
            if (
              this.$refs["inputLists"] &&
              infoList.find((item) => item.key === "measuredStatus")
            ) {
              this.$refs["inputLists"].status = infoList.find(
                (item) => item.key === "measuredStatus"
              ).value;
            }
          }
        }
      }
    },
    /**
     * 地下室列表change事件
     * params：code
     * create by YuXiong
     * date:2020-6-31
     */
    changeBaseMent(id) {
      this.addCheckForm.bidUnitId = "";
      this.getUnitList(id);
    },
    /**
     *保存
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    async save() {
      this.$refs.addCheckForm.validate((valid) => {
        if (valid === true) {
          let params = {
            projectId: this.projectId,
            tcode: this.checkChildCode,
            bidBasementId: this.addCheckForm.bidBasementId,
            bidUnitId: this.addCheckForm.bidUnitId,
            isMain: this.checkChildCode === "04010201020301" ? "1" : "0", // 主表传1
            isMany: "1", //单表传0
            questionInfo: [],
            measuredTitle: "",
            tableId: this.tableId,
            otherQuestionInfo: this.$refs["addQuestion"]
              ? this.$refs["addQuestion"].otherList.filter(
                  (item) => item.isChecked === true
                )
              : [],
            isQuestion: "0",
            checkInfo: this.$refs["acceptanceImage"]
              ? this.$refs["acceptanceImage"].fileList
              : [],
            status: this.$refs["addQuestion"]
              ? this.$refs["addQuestion"].qualified
              : "",
            baseSpace: this.$refs["inputLists"] ? this.inputLists : [],
            measuredStatus: this.$refs["inputLists"]
              ? this.$refs["inputLists"].status
              : "",
          };
          let checkList = this.$refs["addQuestion"]
            ? this.$refs["addQuestion"].checkList
            : [];
          let checkedArr = checkList.filter((item) => item.isChecked === true);
          params.questionInfo = checkedArr;
          if (checkedArr.length > 0 || params.otherQuestionInfo.length > 0) {
            params.isQuestion = "1";
          }
          //  实测至少上传N+1张图片
          if (this.$refs["inputLists"]) {
            for (let item of this.inputLists) {
              let inputLength = Object.keys(item).filter(
                (ele) => ele.indexOf("word") > -1
              ).length;
              let picLength = item.fileList.length;
              if (picLength < inputLength + 1) {
                this.$message({
                  type: "error",
                  message: `实测项每一项至少上传${inputLength + 1}张图片`,
                });
                return false;
              }
            }
          }
          if (this.mainId.length === 0) {
            this.addFun(params);
          } else {
            params.tableList = [
              ...params.questionInfo,
              ...params.otherQuestionInfo,
            ];
            params.mainId = this.mainId;
            params.questionInfo = [];
            params.otherQuestionInfo = [];
            this.editFun(params);
          }
        } else {
          this.$message({ type: "error", message: "请确认填写所有必填项" });
        }
      });
    },

    /**
     * 添加调用方法
     * params:none
     * create by YuXiong
     * date:2020-8-20
     */
    addFun(params) {
      maintableAdd(params)
        .then((res) => {
          if (res.data.status === "0") {
            this.$message({ type: "success", message: "提交成功！" });
            this.$router.push({
              path: "/acceptanceRaftRebar/detail",
              query: {
                tableId: res.data.data.tableId,
                code: this.code,
              },
            });
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch((err) => {
          this.$message({ type: "error", message: "提交失败！" });
        });
    },
    /**
     * 编辑调用方法
     * params:none
     * create by YuXiong
     * date:2020-8-20
     */
    editFun(params) {
      maintableUpdate(params).then((res) => {
        if (res.data.status === "0") {
          this.$message({ type: "success", message: "提交成功!" });
          this.$router.push({
            path: "/acceptanceRaftRebar/detail",
            query: {
              tableId: res.data.data.tableId,
              code: this.code,
            },
          });
        } else {
          this.$message({ type: "error", message: res.data.message });
        }
      });
    },
    /**
     * 点击取消，退回列表页
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang='less'>
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
.btn-box {
  height: 70px;
  box-sizing: border-box;
  padding-top: 20px;
  .row-button {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
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
.info {
  margin-left: 40px;
  margin-top: 40px;
  border-top: 1px dashed #eee;
}
.add-questions-wrap {
  width: 1200px;
  margin: 40px 0 0 40px;
}
</style>