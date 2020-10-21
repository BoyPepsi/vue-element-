<template>
  <div id="quesitonList">
    <div class="contet" v-if="!showChoice">
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
                v-permission="{action: 'questionBase:singleSave' }"
              >添加</el-button>
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
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="choice(scope.row)"
                    v-permission="{action: 'questionBase:qyueryPart' }"
                  >选项</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    v-permission="{action: 'questionBase:singleUpdate' }"
                    @click="edit(scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    class="red"
                    icon="el-icon-delete"
                    @click="deleteItem(scope.row)"
                    v-permission="{action: 'questionBase:singleDelete' }"
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

    <!-- ===================================================================选择打开的html=============================================== -->
    <div class="chioce" v-if="showChoice">
      <el-table
        :data="choiceList"
        border
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        class="choice-table"
      >
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
        <el-table-column label="选项" prop="content" align="center"></el-table-column>
        <el-table-column label="达标" prop="checkName" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!--  <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-permission="{action: 'update' }"
              @click="edit(scope.row)"
            >编辑</el-button>-->
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-delete"
              @click="deleteChoice(scope.row)"
              v-permission="{action: 'delete' }"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form
        :model="choiceForm"
        :rules="choiceRule"
        ref="choiceForm"
        label-width="100px"
        class="choice-form"
      >
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="选项:" prop="content">
              <el-input v-model="choiceForm.content" maxlength="100" style="width:45%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="file">
            <el-form-item label="是否达标:" prop="checkValue">
              <el-select v-model="choiceForm.checkValue" style="width:45%">
                <el-option
                  v-for="item in checkList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitChoice">提 交</el-button>
          <el-button @click="goBackList">返回问题列表</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- ===================================================================添加编辑问题弹窗=============================================== -->

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
  questionSingleList,
  questionDelete,
  questionSavePart,
  questionListSearch,
  questionDeletePart
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "questionListRadio",
  data() {
    return {
      token: "",
      userid: "",
      currentPage: 1,
      limit: 10,
      total: 0,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableList: [],
      currentCode: "",
      currentId: "",
      showModel: false,
      dialogTitle: "",
      editForm: {
        content: "",
        describe: "",
        postion: ""
      },
      questionRule: {
        content: [
          { required: true, message: "问题描述必须填写", trigger: "blur" }
        ],
        describe: [
          { required: true, message: "规范条款必须填写", trigger: "blur" }
        ]
      },
      choiceRule: {
        content: [{ required: true, message: "选项必须填写", trigger: "blur" }]
      },
      choiceList: [],
      choiceForm: {
        content: "",
        checkName: "",
        checkValue: "1"
      },
      checkList: [
        {
          value: "1",
          name: "是"
        },
        {
          value: "0",
          name: "否"
        }
      ],
      showChoice: false,
      currentChoiceId: ""
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
    /**
     * 获取权限树的数据，根据不同的公司code，得到不同的树
     * params：code
     * create by YuXiong
     * date:2020-6-23
     */
    async getTreeList(code) {
      let params = {
        code: code
      };
      try {
        let res = await dictTreeNothing(params);
        if (res.data.status === "0") {
          this.treeData = res.data.data.list;
        } else {
          // judgeErroCode(res.data.status, res.data.message);
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
        optionType: "2"
      };
      try {
        let res = await questionSingleList(params);
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
        this.dialogTitle = "新增";
        this.showModel = true;
      }
    },

    // 导入
    imports(res, file) {
      console.log(res);
      console.log(file);
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
      this.showModel = true;
    },
    /**
     * 点击选项
     * params：item
     * create by YuXiong
     * date:2020-6-23
     */
    choice(item) {
      this.showChoice = true;
      this.currentChoiceId = item.id;
      this.choiceList = [];
      this.choiceForm.content = "";
      this.choiceForm.checkValue = "1";
      this.getChoiceList(item.id);
    },
    /**
     * 获取选项列表
     * params：id
     * create by YuXiong
     * date:2020-6-23
     */
    async getChoiceList(id) {
      let params = {
        quesstionId: id,
        token: this.token,
        userid: this.userid
      };
      try {
        let res = await questionListSearch(params);
        if (res.data.status === "0") {
          this.choiceList = res.data.data;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
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
        type: "warning"
      })
        .then(() => {
          let params = {
            id: item.id,
            token: this.token,
            userid: this.userid,
            optionType: "2"
          };
          questionDelete(params)
            .then(res => {
              if (res.data.status === "0") {
                this.$message({ type: "success", message: "删除成功!" });
                this.currentPage = 1;
                this.getTableList(this.currentCode);
              } else {
                this.$message({ type: "error", message: res.data.message });
              }
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

    /**
     * 删除选项
     * params：item
     * create by YuXiong
     * date:2020-6-23
     */
    deleteChoice(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: item.id,
            token: this.token,
            userid: this.userid,
            checkName: item.checkName,
            checkValue: item.checkValue,
            content: item.content
          };
          questionDeletePart(params)
            .then(res => {
              if (res.data.status === "0") {
                this.$message({ type: "success", message: "删除成功!" });
                this.choiceList = [];
                this.getChoiceList(this.currentChoiceId);
              } else {
                this.$message({ type: "error", message: res.data.message });
              }
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

    /**
     * 提交保存
     * params：none
     * create by YuXiong
     * date:2020-6-23
     */
    submit() {
      this.$refs.editForm.validate(valid => {
        if (valid === true) {
          if (this.dialogTitle === "新增") {
            let params = {
              code: this.currentCode,
              content: this.editForm.content,
              describe: this.editForm.describe,
              postion: this.editForm.postion,
              optionType: "2",
              title: "1",
              token: this.token,
              userid: this.userid
            };
            this.addUserFun(params);
          } else {
            let params = {
              code: "",
              id: this.currentId,
              content: this.editForm.content,
              describe: this.editForm.describe,
              postion: this.editForm.postion,
              optionType: "2",
              title: "1",
              token: this.token,
              userid: this.userid
            };
            this.editUserFun(params);
          }
        }
      });
    },

    /**
     * 选项提交保存
     * params：none
     * create by YuXiong
     * date:2020-6-23
     */
    async submitChoice() {
      let obj = this.checkList.find(
        item => item.value == this.choiceForm.checkValue
      );
      this.choiceForm.checkName = obj.name;
      let params = {
        checkName: this.choiceForm.checkName,
        checkValue: this.choiceForm.checkValue,
        content: this.choiceForm.content,
        quesstionId: this.currentChoiceId,
        token: this.token,
        userid: this.userid
      };
      this.$refs.choiceForm.validate(valid => {
        if (valid === true) {
          questionSavePart(params).then(res => {
            if (res.data.status === "0") {
              this.$message({ type: "success", message: "添加成功!" });
              this.choiceList = [];
              this.choiceForm.content = "";
              this.choiceForm.checkValue = "1";
              this.getChoiceList(this.currentChoiceId);
            } else {
              judgeErroCode(res.data.status, res.data.message);
            }
          });
        }
      });
    },
    goBackList() {
      this.showChoice = false;
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
    }
  }
};
</script>

<style scoped lang='less'>
.contet {
  margin: 40px 0 0 40px;
  width: calc(100% - 120px);
}
.left {
  background-color: #fafafa;
  height: 100%;
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
    padding-top: 30px;
    overflow-x: auto;
    overflow-y: auto;
    height: 665px;
    /deep/ .el-tree-node__label {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
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
    /*  /deep/ .el-tree-node:focus > .el-tree-node__content {
      background-color: transparent !important;
      color: #409eff;
    } */
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
  /*滚动条整体样式*/
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
  width: 100%;
  text-align: right;
  height: 60px;
  line-height: 60px;
}
.choice-table {
  width: 80%;
  margin: 40px 0 0 40px;
}
.choice-form {
  margin-top: 80px;
  padding-top: 40px;
  border-top: 1px dashed #eee;
}
.btns {
  margin-top: 40px;
  width: 80%;
}
.el-upload__tip {
  margin-top: -30px;
}
.red{
  color: red;
}
</style>