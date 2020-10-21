<template>
  <div id="lift-add">
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
        <el-row class="row-item">
          <el-form-item prop="buildId" label="楼栋:">
            <el-select
            :disabled="itemId.length>0"
              @change="changeBuild($event)"
              filterable
              placeholder="请选择楼栋"
              v-model="addCheckForm.buildId"
              style="width:76%"
            >
              <el-option
                v-for="item in buildingList"
                :key="item.id"
                :label="item.number"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="分包单位:">
            <el-select
              clearable
              filterable
              placeholder="请选择"
              v-model="addCheckForm.subUnitId"
              style="width:76%"
              :disabled="itemId.length>0"
            >
              <el-option
                v-for="item in subUnitList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item prop="leaseUnit" label="租赁单位:">
            <el-input
              :disabled="itemId.length>0"
              v-model="addCheckForm.leaseUnit"
              style="width:76%"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item prop="installUnit" label="安装单位:">
            <el-input
              :disabled="itemId.length>0"
              v-model="addCheckForm.installUnit"
              style="width:76%"
            ></el-input>
          </el-form-item>
        </el-row>

        <el-row class="row-item" v-if="code == '0402020601'">
          <el-form-item prop="model" label="型号:">
            <el-input :disabled="itemId.length>0" v-model="addCheckForm.model" style="width:76%"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="检查子项:" prop="childCheck">
            <el-select
            :disabled="itemId.length>0"
              placeholder="请选择"
              v-model="addCheckForm.childCheck"
              style="width:76%"
              class="no-down"
            >
              <el-option
                v-for="item in childCheckList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="add-question">
      <addQuestionsNew  :code="addCheckForm.childCheck" ref="addQuestion" :showOtherPostion="false"></addQuestionsNew>
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
  maintableAdd,
  maintableList,
  maintableUpdate,
  getBuildList,
  getQueryBuildFloor,
  childCheckCombox,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    return {
      userid: "",
      token: "",
      projectName: "",
      projectId: "",
      code: "",
      action: "",
      addCheckForm: {
        code: "",
        bidUnit: "",
        bidUnitId: "",
        subUnitId: "",
        leaseUnit: "",
        installUnit: "",
        model: "",
        buildId: "",
        childCheck: "xxx",
      },
      rule: {
        bidUnitId: [
          { required: true, message: "请选择施工单位", trigger: "change" },
        ],
        subUnitId: [
          { required: true, message: "请选择分包单位", trigger: "change" },
        ],
        buildId: [{ required: true, message: "请选择楼栋", trigger: "change" }],
        leaseUnit: [
          { required: true, message: "请填写租赁单位", trigger: "blur" },
        ],
        installUnit: [
          { required: true, message: "请填写安装单位", trigger: "blur" },
        ],
        model: [{ required: true, message: "请填写型号", trigger: "blur" }],
        childCheck: [
          {
            required: true,
            message: "请选择子项",
            trigger: "change",
          },
        ],
      },
      checkBranchCodeList: [],
      subUnitList: [],
      itemId: "",
      tableList: [],
      buildingList: [],
      childCheckList: [],
      timer: "",
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;
    this.getSelectList("04020206", "checkBranchCodeList");
    if (this.$route.query) {
      this.code = this.$route.query.code;
      this.addCheckForm.code = this.$route.query.code;
      this.action = this.$route.query.action;
    }
    this.getBuildingList();
    if (this.$route.query.id) {
      this.itemId = this.$route.query.id;
      this.getData();
    }
    this.getCheckChildList();
  },
  destroyed() {
      clearTimeout(this.timer)
  },
  methods: {
    /**
     * 修改
     * params：params
     * create by Caohuimin
     * date:2020-9-8
     */
    async update() {
      this.$refs.addCheckForm.validate((valid) => {
        if (valid == true) {
          let params = {
            bidUnitId: this.addCheckForm.bidUnitId,
            isMain: 1,
            isMany: 0,
            isQuestion: "0",
            status: "1",
            otherQuestionInfo: [],
            projectId: this.projectId,
            questionInfo: [],
            subUnitId: this.addCheckForm.subUnitId,
            buildId: this.addCheckForm.buildId,
            leaseUnit: this.addCheckForm.leaseUnit,
            installUnit: this.addCheckForm.installUnit,
            model: this.addCheckForm.model,
            tcode: this.code,
            token: this.token,
            userId: this.userid,
            tableList: this.tableList,
            tableId: this.itemId,
            childCheck: this.addCheckForm.childCheck,
          };

          let checkList = this.$refs["addQuestion"].checkList;
          let checkedArr = checkList.filter((item) => item.isChecked === true);
          let otherList = this.$refs["addQuestion"].otherList;
          let otheredArr = otherList.filter((item) => item.isChecked == true);
          
          otherList.map(item => {
            item.code = this.addCheckForm.childCheck;
          })

          if (params.childCheck == '040202060206,040202060205,040202060204,040202060203,040202060202,040202060201') {
            if (otherList.length > 0) {
              otherList.map(item => {
                item.code = this.code
              })
            }
          }
          this.tableList = [...checkedArr, ...otheredArr];
          params.tableList = this.tableList;
          if (this.tableList.length > 0) {
            params.status = '0';
            params.isQuestion = "1";
          }
          maintableUpdate(params).then((res) => {
            if (res.data.status == "0") {
              this.$message({ type: "success", message: "修改成功" });
              this.$router.push({
                path: "/importantRiskHangingBasket/detail",
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
          this.getFloorList();
          let item = res.data.data.publiList[0];
          this.timer = setTimeout(() => {
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
          }, 500);
        }
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    /**
     * 保存
     * params：params
     * create by Caohuimin
     * date:2020-9-8
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
            subUnitId: this.addCheckForm.subUnitId,
            buildId: this.addCheckForm.buildId,
            leaseUnit: this.addCheckForm.leaseUnit,
            installUnit: this.addCheckForm.installUnit,
            model: this.addCheckForm.model,
            tcode: this.code,
            token: this.token,
            userId: this.userid,
            status: "1",
            childCheck: this.addCheckForm.childCheck,
          };

          
          let checkList = this.$refs["addQuestion"].checkList;
          let checkedArr = [];
          checkList.map((item) => {
            if (item.isChecked == true) {
              item.code = item.tCode;
              checkedArr.push(item);
            }
          });
          params.questionInfo = checkedArr;
          let otherArr = [];
          let otherList = this.$refs["addQuestion"].otherList;
          otherList.map(item => {
            if (item.isChecked == true) {
              item.code = this.addCheckForm.childCheck
              otherArr.push(item);
            }
          })
          params.otherQuestionInfo = otherArr;

          if (params.childCheck == '040202060206,040202060205,040202060204,040202060203,040202060202,040202060201') {
            if (params.otherQuestionInfo.length > 0) {
              params.otherQuestionInfo.map(item => {
                item.code = this.code
              })
            }
          }
          if (
            params.otherQuestionInfo.length > 0 ||
            params.questionInfo.length > 0
          ) {
            params.status = "0";
            params.isQuestion = "1";
          }

          maintableAdd(params)
            .then((res) => {
              if (res.data.status == "0") {
                this.$message({ type: "success", message: "添加成功" });
                this.$router.push({
                  path: "/importantRiskHangingBasket/detail",
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
          this.$message({ type: "error", message: "请输入必填项" });
        }
      });
    },

    /**
     * 获取检查子项
     * params：id
     * create by YuXiong
     * date:2020-8-19
     */
    async getCheckChildList() {
      let params = {
        markStr: "全选",
        parentCode: this.code,
      };
      let res = await childCheckCombox(params);
      if (res.data.status === "0") {
        
        this.childCheckList = res.data.data;
        this.addCheckForm.childCheck = res.data.data[0].code;
      } else {
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    changeBuild() {
      this.getFloorList();
      this.addCheckForm.subUnitId = "";
    },

    // 根据楼栋获取施工单位和分包单位列表
    async getFloorList() {
      let params = {
        id: this.addCheckForm.buildId,
        kind: 2,
        pageNum: 1,
        pageSize: 10000,
        token: this.token,
        userId: this.userid,
      };
      try {
        let res = await getQueryBuildFloor(params);
        if (res.data.status == "0") {
          this.addCheckForm.bidUnitId = res.data.data.unitlist[0].id;
          this.addCheckForm.bidUnit = res.data.data.unitlist[0].name;
          this.subUnitList = res.data.data.subUnitList;
        }
      } catch (error) {
        this.$message({ type: "error", message: "获取数据异常" });
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    // 根据项目获取楼栋列表
    async getBuildingList() {
      let params = {
        pageSize: 10000,
        pageNum: 1,
        token: this.token,
        userid: this.userid,
        projectid: this.projectId,
      };
      try {
        let res = await getBuildList(params);
        if (res.data.status === "0") {
          this.buildingList = res.data.data;
        }
      } catch (error) {
        this.$message({ type: "error", message: "获取数据异常" });
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    /**
     * 获取下拉数据
     * params：code
     * create by YuXiong
     * date:2020-6-28
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