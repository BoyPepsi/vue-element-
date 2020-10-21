<template>
  <div class="child">
    <div class="contet">
      <el-row :gutter="40">
        <el-col :span="4" class="left">
          <h3>节点列表</h3>
          <div class="tree">
            <el-tree
              :show-checkbox="false"
              :data="treeData"
              node-key="code"
              :props="defaultProps"
              highlight-current
              ref="tree"
              @node-click="treeNodeClick"
            ></el-tree>
          </div>
        </el-col>
        <el-col :span="20">
          <el-button type="primary" size="medium" class="right" @click="goback">返回</el-button>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-plus"
            class="right"
            @click="alertModel('add',null)"
            v-permission="{action: 'sysFieldConfigSupervisionLogMouldChild:save' }"
          >添加子表</el-button>
          <el-table
            :data="tableListChild"
            class="table"
            border
            style="width: 100%"
            :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
          >
            <el-table-column label="名称(主表)" prop="codeName" align="center"></el-table-column>
            <el-table-column label="名称(子表)" prop="targetCodeName" align="center"></el-table-column>
            <el-table-column label="类型" prop="dataType" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.dataType | fieldDataTypeLog}}</span>
              </template>
            </el-table-column>
            <el-table-column label="logPart" prop="logPart" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="alertModel('edit',scope.row)"
                  v-permission="{action: 'sysFieldConfigSupervisionLogMouldChild:update' }"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="text"
                  class="red"
                  icon="el-icon-delete"
                  @click="deleteItem(scope.row)"
                  v-permission="{action: 'sysFieldConfigSupervisionLogMouldChild:delete' }"
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
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="showModel"
      width="50%"
      :before-close="cancelModel"
      center
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="180px"
        style="width:70%"
      >
        <el-form-item label="表名" prop="codeName">
          <el-input :disabled="true" type="text" placeholder="表名" v-model="editForm.codeName" />
        </el-form-item>
        <el-form-item label="类型:" prop="dataType">
          <el-select placeholder="请选择" v-model="editForm.dataType">
            <el-option label="地下室-质量日志" :value="1"></el-option>
            <el-option label="主体结构-质量日志" :value="2"></el-option>
            <el-option label="安全日志" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监理日志的部位:" prop="logPart">
          <el-select placeholder="监理日志的部位" v-model="editForm.logPart">
            <el-option label="1" :value="1"></el-option>
            <el-option label="2" :value="2"></el-option>
            <el-option label="3" :value="3"></el-option>
            <el-option label="4" :value="4"></el-option>
            <el-option label="5" :value="5"></el-option>
            <el-option label="6" :value="6"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="表" v-if="!currentCodeChild">
          <div class="tree">
            <el-tree
              :show-checkbox="false"
              :data="treeDataChild"
              node-key="code"
              :props="defaultPropsChild"
              highlight-current
              ref="tree"
              @node-click="treeNodeClickChild"
              :default-expand-all="showDefault"
              :default-checked-keys="defaultValue"
            ></el-tree>
          </div>
        </el-form-item>

        <el-form-item label="子表名" prop="targetCodeName" v-if="currentCodeChild">
          <el-input
            :disabled="true"
            type="text"
            placeholder="表名"
            v-model="editForm.targetCodeName"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModel" size="mini">取 消</el-button>
        <el-button type="primary" @click="submit" size="mini">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  systemWordLogRelevancyList,
  dictTreeNothing,
  systemWordLogRelevancyAdd,
  systemWordLogRelevancyUpdate,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import Axios from "axios";
