<template>
  <div id="roleList">
    <bread-crumb :options="options"></bread-crumb>
    <div class="content">
      <div class="add_button">
        <el-button
          type="primary"
          @click="alertModel('add',null)"
          size="medium"
          icon="el-icon-plus"
          v-permission="{action: 'admin:role:save' }"
        >添加</el-button>
      </div>
      <div class="table">
        <el-table
          :data="roleTable"
          border
          style="width: 100%"
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column label="公司" prop="dicName" min-width="20%" align="center"></el-table-column>
          <el-table-column label="部门" prop="branchName" min-width="10%" align="center"></el-table-column>
          <el-table-column label="组" prop="groupName" min-width="10%" align="center"></el-table-column>
          <el-table-column label="名称" prop="name" min-width="10%" align="center"></el-table-column>
          <el-table-column label="备注" prop="remarks" min-width="20%" align="center"></el-table-column>
          <el-table-column label="操作" min-width="20%" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="alertModel('edit',scope.row)"
                v-permission="{action: 'admin:role:update' }"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                class="red"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                v-permission="{action: 'admin:role:delete' }"
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
      <!--角色-弹窗 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="showModel"
        width="40%"
        :before-close="handleClose"
        center
      >
        <div class="roleInfo">
          <div>
            <div class="remark">
              <span>角色名称:</span>
              <el-input :data-name="1111" v-model="roleInfo.roleName"></el-input>
            </div>
            <!-- 新增角色公司列表 -->
            <div class="remark">
              <span>公司:</span>
              <el-select
                v-model="roleInfo.dicId"
                placeholder="请选择角色所属公司:"
                value-key="code"
                @change="changedCompany"
                :disabled="admin.system === false || !isAddRole"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div>
            <div class="remark">
              <span>角色备注:</span>
              <el-input v-model="roleInfo.remarks" placeholder="请输入角色备注信息:"></el-input>
            </div>
            <div class="remark">
              <span>部门:</span>
              <el-select
                v-model="roleInfo.branchId"
                placeholder="请选择角色部门:"
                value-key="code"
                @change="changedBranch"
                :disabled="admin.branch == true || admin.group == true"
              >
                <el-option
                  v-for="item in branchList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>

            <div class="remark">
              <span>所在组:</span>
              <el-select
                v-model="roleInfo.groupId"
                placeholder="请选择组"
                value-key="code"
                :disabled="admin.group == true"
              >
                <el-option
                  v-for="item in groupList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <el-tree
          show-checkbox
          ref="tree"
          :data="treeData"
          node-key="id"
          :props="defaultProps"
          highlight-current
          v-if="!isAdmin"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitButton" size="mini" v-if="isAddRole">提 交</el-button>
          <el-button type="primary" @click="modifyRole" size="mini" v-else>修 改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getDictionarieList,
  getRoleList,
  getFinde,
  getMenu,
  saveRole,
  updateRole,
  deleteRole,
  roleListNothing,
  menuListNothing,
  findRoleNothing
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "roleList",
  data() {
    return {
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
      dicId: "",
      options: {
        secondNav: "角色管理",
        thirdNav: "角色列表",
      },
      dialogTitle: "添加角色",
      roleTable: [],
      showModel: false, // 隐藏模态框
      // tree数据
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      // 弹窗的一些信息
      roleInfo: {
        roleName: "", //角色名称
        dicId: "", // 所属公司
        branchId: "", // 所属部门
        groupId: "", // 所属组
        remarks: "", // 描述
      },
      userId: "", // 用户id
      toKen: "", // 用户token
      companyList: [],
      branchList: [], // 所有部门列表
      groupList: [], // 组列表
      currentEditId: "", // 修改的时候需要储存当前Id
      isAddRole: true,
      isAdmin: false, // 列表角色是否是管理员，隐藏显示权限树
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    // 判断是系统管理员，公司管理员，还是普通用户
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
    this.userId = userInfo.id;
    this.toKen = userInfo.token;
    this.dicId = userInfo.dicId;
    this.getRoleList();
    this.getTree();
  },
  methods: {
    /**
     * 获取角色列表，进入页面获取角色列表数据
     * params:none
     * create by YuXiong
     * date:2020-6-8
     */
    async getRoleList() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.limit,
        token: this.toKen,
        userId: this.userId,
        dicId: this.dicId,
      };
      try {
        // let res = await getRoleList(params);
        let res = await roleListNothing(params);
        if (res.data.status === "0") {
          this.roleTable = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.roleTable = [];
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 获取公司列表，parentId根据业务此处为默认
     * params:{parentId}
     * create by YuXiong
     * date:2020-6-8
     */
    async getCompanyList(parentId) {
      parentId = "bc7b99932b23464fa0917b147ab62dc6";
      let params = {
        pageNum: 1,
        pageSize: 10000,
        parentid: parentId,
        token: this.toKen,
        userId: this.userId,
      };
      try {
        let res = await getDictionarieList(params);
        if (res.data.status === "0") {
          this.companyList = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
      let res = await getDictionarieList(params);
    },
    /**
     * 获取部门列表信息
     * params:{id}
     * create by YuXiong
     * date:2020-6-3
     */
    async getbranchList(id) {
      let params = {
        pageNum: 1,
        pageSize: 10000,
        parentid: id,
        token: this.toKen,
        userId: this.userId,
      };
      try {
        let res = await getDictionarieList(params);
        if (res.data.status === "0") {
          this.branchList = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 获取角色列表信息
     * params:{id}
     * create by YuXiong
     * date:2020-6-18
     */
    async getGroupList(id) {
      let params = {
        pageNum: 1,
        pageSize: 10000,
        parentid: id,
        token: this.toKen,
        userId: this.userId,
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
        console.log(error);
      }
    },
    /**
     * 获取所有权限列表树
     * params:none
     * create by YuXiong
     * date:2020-6-8
     */
    async getTree() {
      let params = {
        token: this.toKen,
        userId: this.userId,
      };
      try {
        // let res = await getMenu(params);
        // 无权限获取菜单列表
        let res = await menuListNothing(params);
        if (res.data.status === "0") {
          this.treeData = res.data.data;
          let perms = [];
          this.treeData.forEach((parent) => {
            perms.push(parent.id);
            if (parent.children.length !== 0) {
              parent.children.forEach((child) => {
                perms.push(child.id);
              });
            }
          });
        } else {
          // judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },
    /**
     * 获取此角色已有的权限的，编辑的时候展示
     * params:id,
     * create by YuXiong
     * date:2020-6-8
     *
     */
    async getAlreadyTree(id) {
      let params = {
        id: id,
        token: this.toKen,
        userId: this.userId,
      };
      try {
        // let res = await getFinde(params);
        let res = await findRoleNothing(params);
        if (res.data.status === "0") {
          let arr = res.data.data.sysRoleMenus;
          let checked = [];
          arr.forEach((element) => {
            // this.treeData.forEach(item => {
            //   item.children.forEach(subitem => {
            //     subitem.children.forEach(thirdItem => {
            //       if (thirdItem.id === element.menuId) {
            //         checked.push({ id: thirdItem.id });
            //       }
            //     });
            //   });
            // });

            this.treeData.map((item) => {
              if (item.children && item.children.length > 0) {
                item.children.map((subitem) => {
                  if (subitem.children && subitem.children.length > 0) {
                    subitem.children.map((thirdItem) => {
                      if (thirdItem.id === element.menuId) {
                        checked.push({ id: thirdItem.id });
                      }
                    });
                  } else {
                    if (subitem.id == element.menuId) {
                      checked.push({ id: subitem.id });
                    }
                  }
                });
              } else {
                if (item.id == element.menuId) {
                  checked.push({ id: item.id });
                }
              }
            });
          });
          this.$refs.tree.setCheckedNodes(checked);
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {}
    },
    /**
     * 分页点击事件
     * params:val
     * create by YuXiong
     * date:2020-6-5
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRoleList();
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
      this.getRoleList();
    },
    /**
     * 修改公司选项,重新加载部门列表
     * params:id
     * create by YuXiong
     * date:2020-6-8
     */
    async changedCompany(id) {
      this.roleInfo.branchId = "";
      this.roleInfo.groupId = "";
      this.branchList = [];
      this.groupList = [];
      this.getbranchList(id);
    },
    /**
     * 修改部门选项,重新加载组列表
     * params:id
     * create by YuXiong
     * date:2020-6-18
     */
    changedBranch(id) {
      this.roleInfo.groupId = "";
      this.groupList = [];
      this.getGroupList(id);
    },
    /**
     * 新增或编辑角色显示的弹窗
     * params:{type,item},type有add和edit两个值，分别区分新增和编辑，item表示编辑的当前对象
     * 新增的时候，弹窗打开要加载公司和部门列表。普通用户要同时获取部门列表
     * create by YuXiong
     * date:2020-6-8
     */
    alertModel(type, item) {
      this.showModel = true;
      this.dialogTitle = "新增角色";
      this.isAddRole = true;
      this.isAdmin = false;
      let parentId = "";
      console.log(item);
      this.getCompanyList(parentId);
      if (type === "add") {
        let userInfo = this.$store.state.userInfo;
        this.roleInfo.dicId = userInfo.dicId;
        this.roleInfo.branchId = userInfo.branchId;
        this.roleInfo.groupId = userInfo.groupId;
        if (this.admin.system === false) {
          this.getbranchList(this.roleInfo.dicId);
        }
        if (this.admin.branch === true || this.admin.group == true) {
          this.getGroupList(this.roleInfo.branchId);
        }
      } else {
        // 编辑角色
        this.dialogTitle = "编辑角色";
        this.isAddRole = false;
        this.roleInfo.dicId = item.dicId;
        this.roleInfo.branchId = item.branchId;
        this.roleInfo.groupId = item.groupId;
        this.roleInfo.roleName = item.name;
        this.roleInfo.remarks = item.remarks;
        this.currentEditId = item.id;
        this.getAlreadyTree(item.id);
        // 如果有公司ID，则需要加载部门列表,加载权限树
        if (item.dicId.length > 0) {
          this.getbranchList(this.roleInfo.dicId);
          if (item.branchId.length > 0) {
            this.getGroupList(this.roleInfo.branchId);
          }
        }
        if (item.name === "admin") {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除当前项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: row.id,
            token: this.toKen,
            userid: this.userId,
          };
          deleteRole(params)
            .then((res) => {
              if (res.data.status == "0") {
                this.$message({ type: "success", message: "删除成功!" });
                this.resetSth();
                this.getRoleList();
              } else {
                judgeErroCode(res.data.status, res.data.message);
              }
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: "服务器响应失败,请刷新重试或重新登录!",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 关闭模态框
    handleClose() {
      this.showModel = false;
      this.resetSth();
    },
    /**
     * 修改角色调用的方法
     * params:none
     * create by YuXiong
     * date:2020-6-8
     */
    async modifyRole() {
      if (
        this.roleInfo.roleName.length === 0 ||
        (this.admin.system === false && this.roleInfo.dicId.length === 0)
      ) {
        this.$message({ type: "error", message: "您有信息未录入!" });
        return;
      }
      let perms = [];
      let dataCodes = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
      if (dataCodes.length === 0) {
        this.$message({ type: "error", message: "权限不能为空" });
        return false;
      } else {
        perms = dataCodes.join(":");
      }
      let updateParams = {
        id: this.currentEditId,
        name: this.roleInfo.roleName,
        perms: perms,
        remarks: this.roleInfo.remarks,
        userid: this.userId,
        token: this.toKen,
        dicId: this.roleInfo.dicId,
        dicName: "",
        dicCode: "",
        branchId: this.roleInfo.branchId,
        branchName: "",
        branchCode: "",
        groupId: this.roleInfo.groupId,
        groupName: "",
        groupCode: "",
      };
      // 如果有公司ID，则把公司名称，公司code全部传给服务端
      if (this.roleInfo.dicId.length > 0) {
        let obj = this.companyList.find(
          (item) => item.id === this.roleInfo.dicId
        );
        console.log(obj);
        updateParams.dicName = obj.name;
        updateParams.dicCode = obj.code;
      }
      // 如果有部门ID，则把公司名称，公司code全部传给服务端
      if (this.roleInfo.branchId.length > 0) {
        let obj = this.branchList.find(
          (item) => item.id === this.roleInfo.branchId
        );
        updateParams.branchName = obj.name;
        updateParams.branchCode = obj.code;
      }
      // 如果有组ID，则把公司名称，公司code全部传给服务端
      if (this.roleInfo.groupId.length > 0) {
        let obj = this.groupList.find(
          (item) => item.id === this.roleInfo.groupId
        );
        updateParams.groupName = obj.name;
        updateParams.groupCode = obj.code;
      }
      // return false;
      try {
        let res = await updateRole(updateParams);
        if (res.data.status === "0") {
          this.$message({
            type: "success",
            message: "操作成功, 成功修改信息!",
          });
          this.resetSth();
          this.getRoleList();
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 新增角色提交
     * params：none
     * create by YuXiong
     * date:2020-6-8
     */
    async submitButton() {
      if (this.roleInfo.roleName.length === 0) {
        this.$message({ type: "warning", message: "请输入角色名称!" });
        return;
      }
      let perms = [];
      let dataCodes = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
      console.log(dataCodes);
      if (dataCodes.length === 0) {
        this.$message({ type: "error", message: "权限不能为空" });
        return false;
      } else {
        perms = dataCodes.join(":");
      }
      let params = {
        token: this.toKen,
        userid: this.userId,
        name: this.roleInfo.roleName,
        dicId: this.roleInfo.dicId,
        dicName: "",
        dicCode: "",
        branchId: this.roleInfo.branchId,
        branchName: "",
        branchCode: "",
        groupId: this.roleInfo.groupId,
        groupName: "",
        groupCode: "",
        remarks: this.roleInfo.remarks,
        perms: perms,
      };
      // 如果有公司ID，则把公司名称，公司code全部传给服务端
      if (this.roleInfo.dicId.length > 0) {
        let obj = this.companyList.find(
          (item) => item.id === this.roleInfo.dicId
        );
        params.dicName = obj.name;
        params.dicCode = obj.code;
      }
      // 如果有部门ID，则把公司名称，公司code全部传给服务端
      if (this.roleInfo.branchId.length > 0) {
        let obj = this.branchList.find(
          (item) => item.id === this.roleInfo.branchId
        );
        params.branchName = obj.name;
        params.branchCode = obj.code;
      }
      // 如果有组ID，则把公司名称，公司code全部传给服务端
      if (this.roleInfo.groupId.length > 0) {
        let obj = this.groupList.find(
          (item) => item.id === this.roleInfo.groupId
        );
        params.groupName = obj.name;
        params.groupCode = obj.code;
      }
      try {
        let res = await saveRole(params);
        if (res.data.status === "0") {
          this.$message({ type: "success", message: "添加成功!" });
          this.resetSth();
          this.getRoleList();
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 数据初始化
     * params :none
     * create by YuXiong
     * date:2020-6-8
     */
    resetSth() {
      this.showModel = false;
      this.dialogTitle = "添加角色";
      this.roleInfo.roleName = "";
      this.roleInfo.remarks = "";
      this.roleInfo.groupId = "";
      this.companyList = [];
      this.branchList = [];
      this.groupList = [];
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
  },
};
</script>

<style scoped lang='less'>
.content {
  padding-left: 15px;
  .add_button {
    display: flex;
    justify-content: flex-end;
    margin: 0 40px;
  }
  .table {
    padding: 30px;
  }
  // 模态框的input
  .dialog_input {
    margin-bottom: 30px;
  }
  .remark {
    display: inline-block;
    margin-bottom: 15px;
    margin-right: 60px;
    span {
      margin-right: 15px;
    }
    /deep/ .el-input {
      width: 200px;
      height: 40px;
    }
    /deep/ .el-input__inner {
      width: 200px;
      height: 40px;
    }
  }
  .el-tree {
    margin: 0 40px;
  }
}
/* // 表格-删除按钮 */
.red {
  color: #ff0000;
}
</style>