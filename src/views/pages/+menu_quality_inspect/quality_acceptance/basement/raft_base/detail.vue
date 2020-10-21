<template>
  <div class="item-select">
    <el-row class="row-item">项目名称:{{projectName}}</el-row>
    <el-row class="row-item">地下室区块:{{formInfo.bidBasementId | accordingIdFindName(filterList)}}</el-row>
    <el-row class="row-item">施工单位:{{formInfo.bidUnitId | accordingIdFindName(filterList)}}</el-row>
    <div v-if="allList.length > 0">
      <div class="table" v-for="(item) in allList" :key="item.tcode">
        <div class="table-title" style="border-top:0">
          <div class="word">{{item.codeName}}</div>
          <div v-if="isDetail == false && review == '0'">
            <el-button @click="editInfo(item)">修改</el-button>
          </div>
        </div>
        <el-table :data="item.table" border v-if="item.table.length > 0">
          <el-table-column prop="mergePostion" label="部位" align="center"></el-table-column>
          <el-table-column prop="content" label="问题描述" align="center"></el-table-column>
          <el-table-column prop="tDescribe" label="规范条款" align="center"></el-table-column>
          <el-table-column label="问题图片" prop="fileList" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.fileList" :key="item.id">
                <img :src="item.url" width="50" height="50" @click="previewImg(item.url)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改图片" prop="bimPic" align="center">
            <template slot-scope="scope" v-if="scope.row.bimPic.length > 0">
              <div v-for="item in scope.row.bimPic" :key="item.id">
                <img :src="item" width="50" height="50" @click="previewImg(item)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改后图片" prop="bimUpdatePic" align="center">
            <template slot-scope="scope" v-if="scope.row.bimUpdatePic.length > 0">
              <div v-for="item in scope.row.bimUpdatePic" :key="item.id">
                <img :src="item" width="50" height="50" @click="previewImg(item)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改状态" align="center">
            <template slot-scope="scope">{{ scope.row.bimStatus | bimStatus}}</template>
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

        <div class="measured-list" v-if="item.measuredList.length > 0">
          <div v-for="ele in item.measuredList" :key="ele.id">
            <el-row>
              <el-col :span="12">{{ele.label}}</el-col>
              <el-col :span="3">{{ele.word1}}</el-col>
              <el-col :span="3">{{ele.word2}}</el-col>
              <el-col :span="3">{{ele.word3}}</el-col>
              <el-col :span="3">{{ele.word4}}</el-col>
            </el-row>
            <el-row class="img-wrap">
              <div v-for="vm in ele.fileList" :key="vm.uid" class="img-item">
                <img :src="vm.url" width="50" height="50" @click="previewImg(vm.url)" v-if="vm.url" />
              </div>
            </el-row>
          </div>
          <el-row class="status">
            <span>实测结果:{{item.measuredStatus==0?'不合格':'合格'}}</span>
          </el-row>
        </div>

        <el-row class="status" v-if="item.questionStatus.length > 0">
          <span>检查结果:{{item.questionStatus === '0'?'不合格':'合格'}}</span>
        </el-row>
        <el-row class="check-pictures" v-if="item.checkPictureList.length > 0">
          <p>验收图片：</p>
          <ul>
            <li v-for="ele in item.checkPictureList" :key="ele.uid">
              <img :src="ele.url" width="50" height="50" @click="previewImg(ele.url)" />
            </li>
          </ul>
        </el-row>
      </div>
    </div>

    <el-row class="status check-status" v-if="review == 1 && ischeckMark.length == 0">
      <span>复核结果:</span>
      <el-select placeholder="请选择" v-model="checkStatus" style="width:20%">
        <el-option key="0" label="不合格" value="0"></el-option>
        <el-option key="1" label="合格" value="1"></el-option>
      </el-select>
    </el-row>

    <el-row class="status" v-if="ischeckMark.length > 0">
      <span>复核结果:{{checkStatus=='0'?'不合格':'合格'}}</span>
    </el-row>

    <el-row class="review" v-if="review == 1 && ischeckMark.length == 0">
      <el-col :span="4">复核意见</el-col>
      <el-col :span="10">
        <el-input type="textarea" v-model="checkMark"></el-input>
      </el-col>
    </el-row>

    <el-row class="review no-boder" v-if="ischeckMark.length > 0">
      <el-col :span="1.5">复核意见:</el-col>
      <el-col :span="10">
        <span>{{checkMark}}</span>
      </el-col>
    </el-row>

    <div class="btn-box">
      <el-row class="row-item row-button">
        <el-button
          size="medium"
          type="primary"
          @click="save"
          v-if="ischeckMark.length == 0 && isDetail == false && review != 1"
        >提交</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="reviewAdd"
          v-if="ischeckMark.length == 0 && isDetail == false && review == 1"
        >复核</el-button>
        <el-button
          size="medium"
          @click="cancel"
          v-if="ischeckMark.length > 0 || isDetail == true"
        >返回</el-button>
      </el-row>
    </div>

    <el-dialog :title="processDialogTitle" :visible.sync="processDialog" width="30%">
      <upload :isChecked="true" :fileList="processFileList" @removefileList="fileRemove"></upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processDialogHide">取 消</el-button>
        <el-button type="primary" @click="processDialogSumbit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="图片预览" :visible.sync="showModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>
  </div>