export default {
  data() {
    return {
      userid: "",
      token: "",
      tableListChild: [],
      parentid: "",
      currentPage: 1,
      limit: 10,
      total: 0,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      currentCode: "",
      currentCodeName: "",
      dialogTitle: "",
      showModel: false,
      editForm: {
        codeName: "",
        dataType: "",
        logPart: "",
        targetCodeName: "",
      },
      rules: {
        targetCodeName: [
          { required: true, message: "子表名", trigger: "blur" },
        ],
        codeName: [{ required: true, message: "表名", trigger: "blur" }],
        dataType: [{ required: true, message: "类型", trigger: "change" }],
        logPart: [
          {
            required: true,
            message: "监理日志的部位,模块1------模块6",
            trigger: "blur",
          },
        ],
      },
      treeDataChild: [],
      defaultPropsChild: {
        children: "children",
        label: "name",
      },
      currentCodeChild: "",
      currentCodeNameChild: "",
      showDefault: false,
      defaultValue: [],
      itemId: "",
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    if (this.$route.query) {
      this.parentid = this.$route.query.parentid;
    }
    this.getTableList();
    this.getTreeList("04", "treeData");
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },

    //   删除
    async deleteItem(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = {
          token: this.token,
          userid: this.userid,
          id: item.id,
          isDeleted: 1,
        };
        systemWordLogRelevancyUpdate(params)
          .then((res) => {
            if (res.data.status === "0") {
              this.$message({ type: "success", message: "删除成功!" });
              this.currentPage = 1;
              this.getTableList();
            } else {
              this.$message({ type: "error", message: res.data.message });
            }
          })
          .catch((err) => {
            this.$message({ type: "error", message: "服务器响应失败..." });
          });
      });
    },

    //   更新子表
    async updateChildFun(params) {
      let res = await systemWordLogRelevancyUpdate(params);
      if (res.data.status == "0") {
        this.$message({ type: "success", message: "修改成功" });
        this.getTableList();
        this.showModel = false;
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    // 添加子表
    async addChildFun(params) {
      let res = await systemWordLogRelevancyAdd(params);
      if (res.data.status == "0") {
        this.showModel = false;
        this.$message({ type: "success", message: "添加成功" });
        this.getTableList();
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    submit() {
      this.$refs.editForm.validate((valid) => {
        if (valid == true) {
          if (this.dialogTitle == "添加子表") {
            let params = {
              token: this.token,
              userid: this.userid,
              ...this.editForm,
              parentid: this.parentid,
              tcode: this.currentCode,
              targetCode: this.currentCodeChild,
            };
            if (params.targetCode !== "") {
              this.addChildFun(params);
            } else {
              this.$message({ type: "error", message: "请选择子表" });
              return false;
            }
          }
          if (this.dialogTitle == "编辑") {
            let params = {
              token: this.token,
              userid: this.userid,
              ...this.editForm,
              parentid: this.parentid,
              tcode: this.currentCode,
              targetCode: this.currentCodeChild,
              id: this.itemId,
            };
            this.updateChildFun(params);
          }
        }
      });
    },

    alertModel(action, item) {
      if (action == "add") {
        if (this.currentCode !== "") {
          this.showModel = true;
          this.editForm = {
            codeName: "",
            dataType: "",
            logPart: "",
            targetCodeName: "",
          };
          this.currentCodeChild = "";
          this.dialogTitle = "添加子表";
          this.getTreeList(this.currentCode, "treeDataChild");

          this.editForm.codeName = this.currentCodeName;
        } else {
          this.$message({ type: "error", message: "请先选择表" });
          return false;
        }
      }
      if (action == "edit") {
        this.currentCode = "";
        this.currentCodeName = "";
        this.currentCodeChild = "";
        this.currentCodeNameChild = "";
        this.showModel = true;
        this.dialogTitle = "编辑";
        this.editForm.codeName = item.codeName;
        this.currentCode = item.tcode;
        this.editForm.dataType = item.dataType;
        this.editForm.logPart = item.logPart;
        this.editForm.targetCodeName = item.targetCodeName;
        this.currentCodeChild = item.targetCode;
        this.currentCodeNameChild = item.targetCodeName;
        this.itemId = item.id;
      }
    },

    // 获取表格数据
    async getTableList() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.limit,
        token: this.token,
        userid: this.userid,
        parentId: this.parentid,
      };
      let res = await systemWordLogRelevancyList(params);
      if (res.data.status == "0") {
        this.tableListChild = res.data.data.list;
        this.total = res.data.data.total;
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    /**
     * 获取权限树的数据，根据不同的公司code，得到不同的树
     * params：code
     * create by YuXiong
     * date:2020-6-23
     */
    async getTreeList(code, list) {
      let params = {
        code: code,
      };
      try {
        let res = await dictTreeNothing(params);
        if (res.data.status === "0") {
          this[list] = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    treeNodeClickChild(item) {
      this.currentCodeChild = item.code;
      this.currentCodeNameChild = item.name;
    },

    /**
     * 关闭弹窗
     * params:none
     * create by YuXiong
     * date:2020-6-23
     */
    cancelModel() {
      this.currentCode = "";
      this.currentCodeName = "";
      this.currentCodeChild = "";
      this.currentCodeNameChild = "";
      this.showModel = false;
    },

    /**
     * 点击树节点，加载表格
     * params：item
     * create by YuXiong
     * date:2020-6-23
     */
    treeNodeClick(item) {
      this.currentCode = item.code;
      this.currentCodeName = item.name;
    },

    /**
     * 分页每条数目改变，则回到第一页数据，列表重新加载
     * params:val
     * create by YuXiong
     * date:2020-6-28
     */
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getTableList();
    },

    /**
     * 分页点击事件,分页点击的时候，初始化搜索选项
     * params:val
     * create by YuXiong
     * date:2020-6-28
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableList();
    },
  },
};
</script>

<style lang="less" scoped>
.contet {
  margin: 40px 0 0 40px;
  width: calc(100% - 120px);
}
.left {
  background-color: #fafafa;
  margin-top: 60px;
  height: 720px;
  padding: 0 !important;
  h3 {
    background-color: #eee;
    color: #999;
    margin: 0;
    padding: 0;
    text-align: center;
    line-height: 60px;
    font-size: 14px;
    width: 100%;
  }
  .el-tree {
    background-color: transparent;
    width: 100%;
    overflow-x: auto;
    overflow-y: auto;
    height: 665px;
    /* /deep/ .el-tree-node__label {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    } */
    /deep/ .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    /deep/ .el-icon-caret-right:before {
      content: "\e723";
      font-size: 18px;
    }
    /deep/ .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
      content: "\e722";
      font-size: 18px;
    }

    /deep/ .el-tree-node:focus > .el-tree-node__content {
      background-color: transparent !important;
      color: #409eff;
    }
    /deep/ .is-current > .el-tree-node__content {
      background-color: transparent !important;
      color: #409eff;
    }
  }
}
/deep/ .el-tree > .el-tree-node {
  min-width: 100% !important;
  display: inline-block !important;
}
.el-tree::-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
.el-tree::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #fff;
}
.el-tree::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
.table {
  margin-top: 23px;
}
.right {
  float: right;
  margin: 20px;
}
.red {
  color: red;
}
</style>