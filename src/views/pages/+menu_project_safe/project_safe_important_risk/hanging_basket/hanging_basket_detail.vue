<template>
  <div id="lift-detail">
    <div class="item-select">
      <el-row class="row-item">
        <span>项目名称:</span>
        {{projectName}}
      </el-row>
      <el-row class="row-item">
        <span>检查分项:</span>
        {{codeName}}
      </el-row>
      <el-row class="row-item">
        <span>施工单位:</span>
        {{addCheckForm.bidUnitId | accordingIdFindName(filterList)}}
      </el-row>
      <el-row class="row-item">
        <span>分包单位:</span>
        {{addCheckForm.subUnitId | accordingIdFindName(filterList)}}
      </el-row>
      <el-row class="row-item">
        <span>租赁单位:</span>
        {{addCheckForm.leaseUnit | accordingIdFindName(filterList)}}
      </el-row>
      <el-row class="row-item">
        <span>安装单位:</span>
        {{addCheckForm.installUnit | accordingIdFindName(filterList)}}
      </el-row>
      <el-row class="row-item">
        <span>楼栋号:</span>
        {{addCheckForm.buildId | accordingIdFindName(filterList)}}
      </el-row>
      <el-row class="row-item" v-if="code == '0402020601'">
        <span>型号:</span>
        {{addCheckForm.model | accordingIdFindName(filterList)}}
      </el-row>
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
        <el-table-column label="部位" prop="mergePostion" align="center"></el-table-column>
        <el-table-column label="检查项目" prop="codeName" align="center"></el-table-column>
        <el-table-column label="问题描述" prop="content" align="center"></el-table-column>
        <el-table-column label="规范条款" prop="tDescribe" align="center"></el-table-column>
        <el-table-column label="问题图片" prop="fileList" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.fileList" :key="item.id">
              <img :src="item.url" width="50" height="50" @click="priviewBigPicture(item.url)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="整改图片" prop="bimPicVO" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.bimPicVO" :key="item.id">
              <img :src="item" width="50" height="50" @click="priviewBigPicture(item)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="整改后图片" prop="bimUpdatePicVO" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.bimUpdatePicVO" :key="item.id">
              <img :src="item" width="50" height="50" @click="priviewBigPicture(item)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="整改状态" align="center">
          <template slot-scope="scope">{{ scope.row.bimStatus | bimStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope" v-if="scope.row.bimStatus === '1'">
            <el-button
              size="mini"
              type="text"
              class="green"
              icon="el-icon-check"
              @click="showProcess(scope.row, 'pass')"
            >整改通过</el-button>
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-close"
              @click="showProcess(scope.row, 'fail')"
            >整改未通过</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="color:#999;fontSize:14px">
        <p :data="statusId">检查结果：{{status}}</p>
      </el-row>
    </div>

    <div class="status">
      <div v-if="action == 'review'">
        <el-row class="status check-status" style="margin-left:0;padding-left:0">
          <span style="marginRight:38px;color:#999;fontSize:14px">
            <span style="color:red">*</span>复核结果:
          </span>
          <el-select placeholder=" " v-model="checkStatus" style="width:25%">
            <el-option key="0" label="不合格" value="0"></el-option>
            <el-option key="1" label="合格" value="1"></el-option>
          </el-select>
        </el-row>
        <el-row class="review" style="margin-left:0;padding-left:0">
          <el-col :span="1" style="marginRight:15px">
            <span style="color:red">*</span>复核意见
          </el-col>
          <el-col :span="10">
            <el-input type="textarea" v-model="checkMark"></el-input>
          </el-col>
        </el-row>
      </div>

      <div v-if="action == 'detail' && checkMark">
        <el-row class="status check-status" style="margin-left:0;padding-left:0">
          <span style="color:#999;fontSize:14px">复核结果:</span>
          <el-select
            :disabled="true"
            class="no-down"
            placeholder=" "
            v-model="checkStatus"
            style="width:25%"
          >
            <el-option key="0" label="不合格" value="0"></el-option>
            <el-option key="1" label="合格" value="1"></el-option>
          </el-select>
        </el-row>
        <el-row class="review" style="margin-left:0;padding-left:0">
          <span>复核意见：</span>
          {{checkMark}}
        </el-row>
      </div>
    </div>

    <el-container class="go-back">
      <el-button size="medium" type="primary" @click="goBack" v-if="action == 'detail'">返回</el-button>
      <el-button
        size="medium"
        type="primary"
        @click="gotoUpdate"
        v-if="action == 'affirm' || action == 'review'"
      >修改</el-button>
      <el-button size="medium" type="primary" @click="sure" v-if="action == 'affirm'">确定</el-button>
      <el-button v-if="action == 'review'" size="medium" type="default" @click="reviews">复核</el-button>
    </el-container>

    <el-dialog title="图片预览" :visible.sync="showModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>

    <!-- 整改弹框 -->
    <el-dialog :title="processDialogTitle" :visible.sync="processDialog" width="30%">
      <upload :isChecked="true" :fileList="processFileList" @removefileList="fileRemove"></upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processDialog = false; processFileList = [];">取 消</el-button>
        <el-button type="primary" @click="processDialogSumbit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  maintableList,
  maintableReview,
  qualityCheckEditQuestionBimStatus,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    return {
      userid: "",
      token: "",
      code: "",
      itemId: "",
      action: "",
      projectId: "",
      projectName: "",
      codeName: "",
      addCheckForm: {
        code: "",
        bidUnitId: "",
        subUnitId: "",
        leaseUnit: "",
        installUnit: "",
        liftNum: "",
        model: "",
        buildId : '',
      },
      filterList: [],
      tableList: [],
      status: "",
      statusId: "",
      checkStatus: "",
      checkMark: "",
      showModel: false,
      currentImg: "",
      processDialogTitle: "",
      processDialog: false,
      processFileList: [],
      processData: [],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    if (this.$route.query) {
      this.addCheckForm.code = this.$route.query.code;
      this.code = this.$route.query.code;
      this.itemId = this.$route.query.id;
      this.action = this.$route.query.action;
    }
    this.getData();
  },
  methods: {
    /**
     * 问题描述表格 点击整改未通过
     * params:item
     * create by gzy
     * date:2020-8-6
     */
    async processFail(item, urls) {
      let params = {
        projectId: this.projectId,
        questiondDetailId: item.id,
        bimStatus: "0",
        id: this.itemId,
        bimId: item.bimId,
        bimUpdatePic: urls,
      };

      let res = await qualityCheckEditQuestionBimStatus(params);
      if (res.data.status === "0") {
        this.getData();
        this.processDialog = false;
        this.$message({ type: "success", message: res.data.message });
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    /**
     * 问题描述表格 点击整改通过
     * params:item
     * create by gzy
     * date:2020-8-6
     */
    async processPass(item, urls) {
      let params = {
        projectId: this.projectId,
        questiondDetailId: item.id,
        bimStatus: "2",
        id: this.itemId,
        bimId: item.bimId,
        bimUpdatePic: urls,
      };

      try {
        let res = await qualityCheckEditQuestionBimStatus(params);
        if (res.data.status === "0") {
          this.getData();
          this.processDialog = false;
          this.$message({ type: "success", message: res.data.message });
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    /**
     * 操作整改图片上传弹窗 确定操作
     * params:item
     * create by gzy
     * date:2020-8-13
     */
    processDialogSumbit() {
      let urls = [];
      this.processFileList.forEach((item) => {
        urls.push(item.url);
      });
      if (urls.length != 0) {
        if (this.processDialogTitle === "整改通过") {
          this.processPass(this.processData, urls);
        } else {
          this.processFail(this.processData, urls);
        }
      } else {
        this.$message({ type: "error", message: "请选择上传图片" });
      }
    },

    /**
     * 文件移除
     * params:file,fileList
     * create by gzy
     * date:2020-8-13
     */
    fileRemove(listData) {
      this.processFileList = listData.fileList;
    },

    /**
     * 问题描述表格 点击整改操作显示弹窗
     * params:item
     * create by gzy
     * date:2020-8-13
     */
    showProcess(rowData, status) {
      this.processFileList = [];
      this.processDialog = true;
      this.processData = rowData;

      if (status === "pass") {
        this.processDialogTitle = "整改通过";
      } else {
        this.processDialogTitle = "整改未通过";
      }
    },

    // 复核
    async reviews() {
      if (this.checkStatus == "" || this.checkMark == "") {
        this.$message({ type: "error", message: "复核结果和意见不可为空！" });
        return false;
      }
      let params = {
        checkMark: this.checkMark,
        checkStatus: this.checkStatus,
        tableId: this.itemId,
        token: this.token,
        userid: this.userid,
      };
      let res = await maintableReview(params);
      if (res.data.status == "0") {
        this.$message({ type: "success", message: "复核成功" });
        this.$router.push({
          path: "/qualityCheck/risklist",
        });
      }
    },

    gotoUpdate() {
      this.$router.push({
        path: "/importantRiskHangingBasket/add",
        query: {
          code: this.code,
          id: this.itemId,
          action: "update",
        },
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
      if (res.data.status == "0") {
        if (res.data.data && res.data.data.headParam.length > 0) {
          this.filterList = res.data.data.headParam;
          this.addCheckForm = this.$formMap(
            res.data.data.headParam,
            this.addCheckForm
          );
          this.codeName = res.data.data.parentCodeName;
          this.projectName = res.data.data.projectName;
          this.projectId = res.data.data.projectId;
          this.tableList = [
            ...res.data.data.publiList[0].quessVOList,
            ...res.data.data.publiList[0].otherquessVOList,
          ];
          if (this.tableList && this.tableList.length > 0) {
            this.tableList.map((item) => {
              item.bimPicVO = JSON.parse(item.bimPic);
              item.bimUpdatePicVO = JSON.parse(item.bimUpdatePic);
            });
          }
          if (this.tableList.length > 0) {
            this.status = "不合格";
            this.statusId = "1";
            this.checkStatus = "0";
          } else {
            this.status = "合格";
            this.statusId = "0";
            this.checkStatus = "1";
          }
          if (res.data.data.checkMark) {
            this.checkStatus = res.data.data.checkStatus;
          }

          this.checkMark = res.data.data.checkMark;
        }
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },
    sure() {
      this.$router.push("/qualityCheck/risklist");
    },
    // 返回
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
  font-size: 14px;
  color: #999;
  width: 600px;
  margin: 40px 0 0 40px;
  margin-bottom: 30px;
  .row-item {
    margin-top: 20px;
    span {
      width: 100px;
      display: inline-block;
      color: #999;
      font-size: 14px;
    }
  }
}
.row-item {
  margin-left: 0 !important;
  margin-right: 0 !important;
  color: #999;
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
/deep/ .el-form-item__content {
  color: #999 !important;
}
/deep/ .el-form-item {
  margin-bottom: 0;
}
/deep/ .el-form-item__label {
  text-align: left;
  width: 100px;
}
.review {
  margin-top: 40px;
  color: #999;
  font-size: 14px;
}
.no-boder {
  background-color: transparent;
  border: 0;
  padding: 0 0 0 15px;
  margin: 20px 0 0 0;
  resize: none;
  span {
    margin-left: 15px;
  }
}
.status {
  margin: 0 40px;
}
.go-back {
  width: 200px;
  margin: 20px auto;
}
.table {
  margin: 40px;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 20px;
}
.statusInfo {
  margin-top: 20px;
  color: #606266;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 20px;
}
.red {
  color: #f00;
}
.green {
  color: green;
}
</style>