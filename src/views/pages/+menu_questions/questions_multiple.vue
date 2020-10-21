<template>
  <div id="quesitonList">
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
                @click="add"
                size="medium"
                icon="el-icon-plus"
                v-permission="{action: 'questionBase:save' }"
              >添加问题</el-button>
            </div>
            <!-- <div class="add-button">
              <el-button size="medium" icon="el-icon-download" type="primary">
                <a href="doc/体系库表.xlsx" download="体系库表.xlsx">下载模板</a>
              </el-button>
            </div> -->
            <el-button
              type="primary"
              @click="getMould()"
              size="medium"
              icon="el-icon-download"
            >下载模板</el-button>
            <div class="add-button">
              <import-file :fileaccept="filetype" :importFile="questionBaseImportSave2" :title="title"></import-file>
            </div>

            <el-table
              :data="tableList"
              border
              style="width: 100%"
              :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
            >
              <el-table-column label="名称" prop="codeName" align="center"></el-table-column>
              <el-table-column label="编码" prop="tCode" align="center"></el-table-column>
              <el-table-column label="问题描述" prop="content" align="center"></el-table-column>
              <el-table-column label="规范条款" prop="tDescribe" align="center"></el-table-column>
              <el-table-column label="部位" prop="tPostion" align="center"></el-table-column>
              <el-table-column label="特征值" prop="weight" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    v-permission="{action: 'questionBase:update' }"
                    @click="edit(scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    class="red"
                    icon="el-icon-delete"
                    @click="deleteItem(scope.row)"
                    v-permission="{action: 'questionBase:delete' }"
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
      <el-form :model="editForm" :rules="questionRule" ref="editForm" label-width="100px">
        <el-form-item label="问题描述:" prop="content">
          <el-input type="textarea" v-model="editForm.content" maxlength="1000"></el-input>
        </el-form-item>
        <el-form-item label="规范条款:" prop="describe">
          <el-input type="textarea" v-model="editForm.describe" maxlength="1000"></el-input>
        </el-form-item>

        <el-form-item label="部位:" prop="postion">
          <el-input type="textarea" v-model="editForm.postion" maxlength="100"></el-input>
        </el-form-item>

        <!-- 新增字段 -->

        <el-form-item label="特征值:">
          <el-input type="textarea" v-model="editForm.weight" maxlength="100"></el-input>
        </el-form-item>

        <!-- 新增字段 -->
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
  dictTreeNothing,
  questionList,
  questionSave,
  qestionUpdate,
  questionDelete,
  questionBaseImportSave,
} from "@/http/api.js";
import axios from "axios";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "questionListMultiple",
  data() {
    return {
      token: "",
      userid: "",
      treeData: [],
      currentPage: 1,
      limit: 10,
      total: 0,
      defaultProps: {
        children: "children",
        label: "name",
      },
      tableList: [],
      currentCode: "",
      currentId: "",
      showModel: false,
      dialogTitle: "",
      editForm: {
        content: "",
        describe: "",
        postion: "",
        weight: "",
      },
      questionRule: {
        content: [{ required: true, message: "问题描述", trigger: "blur" }],
        describe: [{ required: true, message: "规范条款", trigger: "blur" }],
      },
      fileList: [], //上传的文件列表
      loadingInstance: "",
      loadingOptions: {
        lock: true, // 是否锁屏
        text: "正在加载...", // 加载动画的文字
        spinner: "el-icon-loading", // 引入的loading图标
        background: "rgba(0, 0, 0, 0.3)", // 背景颜色
        target: ".sub-main", // 需要遮罩的区域
        body: true,
        customClass: "mask", // 遮罩层新增类名
      },
      filetype: "xlsx",
      title : '问题导入'
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.getTreeList("04");
    this.getTableList("04");
  },
  methods: {

    // 下载模板
    async getMould() {
      let params = {
        userid: this.userid,
        token: this.token,
      };
      let res = await axios({
        method: "POST",
        url: axios.defaults.baseURL + "/questionBase/mould",
        responseType: "blob",
        data: params,
      });
      let blob = new Blob([res.data], { type: `application/vnd.ms-excel` });
      let link = document.createElement("a");
      let objectUrl = URL.createObjectURL(blob); // 创建URL
      link.href = objectUrl;
      link.download = "问题库--模板"; // 自定义文件名
      link.click(); // 下载文件
      URL.revokeObjectURL(objectUrl); // 释放内存
    },

    questionBaseImportSave2() {
      return questionBaseImportSave;
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
     * 获取表格数据
     * params：code
     * create by YuXiong
     * date:2020-6-23
     */
    async getTableList(code) {
      let params = {
        code: code,
        id: "",
        token: this.token,
        userid: this.userid,
        pageNum: this.currentPage,
        pageSize: this.limit,
        optionType: "1",
      };
      try {
        let res = await questionList(params);
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
     * 点击树节点，加载表格
     * params：item
     * create by YuXiong
     * date:2020-6-23
     */
    treeNodeClick(item) {
      this.currentCode = item.code;
      this.currentPage = 1;
      this.getTableList(item.code);
    },
    /**
     * 添加问题
     * params：none
     * create by YuXiong
     * date:2020-6-23
     */
    add() {
      if (this.currentCode.length === 0) {
        this.$message({ type: "error", message: "请先选择添加的节点" });
      } else {
        this.editForm.content = "";
        this.editForm.describe = "";
        this.editForm.postion = "";
        this.editForm.weight = "";
        this.dialogTitle = "新增";
        this.showModel = true;
      }
    },
    /**
     * 编辑问题
     * params：item
     * create by YuXiong
     * date:2020-6-23
     */
    edit(item) {
      this.dialogTitle = "编辑";
      this.currentId = item.id;
      this.editForm.content = item.content;
      this.editForm.describe = item.tDescribe;
      this.editForm.postion = item.tPostion;
      this.editForm.weight = item.weight;
      this.showModel = true;
    },
    /**
     * 删除问题列表
     * params：item
     * create by YuXiong
     * date:2020-6-23
     */
    deleteItem(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: item.id,
            token: this.token,
            userid: this.userid,
            optionType: "1",
          };
          questionDelete(params)
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 提交保存
     * params：none
     * create by YuXiong
     * date:2020-6-23
     */
    submit() {
      this.$refs.editForm.validate((valid) => {
        if (valid === true) {
          if (this.dialogTitle === "新增") {
            let params = {
              code: this.currentCode,
              content: this.editForm.content,
              describe: this.editForm.describe,
              postion: this.editForm.postion,
              optionType: "1",
              title: "1",
              token: this.token,
              userid: this.userid,
              weight: this.editForm.weight,
            };

            if (this.editForm.weight >= 0 && this.editForm.weight <= 4) {
              this.addUserFun(params);
            } else {
              this.$message({
                type: "warning",
                message: "特征值格式错误，请输入0到4之间的数字",
              });
            }
          } else {
            let params = {
              code: "",
              id: this.currentId,
              content: this.editForm.content,
              describe: this.editForm.describe,
              postion: this.editForm.postion,
              optionType: "1",
              title: "1",
              token: this.token,
              userid: this.userid,
              weight: this.editForm.weight,
            };
            if (this.editForm.weight >= 0 && this.editForm.weight <= 4) {
              this.editUserFun(params);
            } else {
              this.$message({
                type: "warning",
                message: "特征值格式错误，请输入0到4之间的数字",
              });
            }
          }
        }
      });
    },
    /**
     * 添加用户调用的方法
     * params:params
     * create by YuXiong
     * date:2020-6-23
     */
    async addUserFun(params) {
      try {
        let res = await questionSave(params);
        if (res.data.status === "0") {
          this.$message({ type: "success", message: "添加成功!" });
          this.showModel = false;
          this.currentPage = 1;
          this.getTableList(this.currentCode);
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },

    /**
     * 添加用户调用的方法
     * params:params
     * create by YuXiong
     * date:2020-6-23
     */
    async editUserFun(params) {
      try {
        let res = await qestionUpdate(params);
        if (res.data.status === "0") {
          this.$message({ type: "success", message: "添加成功!" });
          this.showModel = false;
          this.currentPage = 1;
          this.getTableList(this.currentCode);
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
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

<style scoped lang='less'>
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
.add-button {
  width: auto;
  text-align: right;
  height: 60px;
  line-height: 60px;
  display: inline-block;
  float: right;
  margin-right: 30px;
}
.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 99;
  text-align: center;
  padding-top: 30px;
}
a {
  text-decoration: none;
  color: inherit;
}
.red {
  color: red;
}
</style>