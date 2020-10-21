<template>
  <div class="item-select">
    <el-row class="row-item">项目名称:{{projectName}}</el-row>
    <el-row class="row-item">地下室区块:{{formInfo.bidBasementId | accordingIdFindName(filterList)}}</el-row>
    <el-row class="row-item">施工单位:{{formInfo.bidUnitId | accordingIdFindName(filterList)}}</el-row>
    <el-row class="row-item">商混供应单位:{{formInfo.mixedUnitId | accordingIdFindName(filterList)}}</el-row>
    <el-row class="row-item">汽车泵:{{numObj.carPumps | accordingIdFindName(numObjList)}}</el-row>
    <el-row class="row-item">地泵:{{numObj.landPumps | accordingIdFindName(numObjList)}}</el-row>
    <el-row class="row-item">震动棒:{{numObj.vibrateSpear | accordingIdFindName(numObjList)}}</el-row>
    <el-row class="row-item">泥工人数:{{numObj.people | accordingIdFindName(numObjList)}}</el-row>
    <!-- /=====================================  以上是头部信息 ===========================================/ -->

    <!-- /========================================== 主表信息===================================================/ -->
    <el-row class="mix-info">混凝土信息</el-row>
    <el-table
      :data="mixInfoList"
      border
      :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
    >
      <el-table-column prop="level" label="标号及抗渗等级" align="center"></el-table-column>
      <el-table-column prop="application" label="使用位置" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.application == '1'? '筏板':'底板'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="plan" label="预计方量(立方)" align="center"></el-table-column>
    </el-table>

    <div>
      <div class="table-title">
        <div class="word">{{tableName}}</div>
        <div v-if="isDetail == false && review == '0' && tableList.length > 0">
          <el-button @click="editMain">修改</el-button>
        </div>
      </div>
      <div class="table" v-if="tableList.length > 0">
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
              <div v-for="item in scope.row.fileList" :key="item.uid">
                <img :src="item.url" width="50" height="50" @click="previewImg(item.url)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
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

    <!-- /========================================== 子表信息===================================================/ -->
    <div class="child-list" v-for="(item) in childList" :key="item.mainId">
      <div class="table-title" style="border-top:0">
        <div class="word">{{item.codeName}}</div>
        <div v-if="isDetail == false && review == '0'">
          <el-button @click="editChild(item.mainId)">修改</el-button>
        </div>
      </div>
      <el-row>
        <p>汽车泵:{{item.carPumps}}</p>
        <p>地泵:{{item.landPumps}}</p>
        <p>振动棒:{{item.vibrateSpear}}</p>
        <p>泥工人数:{{item.people}}</p>
        <p>混凝土开始时间: {{item.mixedInfoTime | transformDate2}}</p>
        <p>提交人员: {{item.createtor}}</p>
        <p>提交时间: {{item.createTime | transformDate2}}</p>
        <p>混凝土是否已浇筑完成: {{item.mixedStatus == '0'? '未完成':'已完成' }}</p>
      </el-row>
      <el-row>
        <el-table
          :data="item.list"
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
              <div v-for="ele in scope.row.fileList" :key="ele.id">
                <img :src="ele.url" width="50" height="50" @click="priviewBigPicture(ele.url)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="status">
        <span>检查结果:{{item.status == '0'?'不合格':'合格'}}</span>
      </el-row>
      <div class="mixed-space">累计浇筑完成混凝土方量</div>

      <el-row>
        <el-table :data="item.mixedSpace" border>
          <el-table-column prop="index" label="编号" align="center"></el-table-column>
          <el-table-column prop="cumulative" label="累计浇筑方量（m³）" align="center"></el-table-column>
          <el-table-column prop="standard" label="标养" align="center"></el-table-column>
          <el-table-column prop="penetration" label="抗渗" align="center"></el-table-column>
          <el-table-column prop="condition" label="同条件" align="center"></el-table-column>
          <el-table-column prop="isCheck" label="混凝土强度低于设计要求" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.isCheck === '0'?'不合格':'合格'}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <p>混凝土坍落度实测</p>
        <el-table
          :data="item.mixedInfoReal"
          border
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column prop="content" label="描述" align="center"></el-table-column>
          <el-table-column label="图片" prop="fileList" align="center">
            <template slot-scope="scope">
              <div v-for="ele in scope.row.fileList" :key="ele.id">
                <img :src="ele.url" width="50" height="50" @click="priviewBigPicture(ele.url)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row class="infos" v-if="item.checkInfo.length > 0">
        <!-- <h3>验收信息</h3> -->
        <!-- <p>内容: {{item.allThoseMark}}</p> -->
        <p>验收图片:</p>
        <img
          @click="priviewBigPicture(img.url)"
          style="width:100px;height:100px;marginRight:20px"
          v-for="(img, index) in item.checkInfo"
          :key="index"
          :src="img.url"
          alt
        />
      </el-row>
    </div>

    <el-row class="checke-status-choice" v-if="review == 1 && ischeckMark.length == 0">
      <span>检查结果:</span>
      <el-select placeholder="请选择" v-model="checkStatus" style="width:20%">
        <el-option key="0" label="不合格" value="0"></el-option>
        <el-option key="1" label="合格" value="1"></el-option>
      </el-select>
    </el-row>

    <el-row class="checke-status-choice" v-if="ischeckMark.length > 0">
      <span>检查结果: {{checkStatus== '0'?'不合格':'合格'}}</span>
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
          @click="goToList"
          v-if="ischeckMark.length == 0 && isDetail == false && review != 1"
        >确定</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="reviewAdd"
          v-if="ischeckMark.length == 0 && isDetail == false && review == 1"
        >复核</el-button>
        <el-button
          size="medium"
          @click="checkChild"
          v-if="ischeckMark.length == 0 && isDetail == false && review != 1"
        >继续检查子表</el-button>
        <el-button
          size="medium"
          @click="cancel"
          v-if="ischeckMark.length > 0 || isDetail == true || review=='1'"
        >返回</el-button>
      </el-row>
    </div>

    <el-dialog title="图片预览" :visible.sync="showModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>
  </div>
