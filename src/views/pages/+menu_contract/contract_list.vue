<template>
  <div class="table">
    <div v-if="!isAddContract">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="项目名称">
          <el-input maxlength="20" v-model="projectName" size="small" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" @click="search">查询</el-button>
          <el-button
            type="primary"
            v-permission="{action: 'contract:save' }"
            size="small"
            icon="el-icon-plus"
            @click="addContract"
          >添加</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableList"
        border
        style="width: 100%"
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
      >
        <el-table-column label="公司" prop="dicName" align="center"></el-table-column>
        <el-table-column label="部门" prop="branchName" align="center"></el-table-column>
        <el-table-column label="组" prop="groupName" align="center"></el-table-column>

        <el-table-column label="项目名称" prop="projectName" align="center"></el-table-column>
        <el-table-column label="建设单位" prop="unitName" align="center"></el-table-column>
        <el-table-column label="中标通知书" prop="letterFileName" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="watchFile(scope.row,'notice')">查看文件</el-button>
          </template>
        </el-table-column>
        <el-table-column label="合同文件" prop="contractFileName" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="watchFile(scope.row,'contract')">查看文件</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-permission="{action: 'contract:update' }"
              @click="editItem(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              v-permission="{action: 'contract:delete' }"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :currentPage="currentPage"
        :total="total"
        :limit="limit"
        :small="true"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <!-- ===============================================添加的html代码=========================================== -->
    <div class="go-list" v-if="isAddContract">
      <el-button size="small" style="margin-left:15px;" @click="cancel">返回合同列表</el-button>
    </div>
    <el-form class="add-form" label-width="100px" v-if="isAddContract">
      <el-form-item>
        <h1>添加合同</h1>
      </el-form-item>
      <div v-if="false">
        <el-form-item label="公司">
          <el-select
            v-model="info.dicId"
            @change="changeCompany"
            style="width:95%;margin-left:15px;"
          >
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <span class="red-span">*</span> -->
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="info.branchId"
            @change="changeBranch"
            style="width:95%;margin-left:15px;"
            :clearable="true"
            :clear="changeBranch"
          >
            <el-option
              v-for="item in branchList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组">
          <el-select v-model="info.groupId" style="width:95%;margin-left:15px;">
            <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="项目名称">
        <el-input maxlength="20" v-model="info.projectName" style="width:95%;margin-left:15px;"></el-input>
        <span class="red-span">*</span>
      </el-form-item>
      <el-form-item label="建设单位">
        <el-select v-model="info.unitId" style="width:95%;margin-left:15px;">
          <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span class="red-span">*</span>
      </el-form-item>
      <el-row justify="end" type="flex">
        <el-col :span="12">
          <el-form-item label="通知书文件">
            <el-upload
              class="upload-demo"
              action="#"
              :limit="1"
              :file-list="noticeFileList"
              accept=".PDF"
              :on-error="noticeGetFile"
              :on-exceed="flieExceed"
              :on-remove="noticeRemoveFile"
              :before-upload="acceptFile"
            >
              <el-button size="small" type="primary" style="margin-left:15px;">上传通知书</el-button>
              <span class="red-span">*</span>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="file">
          <el-form-item label="合同文件">
            <el-upload
              class="upload-demo"
              action="#"
              :limit="1"
              :file-list="contractFileList"
              accept=".PDF"
              :on-error="contractGetFile"
              :on-exceed="flieExceed"
              :on-remove="contractRemoveFile"
              :before-upload="acceptFile"
            >
              <el-button size="small" type="primary">上传合同</el-button>
              <span class="red-span">*</span>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <span class="small">通知书、合同文件都只能上传pdf文件</span>
      </div>
      <el-form-item class="btn-group">
        <el-button
          type="primary"
          @click="saveAndEdit('save')"
          class="btns"
          v-if="!isEditContract"
        >保存</el-button>
        <el-button type="primary" v-if="isEditContract" @click="saveAndEdit('edit')" class="btns">保存</el-button>
        <el-button @click="cancel" class="btns">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :title="dialogTitle" :visible.sync="showModel" width="50%" center>
      <embed :src="url" type="application/pdf" width="100%" height="550" />
    </el-dialog>
  </div>
</template>

