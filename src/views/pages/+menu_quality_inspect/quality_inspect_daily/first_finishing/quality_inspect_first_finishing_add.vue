<template>
  <div id="first-finishing-add">
    <div class="item-select">
      <el-form :model="addCheckForm" :rules="rule" ref="addCheckForm" label-width="100px">
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
              filterable
              @change="changeBuild($event)"
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
        <el-row class="row-item" v-if="floorDis">
          <el-form-item prop="floorNum" label="楼层:">
            <el-select
              filterable
              placeholder="请选择楼层"
              v-model="addCheckForm.floorNum"
              style="width:76%"
            >
              <el-option
                v-for="(item, index) in floorList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row
          class="row-item"
          v-if="code == '0401010310' || code == '0401010309' || code == '0401010306'"
        >
          <el-form-item label="分包单位:" prop="subUnitId">
            <el-select
              filterable
              placeholder="请选择"
              v-model="addCheckForm.subUnitId"
              style="width:76%"
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
          <el-form-item prop="people" label="工种">
            <el-col :span="10">
              <el-select
                :disabled="true"
                placeholder="请选择工种"
                style="width:80%"
                v-model="addCheckForm.peopleCode"
              >
                <el-option
                  v-for="item in peopleList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-input
                prop="people"
                type="number"
                min="0"
                v-model="addCheckForm.people"
                style="width:43%"
              ></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row class="row-item" v-if="code == '0401010303' || code == '0401010305'">
          <el-form-item prop="peopleTwo" label="工种">
            <el-col :span="10">
              <el-select
                :disabled="true"
                placeholder="请选择工种"
                style="width:80%"
                v-model="addCheckForm.peopleCodeTwo"
              >
                <el-option
                  v-for="item in peopleList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-input
                prop="people"
                type="number"
                min="0"
                v-model="addCheckForm.peopleTwo"
                style="width:43%"
              ></el-input>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="table">
      <el-table
        :data="tableList"
        border
        max-height="460"
        style="width: 100%"
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
      >
        <el-table-column label="部位" prop="tPostion" align="center"></el-table-column>
        <el-table-column label="问题描述" prop="content" align="center"></el-table-column>
        <el-table-column label="规范条款" prop="tDescribe" align="center"></el-table-column>
        <el-table-column label="图片" prop="fileList" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.fileList" :key="item.id">
              <img :src="item.url" width="50" height="50" @click="priviewBigPicture(item.url)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-delete"
              @click="deleteItem(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="color:#999;fontSize:14px">
        <p :data="statusId">检查结果：{{status}}</p>
      </el-row>
    </div>

    <el-row class="row-item row-button">
      <el-col :span="3" style="margin-left:55px">
        <el-button size="medium" type="primary" @click="addQuestion">添加问题</el-button>
      </el-col>
    </el-row>
    <el-row>
      <div class="action-btn">
        <el-button size="medium" type="default" @click="goBack">返回</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="save"
          v-if="saveBtn"
        >保存</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="update"
          v-if="updateBtn"
        >保存更新</el-button>
      </div>
    </el-row>

    <el-dialog title="图片预览" :visible.sync="showModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getDictionarieList,
  getBuildList,
  getQueryBuildFloor,
  maintableQuerysecuritydata,
  maintableAdd,
  maintableList,
  maintableUpdate,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    return {
      projectName: "",
      projectId: "",
      code: "",
      addCheckForm: {
        code: "",
        bidUnit: "",
        buildId: "",
        bidUnitId: "",
        subUnitId: "",
        floorNum: "",
        peopleCode: "",
        people: "",
        peopleCodeTwo: "",
        peopleTwo: "",
      },
      rule: {
        code: [
          { required: true, message: "请输入检查分项", trigger: "change" },
        ],
        buildId: [{ required: true, message: "楼栋", trigger: "change" }],
        bidUnitId: [{ required: true, message: "施工单位", trigger: "change" }],
        floorNum: [{ required: true, message: "楼层", trigger: "change" }],
        people: [{ required: true, message: "工种人数", trigger: "change" }],
        peopleTwo: [{ required: true, message: "工种人数", trigger: "change" }],
      },
      checkBranchCodeList: [],
      subUnitList: [],
      floorList: [],
      buildingList: [],
      peopleList: [],
      tableList: [],
      showModel: false,
      currentImg: "",
      floorDis: true,
      statusId: "",
      status: "",
      itemId: "",
      saveBtn: true,
      updateBtn: false,
      mainId: "",
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;

    if (this.$route.query) {
      this.addCheckForm.code = this.$route.query.code;
      this.code = this.$route.query.code;
    }

    switch (this.code) {
      case "0401010301":
        this.addCheckForm.peopleCode = "030101010106";
        break;
      case "0401010302":
        this.addCheckForm.peopleCode = "030101010107";
        break;
      case "0401010303":
        this.addCheckForm.peopleCode = "030101010108";
        this.addCheckForm.peopleCodeTwo = "030101010116";
        break;
      case "0401010304":
        this.addCheckForm.peopleCode = "030101010109";
        break;
      case "0401010305":
        this.addCheckForm.peopleCode = "030101010110";
        this.addCheckForm.peopleCodeTwo = "030101010117";
        break;
      case "0401010306":
        this.addCheckForm.peopleCode = "030101010111";
        break;
      case "0401010307":
        this.addCheckForm.peopleCode = "030101010112";
        break;
      case "0401010308":
        this.addCheckForm.peopleCode = "030101010113";
        break;
      case "0401010309":
        this.addCheckForm.peopleCode = "030101010114";
        break;
      case "0401010310":
        this.addCheckForm.peopleCode = "030101010115";
        break;
    }

    this.getSelectList("04010103", "checkBranchCodeList");
    this.getSelectList("0301010101", "peopleList");
    this.getBuildingList();

    // 查询本地存储表单数据
    if (localStorage.getItem("SAVFORMDATA")) {
      this.addCheckForm = JSON.parse(localStorage.getItem("SAVFORMDATA"));
      this.getFloorList();
    }
    this.getSecurityData();

    if (this.$route.query.id) {
      this.itemId = this.$route.query.id;
      this.updateBtn = true;
      this.saveBtn = false;
      this.getData();
    }
  },
  methods: {
    // 修改
    update() {
      this.$refs.addCheckForm.validate((valid) => {
        if (valid === true) {
          let params = {
            bidUnitId: this.addCheckForm.bidUnitId,
            buildId: this.addCheckForm.buildId,
            floorNum: this.addCheckForm.floorNum,
            subUnitId: this.addCheckForm.subUnitId,
            isMain: 1, //主表
            isMany: 0, //单表
            isQuestion: "0",
            projectId: this.projectId,
            questionInfo: [],
            otherQuestionInfo: [],
            tcode: this.code,
            token: this.token,
            userid: this.userid,
            status: "1",
            peopleCode: this.addCheckForm.peopleCode,
            people: this.addCheckForm.people,
            peopleCodeTwo : this.addCheckForm.peopleCodeTwo,
            peopleTwo: this.addCheckForm.peopleTwo,
            tableList: this.tableList,
            tableId: this.itemId,
          };
          if (this.tableList.length > 0) {
            params.floorNum = "";
            params.isQuestion = "1";
            params.status = "0";
            this.floorDis = false;
            this.tableList.map((item) => {
              item.code = this.code;
              item.tCode = this.code;
            });
          }
          maintableUpdate(params).then((res) => {
            if (res.data.status == "0") {
              this.$message({ type: "success", message: "信息修改成功" });
              this.$router.push({
                path: "/qualityInspect/inspectMainStructureList",
              });
            } else {
              this.$message({ type: "error", message: res.data.message });
            }
          });
        } else {
          this.$message({ type: "error", message: "请填写必填项" });
        }
      });
    },

    // 获取回选数据
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
      if (res.data.data && res.data.data.headParam.length > 0) {
        this.addCheckForm = this.$formMap(
          res.data.data.headParam,
          this.addCheckForm
        );
        this.projectId = res.data.data.projectId;
        this.projectName = res.data.data.projectName;
        this.getBuildingList();
        this.getFloorList();
        this.mainId = res.data.data.publiList[0].mainId;
        this.getSecurityData();
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    // 保存
    save() {
      this.$refs.addCheckForm.validate((valid) => {
        if (valid === true) {
          let params = {
            bidUnitId: this.addCheckForm.bidUnitId,
            buildId: this.addCheckForm.buildId,
            floorNum: this.addCheckForm.floorNum,
            subUnitId: this.addCheckForm.subUnitId,
            isMain: 1, //主表
            isMany: 0, //单表
            isQuestion: "0",
            projectId: this.projectId,
            questionInfo: [],
            otherQuestionInfo: [],
            tcode: this.code,
            token: this.token,
            userid: this.userid,
            status: "1",
            peopleCode: this.addCheckForm.peopleCode,
            people: this.addCheckForm.people,
            peopleCodeTwo : this.addCheckForm.peopleCodeTwo,
            peopleTwo: this.addCheckForm.peopleTwo,
          };
          if (this.tableList && this.tableList.length > 0) {
            params.isQuestion = "1";
            params.status = "0";
            params.floorNum = "";
          }
          this.tableList.map((item) => {
            if (item.id.length == 13) {
              //其他问题项
              params.otherQuestionInfo.push(item);
            } else {
              //普通问题
              params.questionInfo.push(item);
            }
          });
          maintableAdd(params).then((res) => {
            if (res.data.status == "0") {
              this.$message({ type: "success", message: "提交成功" });
              this.$router.push({
                path: "/qualityInspect/inspectMainStructureList",
              });
            } else {
              this.$message({ type: "error", message: res.data.message });
            }
          });
        }
      });
    },

    // 获取缓存数据
    async getSecurityData() {
      let params = {
        mainId: this.mainId,
        token: this.token,
        userid: this.userid,
        code: this.code,
      };
      try {
        let res = await maintableQuerysecuritydata(params);
        if (res.data.status == "0") {
          if (res.data.data) {
            this.tableList = [
              ...res.data.data.quessVOList,
              ...res.data.data.otherquessVOList,
            ];
            if (this.tableList.length > 0) {
              this.status = "不合格";
              this.statusId == "0";
              this.floorDis = false;
            } else {
              this.status = "合格";
              this.statusId == "1";
              this.floorDis = true;
            }
          }
        } else {
          this.$message({ type: "error", message: res.data.message });
        }
      } catch (error) {
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    deleteItem(item) {
      this.tableList = this.tableList.filter(
        (ele) => ele.primaryId != item.primaryId
      );
      if (this.tableList) {
        if (this.tableList.length == 0) {
          this.status = "合格";
          this.statusId = "1";
          this.floorDis = true;
        } else {
          this.status = "不合格";
          this.statusId = "0";
          this.floorDis = false;
        }
      }
    },

    // 返回
    goBack() {
      // this.$router.go(-1);
      this.$router.push("/qualityInspect/inspectMainStructureList");
    },

    // 添加问题
    addQuestion() {
      if (!this.addCheckForm.buildId) {
        this.$message({ type: "error", message: "请选择楼栋" });
        return false;
      }
      this.$store.commit("SAVFORMDATA", this.addCheckForm);
      if (this.itemId) {
        this.$router.push({
          path: "/qualityInspectFirstFinishing/addQuestion",
          query: {
            code: this.code,
            mainId: this.mainId,
          },
        });
      } else {
        this.$router.push({
          path: "/qualityInspectFirstFinishing/addQuestion",
          query: {
            code: this.code,
          },
        });
      }
    },

    // 根据楼栋获取楼层
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
          this.floorList = res.data.data.floorlist;
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

    changeBuild() {
      this.getFloorList();
      this.addCheckForm.floorNum = "";
      this.addCheckForm.subUnitId = "";
    },
    /**
     * 图片预览
     * params:none
     * create by YuXiong
     * date:2020-7-13
     */
    priviewBigPicture(url) {
      this.showModel = true;
      this.currentImg = url;
    },
    /**
     * 获取下拉数据
     * params：code
     * create by CaoHuimin
     * date:2020-8-17
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
</style>