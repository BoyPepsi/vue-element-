<template>
  <div id="baseList">
    <bread-crumb :options="options"></bread-crumb>
    <div class="content">
      <div v-if="showContent">
        <el-form :inline="true" class="demo-form-inline">
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
              <span>{{addForm.projectName}}</span>
            </el-form-item>
            <el-form-item label="标段:">
              <span>{{addForm.bidName}}</span>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button @click="onSearch" size="medium" icon="el-icon-search" v-if="twoLeel">查询</el-button>
            <el-button @click="goBasement" size="medium" v-permission="{action: 'construction:project:bid:basement:find' }" v-if="twoLeel">查询地下室</el-button>
            <el-button
              type="primary"
              @click="detailForm(0,'')"
              v-permission="{action: 'construction:project:bid:basement:save' }"
              size="medium"
              icon="el-icon-plus"
            >添加地下室</el-button>
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
            >返回地下室列表</el-button>
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
              label="项目名称"
              prop="projectName"
              min-width="10%"
              align="center"
              v-if="twoLeel"
            ></el-table-column>
            <el-table-column label="标段" prop="bName" min-width="10%" align="center"></el-table-column>
            <el-table-column label="地下室区块" prop="name" min-width="20%" align="center"></el-table-column>
            <el-table-column label="层数" prop="floorNum" min-width="20%" align="center"></el-table-column>
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
                  v-permission="{action: 'construction:project:bid:basement:update' }"
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
      <!-- 查询页面展示  查询地下室区块 -->
      <baseDetail v-else @changePage="changePage"></baseDetail>
      <!--添加 修改-模态框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="showModel"
        :before-close="cancel"
        width="40%"
        center
      >
        <el-form :model="addForm" :rules="userRule" ref="addForm" label-width="150px">
          <el-form-item label="项目名称:" prop="projectId">
            <el-select
              v-model="addForm.projectId"
              placeholder="请选择项目名称:"
              @change="selectPro"
              value-key="id"
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
          <el-form-item label="区块名称:" prop="name">
            <el-input v-model="addForm.name" style="width: 36%"></el-input>
          </el-form-item>
          <!-- prop="buildIds" -->
          <el-form-item label="楼栋:" prop="modelCheckList">
            <div class="check_class">
              <!-- <div v-for="ite in buildData" :key="ite.id">{{ite.number}}</div> -->
              <el-checkbox-group v-model="addForm.modelCheckList" @change="changeCheckbox">
                <div class="no_class" v-show="showBuild">暂无数据</div>
                <el-checkbox
                  v-for="item in buildData"
                  :label="item.number"
                  :key="item.id"
                  :value="item.number"
                >{{item.number}}#楼</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="地下室层数:" prop="floorNum">
            <el-select v-model="addForm.floorNum" placeholder="请选择地下室层数:">
              <el-option
                v-for="item in foolNum"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              ></el-option>
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
  baseList,
  tungList,
  proList,
  bidList,
  saveBaseList,
  updateBaseList,
  delBaseList,
  serchLit,
  proListNothing,
  bidListNothing,
  baseListNothing,
  basementImport
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import pagination from "@/components/pagination/pagination";
import axios from "axios";
export default {
  name: "baseList",
  components: {
    pagination
  },
  inject: ["reload"],
  data() {
    return {
      options: {
        secondNav: "项目管理",
        thirdNav: "地下室列表"
      },
      checkAll: false,
      twoLeel: true, // 当前列表还是 二级列表
      showContent: true, // 内容 or 详情
      name: "", // 项目名称
      tableData: [], // 地下室列表
      showModel: false, // 隐藏编辑模态框
      dialogTitle: "添加楼栋",
      projectName: "", // 项目名称
      buildData: [], // 楼栋
      showBuild: true, // 隐藏暂无 楼栋 数据
      // 添加时地下室层数
      foolNum: [
        { value: "0", key: "0" },
        { value: "-1", key: "-1" },
        { value: "-2", key: "-2" },
        { value: "-3", key: "-3" },
        { value: "-4", key: "-4" },
        { value: "-5", key: "-5" },
        { value: "-6", key: "-6" },
        { value: "-7", key: "-7" },
        { value: "-8", key: "-8" },
        { value: "-9", key: "-9" },
        { value: "-10", key: "-10" }
      ],

      handle: {
        bid: "", // 标段id
        id: "", // 数据id
        name: "", // 区块名称
        projectid: "", // 项目id
        projectName: "", // 项目name
        userId: "", // 用户id
        toKen: "", // 用户token
        pageSize: 10, // 页数
        pageNum: 1 //  页码
      },
      // v-model的 checkbox
      currentPage: 1, // 页码
      limit: 10, // 一页5条数据
      total: 0,
      showPage: true, // 分页显示

      // 添加
      addForm: {
        bid: "", // 标段id
        buildIds: [], // 楼栋id  // 选中的数据
        floorNum: "", // 层数值
        name: "", // 区块名称
        bidName: "", // 标段name
        projectName: "", // 项目name
        projectId: "", // 项目id
        userId: "", // 用户id
        toKen: "", // 用户token
        pageSize: 10, // 页数
        pageNum: 1, //  页码
        modelCheckList: []
      },
      currentRowId: "", // 编辑时当前ID
      bidSelectList: [], // 标段的列表
      btnText: "提 交", // 模态框按钮文字
      userRule: {
        projectId: [
          { required: true, message: "请选择项目名称", trigger: "blur" }
        ],
        bid: [{ required: true, message: "请选择标段名称", trigger: "blur" }],
        name: [{ required: true, message: "请输入区块名称", trigger: "blur" }],
        floorNum: [
          { required: true, message: "请选择地下室楼层", trigger: "change" }
        ]
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
      isDisabled: false, // 修改时启用
      filetype: "xls",
      title : '地下室导入'
    };
  },
  filters: {
    // 单位类型
    unitType(val) {
      return val === "1"
        ? "建设单位"
        : val === "2"
        ? "监理单位"
        : val === "3"
        ? "施工单位(总包)"
        : val === "4"
        ? "施工单位(分包)"
        : val === "5"
        ? "设计单位"
        : "勘察单位";
    }
  },
  created() {
    const userInfo = this.$store.state.userInfo;
    this.handle.userId = userInfo.id;
    this.handle.toKen = userInfo.token;

    this.handle.pageSize = this.limit;
    this.handle.pageNum = this.currentPage;

    // 判断是否从路由跳转过来
    // 是的话  twoLeel = false;
    if (this.$route.query.id != undefined) {
      this.twoLeel = false;
      this.isDisabled = true;
      this.addForm.projectName = this.$route.query.projectName;
      this.addForm.bidName = this.$route.query.name;

      // 当前标段和项目的数据
      this.handle.bid = this.$route.query.id;
      this.handle.projectid = this.$route.query.projectId;
      this.handle.projectName = this.$route.query.projectName;
    } else {
      this.isDisabled = false;
      this.twoLeel = true;
    }
    this.getTable(this.handle);
    this.getList();
  },
  watch: {
    $route(val) {
      let arr = Object.keys(val.query);
      if (arr.length === 0) {
        // 表示一级路由跳转，不带参数
        this.twoLeel = true;
        this.isDisabled = false;
        this.handle.bid = "";
        this.handle.projectid = "";
        this.handle.projectName = "";
        this.addForm.bid = "";
        this.addForm.projectId = "";
      } else {
        this.twoLeel = false;
        this.isDisabled = true;
      }
    }
  },
  methods: {
    importInterface() {
      return basementImport;
    },

    // 下载模板
    async getMould() {
      let params = {
        userid: this.userid,
        token: this.token,
      };
      let res = await axios({
        method: "POST",
        url: axios.defaults.baseURL + "/construction/project/bid/basement/mould",
        responseType: "blob",
        data: params,
      });
      let blob = new Blob([res.data], { type: `application/vnd.ms-excel` });
      let link = document.createElement("a");
      let objectUrl = URL.createObjectURL(blob); // 创建URL
      link.href = objectUrl;
      link.download = "地下室--模板"; // 自定义文件名
      link.click(); // 下载文件
      URL.revokeObjectURL(objectUrl); // 释放内存
    },

    // 获取表格列表
    getTable(params) {
      baseList(params)
      // baseListNothing(params)
        .then(res => {
          if (res.data.status === "0") {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.tableData = [];
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch(err => {
          this.$message({ type: "error", message: "服务器响应失败..." });
        });
    },
    // 点击添加 加载项目列表
    getList() {
      let params = {
        // name: "",
        pageNum: 1,
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
    goBasement() {
      this.showContent = false;
    },
    // 点击跳转查询的页面
    changePage() {
      this.showContent = true;
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
    // 选择项目
    selectPro(id) {
      this.addForm.bidName = "";
      this.addForm.bid = "";
      this.getDid(id);
      this.addForm.projectId = id;
    },
    // 选择标段
    bidChange(id) {
      this.addForm.bid = id;
      this.getTungList(id, "");
    },
    // chaeck changge事件
    changeCheckbox(val) {
      this.addForm.buildIds = val;
    },
    // 获取 添加 楼栋列表
    async getTungList(bid, build) {
      let params = {
        pageNum: 1,
        pageSize: 10,
        bid: bid,
        token: this.handle.toKen,
        userId: this.handle.userId
      };
      try {
        let res = await tungList(params);
        if (res.data.status === "0") {
          if (res.data.data.list.length > 0) {
            console.log(res.data.data.list);
            this.buildData = res.data.data.list;
            if (build != "") {
              this.addForm.buildIds = [];
              var arr = build.split(",");
              arr.forEach(element => {
                res.data.data.list.forEach(val => {
                  if (element === val.number) {
                    this.addForm.modelCheckList.push(val.number);
                  }
                });
              });
            } else {
              this.addForm.modelCheckList = [];
            }
            this.addForm.buildIds = this.addForm.modelCheckList;
            this.showBuild = false;
          } else {
            this.buildData = [];
            this.showBuild = true;
          }
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
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
      if (s === 0) {
        //新增
        this.dialogTitle = "添加地下室";
        if (this.$route.query.id != undefined) {
          this.isDisabled = true;
          this.addForm.projectId = this.$route.query.projectId;
          this.addForm.bid = this.$route.query.id;
          this.getDid(this.addForm.projectId);
          this.getTungList(this.$route.query.id, "");
        } else {
          this.isDisabled = false;
          this.addForm.projectId = "";
          this.addForm.bid = "";
          this.bidSelectList = [];
          this.addForm.name = "";
        }
        this.currentRowId = "";
      } else if (s === 1) {
        // 修改
        this.dialogTitle = "修改地下室";
        this.addForm.projectId = row.projectId;
        this.getList();
        this.addForm.bid = row.bId;
        this.getDid(this.addForm.projectId);
        this.addForm.name = row.name;
        this.addForm.floorNum = row.floorNum;
        this.addForm.bidName = row.bName;
        this.showBuild = false;
        this.getTungList(row.bId, row.buildIds);
        this.isDisabled = true;
        this.currentRowId = row.id;
      }
      this.showModel = true;
    },
    // 取消编辑
    cancel() {
      this.showModel = false;
      // 判断有没有路由数据
      // this.addForm = {};
      this.addForm.bid = "";
      this.addForm.buildIds = [];
      this.addForm.floorNum = "";
      this.addForm.name = "";
      this.addForm.bidName = "";
      this.addForm.projectName = "";
      this.addForm.projectId = "";
      if (this.$route.query.id != undefined) {
        this.addForm.projectName = this.$route.query.projectName;
        this.addForm.bidName = this.$route.query.name;
      }
      this.buildData = [];
      this.addForm.modelCheckList = [];
      this.showBuild = true;
      this.$refs.addForm.resetFields();
    },
    // 确认
    submitButton() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (this.dialogTitle === "添加地下室") {
            let ids = "";
            if (this.addForm.buildIds.length > 0) {
              ids = this.addForm.buildIds.join();
            }
            let params = {
              bid: this.addForm.bid, // 标段id
              projectId: this.addForm.projectId, // 项目id
              buildIds: ids, // 数组  楼栋id
              name: this.addForm.name,
              floorNum: this.addForm.floorNum, // 地下室层数
              token: this.handle.toKen,
              userid: this.handle.userId
            };
            if (this.$route.query.id != undefined) {
              params.bid = this.$route.query.id;
              params.projectId = this.$route.query.projectId;
            }
            saveBaseList(params)
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
              .catch(res => {
                this.$message({ type: "error", message: "服务器响应失败..." });
              });
          } else {
            let ids = "";
            if (this.addForm.buildIds.length > 0) {
              ids = this.addForm.buildIds.join();
            }
            let params = {
              id: this.currentRowId,
              bid: this.addForm.bId, // 标段id
              projectId: this.addForm.projectId, // 项目id
              buildIds: ids, // 数组  楼栋id
              name: this.addForm.name,
              floorNum: this.addForm.floorNum, // 地下室层数
              token: this.handle.toKen,
              userid: this.handle.userId
            };
            updateBaseList(params)
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
              .catch(res => {
                this.$message({ type: "error", message: "服务器响应失败..." });
              });
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
          name: row.bName,
          id: row.id,
          bidId: row.bId,
          source: "basementList"
        }
      });
    },
    // 删除地下室
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
          delBaseList(params)
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
      this.addForm.modelCheckList = [];
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
  .check_class {
    width: 62%;
    border: 1px #ccc solid;
    padding: 10px;
    max-height: 100px;
    overflow-y: auto;
    .no_class {
      font-size: 14px;
    }
  }
}
.pagination {
  margin-top: 15px;
  text-align: center;
}
/* // 表格-删除按钮 */
.red {
  color: #ff0000;
}
</style>