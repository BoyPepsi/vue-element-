<template>
  <div id="sysmenuList">
    <bread-crumb :options="options"></bread-crumb>
    <div class="content">
      <div class="add_button">
        <el-button
          type="primary"
          @click="detailForm(0,'','top')"
          size="medium"
          icon="el-icon-plus"
          v-permission="{action: 'admin:sysmenu:save' }"
        >添加</el-button>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
          row-key="id"
          border
          lazy
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="name" label="名称" width="200" align="center"></el-table-column>
          <el-table-column prop="type" label="类型" align="center"></el-table-column>
          <el-table-column prop="perms" label="权限" align="center"></el-table-column>
          <el-table-column prop="url" label="路由地址" align="center"></el-table-column>
          <el-table-column label="操作"  min-width="150" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="detailForm(0,scope.row)"
                v-permission="{action: 'admin:sysmenu:save' }"
              >添加</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="detailForm(1,scope.row)"
                v-permission="{action: 'admin:sysmenu:update' }"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                class="red"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                v-permission="{action: 'admin:sysmenu:delete' }"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--   <pagination
          :currentPage="currentPage"
          :total="total"
          :limit="limit"
          :small="true"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        />-->
      </div>
      <!-- 编辑-新增-弹窗 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="showModel"
        width="40%"
        :before-close="handleClose"
        center
      >
        <div class="data_info">
          <el-form :model="menuForm" :rules="userRule" ref="menuForm" label-width="100px">
            <el-form-item label="名称:" prop="name">
              <el-input v-model="menuForm.name"></el-input>
            </el-form-item>
            <el-form-item label="url:">
              <el-input v-model.number="menuForm.url"></el-input>
            </el-form-item>
            <el-form-item label="类型:" prop="type">
              <el-select placeholder="类型:" v-model="menuForm.type" :disabled="typeDis">
                <el-option :value="this.row.type + 1" :label="this.row.type + 1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
              <el-input placeholder="数字" v-model.number="menuForm.sort"></el-input>
            </el-form-item>
            <el-form-item label="权限:" prop="perms">
              <el-input v-model.number="menuForm.perms"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel" size="mini">取 消</el-button>
          <el-button type="primary" @click="submitButton" size="mini">提 交</el-button>
        </span>
      </el-dialog>

      <!-- 删除操作询问框 -->
      <el-dialog title="提示" :visible.sync="dialogDeleteVisible" width="30%">
        <span>你确定要删除此菜单吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogDeleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteMenu">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getMenu,
  adminSysmenuSave,
  adminSysmenuDelete,
  adminSysmenuUpdate,
  adminSysmenuList,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";

