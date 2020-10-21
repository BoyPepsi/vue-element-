<template>
  <div id="field-config">
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
          <div class="add-button">
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-plus"
              class="right"
              v-permission="{action: 'sysFieldConfigSupervisionLogMould:save' }"
              @click="alertModel('add',null)"
            >添加字段</el-button>
          </div>
          <div class="table">
            <el-table
              :data="tableList"
              class="table"
              border
              style="width: 100%"
              :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
            >
              <el-table-column label="名称" prop="codeName" align="center"></el-table-column>
              <el-table-column label="内容" prop="content" align="center"></el-table-column>

              <el-table-column label="工作" prop="operate" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.operate | fieldOperate}}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    v-permission="{action: 'sysFieldConfigSupervisionLogMould:update' }"
                    @click="alertModel('edit',scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-document"
                    @click="show(scope.row)"
                    v-permission="{action: 'sysFieldConfigSupervisionLogMouldChild:list' }"
                  >查看层级</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-document"
                    @click="showFields(scope.row)"
                    v-permission="{action: 'sysFieldConfigSupervisionLog:list' }"
                  >查看字段列表</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-plus"
                    @click="alertModel('addChild',scope.row)"
                    v-permission="{action: 'sysFieldConfigSupervisionLogMouldChild:save' }"
                  >添加层级</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    class="red"
                    icon="el-icon-delete"
                    @click="deleteItem(scope.row)"
                    v-permission="{action: 'sysFieldConfigSupervisionLogMould:delete' }"
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
        <div v-if="mainParams">
          <el-form-item label="模板内容" prop="content">
            <el-input
              type="textarea"
              placeholder="模板内容"
              v-model="editForm.content"
              maxlength="100"
              rows="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="工作:" prop="operate">
            <el-select placeholder="请选择" v-model="editForm.operate">
              <el-option label="合并" :value="1"></el-option>
              <el-option label="循环" :value="2"></el-option>
              <el-option label="混凝土类型表施工人数循环" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div v-if="childParams">
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
          <el-form-item label="表">
            <div class="tree">
              <el-tree
                :show-checkbox="false"
                :data="treeDataChild"
                node-key="code"
                :props="defaultPropsChild"
                highlight-current
                ref="tree"
                @node-click="treeNodeClickChild"
              ></el-tree>
            </div>
          </el-form-item>
        </div>
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
  systemwordLogTempAdd,
  systemWordLogTempList,
  systemwordLogTempUpdate,
  systemwordLogTempDelete,
  dictTreeNothing,
  systemWordLogRelevancyAdd,
  systemWordLogRelevancyList,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    return {
      userid: "",
      token: "",
      currentCode: "",
      currentCodeName: "",
      dialogTitle: "",
      showModel: false,
      editForm: {
        codeName: "",
        content: "",
        operate: "",
        //子表参数
        dataType: "",
        logPart: "",
      },
      rules: {
        content: [{ required: true, message: "模板内容", trigger: "blur" }],
        codeName: [{ required: true, message: "表名", trigger: "blur" }],
        operate: [{ required: true, message: "操作", trigger: "change" }],
        dataType: [{ required: true, message: "类型", trigger: "change" }],
        logPart: [
          {
            required: true,
            message: "监理日志的部位,模块1------模块6",
            trigger: "blur",
          },
        ],
      },
      currentPage: 1,
      limit: 10,
      total: 0,
      tableList: [],
      itemId: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      treeDataChild: [],
      defaultPropsChild: {
        children: "children",
        label: "name",
      },
      codeChild: "",
      codeNameChild: "",
      childParams: false,
      mainParams: true,
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.getTableList();
    this.getTreeList("04", "treeData");
  },
  methods: {
    // 添加子表
    async addChildFun(params) {
      let res = await systemWordLogRelevancyAdd(params);
      if (res.data.status == "0") {
        this.showModel = false;
        this.$message({ type: "success", message: "添加成功" });
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

    // 查看他的字段列表
    showFields(item) {
      this.$router.push({
        path: "/sysFieldConfigSupervisionLog",
        query: {
          parentid: item.id,
        },
      });
    },

    // 查看他的层级关系
    async show(item) {
      let params = {
        pageNum: 1,
        pageSize: 100,
        token: this.token,
        userid: this.userid,
        parentId: item.id,
      };
      systemWordLogRelevancyList(params)
        .then((res) => {
          if (res.data.status == "0") {
            if (res.data.data.total !== 0) {
              this.$router.push({
                path: "/sysFieldConfigSupervisionLogMouldChild",
                query: {
                  parentid: item.id,
                },
              });
            } else {
              this.$message({
                type: "error",
                message: "该模板暂无层级表，请先添加",
              });
            }
          }
        })
        .catch((err) => {});
    },

    // 修改
    async updateWordFun(params) {
      let res = await systemwordLogTempUpdate(params);
      if (res.data.status == "0") {
        this.showModel = false;
        this.getTableList();
        this.$message({ type: "success", message: "字段修改成功" });
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    // 删除
    deleteItem(row) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = {
          id: row.id,
          token: this.token,
          userid: this.userid,
          isDeleted: 1,
        };
        systemwordLogTempDelete(params)
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

    // 保存
    async addWordFun(params) {
      let res = await systemwordLogTempAdd(params);
      if (res.data.status == "0") {
        this.showModel = false;
        this.$message({ type: "success", message: "字段添加成功" });
        this.getTableList();
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    // 提交
    submit() {
      this.$refs.editForm.validate((valid) => {
        if (valid == true) {
          if (this.dialogTitle === "新增") {
            let params = {
              token: this.token,
              userid: this.userid,
              ...this.editForm,
            };
            this.addWordFun(params);
          }
          if (this.dialogTitle === "编辑") {
            let params = {
              token: this.token,
              userid: this.userid,
              id: this.itemId,
              content: this.editForm.content,
              codeName: this.editForm.codeName,
              operate: this.editForm.operate,
            };
            this.updateWordFun(params);
          }
          if (this.dialogTitle === "添加子表") {
            let params = {
              token: this.token,
              userid: this.userid,
              ...this.editForm,
              parentid: this.itemId,
              tcode: this.currentCode,
              targetCode: this.currentCodeChild,
            };
            if (params.targetCode) {
              this.addChildFun(params);
            } else {
              this.$message({ type: "warning", message: "请选择子表" });
            }
          }
        } else {
          this.$message({ type: "warning", message: "请输入必填项" });
        }
      });
    },

    alertModel(action, item) {
      if (action == "add") {
        if (this.currentCode !== "") {
          this.showModel = true;
          this.editForm = {
            codeName: "",
            content: "",
            operate: "",
            //子表参数
            dataType: "",
            logPart: "",
          };
          this.editForm.codeName = this.currentCodeName;
          this.dialogTitle = "新增";
          this.childParams = false;
          this.mainParams = true;
        } else {
          this.showModel = false;
          this.$message({ type: "error", message: "请选择表" });
        }
      }
      if (action == "edit") {
        this.showModel = true;
        this.dialogTitle = "编辑";
        this.childParams = false;
        this.mainParams = true;
        this.itemId = item.id;
        this.editForm.content = item.content;
        this.editForm.operate = item.operate;
        this.editForm.codeName = item.codeName;
      }
      if (action == "addChild") {
        if (this.currentCode !== "") {
          this.showModel = true;
          this.getTreeList(this.currentCode, "treeDataChild");
          this.childParams = true;
          this.mainParams = false;
          this.editForm = {};
          this.dialogTitle = "添加子表";
          this.itemId = item.id;
          this.editForm.codeName = this.currentCodeName;
        } else {
          this.showModel = false;
          this.$message({ type: "error", message: "请选择表" });
        }
      }
    },

    /**
     * 获取表格数据
     * params：code
     * create by YuXiong
     * date:2020-6-23
     */
    async getTableList() {
      let params = {
        token: this.token,
        userid: this.userid,
        pageNum: this.currentPage,
        pageSize: this.limit,
      };
      try {
        let res = await systemWordLogTempList(params);
        if (res.data.status === "0") {
          this.tableList = res.data.data.list;
          this.total = res.data.data.total;
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

    /**
     * 关闭弹窗
     * params:none
     * create by YuXiong
     * date:2020-6-23
     */
    cancelModel() {
      this.showModel = false;
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