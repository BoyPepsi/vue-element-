<template>
  <div id="bidList">
    <bread-crumb :options="options"></bread-crumb>
    <div class="content">
      <div v-if="showContent">
        <el-form :inline="true" class="demo-form-inline">
          <!-- @change="hanldPro" -->
          <el-form-item label="项目名称">
            <el-select v-model="handle.projectid" placeholder="请选择项目名称:" value-key="id" clearable>
              <el-option
                v-for="type in projectNameList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSearch" size="medium" icon="el-icon-search">查询</el-button>
            <el-button
              type="primary"
              v-permission="{action: 'construction:project:bid:save' }"
              @click="detailForm(0,'')"
              size="medium"
              icon="el-icon-plus"
            >添加标段</el-button>

            

            <div style="float:right;marginRight:40px">
              <import-file :fileaccept="filetype" :importFile="importInterface" :title="title" @getList="getDid(handle)"></import-file>
            </div>

            <el-button
              style="marginLeft:20px;marginRight:20px"
              type="primary"
              @click="getMould()"
              size="medium"
              icon="el-icon-download"
            >下载模板</el-button>
          </el-form-item>
        </el-form>
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
            <el-table-column label="项目名称" prop="projectName" width="220px" align="center"></el-table-column>
            <el-table-column label="项目地址" prop="projectAddress" width="400px" align="center"></el-table-column>
            <el-table-column label="标段" prop="name" width="100px" align="center"></el-table-column>
            <el-table-column label="建设单位" prop="unitName" width="150px" align="center"></el-table-column>
            <el-table-column label="建设单位负责人" prop="contactPerson" width="200px" align="center"></el-table-column>
            <el-table-column label="联系电话" prop="contactPhoneNumber" width="150px" align="center"></el-table-column>
            <el-table-column label="项目类型" prop="type" width="150px" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.type | projectType}}</span>
              </template>
            </el-table-column>
            <el-table-column label="建筑用途" prop="buildUse" width="100px" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.type | buildingUse}}</span>
              </template>
            </el-table-column>
            <el-table-column label="建筑面积" prop="buildArea" width="150px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.buildArea}}（m²）</span>
              </template>
            </el-table-column>
            <el-table-column label="开工日期" prop="projectStartDate" width="150px" align="center">

            </el-table-column>
            <el-table-column label="总工期" prop="projectTotalDuration" width="150px" align="center"></el-table-column>
            <el-table-column label="操作" width="280px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-permission="{action: 'construction:project:bid:update' }"
                  @click="detailForm(1,scope.row)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="text"
                  v-permission="{action: 'construction:project:bid:unit:list' }"
                  @click="goCompany(scope.row)"
                >单位</el-button>
                <el-button
                  size="mini"
                  type="text"
                  v-permission="{action: 'construction:project:bid:build:list' }"
                  @click="goBuilding(scope.row)"
                >楼栋</el-button>
                <el-button
                  size="mini"
                  type="text"
                  v-permission="{action: 'construction:project:bid:basement:list' }"
                  @click="goBasements(scope.row)"
                >地下室</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-tickets"
                  v-permission="{action: 'construction:project:bid:detail' }"
                  @click="lotDetails(scope.row)"
                >详情</el-button>
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
        <lotDetails :lotData="lotData" @changePage="changePage"></lotDetails>
      </div>
      <!-- 添加-模态框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="showModel"
        :before-close="cancel"
        width="40%"
        center
      >
        <el-form
          :model="addForm"
          :rules="userRule"
          ref="addForm"
          label-width="100px"
          class="form_class"
        >
          <el-form-item label="项目名称:" prop="projectId">
            <el-select
              v-model="addForm.projectId"
              value-key="id"
              @change="changeName"
              placeholder="请选择项目名称:"
              :disabled="isEdit"
            >
              <el-option
                v-for="type in projectNameList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标段名称:" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="项目类型:" prop="type">
            <el-select v-model="addForm.type" placeholder="请选择项目类型:">
              <el-option
                v-for="type in buildType"
                :key="type.label"
                :label="type.label"
                :value="type.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建筑用途:" prop="buildUse">
            <el-select v-model="addForm.buildUse" placeholder="请选择建筑用途:">
              <el-option
                v-for="use in buildUse"
                :key="use.label"
                :label="use.label"
                :value="use.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建设单位:" prop="unitId">
            <el-input v-model="addForm.unitName" :disabled="isUnit"></el-input>
            <!-- <el-select v-model="addForm.unitId" placeholder="请选择建筑用途:">
                            <el-option v-for="unit in units" :key="unit.id" :label="unit.name" :value="unit.id"></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="建筑面积:" prop="buildArea" class="pos">
            <el-input v-model="addForm.buildArea" type="number"></el-input>
            <span class="mi">m²</span>
          </el-form-item>
          <el-form-item label="联系人:" prop="contactPerson">
            <el-input v-model="addForm.contactPerson"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="contactPhoneNumber">
            <el-input maxlength="11" v-model="addForm.contactPhoneNumber"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel" size="medium">取 消</el-button>
          <el-button type="primary" @click="submitButton" size="mini">保 存</el-button>
        </span>
      </el-dialog>


     
    </div>
  </div>
