<template>
  <div id="managerlog-mould-list">
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
                class="right"
                v-permission="{action: 'save' }"
              >添加模板</el-button>
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
            <el-table-column label="内容" prop="content" align="center"></el-table-column>
            <el-table-column label="时间" prop="createTime" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | transformDate2}}</span>
              </template>
            </el-table-column>
            <el-table-column label="模板1" prop="template1" align="center"></el-table-column>
            <el-table-column label="模板2" prop="template2" align="center"></el-table-column>
            <el-table-column label="模板3" prop="template3" align="center"></el-table-column>
            <el-table-column label="模板4" prop="template4" align="center"></el-table-column>
            <el-table-column label="模板5" prop="template5" align="center"></el-table-column>
            <el-table-column label="模板6" prop="template6" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-permission="{action: 'update' }"
                  @click="edit(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="text"
                  class="red"
                  icon="el-icon-delete"
                  @click="deleteItem(scope.row)"
                  v-permission="{action: 'delete' }"
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
      <el-form :model="editForm" :rules="mouldRule" ref="editForm" label-width="100px">
        <el-form-item label="类型:" prop="type">
          <el-select placeholder="请选择项目类型" v-model="editForm.type" style="width:20%">
            <el-option  label="地下室" :value=1></el-option>
            <el-option  label="主体结构" :value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input type="text" placeholder="请输入内容" v-model="editForm.content" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="模板1:">
          <el-input
            type="textarea"
            placeholder='输入内容格式为  ["内容XXXXX"]'
            v-model="editForm.template1"
            maxlength="100"
            rows="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板2:">
          <el-input
            type="textarea"
            placeholder='输入内容格式为  ["内容XXXXX"]'
            v-model="editForm.template2"
            maxlength="100"
            rows="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板3:">
          <el-input
            type="textarea"
            placeholder='输入内容格式为  ["内容XXXXX"]'
            v-model="editForm.template3"
            maxlength="100"
            rows="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板4:">
          <el-input
            type="textarea"
            placeholder='输入内容格式为  ["内容XXXXX"]'
            v-model="editForm.template4"
            maxlength="100"
            rows="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板5:">
          <el-input
            type="textarea"
            placeholder='输入内容格式为  ["内容XXXXX"]'
            v-model="editForm.template5"
            maxlength="100"
            rows="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板6:">
          <el-input
            type="textarea"
            placeholder='输入内容格式为  ["内容XXXXX"]'
            v-model="editForm.template6"
            maxlength="100"
            rows="10"
          ></el-input>
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
  logTemplateList,
  logTemplateAdd,
  logTemplateUpdate,
  logTemplateDelete
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import { getDate2 } from "@/utils/transformDate.js";
export default {
  name: "managerlogMouldList",
  data() {
    return {
      userid: "",
      token: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      currentPage: 1,
      limit: 10,
      total: 0,
      tableList: [],
      currentCode: "",
      dialogTitle: "",
      showModel: false,
      currentId: "",
      editForm: {
        type: "",
        template1: "",
        template2: "",
        template3: "",
        template4: "",
        template5: "",
        template6: "",
        content: "",
      },
      mouldRule: {
        type: [{ required: true, message: "请输入类型", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
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
    // 删除
    deleteItem(row){
      console.log(row);
      this.$confirm("此操作将永久删除该项, 是否继续?","提示",{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          id : row.id,
          token : this.token,
          userid : this.userid,
          isDelete : "1"
        };
        logTemplateDelete(params).then(res => {
          if (res.data.status === "0") {
            this.$message({ type: "success", message: "删除成功!" });
            this.currentPage = 1;
            this.getTableList(this.currentCode);
          }else {
            this.$message({ type: "error", message: res.data.message });
          }
        })
        .catch(err => {
          this.$message({ type: "error", message: "服务器响应失败..." });
        });
      })
    },

    // 保存
    submit() {
      this.$refs.editForm.validate((valid) => {
        if (valid == true) {
          if (this.dialogTitle === "新增") {
            let params = {
              tcode: this.currentCode,
              content: this.editForm.content,
              template1: this.editForm.template1,
              template2: this.editForm.template2,
              template3: this.editForm.template3,
              template4: this.editForm.template4,
              template5: this.editForm.template5,
              template6: this.editForm.template6,
              token: this.token,
              type: this.editForm.type,
              userid: this.userid,
            };
            this.addMouldFun(params);
          } else {
            let params = {
              tcode: this.currentCode,
              content: this.editForm.content,
              template1: this.editForm.template1,
              template2: this.editForm.template2,
              template3: this.editForm.template3,
              template4: this.editForm.template4,
              template5: this.editForm.template5,
              template6: this.editForm.template6,
              token: this.token,
              type: this.editForm.type,
              userid: this.userid,
              id : this.currentId
            };
            this.editMouldFun(params);
          }
        } else {
          this.$message({ type: "warning", message: "请输入必填项" });
        }
      });
    },

    // 修改
    async editMouldFun(params){
      try{
        let res = await logTemplateUpdate(params);
        if (res.data.status === '0') {
          this.$message({ type: "success", message: "添加成功!" });
          this.showModel = false;
          this.currentPage = 1;
          this.getTableList(this.currentCode);
        }else {
          this.$message({ type: "error", message: res.data.message });
          judgeErroCode(res.data.status, res.data.message);
        }
      }catch(error){
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },

    // 新增
    async addMouldFun(params) {
      try {
        let res = await logTemplateAdd(params);
        if (res.data.status === "0") {
          this.$message({ type: "success", message: "添加成功!" });
          this.showModel = false;
          this.currentPage = 1;
          this.getTableList(this.currentCode);
        } else {
          this.$message({ type: "error", message: res.data.message });
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },

    // 编辑
    edit(item) {
      console.log(item);
      this.dialogTitle = "编辑";
      this.editForm.content = item.content;
      this.currentId = item.id;
      this.editForm.template1 = item.template1;
      this.editForm.template2 = item.template2;
      this.editForm.template3 = item.template3;
      this.editForm.template4 = item.template4;
      this.editForm.template5 = item.template5;
      this.editForm.template6 = item.template6;
      this.currentCode = item.tcode;
      this.editForm.type = item.type;
      // this.$set(this.editForm, 'type', item.type)
      this.showModel = true;
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
        this.editForm.type = "";
        this.editForm.content = "";
        this.editForm.template1 = "";
        this.editForm.template2 = "";
        this.editForm.template3 = "";
        this.editForm.template4 = "";
        this.editForm.template5 = "";
        this.editForm.template6 = "";
        this.dialogTitle = "新增";
        this.showModel = true;
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
     * 获取表格数据
     * params：code
     * create by YuXiong
     * date:2020-6-23
     */
    async getTableList(code) {
      let params = {
        word: code,
        id: "",
        token: this.token,
        userid: this.userid,
        pageNum: this.currentPage,
        pageSize: this.limit,
      };
      try {
        let res = await logTemplateList(params);
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
          // judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
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
.right{
  float: right;
  margin: 20px;
}
</style>