</template>

<script>
import {
  maintableList,
  qualityCheckBatchupdate,
  qualityCheckEditQuestionBimStatus, // 整改操作
  maintableReview,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "acceptanceRaftRebarDetail",
  data() {
    return {
      code: "",
      projectId: "",
      projectName: "",
      tableId: "",
      formInfo: {
        bidBasementId: "",
        bidUnitId: "",
      },
      filterList: [],
      codeName: "",
      allList: [],
      checkMark: "",
      ischeckMark: "",
      review: 0,
      checkStatus: "",
      showModel: false,
      currentImg: "",
      isDetail: false,
      processDialog: false,
      processDialogTitle: "",
      processFileList: [],
      processData: [],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.projectId = userInfo.currProjectId;
    this.projectName = userInfo.currProjectName;
    if (this.$route.query) {
      this.code = this.$route.query.code;
    }
    if (this.$route.query.tableId) {
      this.tableId = this.$route.query.tableId;
    }
    if (this.$route.query.review) {
      this.review = this.$route.query.review;
    }
    if (this.$route.query.isDetail) {
      this.isDetail = true;
    }
    this.getChcekedData();
  },
  methods: {
    previewImg(url) {
      this.showModel = true;
      this.currentImg = url;
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
      };
      let res = await maintableList(params);
      if (res.data.status === "0") {
        if (res.data.data && res.data.data.headParam.length > 0) {
          this.checkStatus = res.data.data.checkStatus;
          this.checkMark = res.data.data.checkMark;
          this.ischeckMark = res.data.data.checkMark;
          this.filterList = res.data.data.headParam;
          this.formInfo = this.$formMap(res.data.data.headParam, this.formInfo);
          this.codeName = res.data.data.publiList[0].codeName;
          this.allList = [];
          res.data.data.publiList.forEach((item) => {
            let obj = {};
            obj.mainId = item.mainId;
            obj.codeName = item.codeName;
            obj.table = [...item.quessVOList, ...item.otherquessVOList];
            let infoList = item.bodyParam;
            if (obj.table.length > 0) {
              obj.table.forEach((ele) => {
                ele.bimPic = JSON.parse(ele.bimPic);
                ele.bimUpdatePic = JSON.parse(ele.bimUpdatePic);
              });
            }
            if (infoList.find((item) => item.key === "status")) {
              obj.questionStatus = infoList.find(
                (item) => item.key === "status"
              ).value;
            } else {
              obj.questionStatus = "";
            }

            if (infoList.find((item) => item.key === "checkInfo")) {
              obj.checkPictureList = infoList.find(
                (item) => item.key === "checkInfo"
              ).fileList;
            } else {
              obj.checkPictureList = [];
            }

            let measuredList = infoList.find(
              (item) => item.key === "baseSpace"
            );
            if (measuredList) {
              obj.measuredList = JSON.parse(measuredList.value);
            } else {
              obj.measuredList = [];
            }
            let measuredStatus = infoList.find(
              (item) => item.key === "measuredStatus"
            );
            if (measuredStatus) {
              obj.measuredStatus = measuredStatus.value;
            } else {
              obj.measuredStatus = "";
            }
            this.allList.push(obj);
          });
        }
      }
    },

    /**
     * 问题描述表格 点击整改操作显示弹窗
     * params:item
     * create by gzy
     * date:2020-8-13
     */
    showProcess(rowData, status) {
      this.processDialog = true;
      this.processData = rowData;
      if (status === "pass") {
        this.processDialogTitle = "整改通过";
      } else {
        this.processDialogTitle = "整改未通过";
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
      if (this.processDialogTitle === "整改通过") {
        this.processPass(this.processData, urls);
      } else {
        this.processFail(this.processData, urls);
      }
    },
    /**
     * 操作整改图片上传弹窗 取消操作
     * params:item
     * create by gzy
     * date:2020-8-13
     */
    processDialogHide() {
      this.processDialog = false;
      this.processFileList = [];
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
     * 问题描述表格 点击整改通过
     * params:item
     * create by gzy
     * date:2020-8-6
     */
    async processPass(item, urls) {
      let params = {
        projectId: this.listData.qualityTableMainBasePO.projectId,
        questiondDetailId: item.id,
        bimStatus: "2",
        id: this.listData.qualityTableMainBasePO.id,
        bimId: item.bimId,
        bimUpdatePic: urls,
      };

      try {
        let res = await qualityCheckEditQuestionBimStatus(params);
        if (res.data.status === "0") {
          this.getChcekedData();
          this.processDialog = false;
          this.$message({ type: "success", message: res.data.message });
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },
    /**
     * 问题描述表格 点击整改未通过
     * params:item
     * create by gzy
     * date:2020-8-6
     */
    async processFail(item, urls) {
      let params = {
        projectId: this.listData.qualityTableMainBasePO.projectId,
        questiondDetailId: item.id,
        bimStatus: "0",
        id: this.listData.qualityTableMainBasePO.id,
        bimId: item.bimId,
        bimUpdatePic: urls,
      };
      try {
        let res = await qualityCheckEditQuestionBimStatus(params);
        if (res.data.status === "0") {
          this.getChcekedData();
          this.processDialog = false;
          this.$message({ type: "success", message: res.data.message });
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },
    /**
     * 修改某条检查表数据
     * params:item
     * create by YuXiong
     * date:2020-8-6
     */
    editInfo(item) {
      this.$router.push({
        path: "/acceptanceRaftRebar/add",
        query: {
          tableId: this.tableId,
          mainId: item.mainId,
          review: this.review,
        },
      });
    },
    /**
     *保存
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    save() {
      this.$router.push({
        path: "/qualityInspect/mainStructureList",
      });
    },

    /**
     *复核
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    reviewAdd() {
      if (this.checkStatus == "") {
        this.$message({ type: "error", message: "复核结果必须选择!" });
        return false;
      }
      if (this.review > 0 && this.checkMark.length === 0) {
        this.$message({ type: "error", message: "复核意见必须填写!" });
        return false;
      }
      let params = {
        checkMark: this.checkMark,
        tableId: this.tableId,
        checkStatus: this.checkStatus,
      };
      maintableReview(params).then((res) => {
        if (res.data.status === "0") {
          this.$message({ type: "success", message: "提交成功!" });
          this.$router.push({
            path: "/qualityInspect/mainStructureList",
          });
        } else {
          this.$message({ type: "warning", message: res.data.message });
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

.row-item {
  margin-top: 20px;
  font-size: 14px;
  color: #999;
  span {
    width: 140px;
    display: inline-block;
    color: #000;
    font-size: 14px;
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
  margin: 40px 0 40px 40px;
  .row-item {
    margin-top: 20px;
    span {
      width: 140px;
      display: inline-block;
      color: #000;
      font-size: 14px;
    }
  }
}
/deep/.el-input.is-disabled .el-input__inner {
  background-color: transparent;
  border: 0;
}

/deep/ .no-down.el-select .el-input .el-select__caret {
  display: none;
}
.status {
  margin: 10px 0 0 10px;
  color: #000;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 15px;
  span {
    font-size: 14px;
    color: #999;
  }
}
.check-status {
  margin: 20px 0;
  span {
    margin: 10px;
  }
}
.input-list {
  width: 1200px;
  color: #999;
  margin-left: 10px;
  font-size: 14px;
  .img-wrap {
    margin-top: 20px;
  }
}
.review {
  margin-top: 40px;
  color: #999;
  font-size: 14px;
}
.title {
  /deep/ .el-input.is-disabled .el-input__inner {
    color: #409eff;
    font-size: 16px;
  }
}
.red {
  color: #f00;
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
.img-item {
  float: left;
  margin-left: 20px;
  padding-bottom: 10px;
}
.imgs {
  margin-right: 15px;
}
.infos {
  padding-bottom: 20px;
  border-bottom: 1px dotted #ccc;
}
.measured-list {
  width: 1200px;
  color: #999;
  font-size: 14px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  .img-wrap {
    margin-top: 20px;
  }
  .img-item {
    float: left;
    margin-right: 20px;
    padding-bottom: 10px;
  }
}
.check-pictures {
  font-size: 14px;
  color: #999;
  ul {
    margin-top: 10px;
    width: 100%;
    overflow: hidden;
    li {
      float: left;
      margin-right: 20px;
    }
  }
  ul,
  li {
    list-style: none;
    padding: 0;
  }
}
.table-title {
  height: 60px;
  display: flex;
  justify-content: space-between;
  margin: 20px 0 10px 0;
  border-top: 1px dashed #ccc;
  padding-top: 20px;
  .word {
    font-size: 18px;
    color: #333;
    border-left: 5px solid #409eff;
    padding-left: 10px;
    font-weight: normal;
    height: 30px;
    line-height: 30px;
  }
}
</style>
