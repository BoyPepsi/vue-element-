<template>
  <div id="unitList">
    <bread-crumb :options="options"></bread-crumb>
    <div class="content">
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="项目名称" v-if="twoLeel">
            <el-select
              v-model="handle.projectid"
              placeholder="请选择项目名称:"
              @change="changeSearchProject"
              value-key="id"
              clearable
              :clear="changeSearchProject"
            >
              <el-option
                v-for="type in projectList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
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
            <!-- <el-button @click="onReset" size="small" icon="el-icon-setting" v-if="twoLeel">重置</el-button> -->
            <el-button
              type="primary"
              @click="detailForm(0,'')"
              v-permission="{action: 'construction:project:bid:unit:save' }"
              size="medium"
              icon="el-icon-plus"
            >添加参建单位</el-button>
            <div style="float:right;marginRight:40px">
              <import-file :fileaccept="filetype" :importFile="importInterface" :title="title" @getList="getTableList(handle)"></import-file>
            </div>
            <el-button type="primary" @click="getMould()" size="medium" icon="el-icon-download" style="marginLeft:20px">下载模板</el-button>
            <el-button
              v-if="!twoLeel"
              type="success"
              icon="el-icon-back"
              @click="changePageStatus"
              size="medium"
              style="margin-left:15px"
            >返回参建单位列表</el-button>
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
              min-width="20%"
              align="center"
              v-if="twoLeel"
            ></el-table-column>
            <el-table-column label="单位" prop="name" min-width="20%" align="center"></el-table-column>
            <el-table-column label="单位类型" prop="type" min-width="10%" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.type | unitType}}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系人" prop="contactPerson" min-width="20%" align="center"></el-table-column>
            <el-table-column label="联系电话" prop="contactPhoneNumber" min-width="20%" align="center"></el-table-column>
            <el-table-column label="操作" min-width="20%" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-permission="{action: 'construction:project:bid:unit:update' }"
                  @click="detailForm(1,scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="text"
                  class="red"
                  icon="el-icon-delete"
                  v-permission="{action: 'construction:project:bid:unit:delete' }"
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

      <!-- =======================================================================分割线，下面是添加的模态框的html================================================ -->

      <el-dialog
        title="添加参建单位"
        :visible.sync="showAddModel"
        :before-close="cancelAdd"
        width="75%"
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
              placeholder="请选择项目名称:"
              @change="changeModelProject"
              :disabled="isQuery"
            >
              <el-option
                v-for="type in projectList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- prop="bidName" -->
          <el-form-item label="标段:" prop="bid">
            <el-select
              v-model="addForm.bid"
              placeholder="请选择标段:"
              :disabled="isQuery"
              @change="changeModelBid"
            >
              <el-option
                v-for="type in bidSelectList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div style="display:flex;" v-for="(ite,index) in addForm.dataProject" :key="index">
            <el-form-item
              label="单位类型:"
              :prop="'dataProject.'+ index + '.type'"
              :rules="dataProject.type"
            >
              <el-select
                v-model="ite.type"
                placeholder="请选择单位类型:"
                :disabled="$route.query.source && $route.query.source.length > 0"
                @change="changeAddUintsType($event,index)"
              >
                <el-option
                  v-for="item in unitsList"
                  :key="item.value"
                  :label="item.type"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="单位:"
              :prop="'dataProject.'+ index + '.unitId'"
              :rules="dataProject.unitId"
            >
              <el-select
                v-model="ite.unitId"
                placeholder="请选择单位:"
                @change="changeAddUnit($event,index)"
              >
                <el-option
                  v-for="use in ite.unitList"
                  :key="use.id"
                  :label="use.name"
                  :value="use.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- prop="contactPerson" -->
            <el-form-item label="联系人:">
              <el-input v-model="ite.contactPerson"></el-input>
            </el-form-item>
            <!-- prop="contactPhoneNumber" -->
            <el-form-item label="联系电话:">
              <el-input maxlength="11" v-model="ite.contactPhoneNumber"></el-input>
            </el-form-item>
            <div>
              <el-button
                @click="addUint(index)"
                icon="el-icon-plus"
                v-if="index === 0"
                size="medium"
              ></el-button>
              <el-button
                @click.prevent="removeDomain(ite)"
                icon="el-icon-delete"
                v-if="index !== 0"
                size="medium"
              ></el-button>
            </div>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd" size="medium">取 消</el-button>
          <el-button type="primary" @click="submitAdd" size="mini">保 存</el-button>
        </span>
      </el-dialog>

      <!-- =======================================================================分割线，下面是编辑的模态框的html================================================ -->

      <el-dialog title="修改参建单位" :visible.sync="showModel" :before-close="cancel" width="40%" center>
        <el-form
          :model="addForm"
          :rules="userRule"
          ref="addForm"
          label-width="100px"
          class="form_class"
        >
          <el-form-item label="项目名称:" prop="projectName">
            <el-select
              v-model="addForm.projectId"
              placeholder="请选择项目名称:"
              @change="changeModelProject"
              :disabled="isEdit"
            >
              <el-option
                v-for="type in projectList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标段:">
            <el-select v-model="addForm.bidName" placeholder="请选择标段:" :disabled="isEdit">
              <el-option
                v-for="type in bidSelectList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位类型:" prop="type">
            <el-select v-model="addForm.type" placeholder="请选择单位类型:" :disabled="isEdit">
              <el-option
                v-for="item in unitsList"
                :key="item.value"
                :label="item.type"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位:" prop="unitId">
            <el-select v-model="addForm.unitId" placeholder="请选择单位:" :disabled="isEdit">
              <el-option v-for="use in units" :key="use.id" :label="use.name" :value="use.id"></el-option>
            </el-select>
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
  unitList,
  getUnitList,
  proList,
  bidList,
  saveUnitSee,
  updateUnitList,
  delUnit,
  proListNothing,
  getUnitListNothing,
  bidListNothing,
  unitListNothing,
  bidUnitImport
} from "@/http/api.js";