<script>
import {
  contractList,
  contractSave,
  contractUpdate,
  contractDelete,
  getDictionarieList,
  getUnitList,
  filePut,
  getUnitListNothing,
  contractListNothing,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "contractList",
  data() {
    return {
      token: "",
      userid: "",
      tableList: [],
      currentPage: 1,
      limit: 10,
      total: 0,
      projectName: "", // 查询时用到的项目名称
      info: {
        token: "",
        userid: "",
        id: "", // 编辑当前对象的id
        // dicId: "", // 公司ID
        // dicName: "",
        // dicCode: "",
        // branchId: "", // 部门id
        // branchName: "",
        // branchCode: "",
        // groupId: "", // 组id
        // groupCode: "",
        // groupName: "",
        projectName: "", // 项目名称
        unitId: "", // 建设单位id
        letterFileName: "", //通知书文件名
        letterFileUrl: "", // 通知书base64字符串
        contractFileName: "", // 合同件文件名
        contractFileUrl: "", // 合同件base64字符串
      },
      companyList: [],
      branchList: [],
      groupList: [],
      unitList: [],
      noticeFileList: [],
      contractFileList: [],
      isAddContract: false,
      isEditContract: false,
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
      showModel: false,
      url: "",
      dialogTitle: "查看文件",
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.info.userid = userInfo.id;
    this.info.token = userInfo.token;
    this.getTableList();
  },
  methods: {
    /**
     * 获取合同列表
     * params:none
     * create by YuXiong
     * date:2020-6-18
     */
    async getTableList(projectName) {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.limit,
        token: this.token,
        userid: this.userid,
        projectName: projectName || "",
      };
      // let result = await contractList(params);
      let result = await contractListNothing(params);
      if (result.data.status === "0") {
        this.tableList = result.data.data.list;
        this.total = result.data.data.total;
      } else {
        judgeErroCode(result.data.status, result.data.message);
        this.tableList = [];
      }
    },
    /**
     * 获取所有公司列表
     * params:none
     * create by YuXiong
     * date:2020-6-18
     */
    async getCompanyList() {
      let params = {
        name: "",
        pageNum: 1,
        pageSize: 30,
        parentid: "bc7b99932b23464fa0917b147ab62dc6",
        token: this.token,
        userId: this.userid,
      };
      try {
        let res = await getDictionarieList(params);
        if (res.data.status === "0") {
          this.companyList = res.data.data.list;
        } else {
          this.companyList = [];
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },

    /**
     * 获取搜索部门列表
     * params:id
     * 查询时parentId为选中的公司id，未选中公司，部门列表为空,默认进入页面为空
     * create by YuXiong
     * date:2020-6-18
     */
    async getBranchList(id) {
      this.branchList = [];
      let params = {
        pageNum: 1,
        pageSize: 30,
        parentid: id,
        token: this.token,
        userId: this.userid,
      };
      try {
        let res = await getDictionarieList(params);
        if (res.data.status === "0") {
          this.branchList = res.data.data.list;
        } else {
          this.branchList = [];
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },

    /**
     * 获取搜索部门列表
     * params:id
     * 查询时parentId为选中的部门id，未选中部门，组列表为空,默认进入页面为空
     * create by YuXiong
     * date:2020-6-4
     */
    async getGroupList(id) {
      let params = {
        pageNum: 1,
        pageSize: 30,
        parentid: id,
        token: this.token,
        userId: this.userid,
      };
      try {
        let res = await getDictionarieList(params);
        if (res.data.status === "0") {
          this.groupList = res.data.data.list;
        } else {
          this.groupList = [];
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },

    // ES6数组去重
    unique(arr) {
      const res = new Map();
      return arr.filter((a) => !res.has(a.name) && res.set(a.name, 1));
    },

    /**
     * 获取单位列表
     * params:none
     * create by YuXiong
     * date:2020-6-18
     */
    async getUnitLists() {
      let params = {
        token: this.token,
        userId: this.userid,
        pageSize: 10000, // 页数
        pageNum: 1, //  页码
        name: "",
        type: 1,
      };
      try {
        // let res = await getUnitList(params);
        // 改为无权限获取建设单位
        let res = await getUnitListNothing(params);
        if (res.data.status === "0") {
          let data = res.data.data.list;

          this.unitList = res.data.data.list;
          this.unitList = this.unique(data);
        } else {
          this.unitList = [];
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {}
    },
    /**
     * 分页点击事件,分页点击的时候，初始化搜索选项
     * params:val
     * create by YuXiong
     * date:2020-6-5
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableList();
    },
    /**
     * 查询列表
     * params:val
     * create by YuXiong
     * date:2020-6-5
     */
    search() {
      this.currentPage = 1;
      this.getTableList(this.projectName);
    },
    /**
     * 点击添加，展示公司列表,获取建设单位列表
     * params:none
     * create by YuXiong
     * date:2020-6-18
     */
    addContract() {
      this.getCompanyList();
      this.getUnitLists();
      this.isAddContract = true;
      this.isEditContract = false;
      this.info.id = "";
    },
    /**
     * 编辑合同列表数据
     * params:item,
     * create by YuXiong
     * date:2020-6-30
     */
    editItem(item) {
      this.info.id = item.id;
      // this.info.dicId = item.dicId;
      // this.info.branchId = item.branchId;
      // this.info.groupId = item.groupId;
      this.info.letterFileName = item.letterFileName;
      this.info.letterFileUrl = item.letterFileUrl;
      this.info.contractFileName = item.contractFileName;
      this.info.contractFileUrl = item.contractFileUrl;
      this.info.projectName = item.projectName;
      this.info.unitId = item.unitId;
      if (item.letterFileName.length > 0) {
        let obj = {
          name: item.letterFileName,
        };
        this.noticeFileList.push(obj);
      }
      if (item.contractFileName.length > 0) {
        let obj = {
          name: item.contractFileName,
        };
        this.contractFileList.push(obj);
      }
      this.getCompanyList();
      this.getUnitLists();
      // if (this.info.dicId.length > 0) {
      //   this.getBranchList(this.info.dicId);
      // }
      // if (this.info.branchId.length > 0) {
      //   this.getGroupList(this.info.branchId);
      // }
      this.isAddContract = true;
      this.isEditContract = true;
    },
    watchFile(item, type) {
      this.showModel = true;
      this.url = "";
      if (type === "notice") {
        this.url = JSON.parse(item.letterFileUrl).urls;
      } else {
        this.url = JSON.parse(item.contractFileUrl).urls;
      }
    },
    /**
     * 删除合同
     * params:index:row
     * create by YuXiong
     * date:2020-6-30
     */
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: row.id,
            token: this.token,
            userid: this.userid,
          };
          contractDelete(params)
            .then((res) => {
              if (res.data.status === "0") {
                this.$message({ type: "success", message: "删除成功!" });
                this.getTableList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 分页每条数目改变，则回到第一页数据，列表重新加载
     * params:val
     * create by YuXiong
     * date:2020-6-5
     */
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getTableList();
    },
    /**
     * 公司改变，重新获取部门列表
     * params:id
     * create by YuXiong
     * date:2020-6-18
     */
    changeCompany(id) {
      // this.info.branchId = "";
      // this.info.groupId = "";
      this.branchList = [];
      this.groupList = [];
      this.getBranchList(id);
    },
    /**
     * 部门改变，重新获取组列表
     * params:id
     * create by YuXiong
     * date:2020-6-18
     */
    changeBranch(id) {
      // this.info.groupId = "";
      this.groupList = [];
      this.getGroupList(id);
    },
    /**
     * 上传之前，限制文件的格式
     * params:file
     * create by YuXiong
     * date:2020-6-19
     */
    acceptFile(file) {
      var FileExt = file.name.replace(/.+\./, "");
      if (["pdf"].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message({
          type: "warning",
          message: "请上传后缀名为pdf的文件！",
        });
        return false;
      }
    },
    /**
     * 通告书文件转为base64,并上传
     * params:event,file,fileList
     * create by YuXiong
     * date:2020-6-19
     */
    noticeGetFile(event, file, fileList) {
      this.loadingInstance = this.$loading(this.loadingOptions);
      this.getBase64(file.raw).then((res) => {
        this.info.letterFileName = file.name;
        let params = {
          fileName: [file.name],
          fileStr: [res.split("base64,")[1]],
          token: this.token,
          userid: this.userid,
        };
        filePut(params)
          .then((fileResult) => {
            if (fileResult.data.status === "0") {
              let obj = {};
              obj.name = file.name;
              this.info.letterFileUrl = fileResult.data.data;
              this.noticeFileList.push(obj);
            }
            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              this.loadingInstance.close();
            });
          })
          .catch((err) => {
            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              this.loadingInstance.close();
            });
          });
      });
    },
    /**
     * 上传合同文件
     * params:event,file,fileList
     * create by YuXiong
     * date:2020-6-19
     */
    contractGetFile(event, file, fileList) {
      this.loadingInstance = this.$loading(this.loadingOptions);
      this.getBase64(file.raw).then((res) => {
        this.info.contractFileName = file.name;
        let params = {
          fileName: [file.name],
          fileStr: [res.split("base64,")[1]],
          token: this.token,
          userid: this.userid,
        };
        filePut(params)
          .then((fileResult) => {
            if (fileResult.data.status === "0") {
              let obj = {};
              obj.name = file.name;
              this.info.contractFileUrl = fileResult.data.data;
              this.contractFileList.push(obj);
            }
            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              this.loadingInstance.close();
            });
          })
          .catch((err) => {
            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              this.loadingInstance.close();
            });
          });
      });
    },
    /**
     * 文件上传超出个数提示
     * params:file,fileList
     * create by YuXiong
     * date:2020-6-19
     */
    flieExceed(files, fileList) {
      this.$message({ type: "error", message: "只能上传一个文件" });
    },
    /**
     * 移除通知书文件
     * params:file,fileList
     * create by YuXiong
     * date:2020-6-19
     */
    noticeRemoveFile(file, fileList) {
      this.noticeFileList = [];
      this.info.letterFileUrl = "";
      this.info.letterFileName = "";
    },
    /**
     * 移除合同书文件
     * params:file,fileList
     * create by YuXiong
     * date:2020-6-19
     */
    contractRemoveFile() {
      this.contractFileList = [];
      this.info.contractFileUrl = "";
      this.info.contractFileName = "";
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
    /**
     * 点击保存或编辑，根据type判断，调用不同的方法
     * pamars:type
     * create by YuXiong
     * date:2020-6-19
     */
    async saveAndEdit(type) {
      if (
        // this.info.dicId.lengt === 0 ||
        this.info.projectName.length === 0 ||
        this.info.unitId.length === 0 ||
        this.info.letterFileUrl.length === 0 ||
        this.info.contractFileUrl.length === 0
      ) {
        this.$message({ type: "warning", message: "请填写全部带*的项" });
      } else {
        // // 如果有公司ID，则把公司名称，公司code全部传给服务端
        // if (this.info.dicId.length > 0) {
        //   let obj = this.companyList.find(
        //     (item) => item.id === this.info.dicId
        //   );
        //   this.info.dicName = obj.name;
        //   this.info.dicCode = obj.code;
        // }
        // // 如果有部门ID，则把公司名称，公司code全部传给服务端
        // if (this.info.branchId.length > 0) {
        //   let obj = this.branchList.find(
        //     (item) => item.id === this.info.branchId
        //   );
        //   this.info.branchName = obj.name;
        //   this.info.branchCode = obj.code;
        // }
        // // 如果有组ID，则把组名称，组code全部传给服务端
        // if (this.info.groupId.length > 0) {
        //   let obj = this.groupList.find(
        //     (item) => item.id === this.info.groupId
        //   );
        //   this.info.groupName = obj.name;
        //   this.info.groupCode = obj.code;
        // }
        if (type === "save") {
          this.saveContract();
        } else {
          this.editContract();
        }
      }
    },
    /**
     * 添加合同调用的方法
     * params:none
     * create by YuXiong
     * date:2020-6-19
     */
    async saveContract() {
      try {
        let result = await contractSave(this.info);
        if (result.data.status === "0") {
          this.$message({ type: "success", message: "添加成功" });
          this.isAddContract = false;
          this.resetData();
          this.getTableList();
        } else {
          judgeErroCode(result.data.status, result.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 编辑合同调用的方法
     * params:none
     * create by YuXiong
     * date:2020-6-19
     */
    async editContract() {
      try {
        let result = await contractUpdate(this.info);
        if (result.data.status === "0") {
          this.$message({ type: "success", message: "编辑成功" });
          this.isAddContract = false;
          this.resetData();
          this.getTableList();
        } else {
          judgeErroCode(result.data.status, result.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 取消添加或编辑
     * params:none
     * create by YuXiong
     * date:2020-6-19
     */
    cancel() {
      this.isAddContract = false;
      this.resetData();
    },
    /**
     * 重置数据
     * params:none
     * create by YuXiong
     * date:2020-6-19
     */
    resetData() {
      this.info = {
        userid: this.userid,
        token: this.token,
        dicId: "", // 公司ID
        dicName: "",
        dicCode: "",
        branchId: "", // 部门id
        branchName: "",
        branchCode: "",
        groupId: "", // 组id
        groupCode: "",
        groupName: "",
        projectName: "", // 项目名称
        unitId: "", // 建设单位id
        letterFileName: "", //通知书文件名
        letterFileUrl: "", // 通知书base64字符串
        contractFileName: "", // 合同件文件名
        contractFileUrl: "", // 合同件base64字符串
      };
      this.companyList = [];
      this.branchList = [];
      this.groupList = [];
      this.unitList = [];
      this.noticeFileList = [];
      this.contractFileList = [];
    },
  },
};
</script>

<style scoped lang='less'>
.table {
  padding: 30px;
  // background: #fff;
  // border: 1px solid #ddd;
  border-radius: 5px;
  // 暂无数据
  /deep/ .el-table__empty-block {
    width: auto !important;
  }
}
.add-form {
  width: 700px;
  margin: 20px 0 0 80px;
  background-color: #f9f9f9;
  padding: 40px 200px;
  /deep/ .btn-group .el-form-item__content {
    text-align: center !important;
    button.btns {
      margin-top: 60px;
      padding: 15px 60px;
    }
  }
}
.file {
  text-align: right;
  /deep/ .el-form-item__label {
    margin-left: 130px;
  }
}
h1 {
  text-align: center;
  color: #999;
}
.red-span {
  color: #f00;
  font-size: 18px;
  margin-left: 3px;
  display: inline-block;
}
.red {
  color: #f00;
}
.small {
  font-size: 12px;
  color: #999;
  margin-left: 115px;
}
.go-list {
  margin-left: 65px;
}
</style>