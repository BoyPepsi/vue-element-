<template>
  <div id="quality-inspect-save">
    <div class="item-select">
      <el-row class="row-item">项目名称:{{projectName}}</el-row>
      <el-row class="row-item">地下室区块:{{formInfo.bidBasementId | accordingIdFindName(filterList)}}</el-row>
      <el-row class="row-item">施工单位:{{formInfo.bidUnitId | accordingIdFindName(filterList)}}</el-row>
      <el-row class="row-item">商混供应单位:{{formInfo.mixedUnitId | accordingIdFindName(filterList)}}</el-row>
    </div>

    <div class="mixed-info-wrap">
      <mixedInfo ref="mixedInfo" :showMixedList="false" :isWall="true"></mixedInfo>
    </div>
    <div class="mixed-time">
      <el-row>
        <span class="red-span">*</span>混凝土开始时间：
        <el-date-picker
          v-model="date"
          type="datetime"
          :editable="false"
          style="width:70%"
          :disabled="dateDisabled && review !=1"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-row>
    </div>

    <el-row class="table">
      <el-table :data="mixInfoList" border>
        <el-table-column type="index" label="编号" align="center" width="200px"></el-table-column>
        <el-table-column prop="plan" label="预计方量(立方)" align="center"></el-table-column>
        <el-table-column prop="level" label="砼强度及抗渗等级" align="center"></el-table-column>
        <el-table-column prop="application" label="使用位置" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.application == '1'? '筏板':'底板'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <div class="input-list">
      <raiseInfo :raiseList="raiseList"></raiseInfo>
    </div>

    <el-row class="mined-end">
      <span class="red-span">*</span>
      <span>混凝土是否浇筑完毕:</span>
      <el-select placeholder="请选择" style="width:70%" v-model="mixedStatus">
        <el-option key="0" label="未完成" value="0"></el-option>
        <el-option key="1" label="已完成" value="1"></el-option>
      </el-select>
    </el-row>
    <div class="question-container">
      <addQuestionsNew code="04010201020502" ref="addQuestion" :showOtherPostion="false"></addQuestionsNew>
    </div>

    <div>
      <h3 class="mixed-title">实测</h3>
      <mixedImgUpload ref="mixedImgUpload"></mixedImgUpload>
    </div>

    <div class="accept-img" v-if="showAcceptance == true">
      <acceptanceImage ref="acceptanceImage"></acceptanceImage>
    </div>

    <div class="btn-box">
      <el-row class="row-item row-button">
        <el-button size="medium" type="primary" @click="save">保存</el-button>
        <el-button size="medium" @click="cancel">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { maintableList, maintableAdd, maintableUpdate } from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "acceptanceRaftRebarAdd",
  data() {
    return {
      code: "",
      projectName: "",
      projectId: "",
      formInfo: {
        bidBasementId: "",
        bidUnitId: "",
        mixedUnitId: "",
      },
      filterList: [],
      mixInfoList: [],
      foolerList: [],
      rule: {
        mixedUnit: [
          { required: true, message: "请填写供应单位", trigger: "blue" },
        ],
        bid_basement_id: [
          { required: true, message: "请选择地下室", trigger: "change" },
        ],
      },
      tableId: "",
      mainId: "",
      childId: "",
      date: "",
      dateDisabled: false,
      review: "",
      raiseList: [],
      mixedStatus: "",
      qustionStatus: "1",
      showAcceptance: true,
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;
    if (this.$route.query) {
      this.code = this.$route.query.code;
    }
    if (this.$route.query.mainId) {
      this.mainId = this.$route.query.mainId;
    }
    if (this.$route.query.tableId) {
      this.tableId = this.$route.query.tableId;
      this.getChcekedData();
    }
    if (this.$route.query.childId) {
      this.childId = this.$route.query.childId;
    }
    if (this.$route.query.review) {
      this.review = this.$route.query.review;
    }
    this.raiseList = JSON.parse(JSON.stringify(this.commonData.raiseList));
  },
  destroyed() {},
  methods: {
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
          this.filterList = res.data.data.headParam;
          this.formInfo = this.$formMap(res.data.data.headParam, this.formInfo);
          this.mixInfoList = JSON.parse(
            res.data.data.headParam.find((item) => item.key === "mixedInfo")
              .value
          );
          let date = "";
          if (
            res.data.data.headParam.find((ele) => ele.key === "mixInfoTime")
          ) {
            date = res.data.data.headParam.find(
              (ele) => ele.key === "mixInfoTime"
            ).value;
          }
          if (date.length > 0) {
            this.date = Number(date);
            this.dateDisabled = true;
          }
          let item = res.data.data.publiList[0];
          if (item.isMain !== "1") {
            this.$refs["mixedInfo"].mixedListObj.car = item.bodyParam.find(
              (ele) => ele.key === "carPumps"
            ).value;
            this.$refs["mixedInfo"].mixedListObj.earth = item.bodyParam.find(
              (ele) => ele.key === "landPumps"
            ).value;
            this.$refs["mixedInfo"].mixedListObj.shock = item.bodyParam.find(
              (ele) => ele.key === "vibrateSpear"
            ).value;
            this.$refs["mixedInfo"].mixedListObj.people = item.bodyParam.find(
              (ele) => ele.key === "people"
            ).value;
            let mixedSpace = item.bodyParam.find(
              (ele) => ele.key === "mixedSpace"
            );
            if (mixedSpace) {
              this.raiseList = JSON.parse(mixedSpace.value);
            }
            let mixedStatus = item.bodyParam.find(
              (ele) => ele.key === "mixedStatus"
            );
            if (mixedStatus) {
              this.mixedStatus = mixedStatus.value;
            }
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
            let mixedInfoReal = item.bodyParam.find(
              (ele) => ele.key === "mixedInfoReal"
            );
            if (mixedInfoReal) {
              this.$refs["mixedImgUpload"].mixedUploadList = JSON.parse(
                mixedInfoReal.value
              );
            }
            if (this.$refs["acceptanceImage"]) {
              this.$refs["acceptanceImage"].fileList = item.bodyParam.find(
                (item) => item.key === "checkInfo"
              ).fileList;
            }
          }
        }
      }
    },

    /**
     *保存
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    async save() {
      if (this.date.length === 0) {
        this.$message({ type: "error", message: "请先选择混凝土开始时间" });
        return false;
      }
      let mixedImgUploadList = this.$refs["mixedImgUpload"].mixedUploadList;
      let wordNum = 0;
      let imgNum = 0;
      mixedImgUploadList.forEach((item) => {
        if (item.content.length > 0) {
          wordNum++;
        }
        if (item.fileList.length > 0) {
          imgNum++;
        }
      });
      let fistObj = mixedImgUploadList.find((item) => item.flag.length > 0);
      if (fistObj.content.length === 0 || fistObj.fileList.length === 0) {
        this.$message({
          type: "error",
          message: "混凝土坍落度实测第一项必须填写和上传图片",
        });
        return false;
      }
      if (imgNum !== wordNum) {
        this.$message({
          type: "error",
          message: "混凝土坍落度实测输入、图片必须对应",
        });
        return false;
      }
      let status = this.$refs["addQuestion"].qualified;
      let numObj = this.$refs["mixedInfo"].mixedListObj;
      if (numObj.people.length === 0) {
        this.$message({ type: "error", message: "请填写泥工人数" });
        return false;
      }
      if (this.mixedStatus.length === 0) {
        this.$message({ type: "error", message: "请选择混凝土浇筑状态" });
        return false;
      }
      let params = {
        tcode: "040102020402",
        projectId: this.projectId,
        landPumps: numObj.earth, //地磅数量
        vibrateSpear: numObj.shock, //震动棒数量
        carPumps: numObj.car, //  汽车棒数量
        people: numObj.people, // 泥工人数
        mainId: this.mainId, // 主表id
        tableId: this.tableId,
        isMain: "0", // 主表传1
        isMany: "1", //单表传0，多表传1
        questionInfo: [],
        mixedStatus: this.mixedStatus,
        otherQuestionInfo: this.$refs["addQuestion"].otherList.filter(
          (item) => item.isChecked === true
        ),
        isQuestion: "0",
        checkInfo: this.$refs["acceptanceImage"]
          ? this.$refs["acceptanceImage"].fileList
          : [],
        status: this.$refs["addQuestion"].qualified,
        mixInfoTime: new Date(this.date).getTime(),
        mixedSpace: "",
        mixedInfoReal: mixedImgUploadList,
      };
      if (this.raiseList.length > 0) {
        this.raiseList.forEach((item, index) => {
          this.mixInfoList.forEach((ele, i) => {
            if (index === i) {
              item.level = ele.level;
            }
          });
        });
      }
      params.mixedSpace = this.raiseList;
      let checkList = this.$refs["addQuestion"].checkList;
      let checkedArr = checkList.filter((item) => item.isChecked === true);
      params.questionInfo = checkedArr;
      if (checkedArr.length > 0 || params.otherQuestionInfo.length > 0) {
        params.isQuestion = "1";
      }
      if (this.mainId.length === 0) {
        this.addFun(params);
      } else {
        params.tableList = [
          ...params.questionInfo,
          ...params.otherQuestionInfo,
        ];
        params.tableId = this.id;
        params.questionInfo = [];
        params.otherQuestionInfo = [];
        this.editFun(params);
      }
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
              path: "/acceptanceRaftConcrete/detail",
              query: {
                code: this.code,
                tableId: this.tableId,
                mainId: this.mainId,
                review: this.review,
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
            path: "/acceptanceRaftConcrete/detail",
            query: {
              code: this.code,
              tableId: this.tableId,
              mainId: this.mainId,
              review: this.review,
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
.wrap {
  width: 100%;
  height: 400px;
  overflow-y: auto;
}
.row-item {
  margin-left: 0 !important;
  margin-right: 0 !important;
  font-size: 14px;
  color: #999;
  span {
    width: 140px;
    display: inline-block;
    color: #000;
    font-size: 14px;
  }
}
.list-item {
  width: 1200px;
  margin: 40px 0 0 40px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 20px;
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
.item-select {
  width: 1200px;
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
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.mixed-info-wrap {
  width: 1200px;
  margin: 4px 0 0 40px;
  padding: 20px 0;
  border-bottom: 1px dashed #ccc;
}

/deep/ .el-input-group__prepend {
  background-color: transparent;
  border: 0;
}
/deep/ .el-form-item__label {
  text-align: left;
  width: 100px;
}
.mixed-time {
  width: 1200px;
  margin: 20px 0 0 40px;
  font-size: 14px;
  color: #999;
}
.input-list {
  margin: 20px 0 0 40px;
  width: 1200px;
  font-size: 14px;
  line-height: 60px;
  color: #999;
}
.mined-end {
  margin: 20px 0 0 40px;
  width: 1200px;
  overflow: hidden;
  font-size: 14px;
  color: #999;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 20px;
  /deep/.el-input {
    margin-left: 10px;
  }
}
.question-container {
  border-bottom: 1px dotted #ccc;
  margin: 0 40px;
  padding-bottom: 20px;
}
.mixed-title {
  margin-left: 30px;
  color: #999;
}
.accept-img {
  width: 1200px;
  margin: 40px 0 0 40px;
}
.table {
  margin: 20px 0 0 40px;
}
</style>