export default {
  name: "sysmenuList",
  data() {
    return {
      userid: "",
      token: "",
      isAdmin: "",
      currentPage: 1,
      limit: 10,
      total: 0,
      options: {
        secondNav: "菜单管理",
        thirdNav: "菜单列表",
      },
      token: this.$store.state.userInfo.token,
      userid: this.$store.state.userInfo.id,
      tableData: [],
      // 表格
      menuTable: [
        {
          id: "admin",
          name: "用户",
          url: "url",
          type: "1",
        },
      ],
      dialogTitle: "新增",
      showModel: false, // 弹窗
      menuForm: {
        name: "",
        url: "",
        type: "",
        sort: "",
        perms: "",
      },
      userRule: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        perms: [{ required: true, message: "请填写权限", trigger: "blur" }],
        type: [{ required: true, message: "请填写类型", trigger: "blur" }],
        sort: [{ required: true, message: "请填写排序", trigger: "blur" }],
      },
      dialogDeleteVisible: false, //删除询问框
      row: {}, //当前操作的对象
      typeDis: false,
    };
  },
  created() {
    const userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.isAdmin = userInfo.isAdmin;
    this.getMenuTree();
  },
  methods: {
    // 获取菜单 树
    getMenuTree() {
      getMenu({
        token: this.token,
        userid: this.userid,
        pageNum: 1,
        pageSize: 8,
      })
        .then((res) => {
          if (res.data.status === "0") {
            this.tableData = res.data.data;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch((err) => console.log(err));
    },
    /**
     * 分页点击事件
     * params:val
     * create by YuXiong
     * date:2020-6-5
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMenuTree();
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
      this.getMenuTree();
    },
    // 0 新增 1 编辑
    detailForm(s, row, flag) {
      if (flag == "top") {
        this.row = {
          type: 0,
          perms: "顶层top",
          id: 0,
        };
      } else {
        this.row = row;
      }

      this.showModel = true;
      if (s == 0) {
        this.dialogTitle = "新增";
        this.menuForm = {};
        this.typeDis = false;
      } else {
        this.dialogTitle = "编辑";
        this.getCurrent();
        this.typeDis = true;
      }
    },

    // 删除
    handleDelete(index, row) {
      this.row = row;

      if (this.row.children && this.row.children.length == 0) {
        this.dialogDeleteVisible = true;
      } else {
        this.$message({ type: "error", message: "先删除子菜单，再删除此菜单" });
      }
    },

    deleteMenu() {
      let params = {
        id: this.row.id,
        token: this.token,
        userid: this.userid,
      };
      adminSysmenuDelete(params)
        .then((res) => {
          if (res.data.status == "0") {
            this.dialogDeleteVisible = false;
            this.$message({ type: "success", message: "删除菜单成功" });
            this.getMenuTree();
          }
        })
        .catch((err) => {
          this.$message({ type: "error", message: "删除菜单失败" });
        });
    },
    // 关闭模态框
    handleClose() {
      this.showModel = false;
    },

    cancel() {
      this.showModel = false;
    },

    getCurrent() {
      //编辑时，回选
      let params = {
        id: this.row.id,
        pageNum: 1,
        pageSize: 1000,
        token: this.token,
        userid: this.userid,
      };
      adminSysmenuList(params)
        .then((res) => {
          if (res.data.status == "0") {
            let data = res.data.data.list;
            data.map((item) => {
              if (item.id == params.id) {
                this.menuForm = item;
              }
            });
          }
        })
        .catch((err) => {
          this.$message({ type: "error", message: "服务器异常..." });
        });
    },

    // 提交
    submitButton() {
      this.$refs.menuForm.validate((valid) => {
        if (valid == true) {
          if (typeof this.menuForm.sort != "number") {
            this.$message({ type: "warning", message: "排序必须为数字" });
            return false;
          }
          if (this.dialogTitle == "新增") {
            let params = {
              name: this.menuForm.name,
              parentId: this.row.id,
              perms: this.menuForm.perms,
              sort: this.menuForm.sort,
              token: this.token,
              type: this.menuForm.type,
              url: this.menuForm.url,
              userid: this.userid,
            };
            adminSysmenuSave(params)
              .then((res) => {
                if (res.data.status == "0") {
                  this.$message({ type: "success", message: "添加菜单成功" });
                  this.showModel = false;
                  this.getMenuTree();
                  this.menuForm = {};
                }
              })
              .catch((err) => {
                this.$message({ type: "error", message: "添加菜单失败" });
              });
          }
          if (this.dialogTitle == "编辑") {
            let params = {
              name: this.menuForm.name,
              sort: this.menuForm.sort,
              token: this.token,
              type: this.menuForm.type,
              url: this.menuForm.url,
              userid: this.userid,
              id: this.row.id,
              perms: this.menuForm.perms,
            };
            adminSysmenuUpdate(params)
              .then((res) => {
                if (res.data.status == "0") {
                  this.showModel = false;
                  this.getMenuTree();
                  this.$message({ type: "success", message: "修改菜单成功" });
                }
              })
              .catch((err) => {
                this.$message({ type: "error", message: "修改菜单失败" });
              });
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.content {
  padding-left: 15px;
  .add_button {
    display: flex;
    justify-content: flex-end;
    margin: 0 40px;
  }
  // input 样式
  /deep/ .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
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
      //   display: inline-block;
      width: 50%;
    }
  }
}
/* // 表格-删除按钮 */
.red {
  color: #ff0000;
}
</style>