</template>

<script>
import { maintableList, continuecheck, maintableReview } from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "acceptanceRaftRebarDetail",
  data() {
    return {
      code: "",
      projectId: "",
      projectName: "",
      formInfo: {
        bidBasementId: "",
        bidUnitId: "",
        mixedUnitId: "",
      },
      numObj: {
        landPumps: "", //地磅数量
        vibrateSpear: "", //震动棒数量
        carPumps: "", //  汽车棒数量
        people: "", // 泥工人数
      },
      numObjList: [],
      filterList: [],
      mixInfoList: [],
      tableName: "",
      tableList: [],
      questionStatus: "",
      checkPictureList: [],
      childList: [],
      tableId: "",
      tableMainId: "",
      checkMark: "",
      ischeckMark: "",
      review: "0",
      checkStatus: "",
      showModel: false,
      currentImg: "",
      isDetail: false,
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.projectId = userInfo.currProjectId;
    this.projectName = userInfo.currProjectName;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    if (this.$route.query) {
      this.code = this.$route.query.code;
    }
    if (this.$route.query.tableId) {
      this.tableId = this.$route.query.tableId;
      this.getChcekedData();
    }
    if (this.$route.query.review) {
      this.review = this.$route.query.review;
    }
    if (this.$route.query.isDetail) {
      this.isDetail = true;
    }
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
          this.numObj = this.$formMap(
            res.data.data.publiList[0].bodyParam,
            this.numObj
          );
          this.tableMainId = res.data.data.publiList[0].mainId;
          this.mixInfoList = JSON.parse(
            res.data.data.headParam.find((item) => item.key === "mixedInfo")
              .value
          );
          this.numObjList = res.data.data.publiList[0].bodyParam;
          this.tableName = res.data.data.publiList[0].codeName;
          this.tableList = [
            ...res.data.data.publiList[0].quessVOList,
            ...res.data.data.publiList[0].otherquessVOList,
          ];
          let infoList = res.data.data.publiList[0].bodyParam;
          this.questionStatus = infoList.find(
            (item) => item.key === "status"
          ).value;

          if (
            infoList.find((item) => item.key === "checkInfo") &&
            infoList.find((item) => item.key === "checkInfo").value
          ) {
            this.checkPictureList = JSON.parse(
              infoList.find((item) => item.key === "checkInfo").value
            );
          }

          //  子表信息
          let childArr = res.data.data.publiList.filter(
            (item) => item.isMain !== "1"
          );
          if (childArr.length > 0) {
            childArr.forEach((item) => {
              let obj = {};
              obj.codeName = item.codeName;
              obj.carPumps = item.bodyParam.find(
                (ele) => ele.key === "carPumps"
              ).value;
              obj.landPumps = item.bodyParam.find(
                (ele) => ele.key === "landPumps"
              ).value;
              obj.vibrateSpear = item.bodyParam.find(
                (ele) => ele.key === "vibrateSpear"
              ).value;
              obj.people = item.bodyParam.find(
                (ele) => ele.key === "people"
              ).value;
              obj.createtor = item.bodyParam.find(
                (ele) => ele.key === "createtor"
              ).value;
              obj.createTime = item.createTime;
              obj.mixedStatus = item.bodyParam.find(
                (ele) => ele.key === "mixedStatus"
              ).value;
              obj.mixedInfoTime = res.data.data.headParam.find(
                (ele) => ele.key === "mixInfoTime"
              ).value;
              obj.list = [...item.quessVOList, ...item.otherquessVOList];
              obj.status = item.bodyParam.find(
                (ele) => ele.key === "status"
              ).value;
              if (
                item.bodyParam.find((ele) => ele.key === "mixedSpace") &&
                item.bodyParam.find((ele) => ele.key === "mixedSpace").value
              ) {
                obj.mixedSpace = JSON.parse(
                  item.bodyParam.find((ele) => ele.key === "mixedSpace").value
                );
              } else {
                obj.mixedSpace = [];
              }
              if (
                item.bodyParam.find((ele) => ele.key === "mixedInfoReal") &&
                item.bodyParam.find((ele) => ele.key === "mixedInfoReal").value
              ) {
                obj.mixedInfoReal = JSON.parse(
                  item.bodyParam.find((ele) => ele.key === "mixedInfoReal")
                    .value
                );
              } else {
                obj.mixedInfoReal = [];
              }
              if (
                item.bodyParam.find((ele) => ele.key === "checkInfo") &&
                item.bodyParam.find((ele) => ele.key === "checkInfo").value
              ) {
                obj.checkInfo = JSON.parse(
                  item.bodyParam.find((ele) => ele.key === "checkInfo").value
                );
              } else {
                obj.checkInfo = [];
              }

              obj.mainId = item.mainId;
              this.childList.push(obj);
            });
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
    deleteItem(item, index) {
      this.tableList = this.tableList.filter((ele) => ele.id !== item.id);
      if (this.tableList.length === 0) {
        this.questionStatus = "1";
      }
    },

    /**
     * 删除子表某条数据
     * params：{item,index}
     * create by YuXiong
     * date:2020-7-6
     */
    deleteChildItem(item, index) {
      this.childList.forEach((ele, i) => {
        if (i === index) {
          ele.list = [
            ...ele.list.filter((listItem) => listItem.id !== item.id),
          ];
          this.$forceUpdate();
        }
      });
      this.childList.forEach((ele) => {
        if (ele.list.length === 0) {
          ele.status = "1";
        }
      });
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
     *点击确定
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    goToList() {
      this.$router.push({
        path: "/qualityInspect/mainStructureList",
      });
    },
    /**
     *修改主表
     * params:none
     * create by YuXiong
     * date:2020-7-15
     */
    editMain() {
      this.$router.push({
        path: "/acceptanceRaftConcrete/add",
        query: {
          code: this.code, // 检查分项
          tableId: this.tableId,
          mainId: this.tableMainId,
          review: this.review,
        },
      });
    },

    /**
     *修改子表
     * params:none
     * create by YuXiong
     * date:2020-7-15
     */
    editChild(id) {
      this.$router.push({
        path: "/acceptanceRaftConcreteChild/add",
        query: {
          code: this.code, // 检查分项
          tableId: this.tableId,
          mainId: id,
          review: this.review,
        },
      });
    },
    /**
     *检查子表
     * params:none
     * create by YuXiong
     * date:2020-7-15
     */
    async checkChild() {
      let params = {
        tableId: this.tableId,
      };
      let res = await continuecheck(params);
      if (res.data.data === "0") {
        this.$router.push({
          path: "/acceptanceRaftConcreteChild/add",
          query: {
            code: this.code, // 检查分项
            review: this.review,
            tableId: this.tableId,
          },
        });
      } else {
        this.$message({ type: "warning", message: res.data.message });
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
.list-item {
  width: 1200px;
  margin: 40px 0 0 40px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 20px;
  .row-item {
    margin-left: 0 !important;
    margin-right: 0 !important;
    color: #000;
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
/deep/ .el-form-item__content {
  color: #999 !important;
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
/deep/.el-input.is-disabled .el-input__inner {
  background-color: transparent;
  border: 0;
}

/deep/ .no-down.el-select .el-input .el-select__caret {
  display: none;
}
.status {
  margin: 10px 0 0 0px;
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
/deep/ .el-form-item {
  margin-bottom: 0;
}
/deep/ .el-form-item__label {
  text-align: left;
  width: 100px;
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
.table {
  margin-left: -15px;
}
.mix-info {
  font-size: 14px;
  line-height: 60px;
  color: #999;
}
.child-list {
  p {
    font-size: 14px;
    color: #999;
  }
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
.infos {
  margin-top: 30px;
  border-top: 1px dotted #ccc;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 20px;
}
.mixed-space {
  margin: 20px 0;
  font-size: 14px;
  color: #999;
}
.check-pictures {
  font-size: 14px;
  color: #999;
  margin-top: 20px;
  ul {
    overflow: hidden;
    margin: 0;
    padding: 0;
    margin-top: 20px;
    li {
      list-style: none;
      float: left;
      margin-right: 20px;
    }
  }
}
</style>