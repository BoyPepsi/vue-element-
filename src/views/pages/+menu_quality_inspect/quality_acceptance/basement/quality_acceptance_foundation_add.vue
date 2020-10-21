<!--
	筏板基础模板质量验收表
	垫层施工检查验收表
	砖模施工检查验收表
	基坑验槽检查
-->
<template>
  <div id="quality-inspect-save">
    <div class="item-select">
      <el-form :model="addCheckForm" :rules="rule" ref="addCheckForm" label-width="100px">
        <el-row class="row-item">
          <el-form-item label="项目名称:">
            <el-input :disabled="true" v-model="addCheckForm.projectName" style="width:76%"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item prop="bidBasementId" label="地下室区块:">
            <el-select
              placeholder="请选择"
              style="width:76%"
              v-model="addCheckForm.bidBasementId"
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
            <el-input
              placeholder="请选择"
              :disabled="true"
              v-model="addCheckForm.bidUnit"
              style="width:76%"
            ></el-input>
          </el-form-item>
        </el-row>

        <el-row
          class="row-item"
          v-if="(addCheckForm.code==='040102010207'||addCheckForm.code==='040102010210')"
        >
          <el-form-item prop="floorNum" label="楼层:">
            <el-select placeholder="请选择" v-model="addCheckForm.floorNum" style="width:76%">
              <el-option v-for="item in floorList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row class="row-item" v-if="addCheckForm.code==='040102010210'">
          <el-form-item prop="people" label="施工人数(人):">
            <el-input
              placeholder="请输入人数"
              maxlength="12"
              v-model="addCheckForm.people"
              style="width:76%"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="add-questions-wrap">
      <addQuestionsNew ref="addQuestion" :code="questionCode"></addQuestionsNew>
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

    <el-dialog title="图片预览" :visible.sync="showModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getDictionarieList,
  maintableList,
  qualityInspectSave,
  qualityInspectQueryunit,
  maintableAdd,
  maintableUpdate,
  qualityCheckPublicUpdate,
  qualityInspectSaveCache,
  filePut,
  baseList,
  baseListNothing,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import { getDate } from "@/utils/transformDate.js";
