<template>
  <div class="item-select">
    <el-row class="row-item">项目名称:{{projectName}}</el-row>
    <el-row class="row-item">楼栋:{{formInfo.buildId | accordingIdFindName(filterList)}}</el-row>
    <el-row class="row-item">施工单位:{{formInfo.bidUnitId | accordingIdFindName(filterList)}}</el-row>
    <el-row
      class="row-item"
      v-if="formInfo.subUnitId.length >0"
    >分包单位:{{formInfo.subUnitId | accordingIdFindName(filterList)}}</el-row>
    <el-row class="row-item">楼层:{{formInfo.floorNum | accordingIdFindName(filterList)}}</el-row>
    <el-row
      class="row-item"
      v-if="formInfo.people >0"
    >模板木工人数:{{formInfo.people | accordingIdFindName(filterList)}}</el-row>
    <div class="table">
      <div class="table-name">{{tableName}}</div>
      <el-table
        :data="tableList"
        border
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
      >
        <el-table-column prop="mergePostion" label="部位" align="center"></el-table-column>
        <el-table-column prop="content" label="问题描述" align="center"></el-table-column>
        <el-table-column prop="tDescribe" label="规范条款" align="center"></el-table-column>
        <el-table-column label="图片" prop="fileList" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.fileList" :key="item.id">
              <img :src="item.url" width="50" height="50" @click="previewImg(item.url)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="false">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-delete"
              @click="deleteItem(scope.row)"
              v-if="isDetail == false && review == '0'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row class="status">
        <span>检查结果:{{questionStatus == '0'? '不合格':'合格'}}</span>
      </el-row>

      <el-row class="check-pictures" v-if="checkPictureList.length > 0">
        <div>验收照片</div>
        <ul>
          <li v-for="item in checkPictureList" :key="item.uid">
            <img :src="item.url" width="50" height="50" @click="previewImg(item.url)" />
          </li>
        </ul>
      </el-row>
    </div>

    <div class="measured-list" v-if="measuredList.length > 0">
      <div class="table-name">{{measuredTitle}}</div>
      <div v-for="item in measuredList" :key="item.id">
        <el-row>
          <el-col :span="12">{{item.label}}</el-col>
          <el-col :span="3">{{item.word1}}</el-col>
          <el-col :span="3">{{item.word2}}</el-col>
          <el-col :span="3">{{item.word3}}</el-col>
          <el-col :span="3">{{item.word4}}</el-col>
        </el-row>
        <el-row class="img-wrap">
          <div v-for="ele in item.fileList" :key="ele.uid" class="img-item">
            <img :src="ele.url" width="50" height="50" @click="previewImg(ele.url)" v-if="ele.url" />
          </div>
        </el-row>
      </div>

      <el-row class="status">
        <span>实测结果:{{measuredStatus==0?'不合格':'合格'}}</span>
      </el-row>
    </div>

    <el-row class="status check-status" v-if="review == 1 && ischeckMark.length == 0">
      <span>复核结果:</span>
      <el-select placeholder="请选择" v-model="checkStatus" style="width:20%">
        <el-option key="0" label="不合格" value="0"></el-option>
        <el-option key="1" label="合格" value="1"></el-option>
      </el-select>
    </el-row>

    <el-row class="checke-status-choice" v-if="ischeckMark.length > 0">
      <span>复核结果: {{checkStatus== '0'?'不合格':'合格'}}</span>
    </el-row>

    <el-row class="review" v-if="review == 1 && ischeckMark.length == 0">
      <el-col :span="4">复核意见</el-col>
      <el-col :span="10">
        <el-input type="textarea" v-model="checkMark"></el-input>
      </el-col>
    </el-row>

    <el-row class="review" v-if="ischeckMark.length > 0">
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
          @click="goToAdd"
          v-if="ischeckMark.length == 0 && isDetail == false && review != 1"
        >修改</el-button>
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

    <el-dialog title="图片预览" :visible.sync="showModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>
  </div>
</template>