import { judgeErroCode } from "@/utils/errorCode.js";
import axios from "axios";
export default {
  name: "bidUnitList",
  inject: ["reload"],
  data() {
    return {
      options: {
        secondNav: "项目管理",
        thirdNav: "参建单位列表",
      },
      twoLeel: true, // 当前列表还是 二级列表
      showContent: true, // 内容 or 详情
      name: "", // 标段名称
      tableData: [], // 标段列表
      showAddModel: false, // 隐藏添加模态框
      showModel: false, // 隐藏编辑模态框
      // showClo: false,
      currentPage: 1, // 页码
      limit: 10, // 一页5条数据
      total: 0,
      showPage: true, // 分页显示
      handle: {
        bid: "", // 标段id
        projectid: "", // 项目id
        projectName: "", //项目名称
        type: "", // 单位类型
        userId: "", // 用户id
        toKen: "", // 用户token
        pageSize: 10, // 页数
        pageNum: 1, //  页码
      },
      total: 10,
      // 添加
      addForm: {
        bid: "", // 标段id
        bidName: "", // 标段名称
        contactPerson: "", // 联系人
        contactPhoneNumber: "", // 联系电话
        type: "", // 单位类型
        projectId: "", // 项目id
        unitId: "", // 单位id
        dataProject: [],
      },

      bidSelectList: [], // 标段的列表
      btnText: "提 交", // 模态框按钮文字
      userRule: {
        projectId: [
          { required: true, message: "请选择项目名称", trigger: "change" },
        ],
        bid: [{ required: true, message: "请输入标段名称", trigger: "change" }],

        contactPerson: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
        contactPhoneNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
      },
      dataProject: {
        type: [{ required: true, message: "请选择单位类型", trigger: "focus" }],
        unitId: [
          { required: true, message: "请选择单位名称", trigger: "focus" },
        ],
      },
      projectList: [], //项目列表
      // 单位类型
      unitsList: [
        { type: "建设单位", value: 1 },
        { type: "监理单位", value: 2 },
        { type: "施工单位(总包)", value: 3 },
        { type: "施工单位(分包)", value: 4 },
        { type: "设计单位", value: 5 },
        { type: "勘察单位", value: 6 },
        { type: "检测单位", value: 7 },
        { type: "监测单位", value: 8 },
        { type: "商混供应单位", value: 9 },
      ],
      units: [], // 单位列表
      isEdit: false, // 修改时启用
      isQuery: false, // 路由参数启用
      filetype: "xls",
      title : '参建单位导入'
    };
  },
  filters: {
    // 单位类型
    unitType(val) {
      return val === 1
        ? "建设单位"
        : val === 2
        ? "监理单位"
        : val === 3
        ? "施工单位(总包)"
        : val === 4
        ? "施工单位(分包)"
        : val === 5
        ? "设计单位"
        : val === 6
        ? "勘察单位"
        : val === 7
        ? "检测单位"
        : val === 8
        ? "监测单位"
        : "商混供应单位";
    },
  },
  created() {
    const userInfo = this.$store.state.userInfo;
    this.handle.userId = userInfo.id;
    this.handle.toKen = userInfo.token;
    this.handle.pageSize = this.limit;
    this.handle.pageNum = this.currentPage;
    // 判断是否从路由跳转过来
    // 是的话  twoLeel = false;
    if (this.$route.query.id) {
      this.twoLeel = false;
      this.isQuery = true;
      this.handle.projectName = this.$route.query.projectName;
      this.getBidList(this.$route.query.projectId);
      this.handle.bid = this.$route.query.bidId;
      this.addForm.bid = this.$route.query.id;
    } else {
      this.twoLeel = true;
      this.isQuery = false;
    }
    this.getProjectList();
    this.getTableList(this.handle);
  },
  watch: {
    $route(val) {
      let arr = Object.keys(val.query);
      if (arr.length === 0) {
        // 表示一级路由跳转，不带参数
        this.twoLeel = true;
        this.handle.bid = "";
        this.handle.projectid = "";
        this.addForm.bid = "";
        this.addForm.projectId = "";
        this.isQuery = false;
        this.getTableList(this.handle);
      } else {
        this.twoLeel = false;
        this.isQuery = true;
      }
    },
  },
  methods: {

    importInterface() {
      return bidUnitImport;
    },

    // 下载模板
    async getMould() {
      let params = {
        userid: this.userid,
        token: this.token,
      };
      let res = await axios({
        method: "POST",
        url: axios.defaults.baseURL + "/construction/project/bid/unit/mould",
        responseType: "blob",
        data: params,
      });
      let blob = new Blob([res.data], { type: `application/vnd.ms-excel` });
      let link = document.createElement("a");
      let objectUrl = URL.createObjectURL(blob); // 创建URL
      link.href = objectUrl;
      link.download = "参建单位--模板"; // 自定义文件名
      link.click(); // 下载文件
      URL.revokeObjectURL(objectUrl); // 释放内存
    },
    /**
     * 进入页面加载项目名称列表
     * params:pageNum
     * create by YuXiong
     * date:2020-6-16
     */
    async getProjectList(pageNum = 1) {
      let params = {
        pageNum,
        pageSize: 10000,
        token: this.handle.toKen,
        userid: this.handle.userId,
      };
      try {
        // let res = await proList(params);
        // 修改为无权限获取项目名称
        let res = await proListNothing(params);
        if (res.data.status === "0") {
          this.projectList = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 获取单位列表数据,进入页面自动加载表格数据
     * params:params
     * create by YuXiong
     * date:2020-6-16
     */
    async getTableList(params) {
      try {
        // let res = await unitList(params);
        // 无权限参建单位列表
        let res = await unitListNothing(params);
        if (res.data.status === "0") {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 获取标段列表
     * params:value
     * create by YuXiong
     * date:2020-6-5
     */
    async getBidList(value) {
      let params = {
        token: this.handle.toKen,
        userid: this.handle.userId,
        pageSize: 10000, // 页数
        pageNum: 1, //  页码
        name: "",
        projectId: value, // 项目标识
      };
      try {
        // let res = await bidList(params);
        // 无权限获取标段
        let res = await bidListNothing(params);
        if (res.data.status === "0") {
          this.bidSelectList = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },

  

    /**
     * 点击添加参建单位，获取单位列表
     * params:pageNum
     * create by YuXiong
     * date:2020-6-16
     */
    async getUnitsList(type, index) {
      let params = {
        pageNum: 1,
        pageSize: 10000,
        token: this.handle.toKen,
        userid: this.handle.userId,
        type: type,
      };
      try {
        // let res = await getUnitList(params);
        // 修改为无权限获取单位列表
        let res = await getUnitListNothing(params);
        if (res.data.status === "0") {
          this.addForm.dataProject.forEach((item, i) => {
            if (index != null) {
              if (i === index) {
                item.unitList = res.data.data.list;
              }
            } else {
              item.unitList = res.data.data.list;
            }
          });
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },

    async getEditUnits(type) {
      let params = {
        pageNum: 1,
        pageSize: 10000,
        token: this.handle.toKen,
        userid: this.handle.userId,
        type: type,
      };
      // let res = await getUnitList(params);
      // 修改为无权限获取单位列表
      let res = await getUnitListNothing(params);
      if (res.data.status === "0") {
        this.units = res.data.data.list;
      } else {
        judgeErroCode(res.data.status, res.data.message);
      }
    },
    /**
     *
     * params:id
     * create by YuXiong
     * date:2020-6-16
     */
    changeModelProject(id) {
      this.addForm.bid = "";
      this.getBidList(id);
      this.addForm.dataProject.forEach((element) => {
        element.projectId = id;
      });
    },
    async changeAddUintsType(val, index) {
      this.addForm.dataProject.forEach((item, i) => {
        if (i === index) {
          item.unitId = "";
          this.getUnitsList(val, index);
        }
      });
    },
    // 选择查询的标段
    handleBid(val) {
      this.handle.bid = val;
    },
    /**
     * 选择标段
     * params:val
     * create by YuXiong
     * date:2020-6-16
     */
    changeModelBid(val) {
      this.addForm.dataProject.forEach((element) => {
        element.bid = val;
      });
    },
    /**
     *  选择查询项目
     * params:id
     * create by YuXiong
     * date:2020-6-16
     */
    changeSearchProject(id) {
      this.handle.bid = "";
      if (id) {
        this.getBidList(id);
        this.handle.projectId = id;
        this.handle.projectName = this.projectList.find(
          (item) => item.id === id
        ).name;
      } else {
        this.bidSelectList = [];
        this.handle.projectId = "";
        this.handle.projectName = "";
      }
    },
    /**
     * 添加参建单位----更改单位选项
     * 要获取当前单位的联系人和联系电话，并赋值到输入框
     * params:id
     * create by YuXiong
     * date:2020-6-17
     */
    changeAddUnit(id, index) {
      this.addForm.dataProject.forEach((item, i) => {
        if (index === i) {
          item.unitList.forEach((chileItem) => {
            if (chileItem.id === id) {
              item.bid = this.addForm.bid;
              item.contactPhoneNumber = chileItem.contactPhoneNumber;
              item.contactPerson = chileItem.contactPerson;
            }
          });
        }
      });
    },

    /**
     * 点击查询，重新加载表格
     * params:none
     * create by YuXiong
     * date:2020-6-16
     */
    onSearch() {
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getTableList(this.handle);
    },
    /**
     * 添加多个单位,添加一个单位就是往addForm.dataProject添加一个对象
     * params:none
     * create by YuXiong
     * date:2020-6-16
     */
    addUint() {
      let routeObj = this.$route.query;
      let routeObjLength = Object.keys(routeObj).length;
      // 有路由参数，判断是从标段过来，还是从楼栋和地下室过来，以有无source区分
      if (routeObjLength > 0) {
        if (routeObj.source) {
          let arr = [
            {
              bid: this.$route.query.id || "", // 标段id
              projectId: this.$route.query.projectId || "", // 项目id
              type: 4, // 单位类型
              unitId: "", // 单位id
              contactPerson: "",
              contactPhoneNumber: "",
              unitList: [],
            },
          ];
          this.addForm.dataProject = [...arr, ...this.addForm.dataProject];
          this.getUnitsList(arr[0].type);
        } else {
          let arr = [
            {
              bid: this.$route.query.id || "", // 标段id
              projectId: this.$route.query.projectId || "", // 项目id
              type: "", // 单位类型
              unitId: "", // 单位id
              contactPerson: "",
              contactPhoneNumber: "",
              unitList: [],
            },
          ];
          this.addForm.dataProject = [...arr, ...this.addForm.dataProject];
        }
      } else {
        let arr = [
          {
            bid: this.addForm.bid || "", // 标段id
            projectId: this.addForm.projectId || "", // 项目id
            type: "", // 单位类型
            unitId: "", // 单位id
            contactPerson: "",
            contactPhoneNumber: "",
            unitList: [],
          },
        ];
        this.addForm.dataProject = [...arr, ...this.addForm.dataProject];
      }
    },
    /**
     * 弹框添加的项选择删除
     * params:item
     * create by YuXiong
     * date:2020-6-16
     */
    removeDomain(item) {
      if (this.addForm.dataProject.length !== 1) {
        var index = this.addForm.dataProject.indexOf(item);
        if (index !== -1) {
          this.addForm.dataProject.splice(index, 1);
        }
      } else {
        this.$message({
          type: "error",
          message: "请勿全部删除, 至少保留一项!",
        });
      }
    },
    /**
     * 添加编辑打开弹窗,新增的时候判断路由有无参数，有的话赋值默认的值
     * params:s,row
     * create by YuXiong
     * date:2020-6-16
     */
    detailForm(s, row) {
      //新增
      if (s === 0) {
        let obj = {
          bid: this.addForm.bid || "", // 标段id
          projectId: this.addForm.projectId || "", // 项目id
          type: "", // 单位类型
          unitId: "", // 单位id
          contactPerson: "",
          contactPhoneNumber: "",
          unitList: [],
        };
        this.isEdit = false;
        // 如果是从其他地方跳转过来,需要加载单位列表
        if (this.$route.query.id) {
          this.addForm.projectId = this.$route.query.projectId;
          this.addForm.bid = this.$route.query.bidId;
          obj.projectId = this.$route.query.projectId;
          obj.bid = this.$route.query.bidId;
          if (this.$route.query.source) {
            obj.type = 4;
          }
        }
        console.log(this.addForm);
        this.addForm.dataProject.push(obj);
        if (obj.type > 0) {
          this.getUnitsList(obj.type, 0);
        }
        this.showAddModel = true;
      } else if (s === 1) {
        // 修改
        this.showModel = true;
        this.addForm = JSON.parse(JSON.stringify(row));
        this.isEdit = true;
        this.getEditUnits(row.type);
      }
      if (this.addForm.bid && this.addForm.bid.length > 0) {
        this.getBidList(this.addForm.projectid);
      }
    },
    /**
     * 取消编辑
     * params:none
     * create by YuXiong
     * date:2020-6-16
     */
    cancel() {
      this.showModel = false;
      this.addForm = {};
      this.addForm.dataProject = [];
      this.$refs.addForm.resetFields();
    },
    /**
     * 重置
     * params:none
     * create by YuXiong
     * date:2020-6-22
     */
    onReset() {
      this.handle.projectid = "";
      this.handle.projectName = "";
      this.handle.bid = "";
      this.handle.bidName = "";
      this.bidSelectList = [];
    },
    // 取消添加模态框
    cancelAdd() {
      this.showAddModel = false;
      this.addForm.contactPerson = "";
      this.addForm.contactPhoneNumber = "";
      this.addForm.bid = "";
      this.addForm.bidName = "";
      this.addForm.type = "";
      this.addForm.projectId = "";
      this.addForm.unitId = "";
      this.addForm.dataProject = [];
      // this.$refs.addForm.resetFields();
    },
    // 确定添加参建单位
    submitAdd() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let data = [];
          let params = {
            data: this.addForm.dataProject,
            token: this.handle.toKen,
            userid: this.handle.userId,
          };
          saveUnitSee(params)
            .then((res) => {
              if (res.data.status === "0") {
                this.$message({
                  type: "success",
                  message: "添加成功!",
                });
                this.cancelAdd();
                this.getTableList(this.handle);
              } else {
                judgeErroCode(res.data.status, res.data.message);
              }
            })
            .catch((res) => {});
        }
      });
    },
    // 确认修改参建单位
    submitButton() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let params = {
            contactPerson: this.addForm.contactPerson,
            contactPhoneNumber: this.addForm.contactPhoneNumber,
            id: this.addForm.id,
            token: this.handle.toKen,
            userid: this.handle.userId,
          };
          updateUnitList(params)
            .then((res) => {
              if (res.data.status === "0") {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.cancel();
                this.getTableList(this.handle);
              } else {
                judgeErroCode(res.data.status, res.data.message);
              }
            })
            .catch((res) => {});
        }
      });
    },
    // 删除单位
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: row.id,
            token: this.handle.toKen,
            userId: this.handle.userId,
          };
          delUnit(params)
            .then((res) => {
              this.$message({ type: "success", message: "删除成功!" });
              this.getTableList(this.handle);
            })
            .catch((err) => {
              this.$message({ type: "error", message: "服务器响应失败..." });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handle.pageNum = val;
      this.getTableList(this.handle);
    },
    /**
     * 分页每条数目改变，则回到第一页数据，列表重新加载
     */
    handleSizeChange(val) {
      this.limit = val;
      this.handle.pageSize = val;
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getTableList(this.handle);
    },
    // 回到参建单位列表
    changePageStatus() {
      this.addForm = {};
      this.addForm.dataProject = [
        {
          bid: "", // 标段id
          projectId: "", // 项目id
          type: "", // 单位类型
          unitId: "", // 单位id
          contactPerson: "",
          contactPhoneNumber: "",
        },
      ];
      let path = this.$route.path; //先获取路由路径
      this.$router.push(path); //再跳转路由路径，query参数没带过去，所以被清除了
      this.reload();
    },
  },
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
      margin-right: 10px;
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