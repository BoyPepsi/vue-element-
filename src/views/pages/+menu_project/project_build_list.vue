<template>
  <div id="tungList">
    <bread-crumb :options="options"></bread-crumb>
    <div class="content">
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <!-- <el-form-item label="项目名称" v-if="twoLeel">
                        <el-input v-model="handle.projectName" clearable></el-input>
          </el-form-item>-->
          <el-form-item label="项目名称" v-if="twoLeel">
            <el-select
              v-model="handle.projectName"
              placeholder="请选择项目名称:"
              @change="hanldPro"
              value-key="id"
              clearable
              :clear="hanldPro"
            >
              <el-option
                v-for="type in projectNameList"
                :key="type.id"
                :label="type.name"
                :value="type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标段" v-if="twoLeel">
            <el-select v-model="handle.bid" placeholder="请选择标段:" clearable @change="handleBid">
              <el-option
                v-for="type in bidSelectList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div v-else>
            <el-form-item label="项目名称:">
              <span>{{$route.query.projectName}}</span>
            </el-form-item>
            <el-form-item label="标段:">
              <span>{{$route.query.name}}</span>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button @click="onSearch" size="medium" icon="el-icon-search" v-if="twoLeel">查询</el-button>
            <el-button
              type="primary"
              @click="detailForm(0,'')"
              size="medium"
              v-permission="{action: 'construction:project:bid:build:save' }"
              icon="el-icon-plus"
            >添加楼栋</el-button>
            <el-button
              type="primary"
              @click="getMould()"
              size="medium"
              icon="el-icon-download"
            >下载模板</el-button>
            <div style="float:right;marginRight:40px">
              <import-file :fileaccept="filetype" :importFile="importInterface" :title="title" @getList="getTable(handle)"></import-file>
            </div>
            <el-button
              v-if="!twoLeel"
              type="success"
              icon="el-icon-back"
              @click="changePageStatus"
              size="medium"
              style="margin-left:15px"
            >返回楼栋列表</el-button>
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
            <el-table-column
              label="标段"
              prop="bidName"
              min-width="10%"
              align="center"
              v-if="twoLeel"
            ></el-table-column>
            <el-table-column label="楼栋号" prop="number" min-width="10%" align="center"></el-table-column>
            <el-table-column label="总楼层" prop="totalFloorNum" min-width="10%" align="center"></el-table-column>
            <el-table-column
              label="非标准层数"
              prop="nonStandardFloorNum"
              min-width="20%"
              align="center"
            ></el-table-column>
            <el-table-column
              label="非标准层总房间数"
              prop="nonStandardTotalRoomNum"
              min-width="20%"
              align="center"
            ></el-table-column>
            <el-table-column label="标准层数" prop="standardFloorNum" min-width="10%" align="center"></el-table-column>
            <el-table-column
              label="标准层房间数(单层)"
              prop="standardRoomNum"
              min-width="20%"
              align="center"
            ></el-table-column>
            <el-table-column
              label="标准层房间数(总数)"
              prop="totalStandardRoomNum"
              min-width="20%"
              align="center"
            ></el-table-column>
            <el-table-column label="楼栋总房间数" prop="totalRoomNum" min-width="20%" align="center"></el-table-column>
            <el-table-column label="楼栋类型" prop="type" min-width="20%" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.type | buildType}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="20%" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="goCompany(scope.row)"
                  v-permission="{action: 'construction:project:bid:unit:list' }"
                >单位</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-permission="{action: 'construction:project:bid:build:update' }"
                  @click="detailForm(1,scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="text"
                  class="red"
                  icon="el-icon-delete"
                  v-permission="{action: 'delete' }"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
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
      <!--添加 修改-模态框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="showModel"
        :before-close="cancel"
        width="50%"
        center
      >
        <el-form
          :model="addForm"
          :rules="userRule"
          ref="addForm"
          label-width="150px"
          class="form_class"
        >
          <el-form-item label="项目名称:" prop="projectId">
            <el-select
              v-model="addForm.projectId"
              placeholder="请选择项目名称:"
              @change="selectPro"
              :disabled="isDisabled"
            >
              <el-option
                v-for="type in projectNameList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标段:" prop="bid">
            <el-select
              v-model="addForm.bid"
              placeholder="请选择标段:"
              :disabled="isDisabled"
              @change="bidChange"
            >
              <el-option
                v-for="type in bidSelectList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼栋号:" prop="number">
            <el-input v-model="addForm.number"></el-input>
          </el-form-item>
          <el-form-item label="楼栋总楼层:" prop="totalFloorNum">
            <el-input v-model="addForm.totalFloorNum"></el-input>
          </el-form-item>
          <el-form-item label="非标准层数:" prop="nonStandardFloorNum">
            <el-input v-model="addForm.nonStandardFloorNum"></el-input>
          </el-form-item>
          <el-form-item label="非标准层总房间数:" prop="nonStandardTotalRoomNum">
            <el-input v-model="addForm.nonStandardTotalRoomNum"></el-input>
          </el-form-item>
          <el-form-item label="标准层数:" prop="standardFloorNum">
            <el-input v-model="addForm.standardFloorNum"></el-input>
          </el-form-item>
          <el-form-item label="标准层房间数(单层):" prop="standardRoomNum">
            <el-input v-model="addForm.standardRoomNum"></el-input>
          </el-form-item>
          <el-form-item label="标准层总房间数:" prop="totalStandardRoomNum">
            <el-input v-model="addForm.totalStandardRoomNum"></el-input>
          </el-form-item>
          <el-form-item label="楼栋总房间数:" prop="totalRoomNum">
            <el-input v-model="addForm.totalRoomNum"></el-input>
          </el-form-item>
          <el-form-item label="楼栋类型:" prop="type">
            <el-select v-model="addForm.type" placeholder="请选择楼栋类型:">
              <el-option label="主楼" value="0"></el-option>
              <el-option label="楼栋" value="1"></el-option>
            </el-select>
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
  tungList,
  proList,
  bidList,
  bidListNothing,
  saveTungList,
  updateTungList,
  delTung,
  proListNothing,
  tungListNothing,
  buildImport
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import pagination from "@/components/pagination/pagination";
import axios from "axios";
export default {
  name: "tungList",
  components: {
    pagination
  },
  inject: ["reload"],
  data() {
    return {
      options: {
        secondNav: "项目管理",
        thirdNav: "楼栋列表"
      },
      twoLeel: true, // 当前列表还是 二级列表
      showContent: true, // 内容 or 详情
      name: "", // 标段名称
      tableData: [], // 标段列表
      showModel: false, // 隐藏编辑模态框
      dialogTitle: "添加楼栋",
      currentPage: 1, // 页码
      limit: 10, // 一页5条数据
      total: 0,
      showPage: true, // 分页显示
      handle: {
        bid: "", // 标段id
        id: "", // 数据id
        number: "", // 楼栋号
        projectName: "", // 项目名称
        userId: "", // 用户id
        toKen: "", // 用户token
        pageSize: 10, // 页数
        pageNum: 1 //  页码
      },
      // 添加
      addForm: {
        bid: "", // 标段id
        bidName: "",
        projectId: "", // 项目id
        number: "",
        totalFloorNum: "",
        nonStandardFloorNum: "",
        nonStandardTotalRoomNum: "",
        standardFloorNum: "",
        standardRoomNum: "",
        totalStandardRoomNum: "",
        totalRoomNum: "",
        type: ""
      },
      bidSelectList: [], // 标段的列表
      btnText: "提 交", // 模态框按钮文字
      userRule: {
        projectName: [
          { required: true, message: "请选择项目名称", trigger: "blur" }
        ],
        bidName: [
          { required: true, message: "请选择标段名称", trigger: "blur" }
        ],
        number: [{ required: true, message: "请输入楼栋号", trigger: "blur" }],
        totalFloorNum: [
          { required: true, message: "请输入楼栋总楼层", trigger: "blur" }
        ],
        nonStandardFloorNum: [
          { required: true, message: "请输入非标准层数", trigger: "blur" }
        ],
        nonStandardTotalRoomNum: [
          { required: true, message: "请输入非标准层总房间数", trigger: "blur" }
        ],
        standardFloorNum: [
          { required: true, message: "请输入标准层数", trigger: "blur" }
        ],
        standardRoomNum: [
          {
            required: true,
            message: "请输入标准层房间数(单层)",
            trigger: "blur"
          }
        ],
        totalStandardRoomNum: [
          { required: true, message: "请输入标准层总房间数", trigger: "blur" }
        ],
        totalRoomNum: [
          { required: true, message: "请输入楼栋总房间数", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择楼栋类型", trigger: "blur" }]
      },
      projectNameList: [], //项目列表
      // 单位类型
      unitsList: [
        { type: "建设单位", value: 1 },
        { type: "监理单位", value: 2 },
        { type: "施工单位(总包)", value: 3 },
        { type: "施工单位(分包)", value: 4 },
        { type: "设计单位", value: 5 },
        { type: "勘察单位", value: 6 }
      ],
      isDisabled: false,// 修改时启用
      filetype: "xls",
      title : '楼栋导入'
    };
  },
  filters: {
    // 楼栋类型
    buildType(val) {
      return val === "0" ? "主楼" : "楼栋";
    }
  },
  created() {
    const userInfo = this.$store.state.userInfo;
    this.handle.userId = userInfo.id;
    this.handle.toKen = userInfo.token;
    this.handle.pageSize = this.limit;
    this.handle.pageNum = this.currentPage;
    if (this.$route.query.id != undefined) {
      this.twoLeel = false;
      this.isDisabled = true;
      this.addForm.projectName = this.$route.query.projectName;
      this.addForm.projectId = this.$route.query.projectId;
      this.addForm.bidName = this.$route.query.name;
      this.addForm.bid = this.$route.query.id;
      // 当前标段和项目的数据
      this.handle.bid = this.$route.query.id;
      this.handle.projectName = this.$route.query.projectName;
    } else {
      this.isDisabled = false;
      this.twoLeel = true;
    }

    this.getList();
    this.getTable(this.handle);
  },
  watch: {
    $route(val) {
      let arr = Object.keys(val.query);
      if (arr.length === 0) {
        // 表示一级路由跳转，不带参数
        this.twoLeel = true;
        this.handle.bid = "";
        this.handle.projectid = "";
        this.handle.projectName = "";
        this.addForm.bid = "";
        this.addForm.projectId = "";
      } else {
        this.twoLeel = false;
      }
    }
  },
  methods: {
    importInterface() {
      return buildImport;
    },

    // 下载模板
    async getMould() {
      let params = {
        userid: this.userid,
        token: this.token,
      };
      let res = await axios({
        method: "POST",
        url: axios.defaults.baseURL + "/construction/project/bid/build/mould",
        responseType: "blob",
        data: params,
      });
      let blob = new Blob([res.data], { type: `application/vnd.ms-excel` });
      let link = document.createElement("a");
      let objectUrl = URL.createObjectURL(blob); // 创建URL
      link.href = objectUrl;
      link.download = "楼栋--模板"; // 自定义文件名
      link.click(); // 下载文件
      URL.revokeObjectURL(objectUrl); // 释放内存
    },

    // 获取表格列表
    getTable(params) {
      // tungList(params)
      // 无权限获取楼栋
      tungListNothing(params)
        .then(res => {
          if (res.data.status === "0") {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch(err => {
          this.$message({ type: "error", message: "服务器响应失败..." });
        });
    },
    // 点击添加 加载项目列表
    getList(pageNum = 1) {
      let params = {
        // name: "",
        pageNum,
        pageSize: 10000,
        token: this.handle.toKen,
        userid: this.handle.userId
      };
      // proList(params)
      // 修改为无权限获取项目名称
      proListNothing(params)
        .then(res => {
          if (res.data.status === "0") {
            this.projectNameList = res.data.data.list;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch(err => console.log(err));
    },
    // 选择项目
    selectPro(id) {
      this.addForm.bid = "";
      this.getDid(id);
    },
    // 选择标段
    bidChange(val) {
      this.addForm.bid = val;
    },
    // 选择项目后  获取标段列表
    getDid(value) {
      let params = {
        token: this.handle.toKen,
        userid: this.handle.userId,
        pageSize: 10000, // 页数
        pageNum: 1, //  页码
        name: "",
        projectId: value // 项目标识
      };
      // bidList(params)
      // 无权限获取标段
      bidListNothing(params)
        .then(res => {
          if (res.data.status === "0") {
            this.bidSelectList = res.data.data.list;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch(err => {
          this.$message({ type: "error", message: "服务器响应失败..." });
        });
    },
    // 查询
    onSearch() {
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getTable(this.handle);
    },
    // 添加
    detailForm(s, row) {
      this.showModel = true;
      if (s === 0) {
        //新增
        this.dialogTitle = "添加楼栋";
        if (this.$route.query.id != undefined) {
          this.isDisabled = true;
          this.getDid(this.addForm.projectId);
        } else {
          this.isDisabled = false;
        }
      } else if (s === 1) {
        // 修改
        this.dialogTitle = "修改楼栋";
        row.bid = row.bidId;
        this.addForm = JSON.parse(JSON.stringify(row));
        this.getDid(this.addForm.projectId);
        this.isDisabled = true;
      }
    },
    // 选择查询项目
    hanldPro(val) {
      this.handle.bid = "";
      if (val.id) {
        this.getDid(val.id);
        this.handle.projectId = val.id;
        this.handle.projectName = val.name;
      } else {
        this.bidSelectList = [];
        this.handle.projectId = "";
        this.handle.projectName = "";
      }
    },
    // 选择查询的标段
    handleBid(val) {
      this.handle.bid = val;
    },
    // 选择项目后  获取标段列表
    /*  getDid(value) {
      let params = {
        token: this.handle.toKen,
        userid: this.handle.userId,
        pageSize: 10, // 页数
        pageNum: 1, //  页码
        name: "",
        projectId: value // 项目标识
      };
      bidList(params)
        .then(res => {
          if (res.data.status === "0") {
            this.bidSelectList = res.data.data.list;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch(err => {
          this.$message({ type: "error", message: "服务器响应失败..." });
        });
    }, */
    // 取消编辑
    cancel() {
      this.showModel = false;
      this.addForm.bid = "";
      this.addForm = {
        bid: "", // 标段id
        bidName: "",
        number: "",
        totalFloorNum: "",
        nonStandardFloorNum: "",
        nonStandardTotalRoomNum: "",
        standardFloorNum: "",
        standardRoomNum: "",
        totalStandardRoomNum: "",
        totalRoomNum: "",
        type: ""
      };
      this.bidSelectList = [];
      this.$refs.addForm.resetFields();
    },
    // 确认
    submitButton() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (this.dialogTitle === "添加楼栋") {
            let params = {
              bid: this.addForm.bid, // 标段id
              projectId: this.addForm.projectId, // 项目id
              number: this.addForm.number,
              totalFloorNum: this.addForm.totalFloorNum,
              nonStandardFloorNum: this.addForm.nonStandardFloorNum,
              nonStandardTotalRoomNum: this.addForm.nonStandardTotalRoomNum,
              standardFloorNum: this.addForm.standardFloorNum,
              standardRoomNum: this.addForm.standardRoomNum,
              totalStandardRoomNum: this.addForm.totalStandardRoomNum,
              totalRoomNum: this.addForm.totalRoomNum,
              type: this.addForm.type,
              token: this.handle.toKen,
              userid: this.handle.userId
            };
            saveTungList(params)
              .then(res => {
                if (res.data.status === "0") {
                  this.$message({
                    type: "success",
                    message: "新增成功!"
                  });
                  this.cancel();
                  this.getTable(this.handle);
                } else {
                  judgeErroCode(res.data.status, res.data.message);
                }
              })
              .catch(res => {});
          } else if (this.dialogTitle === "修改楼栋") {
            let params = {
              id: this.addForm.id,
              bid: this.addForm.bid, // 标段id
              projectId: this.addForm.projectId, // 项目id
              number: this.addForm.number,
              totalFloorNum: this.addForm.totalFloorNum,
              nonStandardFloorNum: this.addForm.nonStandardFloorNum,
              nonStandardTotalRoomNum: this.addForm.nonStandardTotalRoomNum,
              standardFloorNum: this.addForm.standardFloorNum,
              standardRoomNum: this.addForm.standardRoomNum,
              totalStandardRoomNum: this.addForm.totalStandardRoomNum,
              totalRoomNum: this.addForm.totalRoomNum,
              type: this.addForm.type,
              token: this.handle.toKen,
              userid: this.handle.userId
            };
            updateTungList(params)
              .then(res => {
                if (res.data.status === "0") {
                  this.$message({
                    type: "success",
                    message: "修改成功!"
                  });
                  this.cancel();
                  this.getTable(this.handle);
                } else {
                  judgeErroCode(res.data.status, res.data.message);
                }
              })
              .catch(res => {});
          }
        }
      });
    },
    // 去单位
    goCompany(row) {
      // 带参数
      this.$router.push({
        path: "/bidUnitList",
        query: {
          projectName: row.projectName,
          projectId: row.projectId,
          name: row.bidName,
          id: row.id,
          bidId: row.bidId,
          source: "buildList"
        }
      });
    },
    // 删除单位
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: row.id,
            token: this.handle.toKen,
            userId: this.handle.userId
          };
          delTung(params)
            .then(res => {
              this.$message({ type: "success", message: "删除成功!" });
              this.getTable(this.handle);
            })
            .catch(err => {
              this.$message({ type: "error", message: "服务器响应失败..." });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handle.pageNum = val;
      this.getTable(this.handle);
    },
    /**
     * 分页每条数目改变，则回到第一页数据，列表重新加载
     */
    handleSizeChange(val) {
      this.limit = val;
      this.handle.pageSize = val;
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getTable(this.handle);
    },
    // 回到参建单位列表
    changePageStatus() {
      this.twoLeel = true;
      this.isDisabled = false;
      this.addForm.projectName = "";
      this.addForm.bidName = "";

      let path = this.$route.path; //先获取路由路径
      this.$router.push(path); //再跳转路由路径，query参数没带过去，所以被清除了
      this.reload();
    }
  }
};
</script>

<style scoped lang='less'>
.content {
  padding-left: 15px;
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
</style>