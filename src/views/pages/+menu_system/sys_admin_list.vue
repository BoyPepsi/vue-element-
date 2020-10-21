<template>
  <div id="sysadminList">
    <bread-crumb :options="options"></bread-crumb>
    <div class="content">
      <el-form :inline="true" :model="handle" class="demo-form-inline">
        <el-form-item label="手机">
          <el-input maxlength="20" v-model="handle.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="handle.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="公司">
          <el-select
            v-model="handle.dicId"
            @change="searchCompanyChange"
            :disabled="admin.system == false"
          >
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="handle.branchId"
            @change="searchBranchChange"
            :disabled="admin.branch == true || admin.group == true"
          >
            <el-option
              v-for="item in searchBranchList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="组">
          <el-select v-model="handle.groupId" :disabled="admin.group == true">
            <el-option
              v-for="item in searchGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="handle.state" clearable>
            <el-option label="在职" value="1"></el-option>
            <el-option label="离职" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearch" size="small" icon="el-icon-search">查询</el-button>
          <el-button
            type="primary"
            @click="showFormModel('add',null)"
            size="small"
            icon="el-icon-plus"
            v-permission="{action: 'admin:sysadmin:save' }"
          >添加</el-button>
          <el-button @click="onReset" size="small" icon="el-icon-setting">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table">
        <el-table
          :data="tableList"
          border
          style="width: 100%"
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column label="用户" prop="name" width="200" align="center"></el-table-column>
          <el-table-column label="手机" prop="phone" min-width="15%" align="center"></el-table-column>
          <el-table-column label="公司" prop="dicName" min-width="15%" align="center"></el-table-column>
          <el-table-column label="部门" prop="branchName" min-width="15%" align="center"></el-table-column>
          <el-table-column label="组" prop="groupName" min-width="15%" align="center"></el-table-column>
          <el-table-column label="状态" prop="state" min-width="10%" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.state===1?'success':(scope.row.state===0?'danger':'')"
              >{{scope.row.state===1?'在职':'离职'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="登录时间" prop="lastLogin" min-width="20%" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.lastLogin | getDate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="20%" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="showFormModel('edit',scope.row)"
                shiro:hasPermission="admin:sysadmin:update"
                v-permission="{action: 'admin:sysadmin:update' }"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                class="red"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                v-permission="{action: 'admin:sysadmin:delete' }"
              >删除</el-button>
              <el-button
                @click="resetPasswordFun(scope.row)"
                size="mini"
                type="text"
                icon="el-icon-setting"
                v-permission="{action: 'admin:sysadmin:reset' }"
              >重置密码</el-button>
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

      <!-- -----------------------------------------------------------------------------分割线-------------------------------------------------- -->

      <!-- 编辑-新增-弹窗 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="showModel"
        width="50%"
        :before-close="handleClose"
        center
      >
        <div class="data_info">
          <el-form :model="editForm" :rules="userRule" ref="editForm" label-width="100px">
            <el-form-item label="是否管理员:" prop="isAdmin">
              <!-- 看登陆后isAdmin是否为管理员  如果是2 用户禁用  :disabled="'this.$store.state.userInfo.isAdmin===1'?true:false"-->
              <el-select
                placeholder="是否为管理员:"
                v-model="editForm.isAdmin"
                @change="adminChange"
                style="width:76%"
                :disabled="admin.system == false"
              >
                <el-option
                  v-for="item in userType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称:" prop="name">
              <el-input maxlength="30" v-model="editForm.name" style="width:76%"></el-input>
            </el-form-item>
            <el-form-item label="手机:" prop="phone" v-if="editForm.isAdmin == 2">
              <el-input
                maxlength="11"
                v-model.number="editForm.phone"
                :disabled="!idAddUser"
                style="width:76%"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户名:" prop="userName" v-if="editForm.isAdmin == 1">
              <el-input
                maxlength="20"
                v-model="editForm.userName"
                :disabled="!idAddUser"
                style="width:76%"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态:" prop="state">
              <el-select placeholder="请选择状态:" v-model="editForm.state" style="width:76%">
                <el-option label="在职" :value="1"></el-option>
                <el-option label="离职" :value="0" v-if="isState"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="密码:" prop="password" v-if="idAddUser == true">
              <el-input v-model="editForm.password" type="password" style="width:76%"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="checkPass" v-if="idAddUser == true">
              <el-input v-model="editForm.checkPass" type="password" style="width:76%"></el-input>
            </el-form-item>
            <!-- prop="dicName"  -->
            <el-form-item label="选择公司:" prop="dicId" v-if="editForm.isAdmin == 2">
              <el-select
                placeholder="请选择选择公司:"
                v-model="editForm.dicId"
                value-key="name"
                @change="companyChange"
                style="width:76%"
                :disabled="admin.system == false"
                :clearable="true"
                :clear="companyChange"
              >
                <el-option
                  v-for="item in companyList"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- prop="branchName" 部门的必选 -->
            <el-form-item label="部门:" v-if="editForm.isAdmin == 2">
              <el-select
                placeholder="请选择部门:"
                v-model="editForm.branchId"
                value-key="name"
                @change="branchChange"
                :clearable="true"
                :clear="branchChange"
                style="width:76%"
                :disabled="admin.branch == true || admin.group == true"
              >
                <el-option
                  v-for="item in branchList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="组:" v-if="editForm.isAdmin == 2">
              <el-select
                placeholder="请选择组:"
                v-model="editForm.groupId"
                value-key="name"
                @change="groupChange"
                :clearable="true"
                :clear="groupChange"
                style="width:76%"
                :disabled="admin.group == true"
              >
                <el-option
                  v-for="item in groupList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="角色权限: " prop="roleId">
              <!-- :disabled="roleType===1?true:false" -->
              <el-select
                placeholder="请选择角色权限:"
                v-model="editForm.roleId"
                clearable
                style="width:76%"
              >
                <el-option
                  v-for="item in adminList"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权限类型:" prop="dataType" v-if="editForm.dicId.length > 0">
              <el-select
                placeholder="请选择权限类型:"
                v-model="editForm.dataType"
                @change="dataTypeChange"
                style="width:76%"
                :disabled="true"
              >
                <el-option label="自己" :value="1"></el-option>
                <el-option label="分配" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <!-- (<span style="color:#e74c3c">多选</span>) -->
            <el-form-item label="数据权限" prop="dataCodes" v-if="editForm.dataType == 2">
              :
              <div class="tree_class">
                <el-tree
                  show-checkbox
                  :data="treeData"
                  node-key="code"
                  :props="defaultProps"
                  highlight-current
                  ref="tree"
                  @check-change="handleNodeClick"
                  :disabled="true"
                ></el-tree>
              </div>
            </el-form-item>

            <!-- 选择项目开始 -->
            <el-row v-if="showsPro">
              <el-form-item
                label="选择项目"
                prop="proSelected"
                v-if="editForm.isAdmin == 2"
                class="choice-project"
              >
                <el-select
                  @change="showPro($event)"
                  v-model="editForm.proSelected"
                  multiple
                  style="width:210%"
                  placeholder="请选择你参与的项目"
                  :disabled="admin.group == true"
                  popper-class="proSelected"
                >
                  <el-option
                    class="pro-options"
                    v-for="item in proOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <!-- 选择项目结束 -->
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose" size="mini">取 消</el-button>
          <el-button type="primary" @click="submitButton" size="mini">提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getUserList,
  getDictionarieList,
  getAdduser,
  delUser,
  updateUser,
  getDicTree,
  getRoleList,
  resetPasswordUser,
  proList,
  listByids,
  proListNothing,
  dictionarieNothing,
  roleListNothing,
  getUserListNothing,
} from "@/http/api.js";
import { getDate } from "@/utils/transformDate.js";
import { judgeErroCode } from "@/utils/errorCode.js";
let is;
export default {
  name: "sysadminList",
  data() {
    let validatePass = (rule, value, callback) => {
      if (this.editForm.checkPass !== "") {
        this.$refs.editForm.validateField("checkPass");
      }
      callback();
    };
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.editForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let checkPhone = (rule, value, callback) => {
      let reg = /^1[3456789]\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      showPage: true,
      admin: {
        // 系统管理员，公司管理员，普通用户
        company: false,
        system: false,
        branch: false,
        group: false,
      },
      currentPage: 1,
      limit: 10,
      total: 0,
      options: {
        secondNav: "用户管理",
        thirdNav: "用户列表",
      },
      userType: [
        {
          value: 1,
          label: "系统管理员",
        },
        {
          value: 2,
          label: "用户",
        },
      ],
      tableList: [], // 表格列表
      companyList: [], // 公司列表
      searchBranchList: [], // 搜索选项的部门列表
      searchGroupList: [], // 搜索选项的组列表
      branchList: [], // 部门列表
      groupList: [], // 组列表
      // 获取表格的参数
      handle: {
        userid: "", // 用户id
        toKen: "", // 用户token
        isAdmin: "", // 是否是系统管理员
        pageSize: "", // 每页条数
        pageNum: "", //  页码
        phone: "",
        name: "", // 用户
        dicId: "", // 公司id
        branchId: "", // 部门id
        groupId: "", // 组ID
        state: "", // 状态
        branchCode: "",
        branchName: "",
        dicCode: "",
        dicId: "",
        dicName: "",
      },

      dialogTitle: "",
      showModel: false, // 弹窗
      editForm: {
        token: "",
        userid: "",
        name: "",
        phone: "",
        userName: "", // 添加系统管理员是userName，提交的时候赋值给 phone属性
        state: "", // 状态
        password: "",
        checkPass: "",
        isAdmin: 1, // 是否是管理员,默认是系统管理员
        dicId: "", // 公司id
        dicCode: "", // 公司编码
        dicName: "", // 公司名称
        branchId: "", // 部门id
        branchCode: "", // 部门编码
        branchName: "", // 部门名称
        groupId: "", // 组id
        groupName: "", // 组名称
        groupCode: "", // 组编码
        roleId: "", // 角色权限
        dataType: 1, // 权限类型
        dataCodes: "", // 数据权限
        id: "", // 编辑的时候当前对象的id
        proSelected: [], //实际参与的项目集合
      },
      userRule: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        branchName: [
          { required: true, message: "请填写部门", trigger: "blur" },
        ],
        phone: [
          {
            required: true,
            message: "请填写登录账号",
            trigger: "blur",
          },
          {
            type: "number",
            validator: checkPhone,
            message: "请输入正确的手机号",
            trigger: ["blur", "change"],
          },
        ],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur", required: true },
        ],
        roleId: [
          { required: true, message: "请选择角色权限", trigger: "change" },
        ],
        dicId: [{ required: true, message: "请选择公司", trigger: "change" }],
        dataType: [
          {
            required: true,
            message: "请选择公司",
            trigger: "change",
          },
        ],
        userName: [
          { required: true, message: "请填写用户名", trigger: "blur" },
        ],
        proSelected: [
          {
            required: true,
            message: "请选择项目",
            trigger: "change",
          },
        ],
      },
      adminList: [], // 角色权限列表
      roleType: "", //权限类型
      dataCodes: "", // 数据权限入参
      isCompany: false, // 是否显示公司
      treeData: [], // 数据权限的树
      defaultProps: {
        children: "children",
        label: "name",
      },
      isState: false, // 隐藏离职职位
      isBranch: false, // 选择分配 展示数据权限 显示
      phoneAdmin: "", // 用户当前的手机号码
      isDisabled: false, // 编辑时禁用手机号
      idAddUser: null, // 是否是添加用户,
      proList: [], // 项目列表
      proOptions: [],

      showsPro: true,
    };
  },
  filters: {
    getDate,
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    // 判断是系统管理员，公司管理员，部门管理员，还是组管理员
    if (userInfo.isAdmin === 1) {
      this.admin.system = true;
    } else {
      if (
        userInfo.dicId.length > 0 &&
        userInfo.branchId.length > 0 &&
        userInfo.groupId.length > 0
      ) {
        // 组管理员
        this.admin.group = true;
      } else if (
        // 部门管理员
        userInfo.dicId.length > 0 &&
        userInfo.branchId.length > 0 &&
        userInfo.groupId.length === 0
      ) {
        this.admin.branch = true;
      } else if (
        // 公司管理员
        userInfo.dicId.length > 0 &&
        userInfo.branchId.length === 0 &&
        userInfo.groupId.length === 0
      ) {
        this.admin.company = true;
      }
    }
    this.handle.userid = userInfo.id;
    this.handle.toKen = userInfo.token;
    this.handle.dicId = userInfo.dicId;
    this.handle.branchId = userInfo.branchId;
    this.handle.groupId = userInfo.groupId;
    this.editForm.userid = userInfo.id;
    this.editForm.token = userInfo.token;
    if (this.handle.toKen.length > 0 && this.handle.userid.length > 0) {
      // 加载用户列表
      this.handle.pageSize = this.limit;
      this.handle.pageNum = this.currentPage;
      this.getTabaleList(this.handle);
      // 加载搜索项公司列表
      this.getCompanyList();
      // 加载部门列表
      if (this.handle.dicId.length > 0) {
        this.getSearchBranchList(this.handle.dicId);
      }
      // 加载组列表
      if (this.handle.branchId.length > 0) {
        this.getSearchGroupList(this.handle.branchId);
      }
    }

    /**
     * 获取所有的项目
     * params:params
     * create by CaoHuimin
     * date:2020-7-4
     */

    let params = {
      pageNum: 1,
      pageSize: 10000,
      token: this.handle.toKen,
      userid: this.handle.userid,
    };
    // proList(params).then(res => {
    // 修改为无权限获取【选择项目】
    proListNothing(params).then((res) => {
      this.proList = res.data.data.list;
      this.proList.map((item) => {
        item.label = item.name;
        item.value = item.id;
        this.proOptions.push(item);
      });
    });
  },
  methods: {
    // 下拉框进行选择项目---获取所有的项目
    showPro(e) {
      this.editForm.proSelected = e;
    },

    /**
     * 获取用户列表数据
     * params:{params}
     * create by YuXiong
     * date:2020-6-4
     */
    async getTabaleList(params) {
      try {
        // let res = await getUserList(params);
        let res = await getUserListNothing(params);

        if (res.data.status === "0") {
          this.tableList = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.tableList = [];
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 获取所有公司列表
     * params:none
     * create by YuXiong
     * date:2020-6-4
     */
    async getCompanyList() {
      let params = {
        name: "",
        pageNum: 1,
        pageSize: 10000,
        parentid: "bc7b99932b23464fa0917b147ab62dc6",
        token: this.handle.toKen,
        userId: this.handle.userid,
      };
      try {
        // let res = await getDictionarieList(params);
        // 无权限获取公司列表
        let res = await dictionarieNothing(params);

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
     * date:2020-6-4
     */
    async getSearchBranchList(id) {
      this.searchBranchList = [];
      let params = {
        pageNum: 1,
        pageSize: 10000,
        parentid: id,
        token: this.handle.toKen,
        userId: this.handle.userid,
      };
      try {
        // let res = await getDictionarieList(params);
        let res = await dictionarieNothing(params);
        if (res.data.status === "0") {
          if (res.data.data.list.length > 0) {
            let dataCodes = this.$store.state.userInfo.dataCodes;
            if (dataCodes.length > 0) {
              res.data.data.list.forEach((item) => {
                if (dataCodes.indexOf(item.code) > -1) {
                  this.searchBranchList.push(item);
                }
              });
            } else {
              this.searchBranchList = res.data.data.list;
            }
          } else {
            this.searchBranchList = [];
          }
        } else {
          this.searchBranchList = [];
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
    async getSearchGroupList(id) {
      this.searchGroupList = [];
      let params = {
        pageNum: 1,
        pageSize: 10000,
        parentid: id,
        token: this.handle.toKen,
        userId: this.handle.userid,
      };
      try {
        // let res = await getDictionarieList(params);
        let res = await dictionarieNothing(params);
        if (res.data.status === "0") {
          if (res.data.data.list.length > 0) {
            let dataCodes = this.$store.state.userInfo.dataCodes;
            if (dataCodes.length > 0) {
              res.data.data.list.forEach((item) => {
                if (dataCodes.indexOf(item.code) > -1) {
                  this.searchGroupList.push(item);
                }
              });
            } else {
              this.searchGroupList = res.data.data.list;
            }
          } else {
            this.searchGroupList = [];
          }
        } else {
          this.searchGroupList = [];
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 获取部门列表
     * params:id
     * 查询时parentId为选中的公司id，未选中公司，部门列表为空,默认进入页面为空
     * create by YuXiong
     * date:2020-6-4
     */
    async getBranchList(id) {
      let params = {
        pageNum: 1,
        pageSize: 30,
        parentid: id,
        token: this.handle.toKen,
        userId: this.handle.userid,
      };
      try {
        // let res = await getDictionarieList(params);
        let res = await dictionarieNothing(params);
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
     * 获取组列表
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
        token: this.handle.toKen,
        userId: this.handle.userid,
      };
      try {
        // let res = await getDictionarieList(params);
        let res = await dictionarieNothing(params);
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
    /**
     * 获取角色权限列表，点击添加，编辑的时候执行
     * params:none
     * create by YuXiong
     * date:2020-6-4
     */
    async getAdminList() {
      let params = {
        type: "1",
        pageNum: 1,
        pageSize: 10000,
        userId: this.handle.userid,
        token: this.handle.toKen,
        isAdmin: this.editForm.isAdmin,
        dicId: this.editForm.dicId,
        branchId: this.editForm.branchId,
        groupId: this.editForm.groupId,
      };
      if (this.editForm.isAdmin === 2 && this.editForm.dicId.length === 0) {
        this.adminList = [];
        return false;
      }
      try {
        // let res = await getRoleList(params);
        let res = await roleListNothing(params);
        if (res.data.status === "0") {
          this.adminList = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 获取权限树的数据，根据不同的公司code，得到不同的树
     * params：code,checkedArr
     * create by YuXiong
     * date:2020-6-4
     */
    async getTreeData(code, checkedArr) {
      let params = {
        code: code,
      };
      try {
        let res = await getDicTree(params);
        if (res.data.status === "0") {
          this.treeData = res.data.data;
          // 有选中的数组表示回显，没有表示加载数据
          if (checkedArr.length === 0) {
            let checked = [];
            this.treeData.forEach((item) => {
              // 如果部门未选择，则勾选全部权限，如果有部门，则勾选已有的部门选项
              if (this.editForm.branchId.length === 0) {
                checked.push(item.code);
              } else {
                item.children.forEach((childItem) => {
                  if (childItem.id === this.editForm.branchId) {
                    checked.push(childItem.code);
                  }
                });
              }
            });
            // 勾选所有节点
            this.$refs.tree.setCheckedKeys(checked, true);
          } else {
            this.$refs.tree.setCheckedKeys(checkedArr, true);
          }
        } else {
          this.treeData = [];
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 搜索项切换公司列表选项,切换时加载部门列表,同时清空部门绑定的值
     * params:id
     * create by YuXiong
     * date:2020-6-4
     */
    searchCompanyChange(id) {
      if (id && id.length > 0) {
        this.handle.branchId = "";
        this.handle.groupId = "";
        this.searchGroupList = [];
        this.getSearchBranchList(id);
      }
    },
    /**
     * 搜索项切换部门列表选项,切换时加载组列表,同时清空组绑定的值
     * params:id
     * create by YuXiong
     * date:2020-6-4
     */
    searchBranchChange(id) {
      this.handle.groupId = "";
      this.searchGroupList = [];
      this.getSearchGroupList(id);
    },
    /**
     * 点击查询，刷新table列表,查询时，分页的页码变为1
     * params:none
     * create by YuXiong
     * date:2020-6-4
     */
    onSearch() {
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getTabaleList(this.handle);
    },
    /**
     * 点击重置，刷新table列表
     * params:none
     * create by YuXiong
     * date:2020-6-4
     */
    onReset() {
      let userInfo = this.$store.state.userInfo;
      this.handle.phone = "";
      this.handle.name = "";
      this.handle.dicId = userInfo.dicId;
      this.handle.branchId = userInfo.branchId;
      this.handle.groupId = userInfo.groupId;
      this.handle.state = "";
      this.getTabaleList(this.handle);
      this.searchBranchList = [];
      this.searchGroupList = [];
      // 加载部门列表
      if (this.handle.dicId.length > 0) {
        this.getSearchBranchList(this.handle.dicId);
      }
      // 加载组列表
      if (this.handle.branchId.length > 0) {
        this.getSearchGroupList(this.handle.branchId);
      }
    },
    /**
     * 分页点击事件,分页点击的时候，初始化搜索选项
     * params:val
     * create by YuXiong
     * date:2020-6-5
     */
    handleCurrentChange(val) {
      /*  this.handle.phone = "";
       this.handle.name = "";
       this.handle.dicId = "";
       this.handle.branchId = "";
       this.handle.state = ""; */
      this.currentPage = val;
      this.handle.pageNum = val;
      this.getTabaleList(this.handle);
    },
    /**
     * 分页每条数目改变，则回到第一页数据，列表重新加载
     * params:val
     * create by YuXiong
     * date:2020-6-5
     */
    handleSizeChange(val) {
      this.limit = val;
      this.handle.pageSize = val;
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getTabaleList(this.handle);
    },
    /**
     * 删除用户
     */
    handleDelete(index, row) {
      if (this.$store.state.userInfo.phone === row.phone) {
        this.$message({ type: "error", message: "无法删除当前登陆账户！" });
        return;
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: row.id,
            token: this.handle.toKen,
            userId: this.handle.userid,
          };
          delUser(params)
            .then((res) => {
              if (res.data.status === "0") {
                this.$message({ type: "success", message: "删除成功!" });
                this.getTabaleList(this.handle);
              } else {
                this.$message({ type: "error", message: res.data.message });
              }
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
    /**
     * 重置密码,重置后密码为123456
     * params:item
     * create by YuXiong
     * date:2020-6-11
     */
    resetPasswordFun(item) {
      this.$confirm("确定重置密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let userInfo = this.$store.state.userInfo;
          let params = {
            id: item.id,
            userid: userInfo.id,
            toKen: userInfo.token,
          };
          resetPasswordUser(params).then((res) => {
            if (res.data.status === "0") {
              this.$message({ type: "success", message: "重置成功!" });
              this.getTabaleList(this.handle);
            } else {
              judgeErroCode(res.data.status, res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置",
          });
        });
    },

    /**
     * 点击添加或编辑，弹出共同的表单框
     * params:{type,value}
     * create by YuXiong
     * date:2020-6-4
     */
    async showFormModel(type, obj) {
      this.showModel = true;
      // 同级用户新增同级用户，展示选择项目，列表数据按数据权限获取（系统管理员除外）
      if (type === "add") {
        this.editForm.proSelected = [];
        this.dialogTitle = "新增";
        this.idAddUser = true;
        this.showsPro = true;

        let userInfo = this.$store.state.userInfo;
        this.editForm.dicId = userInfo.dicId;
        this.editForm.branchId = userInfo.branchId;
        this.editForm.groupId = userInfo.groupId;
        this.editForm.isAdmin = userInfo.isAdmin;
        this.editForm.id = "";
        // 打开弹窗后，获取角色权限列表
      } else {
        this.dialogTitle = "编辑";
        this.idAddUser = false;
        this.showsPro = false;
        this.editForm.proSelected = [];
        this.editForm.name = obj.name;
        this.editForm.phone = obj.phone;
        this.editForm.userName = obj.phone;
        this.editForm.state = obj.state;
        this.editForm.isAdmin = Number(obj.isAdmin);
        this.editForm.dicId = obj.dicId;
        this.editForm.branchId = obj.branchId;
        this.editForm.groupId = obj.groupId;
        this.editForm.dataType = obj.dataType;
        this.editForm.roleId = obj.roleId;
        this.editForm.id = obj.id;
        this.editForm.dataCodes = obj.dataCodes;
        this.editForm.proSelected = obj.projects;
        this.editForm.proSelected = this.editForm.proSelected.split(",");
        let userInfo = this.$store.state.userInfo;

        // 部门=>组              登录人 组信息为空  修改人组信息不为空

        // 公司=>部门/部门以下    登录人 部门信息为空  修改人部门信息不为空

        // 系统管理员=>所有
        if (!userInfo.dicId) {
          //公司不存在
          this.showsPro = true;
        }

        if (!userInfo.groupId && obj.groupId) {
          this.showsPro = true;
        }

        if (!userInfo.branchId && obj.branchId) {
          this.showsPro = true;
        }
        if (obj.isAdmin == 1) {
          this.editForm.proSelected = [];
        }

        this.companyList = [];
        this.branchList = [];
        this.groupList = [];
        // 点击编辑 如果权限类型是分配，则还需要拿到权限树
        if (this.editForm.dataType === 2) {
          let checkedArr = this.editForm.dataCodes.split(",");
          this.getTreeData(obj.dicCode, checkedArr);
        }
      }
      this.getAdminList();
      // 如果是非系统管理员，无论是添加还是编辑都需要获取到公司和部门的列表
      if (this.editForm.isAdmin === 2) {
        this.getCompanyList();
        this.getBranchList(this.editForm.dicId);
        // 有部门ID要获取组的列表
        if (this.editForm.branchId.length > 0) {
          this.getGroupList(this.editForm.branchId);
        }
      }
    },

    /**
     * 切换系统管理员，用户选项。切换时，角色权限，公司，部门，权限类型，数据权限，要全部清空
     * 重新请求角色权限列表，
     * 当切换为用户的时候，加载公司列表
     * params : val
     * create by YuXiong
     * date:2020-6-4
     */
    adminChange(val) {
      this.editForm.isAdmin = val; // 是否是管理员，值要切换
      this.editForm.phone = this.editForm.userName;
      // this.editForm.userName = "";
      this.editForm.dicId = "";
      this.editForm.dicName = "";
      this.editForm.dicCode = "";
      this.editForm.branchId = "";
      this.editForm.branchName = "";
      this.editForm.branchCode = "";
      this.editForm.groupId = "";
      this.editForm.groupName = "";
      this.editForm.groupCode = "";
      this.editForm.roleId = "";
      this.editForm.dataType = 1;
      this.editForm.dataCodes = "";
      this.adminList = [];
      this.companyList = [];
      this.branchList = [];
      this.groupList = [];
      this.treeData = [];
      this.getAdminList();
      if (val === 2) {
        this.getCompanyList();
      }
    },
    /**
     * 公司选项切换。切换时部门，权限类型，数据权限全部要清空
     * 重新请求部门列表,重新请求角色权限列表
     * params : id
     * create by YuXiong
     * date:2020-6-4
     */
    companyChange(id) {
      this.editForm.branchId = "";
      this.editForm.branchCode = "";
      this.editForm.branchName = "";
      this.editForm.groupId = "";
      this.editForm.groupName = "";
      this.editForm.groupCode = "";
      this.editForm.roleId = "";
      this.editForm.dataType = 1;
      this.editForm.dataCodes = "";
      this.branchList = [];
      this.groupList = [];
      this.adminList = [];
      this.treeData = [];
      this.getAdminList();
      if (id.length > 0) {
        this.getBranchList(id);
      }
    },
    /**
     * 部门选项切换。切换时，权限类型，角色权限，数据权限全部要清空
     * 重新请求角色权限列表
     * params : id
     * create by YuXiong
     * date:2020-6-4
     */
    branchChange(id) {
      this.editForm.groupId = "";
      this.editForm.groupName = "";
      this.editForm.groupCode = "";
      this.groupList = [];
      this.editForm.roleId = "";
      this.editForm.dataType = 1;
      this.editForm.dataCodes = "";
      this.treeData = [];
      this.adminList = [];
      this.getAdminList();
      if (id.length > 0) {
        this.getGroupList(id);
      }
      /* let code = this.branchList.find(item => item.id === id);
      if (code && code.length > 0) {
        this.getTreeData(code);
      } */
    },
    /**
     * 组选项切换。切换时，权限类型，角色权限，数据权限全部要清空
     * 重新请求角色权限列表
     * params : id
     * create by YuXiong
     * date:2020-6-18
     */
    groupChange(id) {
      this.editForm.roleId = "";
      this.editForm.dataCodes = "";
      this.editForm.dataType = 1;
      this.treeData = [];
      this.adminList = [];
      this.getAdminList();
    },
    /**
     * 权限类型切换，切换时，数据权限状态重置
     * 当值为自己时，权限树隐藏，当值为分配时，加载树，并且权限树可以编辑
     * params : val
     * create by YuXiong
     * date:2020-6-4
     */
    dataTypeChange(val) {
      if (val === 1) {
        this.editForm.dataCodes = "";
      } else {
        // 获取当前选中公司的code,加载树
        let code = this.companyList.find(
          (item) => item.id === this.editForm.dicId
        ).code;
        this.getTreeData(code, []);
      }
    },
    /**
     * 选择数据权限的树
     * params:none
     * create by YuXiong
     * date:2020-6-4
     */
    handleNodeClick() {
      let parent = this.$refs.tree.getHalfCheckedKeys(); // 父节点
      let data = this.$refs.tree.getCheckedKeys(); // 选中的所有子节点
      this.editForm.dataCodes = parent.concat(data).join();
    },
    /**
     * 关闭模态框，表单所有的项重置
     * pamars:none
     * create by YuXiong
     * date:2020-6-4
     */
    handleClose() {
      // 取消清空
      this.$refs.editForm.resetFields();
      this.treeData = [];
      this.editForm = {
        name: "",
        phone: "",
        state: "",
        password: "",
        checkPass: "",
        isAdmin: 1, // 是否是管理员,默认是系统管理员
        dicId: "", // 公司id
        branchId: "", // 部门id
        groupId: "", // 组 ID
        roleId: "", // 角色权限
        dataType: 1, // 权限类型
        dataCodes: "", // 数据权限
        dicCode: "", // 公司编码
        dicName: "", // 公司名称
        branchCode: "", // 部门编码
        branchName: "", // 部门名称
        groupName: "",
        proSelected: [],
      };
      this.showModel = false;
      this.idAddUser = null;
      this.companyList = [];
      this.branchList = [];
      this.groupList = [];
      // 先清空，再获取公司和部门列表
      this.getCompanyList();
      this.getBranchList(this.handle.dicId);
    },
    /**
     * 提交编辑用户或添加用户的表单
     * 验证通过则发送请求,并且权限不能为空
     * params:none
     * create by YuXiong
     * date:2020-6-4
     */
    async submitButton() {
      let dataCodes = [];
      if (this.$refs.tree) {
        dataCodes = this.$refs.tree.getCheckedKeys(false);
      }
      // 非系统管理员，权限类型为分配时，dataCodes不能为空
      if (
        this.editForm.dicId.length > 0 &&
        this.editForm.dataType === 2 &&
        dataCodes.length === 0
      ) {
        this.$message({ type: "error", message: "权限不能为空" });
        return false;
      }
      this.editForm.dataCodes = dataCodes.join();
      this.$refs.editForm.validate((valid) => {
        if (valid === true) {
          let userInfo = this.$store.state.userInfo;
          this.editForm.userid = userInfo.id;
          this.editForm.token = userInfo.token;
          // 如果添加系统管理员，把userName的值赋给phone，提交给服务端
          if (this.editForm.isAdmin === 1) {
            this.editForm.phone = this.editForm.userName;
          }
          // 如果有公司ID，则把公司名称，公司code全部传给服务端
          if (this.editForm.dicId.length > 0) {
            let obj = this.companyList.find(
              (item) => item.id === this.editForm.dicId
            );
            this.editForm.dicName = obj.name;
            this.editForm.dicCode = obj.code;
          }
          // 如果有部门ID，则把公司名称，公司code全部传给服务端
          if (this.editForm.branchId.length > 0) {
            let obj = this.branchList.find(
              (item) => item.id === this.editForm.branchId
            );
            this.editForm.branchName = obj.name;
            this.editForm.branchCode = obj.code;
          }
          // 如果有组ID，则把组名称，组code全部传给服务端
          if (this.editForm.groupId.length > 0) {
            let obj = this.groupList.find(
              (item) => item.id === this.editForm.groupId
            );
            this.editForm.groupName = obj.name;
            this.editForm.groupCode = obj.code;
          }
          // 根据是添加还是编辑，调用不同的方法
          this.editForm.projects = this.editForm.proSelected.toString();
          if (this.idAddUser === true) {
            this.addUserFun(this.editForm);
          } else {
            this.updateUserFun(this.editForm);
          }
        } else {
          this.$message({ type: "error", message: "请先正确填写输入的信息" });
        }
      });
    },
    /**
     * 添加用户调用的方法
     * params:params
     * create by YuXiong
     * date:2020-6-10
     */
    async addUserFun(params) {
      try {
        let res = await getAdduser(params);

        if (res.data.status === "0") {
          this.$message({ type: "success", message: "添加成功!" });
          this.currentPage = 1;
          this.handle.pageNum = 1;
          this.getTabaleList(this.handle);
          this.handleClose();
        } else {
          this.$message({ type: "warning", message: res.data.message });
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 编辑用户调用的方法
     * params:params
     * create by YuXiong
     * date:2020-6-10
     */
    async updateUserFun(params) {
      try {
        let res = await updateUser(params);
        if (res.data.status === "0") {
          this.$message({ type: "success", message: "修改成功!" });
          this.currentPage = 1;
          this.handle.pageNum = 1;
          this.getTabaleList(this.handle);
          this.handleClose();
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
  },
};
</script>

<style scoped lang="less">
.content {
  padding-left: 15px;
  // input 样式
  /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
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
  // 弹出框  css
  .data_info {
    width: 95%;
    margin: 0 auto;
    /deep/ .el-form-item {
      display: inline-block;
      width: 50%;
    }
  }
}
.pagination {
  margin-top: 15px;
  text-align: center;
}
// 数据权限 树的 样式
.tree_class {
  position: absolute;
  top: 8px;
  /deep/ .el-tree__empty-text {
    position: initial !important;
  }
}
.red {
  color: #ff0000;
}

// 选择项目
.pro-options {
  width: 49%;
  float: left;
  text-align: center;
  font-size: 14px;
  line-height: 34px;
  color: #333;
  .selected::after {
    position: absolute;
    left: 20px;
  }
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  color: #66b1ff;
}
.el-select-dropdown__item.selected {
  font-weight: 600;
}
</style>