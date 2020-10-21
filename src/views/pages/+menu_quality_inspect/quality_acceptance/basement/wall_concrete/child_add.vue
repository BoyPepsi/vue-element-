<template>
  <div id="quality-inspect-save">
    <div class="item-select">
      <el-form :model="addCheckForm" :rules="rule" ref="addCheckForm" label-width="130px">
        <el-row class="row-item">
          <el-form-item label="项目名称:">
            <el-input :disabled="true" v-model="projectName" style="width:76%" class="no-down"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="施工单位:">
            <el-select
              placeholder
              v-model="addCheckForm.bidUnitId"
              style="width:76%"
              :disabled="true"
              class="no-down"
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
          <el-form-item prop="bidBasementId" label="施工部位:">
            <el-select
              placeholder="请选择"
              style="width:76%"
              v-model="addCheckForm.bidBasementId"
              :disabled="true"
              @change="changeBaseMent"
              class="no-down"
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
          <el-form-item prop="wallNum" label="墙柱楼层:">
            <el-select
              placeholder="请选择"
              style="width:76%"
              v-model="addCheckForm.wallNum"
              :disabled="true"
              class="no-down"
            >
              <el-option v-for="item in foolerList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row class="row-item">
          <el-form-item prop="beamNum" label="梁板楼层:">
            <el-select
              placeholder="请选择"
              style="width:76%"
              v-model="addCheckForm.beamNum"
              :disabled="true"
              class="no-down"
            >
              <el-option v-for="item in foolerList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row class="row-item">
          <el-form-item prop="mixedUnit" label="商混供应单位:">
            <el-select
              placeholder="请选择"
              style="width:76%"
              v-model="addCheckForm.mixedUnitId"
              :disabled="tableId.length > 0"
              class="no-down"
            >
              <el-option
                v-for="(item) in mixedUnitList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="mixed-info-wrap">
      <mixedInfo ref="mixedInfo" :showMixedList="false" :isWall="true"></mixedInfo>
    </div>

    <div class="mixed-time">
      <el-row>
        <span style="color:red">*</span>混凝土开始时间：
        <el-date-picker
          v-model="addCheckForm.mixInfoTime"
          type="datetime"
          :editable="false"
          style="width:70%"
          :disabled="dateDisabled && review !=1"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-row>
      <el-row class="table">
        <el-table
          :data="mixInfoList"
          border
          style="width: 100% ;margin-left:15px"
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column type="index" label="编号" align="center" width="200px"></el-table-column>
          <el-table-column prop="level" label="砼强度及抗渗等级" align="center"></el-table-column>
          <el-table-column prop="application" label="使用位置" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.application == '1'? '墙柱':'梁板'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="plan" label="预计方量(立方)" align="center"></el-table-column>
        </el-table>
      </el-row>
    </div>

    <div class="input-list">
      <el-row v-for="item in addCheckForm.mixedSpace" :key="item.index">
        <el-col :span="1">{{item.index}}</el-col>
        <el-col :span="5">
          <el-input v-model="item.cumulative">
            <template slot="prepend">累计浇筑方量（m3）:</template>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-input v-model="item.label1">
            <template slot="prepend">标养:</template>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-input v-model="item.label2">
            <template slot="prepend">抗渗:</template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="item.label3">
            <template slot="prepend">同条件:</template>
          </el-input>
        </el-col>
        <el-col :span="6" class="right">
          <span>混凝土强度低于设计要求:</span>
          <el-select placeholder="请选择" v-model="item.isCheck">
            <el-option key="0" label="不合格" value="0"></el-option>
            <el-option key="1" label="合格" value="1"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <el-row class="mined-end">
      <span>
        <span style="color:red">*</span>混凝土是否浇筑完毕:
      </span>
      <el-select placeholder="请选择" style="width:70%" v-model="addCheckForm.mixedStatus">
        <el-option key="0" label="未完成" value="0"></el-option>
        <el-option key="1" label="已完成" value="1"></el-option>
      </el-select>
    </el-row>
    <div class="question-container">
      <addQuestionsNew ref="addQuestion" code="04010201020501"></addQuestionsNew>
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
import {
  qualityInspectQueryunit,
  queryBasementFloor,
  baseList,
  baseListNothing,
  maintableList,
  maintableAdd,
  maintableUpdate,
  qualityChecBaseBetonquery,
  filePut,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "acceptanceRaftRebarAdd",
  data() {
    return {
      code: "",
      projectName: "",
      projectId: "",
      userid: "",
      token: "",
      userName: "",
      addCheckForm: {
        bidBasementId: "",
        bidUnitId: "",
        mixedUnitId: "",
        beamNum: "",
        wallNum: "",
        fileList: [],
        allThoseMark: "",
        mixInfoTime: "",
        mixedStatus: "",
        mixedSpace: [
          {
            index: "1号",
            label1: "",
            label2: "",
            label3: "",
            standard: "",
            isCheck: "1",
          },
          {
            index: "2号",
            label1: "",
            label2: "",
            label3: "",
            standard: "",
            isCheck: "1",
          },
          {
            index: "3号",
            label1: "",
            label2: "",
            label3: "",
            standard: "",
            isCheck: "1",
          },
        ],
      },
      baseMentList: [],
      unitList: [],
      mixInfoList: [],
      foolerList: [],
      mixedUnitList: [],
      rule: {
        mixedUnit: [
          { required: true, message: "请填写供应单位", trigger: "blue" },
        ],
        bidBasementId: [
          { required: true, message: "请选择地下室", trigger: "change" },
        ],
      },
      tableId: "",
      childId: "",
      basePid: "",
      date: "",
      dateDisabled: false,
      checkedArr: [], // 问题选中的列表，做回显
      timer: "",
      review: "",
      otherList: [
        {
          content: "",
          id: Date.parse(new Date()).toString(),
          fileList: [],
          isChecked: false,
          tPostion: "",
        },
      ],
      mixedStatus: "",
      isUpdate: "",
      loadingInstance: "",
      showAcceptance: true,
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userName = userInfo.name;
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    if (this.$route.query) {
      this.code = this.$route.query.code;
    }
    if (this.$route.query.tableId) {
      this.tableId = this.$route.query.tableId;
    }
    // if (this.$route.query.mainId) {
    //   this.mainId = this.$route.query.mainId;
    // }
    if (this.$route.query.isUpdate) {
      this.isUpdate = this.$route.query.isUpdate;
    }
    if (this.$route.query.review) {
      this.review = this.$route.query.review;
    }
    this.getChcekedData();
    this.getBaseMentList();
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    showAcceptanceBtn(value) {
      // @isQualified="showAcceptanceBtn"
      this.showAcceptanceUploadImg = value;
      this.addCheckForm.fileList = [];
    },
    /**
     * params:file
     * create by YuXiong
     * date:2020-7-13
     */
    previewImg(file) {
      this.showModel = true;
      this.currentImg = file.url;
    },

    acceptFile(file) {
      var FileExt = file.name.replace(/.+\./, "");
      if (["jpg", "png", "gif", "jpeg"].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message({
          type: "warning",
          message: "请上传后缀名为jpg、png、gif或jpeg的文件！",
        });
        return false;
      }
    },

    /**
     * 文件移除
     * params:file,fileList
     * create by YuXiong
     * date:2020-7-13
     */
    fileRemove(file, fileList) {
      this.addCheckForm.fileList = fileList;
    },

    /**
     * 文件转为base64
     * params:event,file,fileList
     * create by YuXiong
     * date:2020-7-13
     */
    async fileGet(file, fileList) {
      this.loadingInstance = this.$loading(this.loadingOptions);
      let res = await this.getBase64(file.raw);
      let fileStr = res.split("base64,")[1];
      let fileName = file.name;
      let params = {
        fileName: [fileName],
        fileStr: [fileStr],
      };
      this.fileUploadFun(params);
    },

    fileUploadFun(params) {
      filePut(params).then((fileResult) => {
        if (fileResult.data.status === "0") {
          let obj = {};
          obj.name = fileResult.data.data.fileNames[0];
          obj.url = fileResult.data.data.urls[0];
          this.addCheckForm.fileList.push(obj);
          this.addCheckForm.fileList = this.removeDuplicatedItem(
            this.addCheckForm.fileList
          );
        }
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          this.loadingInstance.close();
        });
      });
    },

    removeDuplicatedItem(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].url == arr[j].url) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    },

    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function (ev) {
          imgResult = ev.target.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },

    /**
     * 获取地下室列表
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    async getBaseMentList() {
      let params = {
        pageNum: 1,
        pageSize: 100,
        projectid: this.projectId,
        type: "1",
      };
      // let res = await baseList(params);
      let res = await baseListNothing(params);
      if (res.data.status === "0") {
        this.baseMentList = res.data.data.list;
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
        kind: "1",
        projectId: this.projectId,
      };
      try {
        let res = await queryBasementFloor(params);
        if (res.data.status === "0") {
          this.unitList = res.data.data.unitlist;
          this.foolerList = res.data.data.floorlist;
          this.mixedUnitList = res.data.data.mixnUnitList;
          this.addCheckForm.bidUnitId = res.data.data.unitlist[0].id;
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this.unitList = [];
          this.foolerList = [];
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },
    /**
     * 地下室列表change事件
     * params：code
     * create by YuXiong
     * date:2020-6-31
     */
    changeBaseMent(id) {
      this.addCheckForm.bid = "";
      this.addCheckForm.beamNum = "";
      this.addCheckForm.wallNum = "";
      this.getUnitList(id);
    },
    /**
     * 其他选项删除事件
     * params:id
     * create by YuXiong
     * date:2020-7-15
     */
    removeOtherList(id) {
      this.otherList = this.otherList.filter((item) => item.id != id);
    },
    /**
     * 其他选项添加事件
     * params:id
     * create by YuXiong
     * date:2020-7-15
     */
    getOtherList(data) {
      this.otherList = [...data, ...this.otherList];
    },
    /**
     * 获取回选数据
     * params:none
     * create by YuXiong
     * date:2020-7-7
     */
    async getChcekedData() {
      let params = {
        token: this.token,
        userid: this.userid,
        pageNum: 1,
        pageSize: 100,
        parentId: this.tableId,
      };

      if (this.$route.query.mainId) {
        params.mainId = this.$route.query.mainId;
      }
      let res = await maintableList(params);
      if (res.data.status === "0") {
        // 头部信息处理
        this.filterList = res.data.data.headParam;
        this.addCheckForm = this.$formMap(
          res.data.data.headParam,
          this.addCheckForm
        );
        res.data.data.headParam.forEach((item) => {
          if (item.key == "mixedInfo" && item.value != "") {
            this.mixInfoList = eval(item.value);
          } else if (item.key == "mixInfoTime" && item.value != "") {
            this.addCheckForm.mixInfoTime = Number(item.value);
            this.dateDisabled = true;
          }
        });
        this.mixInfoList.forEach((item, index) => {
          this.addCheckForm.mixedSpace.forEach((ele, i) => {
            if (index === i) {
              ele.level = item.level;
            }
          });
        });
        this.projectName = res.data.data.projectName;
        await this.getUnitList(this.addCheckForm.bidBasementId);

        if (this.$route.query.mainId) {
          // 汽车泵处理
          res.data.data.publiList[0].bodyParam.forEach((item) => {
            if (item.key == "carPumps" && item.value != "") {
              this.$refs["mixedInfo"].mixedListObj.car = item.value;
            } else if (item.key == "landPumps" && item.value != "") {
              this.$refs["mixedInfo"].mixedListObj.earth = item.value;
            } else if (item.key == "vibrateSpear" && item.value != "") {
              this.$refs["mixedInfo"].mixedListObj.shock = item.value;
            } else if (item.key == "people" && item.value != "") {
              this.$refs["mixedInfo"].mixedListObj.people = item.value;
            } else if (item.key == "mixInfoTime" && item.value != "") {
              this.addCheckForm.mixInfoTime = Number(item.value);
            } else if (item.key == "mixedSpace" && item.value != "") {
              this.addCheckForm.mixedSpace = eval(item.value);
            } else if (item.key == "mixedStatus" && item.value != "") {
              this.addCheckForm.mixedStatus = item.value;
            } else if (item.key == "mixedInfoReal" && item.value != "") {
              this.$refs["mixedImgUpload"].mixedUploadList = eval(item.value);
            } else if (item.key == "allThoseMark" && item.value != "") {
              this.addCheckForm.allThoseMark = item.value;
            } else if (item.key == "checkInfo" && item.value != "") {
              this.addCheckForm.fileList = eval(item.value);
            }
          });

          // 表格信息处理
          let dataObject = res.data.data.publiList[0];
          this.$refs["addQuestion"].checkedArr = dataObject.quessVOList;
          if (dataObject.otherquessVOList.length > 0) {
            dataObject.otherquessVOList.forEach((item) => {
              item.isChecked = true;
            });
            this.$refs["addQuestion"].otherList = dataObject.otherquessVOList;
          }
          if (this.$refs["acceptanceImage"]) {
            this.$refs["acceptanceImage"].fileList = item.bodyParam.find(
              (item) => item.key === "checkInfo"
            ).fileList;
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
      if (this.addCheckForm.mixInfoTime.length === 0) {
        this.$message({ type: "error", message: "请选择混凝土开始时间" });
        return false;
      }
      if (this.addCheckForm.mixedStatus == "") {
        this.$message({ type: "error", message: "请选择混凝土是否浇筑完成" });
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

      let checkList = this.$refs["addQuestion"].checkList;
      let otherList = this.$refs["addQuestion"].otherList;
      let qualified = this.$refs["addQuestion"].qualified;
      let numObj = this.$refs["mixedInfo"].mixedListObj;
      if (numObj.people.length === 0) {
        this.$message({ type: "error", message: "请填写泥工人数" });
        return false;
      }
      let param = {
        token: this.token,
        userid: this.userid,
        tcode: "04010201020902",
        projectId: this.projectId,
        isMain: "0",
        isMany: "1",
        isQuestion: "0", // 没问题传0,有传1
        tableId: this.tableId,

        mixInfoTime: new Date(this.addCheckForm.mixInfoTime).getTime(), // 时间
        mixedInfoReal: mixedImgUploadList, // 混凝土实测信息
        mixedSpace: this.addCheckForm.mixedSpace,
        mixedStatus: this.addCheckForm.mixedStatus,

        mixedInfo: this.mixInfoList, // 混凝土信息

        isChild: true,
        bidBasementId: this.addCheckForm.bidBasementId,
        bidUnitId: this.addCheckForm.bidUnitId,
        mixedUnit: this.addCheckForm.mixedUnit,
        wallNum: this.addCheckForm.wallNum,
        beamNum: this.addCheckForm.beamNum,
        isUpdate: this.isUpdate,
        id: "",
        status: qualified,
        carPumps: numObj.car, //  汽车泵数量
        landPumps: numObj.earth, //地泵数量
        vibrateSpear: numObj.shock, //震动棒数量
        people: numObj.people, // 泥工人数
        createtor: this.userName, // 提交人
        checkInfo: this.$refs["acceptanceImage"]
          ? this.$refs["acceptanceImage"].fileList
          : [],
        allThoseMark: this.addCheckForm.allThoseMark,

        questionInfo: [], // 问题列表
        otherQuestionInfo: [], // 其他问题列表
      };

      param.questionInfo = checkList.filter((item) => {
        if (item.isChecked) {
          param.isQuestion = "1";
        }
        return item.isChecked == true;
      });

      param.otherQuestionInfo = otherList.filter((item) => {
        if (item.isChecked) {
          param.isQuestion = "1";
        }
        return item.isChecked == true;
      });

      if (this.$route.query.mainId) {
        param.mainId = this.$route.query.mainId;
        param.tableId = this.$route.query.tableId;
        param.tableList = [...param.questionInfo, ...param.otherQuestionInfo];
        param.questionInfo = [];
        param.otherQuestionInfo = [];
        maintableUpdate(param).then((res) => {
          if (res.data.status === "0") {
            this.$router.push({
              path: "/acceptanceWallConcrete/detail",
              query: {
                tableId: res.data.data.tableId,
                mainId: res.data.data.mainId,
              },
            });
          } else {
            this.$message({ type: "error", message: res.data.message });
          }
        });
      } else {
        maintableAdd(param).then((res) => {
          if (res.data.status === "0") {
            this.$router.push({
              path: "/acceptanceWallConcrete/detail",
              query: {
                tableId: res.data.data.tableId,
                mainId: res.data.data.mainId,
              },
            });
          } else {
            this.$message({ type: "error", message: res.data.message });
          }
        });
      }
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
  width: 1200px;
  margin: 40px 0 0 60px;
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
.no-down {
  /deep/.el-input.is-disabled .el-input__inner {
    background-color: transparent;
    border: 0;
  }
  /deep/.el-input__inner {
    background-color: transparent;
    border: 0;
  }
}

/deep/ .no-down.el-select .el-input .el-select__caret {
  display: none;
}
.mixed-info-wrap {
  width: 1200px;
  margin: 4px 0 0 60px;
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
  margin: 20px 0 0 60px;
  font-size: 14px;
  color: #999;
}
.input-list {
  margin: 20px 0 0 60px;
  width: 1200px;
  font-size: 14px;
  line-height: 60px;
  color: #999;
  /deep/ .el-select {
    margin-left: 15px;
    .el-input__inner {
      width: 90px;
    }
  }
  .right {
    text-align: right;
  }
}
.table {
  margin: 20px 0 0 -15px;
}
.mined-end {
  margin: 20px 0 0 60px;
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
.upload-pic {
  margin-left: 40px;
}

.accept-img {
  width: 1200px;
  margin: 40px 0 0 40px;
}
</style>