<!--
	筏板基础模板质量验收表
	垫层施工检查验收表
	砖模施工检查验收表
	基坑验槽检查
-->
<template>
  <div id="quality-inspect-save">
    <div class="item-select">
      <el-form label-width="100px">
        <el-row class="row-item">
          <el-form-item label="项目名称:">{{ addCheckForm.projectName }}</el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item
            prop="bidUnitName"
            label="施工单位:"
          >{{ addCheckForm.bidUnitId | accordingIdFindName(filterList) }}</el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item
            prop="bidBasementName"
            label="地下室区块:"
          >{{ addCheckForm.bidBasementId | accordingIdFindName(filterList) }}</el-form-item>
        </el-row>

        <el-row
          class="row-item"
          v-if="(addCheckForm.code==='040102010207'||addCheckForm.code==='040102010210')"
        >
          <el-form-item prop="bidUnitId" label="楼层:">{{addCheckForm.floorNum}}</el-form-item>
        </el-row>

        <el-row class="row-item" v-if="addCheckForm.code==='040102010210'">
          <el-form-item prop="bidUnitId" label="施工人数(人):">{{addCheckForm.people}}</el-form-item>
        </el-row>
      </el-form>
    </div>

    <!-- ============================================  表格内容======================================== -->
    <div class="table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
      >
        <el-table-column label="问题描述" prop="content" align="center"></el-table-column>
        <el-table-column label="规范条款" prop="tDescribe" align="center"></el-table-column>
        <el-table-column label="问题图片" prop="fileList" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.fileList" :key="item.id">
              <img :src="item.url" width="50" height="50" @click="previewImg(item.url)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="整改图片" prop="bimPic" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.bimPic" :key="item.id">
              <img :src="item" width="50" height="50" @click="previewImg(item)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="整改后图片" prop="bimUpdatePic" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.bimUpdatePic" :key="item.id">
              <img :src="item" width="50" height="50" @click="priviewBigPicture(item)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="整改状态" align="center">
          <template slot-scope="scope">{{ scope.row.bimStatus | bimStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" prop="name" align="center">
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
    </div>

    <el-row class="status">
      <span>检查结果:{{ tableData.length == 0 ? '合格':'不合格' }}</span>
    </el-row>

    <div style="margin: 50px">
      <el-form :model="addCheckForm" :rules="rule" ref="addCheckForm">
        <el-row class="check-pictures" v-if="checkPictureList.length > 0">
          <p>验收图片：</p>
          <ul>
            <li v-for="ele in checkPictureList" :key="ele.uid">
              <img :src="ele.url" width="50" height="50" @click="previewImg(ele.url)" />
            </li>
          </ul>
        </el-row>

        <el-row class="row-item infos">
          <el-col :span="4" class="file" v-if="acceptanceInfo">
            <el-form-item label="上传验收照片:">
              <el-upload
                class="upload-demo"
                action="#"
                :auto-upload="false"
                :file-list="addCheckForm.fileList"
                :multiple="true"
                list-type="picture"
                accept=".JPG, .PNG, .GIF, .JPEG"
                ref="fileuUpload"
                :on-change="(file,fileList)=> fileGet2(file,fileList)"
                :on-preview="previewImg"
                :on-remove="(file, fileList)=> fileRemove2(file,fileList)"
                :before-upload="acceptFile"
              >
                <el-button size="small" type="primary">上传照片</el-button>
                <span class="red-span">*</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="review==1">
          <el-form-item label="复核结果:" prop="reviewStatus">
            <el-select placeholder="请选择" style="width:120px" v-model="addCheckForm.reviewStatus">
              <el-option
                v-for="item in resultList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row v-if="isDetail && addCheckForm.checkMark != ''">
          <el-form-item label="复核结果:">
            <span v-if="addCheckForm.reviewStatus=='1'">合格</span>
            <span v-if="addCheckForm.reviewStatus=='0'">不合格</span>
          </el-form-item>
        </el-row>

        <div>
          <el-row v-if="review == 1">
            <el-form-item label="复核意见:" prop="checkMark">
              <el-input type="textarea" v-model="addCheckForm.checkMark" style="width:76%"></el-input>
            </el-form-item>
          </el-row>

          <el-row v-if="isDetail && addCheckForm.checkMark != ''">
            <el-form-item label="复核意见:">{{addCheckForm.checkMark}}</el-form-item>
          </el-row>
        </div>
      </el-form>
    </div>

    <div class="btn-box">
      <el-row class="row-item row-button">
        <el-button
          size="medium"
          @click="cancel"
          v-if="addCheckForm.isCheckMark=='' && isDetail==false && review != 1"
        >修改</el-button>
        <el-button
          size="medium"
          type="primary"
          v-if="addCheckForm.isCheckMark==''  && isDetail==false"
          @click="save"
        >保存</el-button>
        <el-button
          size="medium"
          @click="goList"
          type="primary"
          v-if="addCheckForm.isCheckMark!='' || isDetail==true"
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
  qualityInspectQuerycache,
  maintableList,
  maintableUpdate,
  qualityCheckPublicUpdate,
  qualityCheckEditQuestionBimStatus, // 整改操作
  filePut,
  maintableReview,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import { getDate } from "@/utils/transformDate.js";
export default {
  name: "acceptanceFoundationDetail",
  data() {
    return {
      token: "",
      userid: "",
      isDetail: false,
      review: 0, //复核按钮
      showModel: false,
      currentImg: "",
      code: "",
      addCheckForm: {
        checkUrl: "",
        fileList: [],
        isCheckMark: "",
        checkMark: "",
        id: "",
        projectId: "",
        projectName: "",
        isQuestion: "0",
        status: "",
        reviewStatus: "",
        code: "",
        bidBasementId: "",
        bidBasementName: "",
        bidUnitId: "",
        bidUnitName: "",
        floorNum: "",
        peopleCode: "",
        people: "",
        allThoseMark: "",
        checkInfo: [],
      },
      tableData: [],
      resultList: [],
      baseMentList: [],
      unitList: [],
      checkBranchCodeList: [],
      peopleList: [],
      checkPictureList: [],
      loadingInstance: "",
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
        checkMark: [
          { required: true, message: "请输入复核意见", trigger: "change" },
        ],
        reviewStatus: [
          { required: true, message: "请选择复核结果", trigger: "change" },
        ],
      },
      otherList: [],
      showTable: true,
      listData: [],
      processDialog: false,
      processDialogTitle: "",
      processFileList: [],
      processData: [],
      filterList: [],
      acceptanceInfo: false,
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.getChcekedData();
  },
  methods: {
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
     * 文件转为base64
     * params:event,file,fileList
     * create by YuXiong
     * date:2020-7-13
     */
    async fileGet2(file, fileList) {
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
            arr.splice(j, 1); //console.log(arr[j]);
            j--;
          }
        }
      }
      return arr;
    },

    /**
     * 文件移除
     * params:file,fileList
     * create by YuXiong
     * date:2020-7-13
     */
    fileRemove2(file, fileList) {
      this.addCheckForm.fileList = fileList;
    },

    /**
     * 获取页面数据
     * params:none
     * create by gzy
     * date:2020-8-7
     */
    getChcekedData() {
      if (this.$route.query) {
        this.code = this.$route.query.code;
        this.addCheckForm.code = this.$route.query.code;
        this.addCheckForm.id = this.$route.query.id;
        this.review = this.$route.query.review;
        if (this.$route.query.isDetail) {
          this.isDetail = true;
        }
        let params = {
          token: this.token,
          userid: this.userid,
          parentId: this.$route.query.tableId,
          mainId: this.$route.query.mainId,
          pageNum: 1,
          pageSize: 10000,
        };
        maintableList(params).then((res) => {
          if (res.data.status === "0") {
            // 头部信息处理
            this.filterList = res.data.data.headParam;
            this.addCheckForm = this.$formMap(
              res.data.data.headParam,
              this.addCheckForm
            );
            this.addCheckForm.projectName = res.data.data.projectName;
            this.addCheckForm.projectId = res.data.data.projectId;
            // 表格信息处理
            this.tableData = [
              ...res.data.data.publiList[0].quessVOList,
              ...res.data.data.publiList[0].otherquessVOList,
            ];
            this.tableData.forEach((item) => {
              item.bimPic = eval(item.bimPic);
              item.bimUpdatePic = eval(item.bimUpdatePic);
            });
            this.tableId = res.data.data.tableId;
            this.mainId = res.data.data.publiList[0].mainId;
            // 底部信息处理
            res.data.data.publiList[0].bodyParam.forEach((item) => {
              if (item.key === "status" && item.value != "") {
                this.addCheckForm.status = item.value;
              } else if (item.key === "allThoseMark" && item.value != "") {
                this.addCheckForm.allThoseMark = item.value;
              } else if (item.key === "checkInfo" && item.value != "") {
                this.checkPictureList = eval(item.value);
              }
            });

            this.addCheckForm.checkMark = res.data.data.checkMark;
            this.addCheckForm.reviewStatus = res.data.data.checkStatus;
            this.addCheckForm.ischeckMark = res.data.data.checkMark;
          }
        });
        this.dataHandle();
      }
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

    previewImg(url) {
      this.showModel = true;
      this.currentImg = url;
    },
    dataHandle() {
      let resultList = [];
      let arr1 = {
        value: "1",
        name: "合格",
      };
      let arr2 = {
        value: "0",
        name: "不合格",
      };
      resultList.push(arr1);
      resultList.push(arr2);
      this.resultList = resultList;
    },
    goList() {
      this.$router.push({
        path: "/qualityInspect/mainStructureList",
      });
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

    deleteById: function (id) {
      this.tableData.forEach(function (itme, index, array) {
        if (itme.id === id) {
          array.splice(index, 1);
        }
      });
      if (this.tableData.length < 1) {
        this.addCheckForm.status = "1";
        this.acceptanceInfo = true;
      }
    },
    /**
     *保存
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    save() {
      this.$refs.addCheckForm.validate((valid) => {
        if (this.addCheckForm.fileList.length > 0) {
          this.addCheckForm.checkInfo = this.addCheckForm.fileList;
        }
        if (valid === true) {
          let params = {
            token: this.token,
            userid: this.userid,
            tcode: this.$route.query.code,
            projectId: this.addCheckForm.projectId,
            isMain: "0",
            isMany: "0",
            isQuestion: this.addCheckForm.isQuestion, // 没问题传0,有传1
            mainId: this.$route.query.mainId,
            tableId: this.$route.query.tableId,

            bidBasementId: this.addCheckForm.bidBasementId,
            status: this.addCheckForm.status,
            bidUnitId: this.addCheckForm.bidUnitId,
            floorNum: this.addCheckForm.floorNum,
            people: this.addCheckForm.people,
            checkInfo: this.checkPictureList,
            allThoseMark: this.addCheckForm.allThoseMark,

            tableList: this.tableData,
          };

          maintableUpdate(params).then((res) => {
            if (res.data.status === "0") {
              this.$message({ type: "success", message: "保存成功!" });
              if (this.review == 1) {
                this.reviewUpdate();
              } else {
                this.$router.push({
                  path: "/qualityInspect/mainStructureList",
                });
              }
            } else {
              this.$message({ type: "warning", message: res.data.message });
            }
          });
        } else {
          this.$message({ type: "error", message: "请填写必填项" });
        }
      });
    },
    /**
     * 复核提交
     * params: param
     * create: by gzy
     * date: 2020-08-20
     */
    async reviewUpdate() {
      let param = {
        token: this.token,
        userid: this.userid,
        tableId: this.$route.query.tableId,
        checkStatus: this.addCheckForm.reviewStatus,
        checkMark: this.addCheckForm.checkMark,
      };

      let res = await maintableReview(param);
      if (res.data.status === "0") {
        this.$router.push({
          path: "/qualityInspect/mainStructureList",
        });
      }
    },
    /**
     * 点击修改，退回新增修改页
     * params:none
     * date:2020-6-29
     */
    cancel() {
      this.$router.push({
        path: "/acceptanceFoundation/add",
        query: {
          mainId: this.$route.query.mainId,
          tableId: this.$route.query.tableId,
          code: this.$route.query.code,
          review: this.review,
        },
      });
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
.infos {
  padding-bottom: 20px;
  border-bottom: 1px dotted #ccc;
  margin-bottom: 20px;
}
.imgs {
  margin-right: 20px;
}
.red {
  color: red;
}
.green {
  color: green;
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

.status {
  margin: 10px 0 0 40px;
  color: #000;
  padding-bottom: 15px;
  span {
    font-size: 14px;
    color: #999;
  }
}

.table {
  margin: 0 0 0 40px;
}
</style>