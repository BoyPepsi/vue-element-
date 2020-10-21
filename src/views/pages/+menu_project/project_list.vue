<template>
  <div id="projectList">
    <bread-crumb :options="options"></bread-crumb>
    <div class="proMain" v-if="noDetails">
      <div class="proSearch">
        <span>项目名称:</span>
        <el-input v-model="handle.name" placeholder="请输入要查询的项目名称:" clearable></el-input>
        <el-button icon="el-icon-search" size="medium" @click="onSearch">查 询</el-button>
        <el-button
         
          type="primary"
          icon="el-icon-plus"
          size="medium"
          v-permission="{action: 'construction:project:save' }"
          @click="addProject"
        >添加项目</el-button>
       
       
        <el-button style="float:right" type="primary" icon="el-icon-download" size="medium" @click="getMould">下载模板</el-button>
        <div style="float:right">
          <import-file  :importFile="importInterface" :title="title"  @getList="getList(handle)"></import-file>
        </div>
      </div>
      <div class="proList">
        <el-table
          :data="proList"
          border
          style="width: 100%"
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <!-- <el-table-column
            v-for="column in proListTableHeader"
            :key="column.id"
            :label="column.label"
            :prop="column.prop"
            :width="column.width"
            align="center"
          ></el-table-column> -->
          <!-- proListTableHeader: [
        { label: "项目名称", prop: "name", width: "120px" },
        { label: "项目地址", prop: "address", width: "410px" },
        { label: "建设单位", prop: "unitName", width: "160px" },
        { label: "负责人", prop: "contactPerson", width: "150px" },
        { label: "联系电话", prop: "contactPhoneNumber", width: "150px" },
        { label: "项目类型", prop: "typeName", width: "100px" },
        { label: "建筑用途", prop: "buildUseName", width: "100px" },
        { label: "建筑面积", prop: "buildArea", width: "100px" },
        { label: "开工日期", prop: "startDate", width: "180px" },
        { label: "总工期", prop: "totalDuration", width: "120px" },
      ], -->
          <el-table-column label="项目名称" prop="name" width="120px" align="center"></el-table-column>
          <el-table-column label="项目地址" prop="address" width="410px" align="center"></el-table-column>
          <el-table-column label="建设单位" prop="unitName" width="160px" align="center"></el-table-column>
          <el-table-column label="负责人" prop="contactPerson" width="150px" align="center"></el-table-column>
          <el-table-column label="联系电话" prop="contactPhoneNumber" width="150px" align="center"></el-table-column>
          <el-table-column label="项目类型" prop="typeName" width="100px" align="center"></el-table-column>
          <el-table-column label="建筑用途" prop="buildUseName" width="100px" align="center"></el-table-column>
          <el-table-column label="建筑面积" prop="buildArea" width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.buildArea}}（m²）</span>
            </template>
          </el-table-column>
          <el-table-column label="开工日期" prop="startDate" width="180px" align="center">

          </el-table-column>
          <el-table-column label="总工期" prop="totalDuration" width="120px" align="center"></el-table-column>
          <el-table-column label="操作" width="300px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                v-permission="{action: 'construction:project:update' }"
                @click="startModify(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                v-permission="{action: 'construction:project:detail' }"
                @click="browseDetails(scope.row)"
              >查看详情</el-button>
              <!-- v-permission="{action: 'detail' }" -->
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :currentPage="currentPage"
          :total="total"
          :limit="limit"
          :small="true"
          :showPage="showPage"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        />
      </div>
    </div>
    <div v-else>
      <proDetails :proDetailData="proDetailData" @changePageStatus="changePageStatus"></proDetails>
    </div>
    <!-- 新增项目 or 修改项目 -->
    <el-dialog :title="dialogTitle" :visible.sync="showProInfo" width="40%" center>
      <div class="data_info">
        <el-form :model="addForm" :rules="addRule" ref="addForm" label-width="100px">
          <!-- +++++++++++++++上传图片开始+++++++++++++++ -->
          <el-form-item label="上传图片" prop="pic">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              accept=".JPG, .PNG, .GIF, .JPEG"
              :on-error="handleAvatarSuccess"
              :before-upload="acceptFile"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <!-- ++++++++++++++++++++++++上传图片结束++++++++++++++++++++++ -->
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="项目地址:" prop="address">
            <el-input v-model="addForm.address"></el-input>
          </el-form-item>
          <!-- prop="startDate"  可不填写 -->
          <el-form-item label="开工日期:">
            <el-date-picker
              :editable="false"
              v-model="addForm.startDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="总工期:" prop="totalDuration">
            <el-input v-model="addForm.totalDuration" type="number"></el-input>
          </el-form-item>
          <el-form-item label="项目类型:" prop="type" class="setDisplay">
            <el-select v-model="addForm.type" placeholder="请选择项目类型:">
              <el-option
                v-for="type in buildType"
                :key="type.label"
                :label="type.label"
                :value="type.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建筑用途:" prop="buildUse" class="setDisplay">
            <el-select v-model="addForm.buildUse" placeholder="请选择建筑用途:">
              <el-option
                v-for="use in buildUse"
                :key="use.label"
                :label="use.label"
                :value="use.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建设单位:" prop="unitId" class="setDisplay">
            <el-select v-model="addForm.unitId" placeholder="请选择建设单位:" @change="changeAddUnit">
              <el-option v-for="unit in units" :key="unit.id" :label="unit.name" :value="unit.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目负责人:" prop="contactPerson">
            <el-input v-model="addForm.contactPerson"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="contactPhoneNumber">
            <el-input v-model="addForm.contactPhoneNumber" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="建筑面积:" prop="buildArea" class="setDisplay">
            <el-input v-model="addForm.buildArea" style="width: 160px" type="number"></el-input>
            <span style="padding-left: 10px;">m²</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="medium">取 消</el-button>
        <el-button type="primary" @click="submitAddPro" size="medium" v-if="dialogStatus">添加项目</el-button>
        <el-button type="primary" @click="modifyPro" size="medium" v-else>修改项目</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  proList,
  getUnitList,
  getUnitListNothing,
  addPro,
  updatePro,
  unitList,
  filePut,
  proListNothing,
  projectImport
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import axios from "axios";
export default {
  name: "projectList",
  data() {
    return {
      options: {
        secondNav: "项目管理",
        thirdNav: "项目列表",
      },
      userInfo: this.$store.state.userInfo,
      handle: {
        userId: "", // 用户id
        toKen: "", // 用户toke
        pageSize: 10, // 页数
        pageNum: 1, //  页码
        name: "",
        // 初始化数据 不传项目id
        // projectId: '',  // 项目标识
      },
      proList: [], // 项目列表
      proListTableHeader: [
        { label: "项目名称", prop: "name", width: "120px" },
        { label: "项目地址", prop: "address", width: "410px" },
        { label: "建设单位", prop: "unitName", width: "160px" },
        { label: "负责人", prop: "contactPerson", width: "150px" },
        { label: "联系电话", prop: "contactPhoneNumber", width: "150px" },
        { label: "项目类型", prop: "typeName", width: "100px" },
        { label: "建筑用途", prop: "buildUseName", width: "100px" },
        { label: "建筑面积", prop: "buildArea", width: "100px" },
        { label: "开工日期", prop: "startDate", width: "180px" },
        { label: "总工期", prop: "totalDuration", width: "120px" },
      ],
      dialogTitle: "添加项目",
      dialogStatus: true, // 弹窗状态 true add false modify
      showProInfo: false, // 弹窗
      //建筑用途
      buildType: [
        { label: "住宅建筑", value: "1" },
        { label: "宿舍建筑", value: "2" },
        { label: "商业建筑", value: "3" },
        { label: "办公建筑", value: "4" },
        { label: "教育建筑", value: "5" },
        { label: "交通建筑", value: "6" },
        { label: "文娱建筑", value: "7" },
        { label: "金融建筑", value: "8" },
        { label: "体育建筑", value: "9" },
        { label: "园林建筑", value: "10" },
      ],
      buildUse: [
        { label: "民用建筑", value: "1" },
        { label: "居住建筑", value: "2" },
        { label: "公共建筑", value: "3" },
        { label: "工业建筑", value: "4" },
        { label: "农业建筑", value: "5" },
      ],
      units: [
        { value: "民用建筑" },
        { value: "居住建筑" },
        { value: "公共建筑" },
      ],
      currentPage: 1, // 页码
      limit: 10, // 一页5条数据
      total: 0,
      showPage: true, // 分页显示
      addForm: {
        address: "",
        buildArea: "",
        buildUse: "",
        contactPerson: "",
        contactPhoneNumber: "",
        name: "",
        startDate: "",
        totalDuration: "",
        type: "",
        unitId: "",
      },
      addRule: {
        address: [
          { required: true, message: "请录入项目地址", trigger: "blur" },
        ],
        buildArea: [
          { required: true, message: "请录入项目建筑面积", trigger: "blur" },
        ],
        buildUse: [
          { required: true, message: "请选择建筑用途", trigger: "change" },
        ],
        contactPerson: [
          { required: true, message: "请录入项目负责人", trigger: "blur" },
        ],
        contactPhoneNumber: [
          { required: true, message: "请录入项目联系人电话", trigger: "blur" },
        ],
        name: [{ required: true, message: "请录入项目名称", trigger: "blur" }],
        startDate: [
          { required: true, message: "请录入项目开工日期", trigger: "change" },
        ],
        totalDuration: [
          { required: true, message: "请录入项目总工期", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择项目类型", trigger: "change" },
        ],
        unitId: [
          { required: true, message: "请选择建设单位", trigger: "change" },
        ],
      },
      noDetails: true, // 切换到细节展示， 默认 false 不显示
      proDetailData: {},
      imageUrl: "", //项目图片
      url: "", //项目添加时，图片参数
      loadingOptions: {
        lock: true, // 是否锁屏
        text: "正在加载...", // 加载动画的文字
        spinner: "el-icon-loading", // 引入的loading图标
        background: "rgba(0, 0, 0, 0.3)", // 背景颜色
        target: ".sub-main", // 需要遮罩的区域
        body: true,
        customClass: "mask", // 遮罩层新增类名
      },
      loadingInstance: "",
      title : '项目导入'
    };
  },
  created() {
    const userInfo = this.$store.state.userInfo;
    this.handle.userId = userInfo.id;
    this.handle.toKen = userInfo.token;

    this.handle.pageSize = this.limit;
    this.handle.pageNum = this.currentPage;

    this.getList(this.handle);
    this.getUnitList();
  },
  methods: {
    importInterface(){
      return projectImport;
    },
    // 下载模板
    async getMould() {
      let params = {
        userid: this.userid,
        token: this.token,
      };

      let res = await axios({
        method: "POST",
        url: axios.defaults.baseURL + "/construction/project/mould",
        responseType: "blob",
        data: params,
      });
      let blob = new Blob([res.data], { type: `application/vnd.ms-excel` });
      let link = document.createElement("a");
      let objectUrl = URL.createObjectURL(blob); // 创建URL
      link.href = objectUrl;
      link.download = "项目--模板"; // 自定义文件名
      link.click(); // 下载文件
      URL.revokeObjectURL(objectUrl); // 释放内存
    },

    /**
     * 上传之前，限制文件的格式
     * params:file
     * create by YuXiong
     * date:2020-7-13
     */
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
     * 通告书文件转为base64
     * params:event,file,fileList
     * create by YuXiong
     * date:2020-6-19
     */
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

    // 上传图片-------------曹慧敏-----------2020.7.3
    handleAvatarSuccess(res, file) {
      this.imageUrl = "";
      this.loadingInstance = this.$loading(this.loadingOptions);
      let fileName = file.name;
      this.getBase64(file.raw)
        .then((res) => {
          let params = {
            fileName: [fileName],
            fileStr: [res.split("base64,")[1]],
            token: this.handle.toKen,
            userid: this.handle.userId,
          };
          filePut(params)
            .then((fileResult) => {
              this.imageUrl = fileResult.data.data.urls[0];
              this.loadingInstance.close();
            })
            .catch((err) => {});
        })
        .catch((err) => {
          console.log("图片格式有误，上传失败");
        });
    },

    getList(params) {
      // proList(params)
      proListNothing(params) //无权限获取项目列表
        .then((res) => {
          if (res.data.status === "0") {
            this.proList = res.data.data.list;
            if (res.data.data.list.length > 0) {
              res.data.data.list.forEach((item) => {
                item.startDate = item.startDate.slice(0,10)
                this.buildType.forEach((ele) => {
                  if (item.type === ele.value) {
                    item.typeName = ele.label;
                  }
                });
                this.buildUse.forEach((ele) => {
                  if (item.type === ele.value) {
                    item.buildUseName = ele.label;
                  }
                });
              });
            }
            this.total = res.data.data.total;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch((err) => console.log(err));
    },
    // 获取现有只属于建设的 单位列表
    getUnitList(pageNum = 1) {
      let params = {
        pageNum,
        pageSize: 10000,
        type: 1,
        token: this.userInfo.token,
        userid: this.userInfo.id,
      };
      // getUnitList(params)
      // 改为无权限获取单位列表
      getUnitListNothing(params)
        .then((res) => {
          if (res.data.status === "0") {
            this.units = res.data.data.list;
          }
        })
        .catch((err) => console.log(err));
    },
    // ===============================
    //    上述部分放置 api 相关方法
    // ===============================
    // 添加项目
    addProject() {
      this.imageUrl = "";
      this.dialogTitle = "新增项目";
      this.dialogStatus = true;
      this.showProInfo = true;
      for (let key in this.addForm) {
        this.addForm[key] = "";
      }
    },
    /**
     * 添加参建单位----更改单位选项
     * 要获取当前单位的联系人和联系电话，并赋值到输入框
     * params:id
     * create by YuXiong
     * date:2020-6-17
     */
    changeAddUnit(id) {
      let obj = this.units.find((item) => item.id === id);
      this.addForm.contactPhoneNumber = obj.contactPhoneNumber;
      this.addForm.contactPerson = obj.contactPerson;
    },
    // 点击 列表 修改 按钮触发
    startModify(row) {

      this.dialogTitle = "修改信息";
      this.showProInfo = true;
      this.dialogStatus = false;
      this.imageUrl = row.url;
      this.addForm = JSON.parse(JSON.stringify(row));
    },
    // 点击 列表 查看详情 按钮触发
    browseDetails(row) {
      this.proDetailData = JSON.parse(JSON.stringify(row));
      this.proDetailData.buildArea = JSON.parse(JSON.stringify(row)).buildArea + '（m²）';
      this.noDetails = false;
    },
    // 查询
    onSearch() {
      this.currentPage = 1;
      this.handle.pageNum = 1;

      this.getList(this.handle);
    },
    //
    cancel() {
      this.showProInfo = false;
      this.dialogStatus = true;
      this.$refs["addForm"].resetFields();
    },
    // dialog add
    submitAddPro() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let params = {
            ...this.addForm,
            token: this.userInfo.token,
            userid: this.userInfo.id,
            url: this.imageUrl,
          };

          addPro(params)
            .then((res) => {
              if (res.data.status === "0") {
                this.$message({
                  type: "success",
                  message: "操作成功, 成功添加项目!",
                });
                this.getList(this.handle);
                this.cancel();
              } else {
                judgeErroCode(res.data.status, res.data.message);
              }
            })
            .catch((err) => console.log(err));
        }
      });
    },
    modifyPro() {
      let params = {
        ...this.addForm,
        token: this.userInfo.token,
        userid: this.userInfo.id,
        url: this.imageUrl,
      };
      updatePro(params)
        .then((res) => {
          if (res.data.status === "0") {
            this.$message({
              type: "success",
              message: "操作成功, 项目信息已更新!",
            });
            this.getList(this.handle);
            this.$refs["addForm"].resetFields();
            this.showProInfo = false;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch((err) => console.log(err));
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handle.pageNum = val;
      this.getList(this.handle);
    },
    /**
     * 分页每条数目改变，则回到第一页数据，列表重新加载
     */
    handleSizeChange(val) {
      this.limit = val;
      this.handle.pageSize = val;
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getList(this.handle);
    },
    changePageStatus(status) {
      this.noDetails = status;
    },
  },
};
</script>

<style scoped lang="less">
#projectList {
  .proMain {
    width: 98%;
    margin: 20px auto 0 auto;
    .proSearch {
      span {
        color: #333;
        font-size: 16px;
        font-weight: 500;
        margin-right: 15px;
      }
      /deep/ .el-input {
        width: 18%;
        margin-right: 30px;
      }
      /deep/ .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }
    // 列表
    .proList {
      margin-top: 40px;
    }
  }
  .data_info {
    width: 95%;
    margin: 10px auto;
    .setDisplay {
      display: inline-block;
    }
    /deep/ .el-input {
      width: 80%;
    }
    /deep/ .el-form-item {
      margin-bottom: 15px;
    }
    /deep/ .el-input__inner {
      height: 35px;
      line-height: 35px;
    }
  }
  /deep/ .el-dialog__headerbtn .el-dialog__close {
    display: none;
  }

  // 上传图像
  .avatar-uploader {
    border: 2px dashed #878787;
    width: 86px;
    height: 86px;
    cursor: pointer;
    position: relative;
    // overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 36px;
    color: #878787;
    width: 82px;
    height: 82px;
    line-height: 86px;
    text-align: center;
  }
  .avatar {
    width: 170px;
    height: 110px;
    display: block;
  }
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>