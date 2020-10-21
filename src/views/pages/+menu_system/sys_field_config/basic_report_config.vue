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
          <div class="grid-content bg-purple">
            <div class="add-button">
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-plus"
                class="right"
                v-permission="{action: 'sysFieldConfigBasicReport:save' }"
                @click="alertModel('add',null)"
              >添加字段</el-button>
            </div>
          </div>
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
            <el-table-column label="编码" prop="tCode" align="center"></el-table-column>
            <el-table-column label="类型" prop="datatype" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.datatype | fieldDataType}}</span>
              </template>
            </el-table-column>

            <el-table-column label="字段" prop="tKey" align="center"></el-table-column>
            <el-table-column label="字段描述" prop="keydesc" align="center"></el-table-column>
            <el-table-column label="部位" prop="postion" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.postion == 1 ? "顶部" : "body"}}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-permission="{action: 'sysFieldConfigBasicReport:update' }"
                  @click="alertModel('edit',scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="text"
                  class="red"
                  icon="el-icon-delete"
                  @click="deleteItem(scope.row)"
                  v-permission="{action: 'sysFieldConfigBasicReport:delete' }"
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
      width="80%"
      :before-close="cancelModel"
      center
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="180px"
        style="width:45%"
      >
        <el-form-item label="编码(code):" prop="tCode">
          <el-input
            :disabled="true"
            type="text"
            placeholder="字典表对应的code"
            v-model="editForm.tCode"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="code名称(code_name):" prop="codeName">
          <el-input
            :disabled="true"
            type="text"
            placeholder="字典表对应的名称"
            v-model="editForm.codeName"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="字段(t_key):" prop="tKey">
          <el-input placeholder="字段key" v-model="editForm.tKey" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="字段描述(keydesc):" prop="keydesc">
          <el-input placeholder="key描述" v-model="editForm.keydesc" maxlength="100"></el-input>
        </el-form-item>

        <el-form-item label="部位:" prop="postion">
          <el-select placeholder="请选择" v-model="editForm.postion">
            <el-option label="顶部" :value="1"></el-option>
            <el-option label="body" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型:" prop="datatype">
          <el-select placeholder="请选择" v-model="editForm.datatype">
            <el-option label="输入框" :value="1"></el-option>
            <el-option label="问题项" :value="2"></el-option>
            <el-option label="其他问题项" :value="3"></el-option>
            <el-option label="图片" :value="4"></el-option>
            <el-option label="下拉框" :value="5"></el-option>
            <el-option label="下拉框选的值不需要返回" :value="6"></el-option>
            <el-option label="修改问题项=其他问题项+问题项" :value="7"></el-option>
            <el-option label="上传图片" :value="8"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModel" size="mini">取 消</el-button>
        <el-button type="primary" @click="submit" size="mini">提 交</el-button>
      </div>

      <div class="pointer">
        <span
          @click="getItem(item)"
          class="tips"
          v-for="(item ,index) in tipList"
          :key="index"
        >{{item}}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  dictTreeNothing,
  systemWordAdd,
  systemWordList,
  systemWordUpdate,
  systemWordTipList,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    return {
      userid: "",
      token: "",
      currentCode: "",
      currentCodeName: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      dialogTitle: "",
      showModel: false,
      editForm: {
        tCode: "",
        codeName: "",
        tKey: "",
        keydesc: "",
        postion: "",
        datatype: "",
      },
      rules: {
        tCode: [
          { required: true, message: "字典表对应的code", trigger: "blur" },
        ],
        codeName: [
          { required: true, message: "字典表对应的名称", trigger: "blur" },
        ],
        tKey: [{ required: true, message: "字段key", trigger: "blur" }],
        keydesc: [{ required: true, message: "key描述", trigger: "blur" }],
        postion: [{ required: true, message: "部位", trigger: "change" }],
        datatype: [{ required: true, message: "数据类型", trigger: "change" }],
      },
      currentPage: 1,
      limit: 10,
      total: 0,
      tableList: [],
      itemId: "",
      tipList: [],
      str: "",
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.getTreeList("04");
    this.getTableList("04");
    this.getTipList();
  },
  methods: {
    // 点击字段提示
    getItem(item) {
      this.str = item.split(":");
      this.editForm.tKey = this.str[1];
      this.editForm.keydesc = this.str[0];
    },

    // 获取字段提示
    async getTipList() {
      let params = {
        userid: this.userid,
        token: this.token,
      };
      let res = await systemWordTipList(params);
      if (res.data.status == "0") {
        this.tipList = res.data.data;
      }
    },

    // 修改
    async updateWordFun(params) {
      let res = await systemWordUpdate(params);
      if (res.data.status == "0") {
        this.showModel = false;
        this.getTableList(this.currentCode);
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
        systemWordUpdate(params)
          .then((res) => {
            if (res.data.status === "0") {
              this.$message({ type: "success", message: "删除成功!" });
              this.currentPage = 1;
              this.getTableList(this.currentCode);
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
      let res = await systemWordAdd(params);
      if (res.data.status == "0") {
        this.showModel = false;
        this.$message({ type: "success", message: "字段添加成功" });
        this.getTableList(this.currentCode);
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
              tCode: this.editForm.tCode,
              codeName: this.editForm.codeName,
              datatype: this.editForm.datatype,
              postion: this.editForm.postion,
              tKey: this.editForm.tKey,
              keydesc: this.editForm.keydesc,
              id: this.itemId,
            };
            this.updateWordFun(params);
          }
        } else {
          this.$message({ type: "warning", message: "请输入必填项" });
        }
      });
    },

    alertModel(action, item) {
      if (action == "add") {
        if (this.currentCode) {
          this.showModel = true;
          this.editForm = {
            tCode: "",
            codeName: "",
            tKey: "",
            keydesc: "",
            postion: "",
            datatype: "",
          };
          this.editForm.tCode = this.currentCode;
          this.editForm.codeName = this.currentCodeName;
          this.dialogTitle = "新增";
        } else {
          this.$message({ type: "error", message: "请选择一个节点" });
        }
      }
      if (action == "edit") {
        this.showModel = true;
        this.dialogTitle = "编辑";
        this.editForm.tCode = item.tCode;
        this.editForm.codeName = item.codeName;
        this.editForm.datatype = item.datatype;
        this.editForm.postion = item.postion;
        this.editForm.tKey = item.tKey;
        this.editForm.keydesc = item.keydesc;
        this.itemId = item.id;
      }
    },

    /**
     * 获取表格数据
     * params：code
     * create by YuXiong
     * date:2020-6-23
     */
    async getTableList(code) {
      let params = {
        word: code,
        token: this.token,
        userid: this.userid,
        pageNum: this.currentPage,
        pageSize: this.limit,
      };
      try {
        let res = await systemWordList(params);
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

    /**
     * 获取权限树的数据，根据不同的公司code，得到不同的树
     * params：code
     * create by YuXiong
     * date:2020-6-23
     */
    async getTreeList(code) {
      let params = {
        code: code,
      };
      try {
        let res = await dictTreeNothing(params);
        if (res.data.status === "0") {
          this.treeData = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
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
      this.getTableList(this.currentCode);
    },

    /**
     * 分页点击事件,分页点击的时候，初始化搜索选项
     * params:val
     * create by YuXiong
     * date:2020-6-28
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableList(this.currentCode);
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

    /**
     * 点击树节点，加载表格
     * params：item
     * create by YuXiong
     * date:2020-6-23
     */
    treeNodeClick(item) {
      this.currentCode = item.code;
      this.currentCodeName = item.name;
      this.currentPage = 1;
      this.getTableList(item.code);
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
.pointer {
  position: absolute;
  right: 30px;
  top: 60px;
  width: 50%;
  height: 450px;
  overflow: scroll;
}
.tips {
  display: inline-block;
  padding: 2px;
  margin: 3px;
  color: #409eff;
  background-color: #ecf5ff;
  border-color: #d9ecff;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
}
.dialog-footer {
  margin-top: 50px;
}
</style>