</template>

<script>
import {
  bidList,
  getUnitList,
  saveBid,
  updateBid,
  proList,
  detailUnit,
  proListNothing,
  getUnitListNothing,
  bidListNothing,
  bidImport,
} from "@/http/api.js";
import axios from "axios";
import { judgeErroCode } from "@/utils/errorCode.js";
import pagination from "@/components/pagination/pagination";

export default {
  name: "bidList",
  components: {
    pagination,
  },
  data() {
    return {
      options: {
        secondNav: "项目管理",
        thirdNav: "标段列表",
      },
      showContent: true, // 内容 or 详情
      name: "", // 标段名称
      tableData: [], // 标段列表
      dialogTitle: "添加标段",
      showModel: false, // 隐藏模态框
      // showClo: false,
      handle: {
        userId: "", // 用户id
        toKen: "", // 用户token
        pageSize: 10, // 页数
        pageNum: 1, //  页码
        projectid: "",
        // 初始化数据 不传项目id
      },
      currentPage: 1, // 页码
      limit: 10, // 一页5条数据
      total: 0,
      showPage: true, // 分页显示
      // 添加
      addForm: {
        buildArea: "", // 建筑面积
        buildUse: "", // 建筑用途
        contactPerson: "", // 联系人
        contactPhoneNumber: "", // 联系电话
        name: "", // 标段名称
        type: "", // 项目类型
        projectId: "", // 项目id
        unitId: "", // 建筑单位id
        unitName: "", // 建筑单位名称
      },
      btnText: "提 交", // 模态框按钮文字
      isEdit: false,
      userRule: {
        projectId: [
          { required: true, message: "请选择项目名称", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入标段名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择项目类型", trigger: "blur" }],
        buildUse: [
          { required: true, message: "请选择建筑用途", trigger: "blur" },
        ],
        unitId: [
          { required: true, message: "请输入建筑单位", trigger: "blur" },
        ],
        buildArea: [
          { required: true, message: "请输入建筑面积", trigger: "blur" },
        ],
        contactPerson: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
        contactPhoneNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
      },
      // projectName:[], //项目列表
      projectNameList: [], // 查询项目列表
      // 项目类型
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
      // 建筑用途
      buildUse: [
        { label: "民用建筑", value: "1" },
        { label: "居住建筑", value: "2" },
        { label: "公共建筑", value: "3" },
        { label: "工业建筑", value: "4" },
        { label: "农业建筑", value: "5" },
      ],
      units: [{ value: "民用建筑" }],
      lotData: {}, // 详情数据
      isUnit: false, // 建设单位禁用
      filetype: "xls",
      title : "标段导入"
    };
  },
  filters: {
    // 项目
    projectType(val) {
      return val === "1"
        ? "住宅建筑"
        : val === "2"
        ? "宿舍建筑"
        : val === "3"
        ? "商业建筑"
        : val === "4"
        ? "办公建筑"
        : val === "5"
        ? "教育建筑"
        : val === "6"
        ? "交通建筑"
        : val === "7"
        ? " 文娱建筑"
        : val === "8"
        ? " 金融建筑"
        : val === "9"
        ? " 体育建筑"
        : "园林建筑";
    },
    // 建筑
    buildingUse(val) {
      return val === "1"
        ? "民用建筑"
        : val === "2"
        ? "居住建筑"
        : val === "3"
        ? "公共建筑"
        : val === "4"
        ? "工业建筑"
        : "农业建筑";
    },
  },
  created() {
    const userInfo = this.$store.state.userInfo;
    this.handle.userId = userInfo.id;
    this.handle.toKen = userInfo.token;

    this.handle.pageSize = this.limit;
    this.handle.pageNum = this.currentPage;

    this.getProjList();

    this.getDid(this.handle);
    this.getUnitList();
  },
  methods: {
    importInterface() {
      return bidImport;
    },

    // 下载模板
    async getMould() {
      let params = {
        userid: this.userid,
        token: this.token,
      };

      let res = await axios({
        method: "POST",
        url: axios.defaults.baseURL + "/construction/project/bid/mould",
        responseType: "blob",
        data: params,
      });
      let blob = new Blob([res.data], { type: `application/vnd.ms-excel` });
      let link = document.createElement("a");
      let objectUrl = URL.createObjectURL(blob); // 创建URL
      link.href = objectUrl;
      link.download = "标段--模板"; // 自定义文件名
      link.click(); // 下载文件
      URL.revokeObjectURL(objectUrl); // 释放内存
    },

    // 获取表格列表
    getDid(params) {
      // bidList(params)
      bidListNothing(params) //无权限获取标段列表
        .then((res) => {
          if (res.data.status === "0") {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
            this.tableData.map(item => {
              item.projectStartDate = item.projectStartDate.slice(0,10)
            })
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch((err) => {
          this.$message({ type: "error", message: "服务器响应失败..." });
        });
    },
    // 获取现有单位列表
    getUnitList(pageNum = 1) {
      let params = {
        pageNum,
        pageSize: "10",
        token: this.handle.toKen,
        userid: this.handle.userId,
      };
      // getUnitList(params)
      getUnitListNothing(params)
        .then((res) => {
          if (res.data.status === "0") {
            this.units = res.data.data.list;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch((err) => console.log(err));
    },
    // 加载项目列表
    getProjList() {
      let params = {
        pageNum: "1",
        pageSize: 10000,
        token: this.handle.toKen,
        userid: this.handle.userId,
      };
      // proList(params)
      // 更换为无权限
      proListNothing(params)
        .then((res) => {
          if (res.data.status === "0") {
            this.projectNameList = res.data.data.list;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch((err) => console.log(err));
    },
    // 查询
    onSearch() {
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getDid(this.handle);
    },
    // 添加
    detailForm(s, row) {
      this.showModel = true;
      // this.getList();
      if (s === 0) {
        //新增
        this.dialogTitle = "添加标段";
        this.isEdit = false;
      } else if (s === 1) {
        // 修改
        this.dialogTitle = "修改标段";
        this.isUnit = true;
        this.isEdit = true;
        this.addForm = JSON.parse(JSON.stringify(row));
      }
    },
    // 选中项目后 查询出单位
    changeName(val) {
      // 获取label值
      let obj = {};
      obj = this.projectNameList.find((item) => {
        return item.id === val;
      });
      this.addForm.unitName = obj.unitName;
      this.addForm.unitId = obj.unitId;
      this.isUnit = true;
    },
    // 点击添加 加载项目列表
    getList(pageNum = 1) {
      let params = {
        // name: "",
        pageNum,
        pageSize: "10",
        token: this.handle.toKen,
        userid: this.handle.userId,
      };
      // proList(params)
      proListNothing(params)
        .then((res) => {
          if (res.data.status === "0") {
            this.projectName = res.data.data.list;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch((err) => console.log(err));
    },
    // 取消
    cancel() {
      this.showModel = false;
      this.isUnit = false;
      this.addForm = {};
      this.$refs.addForm.resetFields();
    },
    // 确认添加标段
    submitButton() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === "添加标段") {
            let params = {
              ...this.addForm,
              token: this.handle.toKen,
              userid: this.handle.userId,
            };
            saveBid(params)
              .then((res) => {
                if (res.data.status === "0") {
                  this.$message({
                    type: "success",
                    message: "添加成功!",
                  });
                  this.cancel();
                  this.getDid(this.handle);
                } else {
                  judgeErroCode(res.data.status, res.data.message);
                }
              })
              .catch((res) => {});
          } else if (this.dialogTitle === "修改标段") {
            let params = {
              ...this.addForm,
              token: this.handle.toKen,
              userid: this.handle.userId,
            };
            updateBid(params)
              .then((res) => {
                if (res.data.status === "0") {
                  this.$message({
                    type: "success",
                    message: "修改成功!",
                  });
                  this.cancel();
                  this.getDid(this.handle);
                } else {
                  judgeErroCode(res.data.status, res.data.message);
                }
              })
              .catch((res) => {});
          }
        }
      });
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handle.pageNum = val;
      this.getDid(this.handle);
    },
    /**
     * 分页每条数目改变，则回到第一页数据，列表重新加载
     */
    handleSizeChange(val) {
      this.limit = val;
      this.handle.pageSize = val;
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getDid(this.handle);
    },
    // 详情
    lotDetails(row) {
      this.showContent = false;
      this.lotData = JSON.parse(JSON.stringify(row));
    },
    changePage() {
      this.showContent = true;
    },
    // 去单位
    goCompany(row) {
      // 带参数
      this.$router.push({
        path: "/bidUnitList",
        query: {
          projectName: row.projectName,
          projectId: row.projectId,
          name: row.name,
          id: row.id,
          bidId: row.id,
        },
      });
    },
    // 去楼栋
    goBuilding(row) {
      this.$router.push({
        path: "/buildList",
        query: {
          projectName: row.projectName,
          projectId: row.projectId,
          name: row.name,
          id: row.id,
        },
      });
    },
    // 去地下室
    goBasements(row) {
      this.$router.push({
        path: "/basementList",
        query: {
          projectName: row.projectName,
          projectId: row.projectId,
          name: row.name,
          id: row.id,
        },
      });
    },
  },
};
</script>

<style scoped lang='less'>
.content {
  padding: 0 10px 50px 15px;

  // input 样式
  /deep/ .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
  }
  // 分页
  .pagination {
    margin-top: 15px;
    text-align: center;
  }
  .table {
    padding: 30px;
  }
  // 模态框的form
  .form_class {
    margin-left: 3%;
    .el-form-item {
      display: inline-block;
      margin-right: 50px;
      /deep/ .el-input__inner {
        width: 180px;
        height: 30px !important;
        line-height: 30px !important;
      }
    }
  }
}
/* // 表格-删除按钮 */
.red {
  color: #ff0000;
}
.pos {
  position: relative;
}
.mi {
  position: absolute;
  right: -20px;
  bottom: 0;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>