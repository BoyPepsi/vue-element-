<template>
  <div class="safe-basement-add">
    <div class="item-select">
      <el-form :model="addCheckForm" :rules="rule" ref="addCheckForm" label-width="140px">
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
        <el-row>
          <el-form-item label="分包单位:">
            <el-select clearable filterable placeholder="请选择" v-model="addCheckForm.subUnitId" style="width:76%">
              <el-option
                v-for="item in subUnitList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <div v-if="code == '0402030102'">
          <el-row>
          <el-form-item  label="移动吊车（台）:">
            <el-input
              v-model="addCheckForm.craneNum"
              placeholder="请输入移动吊车的数量"
              style="width:76%"
              type="number"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item  label="反铲（台）:">
            <el-input
              v-model="addCheckForm.backholNum"
              placeholder="请输入移动反铲的数量"
              style="width:76%"
              type="number"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item  label="作业人员总数(人):">
            <el-input
              v-model="addCheckForm.people"
              placeholder="请输入作业人员总数（人）"
              style="width:76%"
              type="number"
            ></el-input>
          </el-form-item>
        </el-row>
        </div>
      </el-form>
    </div>
     <div class="table">
      <el-table
        :data="tableList"
        border
        style="width: 100%"
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
      >

      <el-table-column prop="codeName" label="检查项目" class="table-column"></el-table-column>
        <el-table-column prop="tPostion" label="问题部位" class="table-column"></el-table-column>
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
      <el-row>
        <p :data="statusId">检查结果：{{status}}</p>
      </el-row>
    </div>

    <el-row class="row-item row-button">
      <el-col :span="3" style="margin-left:45px">
        <el-button size="medium" type="primary" @click="addQuestion">添加问题</el-button>
      </el-col>
    </el-row>

    <el-row>
      <div class="action-btn">
        <el-button size="medium" type="default" @click="goBack">返回</el-button>
        <el-button size="medium" type="primary" @click="save" >保存</el-button>
        <!-- <el-button size="medium" type="primary" @click="update" v-if="updateBtn">保存更新</el-button> -->
      </div>
    </el-row>

    <el-dialog title="图片预览" :visible.sync="showModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>
  </div>
</template>

<script>
import { getDictionarieList, getBuildUnit, getSubUnit,maintableQuerysecuritydata,maintableAdd} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
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
        subUnitId: "",
        craneNum: "",
        backholNum: "",
        peopleCode: "",
        people: "",
      },
      rule: {
        code: [
          { required: true, message: "请选择检查分项", trigger: "change" },
        ],
        craneNum: [
          { required: true, message: "移动吊台", trigger: "change" },
        ],
        bidUnitId: [{ required: true, message: "施工单位", trigger: "change" }],
        backholNum: [{ required: true, message: "反铲", trigger: "change" }],
        people: [{ required: true, message: "人数", trigger: "change" }],
      },
      checkBranchCodeList: [],
      subUnitList: [],
      tableList : [],
      statusId : '',
      status : '',
      showModel: false,
      currentImg: "",
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
      this.addCheckForm.code = this.$route.query.code;
    }
    let pCode = this.code.slice(0, 8);
    this.getSelectList(pCode, "checkBranchCodeList");
    this.getUnit();
    this.getSubList();

    
    this.getSecurityData();

    // 查询本地存储表单数据
    if (localStorage.getItem("SAVFORMDATA")) {
      this.addCheckForm = JSON.parse(localStorage.getItem("SAVFORMDATA"));
    }
  },
  methods: {


    // 保存
    save(){
      this.$refs.addCheckForm.validate((valid) => {
        if (valid == true){
          let questionList = [];
          let otherList = [];
          let params = {
            projectId : this.projectId,
            tcode : this.code,
            bidUnitId : this.addCheckForm.bidUnitId,
            subUnitId : this.addCheckForm.subUnitId,
            craneNum : this.addCheckForm.craneNum,
            backholNum : this.addCheckForm.backholNum,
            people : this.addCheckForm.people,
            questionInfo: [],
            otherQuestionInfo: [],
            isMain: 1, //主表
            isMany: 0, //单表
            isQuestion: "0",
            status : '1',
            token: this.token,
            userid: this.userid,
          }
          if (this.tableList && this.tableList.length > 0) {
            params.isQuestion = "1";
            params.status = "0";
          }
          this.tableList.map((item) => {
            item.codeName = item.codeName
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
                path: "/projectSecurityList",
              });
            } else {
              this.$message({ type: "error", message: res.data.message });
            }
          });
        }else{
          this.$message({ type: "error", message: "请填写必填项" });
        }
      })
    },

    // 获取缓存数据---chm---2020.09.01
    async getSecurityData() {
      let params = {
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
            } else {
              this.status = "合格";
              this.statusId == "1";
            }
          }
        } else {
          this.$message({ type: "error", message: res.data.message });
        }
      } catch (err) {
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    addQuestion(){
      this.$store.commit("SAVFORMDATA", this.addCheckForm);
      this.$router.push({
          path: "/safeDaily/addQuestion",
          query: {
            code: this.code,
          },
        });
    },
    /*
     *获取分包单位
     chm 2020.09.02 
     */
    async getSubList(){
      let params = {
        token : this.token,
        userid : this.userid
      }
      try {
        let res = await getSubUnit(params);
        if (res.data.status == '0') {
          this.subUnitList = res.data.data;
        }
      } catch (error) {
        // this.$message({ type: "error", message: res.data.message });
      }
    },

    /**
     * 获取施工单位
     * params：projectId
     * create by CaoHuimin
     * date:2020.09.02
     */
    async getUnit() {
      let params = {
        projectId: this.projectId,
      };
      try {
        let res = await getBuildUnit(params);
        if (res.data.status == "0") {
          this.addCheckForm.bidUnit = res.data.data[0].name;
          this.addCheckForm.bidUnitId = res.data.data[0].id;
        }else{
          judgeErroCode(res.data.status, res.data.message);
          this.$message({ type: "error", message: res.data.message });
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
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

    deleteItem(item) {
      this.tableList = this.tableList.filter(
        (ele) => ele.primaryId != item.primaryId
      );
      if (this.tableList) {
        if (this.tableList.length == 0) {
          this.addCheckForm.floorNum = "";
          this.status = "合格";
          this.statusId = "1";
        } else {
          this.status = "不合格";
          this.statusId = "0";
        }
      }
    },
    goBack() {
      this.$router.go(-1);
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