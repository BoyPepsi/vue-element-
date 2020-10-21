<template>
  <div id="quality-inspect-save">
    <div class="item-select">
      <el-form :model="addCheckForm" :rules="rule" ref="addCheckForm" label-width="130px">
        <el-row class="row-item">
          <el-form-item label="项目名称:">
            <el-input :disabled="true" v-model="projectName" style="width:76%"></el-input>
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
              :disabled="mainId.length > 0"
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
              :disabled="mainId.length > 0"
              class="no-down"
            >
              <el-option v-for="(item) in foolerList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row class="row-item">
          <el-form-item prop="beamNum" label="梁板楼层:">
            <el-select
              placeholder="请选择"
              style="width:76%"
              v-model="addCheckForm.beamNum"
              :disabled="mainId.length > 0"
              class="no-down"
            >
              <el-option v-for="(item) in foolerList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row class="row-item">
          <el-form-item prop="mixedUnitId" label="商混供应单位:">
            <el-select
              placeholder="请选择"
              style="width:76%"
              v-model="addCheckForm.mixedUnitId"
              :disabled="mainId.length > 0"
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
      <mixedInfo ref="mixedInfo" :showMixedList="true" :isWall="true"></mixedInfo>
    </div>
    <div class="add-auestion-wrap">
      <addQuestionsNew ref="addQuestion" code="04010201020501"></addQuestionsNew>
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
  queryBasementFloor,
  qualityCheckrebarAdd,
  baseList,
  baseListNothing,
  maintableList,
  maintableAdd,
  maintableUpdate,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "acceptanceRaftRebarAdd",
  data() {
    return {
      code: "",
      projectName: "",
      projectId: "",
      addCheckForm: {
        bidBasementId: "",
        bidUnitId: "",
        mixedUnitId: "",
        beamNum: "",
        wallNum: "",
      },
      baseMentList: [],
      unitList: [],
      foolerList: [],
      mixedUnitList: [],
      filterList: [],
      rule: {
        mixedUnitId: [
          { required: true, message: "请填写供应单位", trigger: "blue" },
        ],
        bidBasementId: [
          { required: true, message: "请选择地下室", trigger: "change" },
        ],
        beamNum: [
          { required: true, message: "请选择墙柱楼层", trigger: "change" },
        ],
        wallNum: [
          { required: true, message: "请选择梁板楼层", trigger: "change" },
        ],
      },
      mainId: "",
      tableId: "",
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
      isUpdate: "",
      showAcceptance: true,
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
    if (this.$route.query.tableId && this.$route.query.mainId) {
      this.tableId = this.$route.query.tableId;
      this.mainId = this.$route.query.mainId;
      this.getChcekedData();
    }
    if (this.$route.query.isUpdate) {
      this.isUpdate = this.$route.query.isUpdate;
    }
    if (this.$route.query.review) {
      this.review = this.$route.query.review;
    }
    this.getBaseMentList();
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    // 切换墙柱楼层
    getFool(e) {
      let i;
      for (let index in this.foolerList) {
        if (e === this.foolerList[index]) i = index - 1;
      }
      this.addCheckForm.beamNum = this.foolerList[i];
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
        pageSize: 10000,
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
      this.addCheckForm.mixedUnitId = "";
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
        mainId: this.mainId,
      };
      let res = await maintableList(params);
      if (res.data.status === "0") {
        // 头部信息处理
        this.filterList = res.data.data.headParam;
        this.addCheckForm = this.$formMap(
          res.data.data.headParam,
          this.addCheckForm
        );
        this.projectName = res.data.data.projectName;
        this.getUnitList(this.addCheckForm.bidBasementId);
        res.data.data.headParam.forEach((item) => {
          if (item.key == "mixedInfo" && item.value != "") {
            this.$refs["mixedInfo"].mixedList = eval(item.value);
          }
        });
        console.log(this.$refs["mixedInfo"].mixInfoList);

        // 混凝土信息处理
        res.data.data.publiList[0].bodyParam.forEach((item) => {
          if (item.key == "carPumps" && item.value != "") {
            this.$refs["mixedInfo"].mixedListObj.car = item.value;
          } else if (item.key == "landPumps" && item.value != "") {
            this.$refs["mixedInfo"].mixedListObj.earth = item.value;
          } else if (item.key == "vibrateSpear" && item.value != "") {
            this.$refs["mixedInfo"].mixedListObj.shock = item.value;
          } else if (item.key == "people" && item.value != "") {
            this.$refs["mixedInfo"].mixedListObj.people = item.value;
          } else if (item.key == "checkInfo" && item.value != "") {
            this.$refs["acceptanceImage"].fileList = eval(item.value);
          }
        });

        // 问题列表
        let dataObject = res.data.data.publiList[0];
        this.$refs["addQuestion"].checkedArr = dataObject.quessVOList;
        if (dataObject.otherquessVOList.length > 0) {
          dataObject.otherquessVOList.forEach((item) => {
            item.isChecked = true;
          });
          this.$refs["addQuestion"].otherList = dataObject.otherquessVOList;
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
      this.$refs.addCheckForm.validate((valid) => {
        if (valid === true) {
          let checkList = this.$refs["addQuestion"].checkList;
          let otherList = this.$refs["addQuestion"].otherList;
          let qualified = this.$refs["addQuestion"].qualified;
          let numObj = this.$refs["mixedInfo"].mixedListObj;
          let mixedInfo = this.$refs["mixedInfo"].mixedList;

          let param = {
            token: this.token,
            userid: this.userid,
            tcode: "04010201020901",
            projectId: this.projectId,
            isMain: "1",
            isMany: "1",
            isQuestion: "0", // 没问题传0,有传1

            bidBasementId: this.addCheckForm.bidBasementId, // 施工部位
            bidUnitId: this.addCheckForm.bidUnitId, // 施工单位
            mixedUnitId: this.addCheckForm.mixedUnitId, // 商混供应单位
            beamNum: this.addCheckForm.beamNum, // 梁板楼层
            wallNum: this.addCheckForm.wallNum, // 墙柱楼层
            status: qualified, // 检察意见
            mixedInfo: mixedInfo, // 商混供应信息
            carPumps: numObj.car, //  汽车泵数量
            landPumps: numObj.earth, //地泵数量
            vibrateSpear: numObj.shock, //震动棒数量
            people: numObj.people, // 泥工人数

            checkInfo: this.$refs["acceptanceImage"]
              ? this.$refs["acceptanceImage"].fileList
              : [], // 验收图片

            questionInfo: [], // 问题列表
            otherQuestionInfo: [], // 其他问题列表
          };

          if (param.people.length === 0) {
            this.$message({ type: "error", message: "请填写泥工人数" });
            return false;
          }

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
            param.tableList = [
              ...param.questionInfo,
              ...param.otherQuestionInfo,
            ];
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
        } else {
          this.$message({ type: "error", message: "请确认填写所有必填项" });
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
/deep/.el-input.is-disabled .el-input__inner {
  background-color: transparent;
  border: 0;
}
/deep/ .no-down.el-select .el-input .el-select__caret {
  display: none;
}
.mixed-info-wrap {
  width: 1200px;
  margin: 4px 0 0 60px;
  padding: 20px 0;
  border-top: 1px dashed #ccc;
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
.add-auestion-wrap {
  margin-left: 40px;
}

.accept-img {
  width: 1200px;
  margin: 40px 0 0 40px;
}
</style>