export default {
  name: "acceptanceFoundationAdd",
  data() {
    return {
      token: "",
      userid: "",
      id: "",
      showModel: false,
      code: "",
      review: 0,
      currentImg: "",
      questionCode: "",
      addCheckForm: {
        id: "",
        checkUrlStr: "",
        fileList: [],
        allThoseMark: "",
        checkUrl: "",
        fileName: "",
        unitName: "",
        isQuestion: "0",
        status: "",
        projectId: "",
        projectName: "",
        code: "",
        bidBasementId: "",
        bidBasementName: "",
        bidUnitId: "",
        floorNum: "",
        peopleCode: "",
        people: "",
        bidUnit: "",
      },
      floorList: [],
      questionList: [], //问题列表
      baseMentList: [], //地下室区块列表
      unitList: [], //单位列表
      checkBranchCodeList: [],
      peopleList: [],
      loadingInstance: "",
      checkedArr: [],
      loadingOptions: {
        lock: true, // 是否锁屏
        text: "正在加载...", // 加载动画的文字
        spinner: "el-icon-loading", // 引入的loading图标
        background: "rgba(0, 0, 0, 0.3)", // 背景颜色
        target: ".sub-main", // 需要遮罩的区域
        body: true,
        customClass: "mask", // 遮罩层新增类名
      },
      rule: {
        people: [{ required: true, message: "请输入人数", trigger: "change" }],
        floorNum: [
          { required: true, message: "请选择楼层", trigger: "change" },
        ],
        code: [{ required: true, message: "请输入名称", trigger: "change" }],
        bid_basement_id: [
          { required: true, message: "请选择地下室", trigger: "change" },
        ],
        bidUnitId: [
          { required: true, message: "请选择施工单位", trigger: "change" },
        ],
      },
      otherList: [
        {
          content: "",
          id: Date.parse(new Date()).toString(),
          fileList: [],
          isChecked: false,
          tPostion: "",
        },
      ],
      acceptanceInfo: true,
      timer: "",
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.addCheckForm.projectId = userInfo.currProjectId;
    this.addCheckForm.projectName = userInfo.currProjectName;
    this.questionCode = this.$route.query.code;
    this.addCheckForm.code = this.$route.query.code;

    this.getSelectList("04010101", "checkBranchCodeList");
    this.getSelectList("0301010101", "peopleList");
    this.getBaseMentList();
    if (this.$route.query.tableId) {
      this.getEchoData();
    }
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    /**
     * 获取回显数据
     * params: param
     * create by gzy
     * date: 2020-09-01
     */
    async getEchoData() {
      let param = {
        token: this.token,
        userid: this.userid,
        parentId: this.$route.query.tableId,
        mainId: this.$route.query.mainId,
        pageNum: 1,
        pageSize: 10000,
      };

      let res = await maintableList(param);
      if (res.data.status === "0") {
        if (res.data.data.headParam && res.data.data.headParam.length != 0) {
          // 头部信息处理
          this.filterList = res.data.data.headParam;
          this.addCheckForm = this.$formMap(
            res.data.data.headParam,
            this.addCheckForm
          );
          this.addCheckForm.projectName = res.data.data.projectName;
          this.projectId = res.data.data.projectId;
          this.checkMark = res.data.data.checkMark;
          res.data.data.headParam.forEach((item) => {
            if (item.key == "bidBasementId" && item.value != "") {
              this.addCheckForm.bidBasementId = item.value;
            }
            if (item.key == "bidUnitId" && item.value != "") {
              this.addCheckForm.bidUnit = item.name;
              this.addCheckForm.bidUnitId = item.value;
            }
          });
          await this.getUnitList(this.addCheckForm.bidBasementId);

          // 表格信息处理
          let dataObject = res.data.data.publiList[0];
          this.$refs["addQuestion"].checkedArr = dataObject.quessVOList;
          if (dataObject.otherquessVOList.length > 0) {
            dataObject.otherquessVOList.forEach((item) => {
              item.isChecked = true;
            });
            this.$refs["addQuestion"].otherList = dataObject.otherquessVOList;
          }

          // 底部信息处理
          res.data.data.publiList[0].bodyParam.forEach((item) => {
            if (item.key == "allThoseMark" && item.value != "") {
              this.addCheckForm.allThoseMark = item.value;
            }
            if (item.key == "checkInfo" && item.value != "") {
              this.$refs["acceptanceImage"].fileList = eval(item.value);
            }
          });
        }
      }
    },

    /**
     * 获取地下室列表
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    async getBaseMentList() {
      let params = {
        token: this.token,
        userid: this.userid,
        type: "1",
        projectid: this.addCheckForm.projectId,
        pageNum: 1,
        pageSize: 10000,
      };

      let res = await baseListNothing(params);
      if (res.data.status === "0") {
        this.baseMentList = res.data.data.list;
      } else {
        this.baseMentList = [];
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
    /**
     * 获取施工单位列表
     * params：code
     * create by YuXiong
     * date:2020-7-1
     */
    async getUnitList(bid) {
      this.unitList = [];
      let params = {
        bid: bid,
      };
      try {
        let res = await qualityInspectQueryunit(params);
        if (res.data.status === "0") {
          this.unitList = res.data.data.unitlist;
          this.floorList = res.data.data.floorlist;
          this.addCheckForm.bidUnitId = this.unitList[0].id;
          this.addCheckForm.bidUnit = this.unitList[0].name;
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this.unitList = [];
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
      this.addCheckForm.bidUnitId = "";
      this.getUnitList(id);
    },

    /**
     *保存
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    save() {
      this.$refs.addCheckForm.validate((valid) => {
        if (valid === true) {
          let checkList = this.$refs["addQuestion"].checkList;
          let otherList = this.$refs["addQuestion"].otherList;
          let qualified = this.$refs["addQuestion"].qualified;
          this.addCheckForm.status = qualified;

          let checkedArr = checkList.filter((item) => item.isChecked === true);
          this.addCheckForm.isQuestion = checkedArr.length > 0 ? "1" : "0";

          let param = {
            token: this.token,
            userid: this.userid,
            tcode: this.$route.query.code,
            projectId: this.addCheckForm.projectId,
            isMain: "1",
            isMany: "0",
            isQuestion: "0", // 没问题传0,有传1

            bidBasementId: this.addCheckForm.bidBasementId,
            status: this.addCheckForm.status,
            bidUnitId: this.addCheckForm.bidUnitId,
            floorNum: this.addCheckForm.floorNum,
            people: this.addCheckForm.people,
            checkInfo: this.$refs["acceptanceImage"]
              ? this.$refs["acceptanceImage"].fileList
              : [],

            questionInfo: [],
            otherQuestionInfo: [],
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

          if (this.$route.query.tableId) {
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
                  path: "/acceptanceFoundation/detail",
                  query: {
                    tableId: res.data.data.tableId,
                    mainId: res.data.data.mainId,
                    code: this.$route.query.code,
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
                  path: "/acceptanceFoundation/detail",
                  query: {
                    tableId: res.data.data.tableId,
                    mainId: res.data.data.mainId,
                    code: this.$route.query.code,
                  },
                });
              } else {
                this.$message({ type: "error", message: res.data.message });
              }
            });
          }
        } else {
          this.$message({ type: "error", message: "请填写必填项" });
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
  margin: 40px;
  border-top: 1px dotted #ccc;
  border-bottom: 1px dotted #ccc;
}
.add-questions-wrap {
  margin-left: 40px;
}
</style>