<script>
import {
  qualityCheckList,
  maintableList,
  maintableUpdate,
  maintableReview,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import { getDate } from "@/utils/transformDate.js";
export default {
  name: "acceptanceRaftRebarDetail",
  data() {
    return {
      code: "",
      projectId: "",
      projectName: "",
      formInfo: {
        bidUnitId: "", //施工单位
        buildId: "",
        floorNum: "",
        people: "",
        subUnitId: "",
      },
      filterList: [],
      tableList: [],
      tableId: "",
      questionStatus: "",
      checkPictureList: [],
      measuredTitle: [],
      measuredList: [],
      measuredStatus: "",
      checkMark: "",
      ischeckMark: "",
      review: 0,
      checkStatus: "",
      showModel: false,
      currentImg: "",
      isDetail: false,
      tableName: "",
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
          this.tableName = res.data.data.publiList[0].codeName;
          this.tableList = [
            ...res.data.data.publiList[0].quessVOList,
            ...res.data.data.publiList[0].otherquessVOList,
          ];
          let infoList = res.data.data.publiList[0].bodyParam;
          this.questionStatus = infoList.find(
            (item) => item.key === "status"
          ).value;
          this.checkPictureList = infoList.find(
            (item) => item.key === "checkInfo"
          ).fileList;
          let measuredTitle = infoList.find(
            (item) => item.key === "measuredTitle"
          );
          if (measuredTitle) {
            this.measuredTitle = measuredTitle.value;
          }
          let measuredList = infoList.find((item) => item.key === "baseSpace");
          if (measuredList) {
            this.measuredList = JSON.parse(measuredList.value);
          }
          let measuredStatus = infoList.find(
            (item) => item.key === "measuredStatus"
          );
          if (measuredStatus) {
            this.measuredStatus = measuredStatus.value;
          }
        }
      }
    },

    /**
     * 删除某条数据
     * params：{item,index}
     * create by YuXiong
     * date:2020-7-6
     */
    deleteItem(item) {
      this.tableList = this.tableList.filter((ele) => ele.id !== item.id);
      if (this.tableList.length === 0) {
        this.questionStatus = "1";
      }
    },

    /**
     * 图片预览
     * params:none
     * create by YuXiong
     * date:2020-7-13
     */
    previewImg(url) {
      this.showModel = true;
      this.currentImg = url;
    },
    /**
     *保存
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    save() {
      /*   if (this.review > 0 && this.checkMark.length === 0) {
        this.$message({ type: "error", message: "复核意见必须填写!" });
        return false;
      } */
      let params = {
        projectId: this.projectId,
        tcode: this.code,
        buildId: this.formInfo.buildId,
        bidUnitId: this.formInfo.bidUnitId,
        floorNum: this.formInfo.floorNum,
        isMain: "1", // 主表传1
        isMany: "0", //单表传0
        tableId: this.tableId,
        measuredTitle: "墙柱钢筋实测项",
        isQuestion: this.tableList.length > 0 ? "1" : "0",
        tableList: this.tableList,
        checkInfo: this.checkPictureList,
        status: this.questionStatus,
        baseSpace: this.measuredList,
        measuredStatus: this.measuredStatus,
      };
      maintableUpdate(params).then((res) => {
        if (res.data.status === "0") {
          this.$message({ type: "success", message: "提交成功!" });
          this.$router.push({
            path: "/qualityInspect/mainStructureList",
          });
        } else {
          this.$message({ type: "error", message: res.data.message });
        }
      });
    },

    /**
     *复核
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    reviewAdd() {
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
     *修改
     * params:none
     * create by YuXiong
     * date:2020-7-7
     */
    goToAdd() {
      this.$router.push({
        path: "/qualityCheck/mainStructure/wallRebar/add",
        query: {
          code: this.code, // 检查分项
          tableId: this.tableId,
          review: this.review,
        },
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
      this.$router.push("/qualityCheck/list");
    },
  },
};
</script>

<style scoped lang='less'>
.red-span {
  color: #f00;
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
    font-size: 14px;
    color: #999;
    span {
      width: 140px;
      display: inline-block;
      color: #000;
      font-size: 14px;
    }
  }
}
.table {
  padding-bottom: 20px;
  border-top: 1px solid #ddd;
  margin-top: 40px;
  padding-top: 20px;
}
.table-name {
  font-size: 14px;
  margin: 20px 0;
  color: #999;
}
.status {
  margin: 10px 0 0 0px;
  color: #000;
  padding-bottom: 15px;
  span {
    font-size: 14px;
    color: #999;
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

.check-status {
  margin: 20px 0;
  span {
    margin: 10px;
  }
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
.review {
  margin-top: 40px;
  color: #999;
  font-size: 14px;
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
.imgs {
  margin-right: 15px;
}
.infos {
  padding-bottom: 20px;
  border-bottom: 1px dotted #ccc;
}
.checke-status-choice {
  margin-top: 40px;
  border-top: 1px dashed #ccc;
  padding-top: 20px;
  font-size: 14px;
  color: #999;
  span {
    margin-right: 15px;
  }
}
</style>