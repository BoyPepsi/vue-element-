<template>
  <div id="field-config">
    <div class="contet">
      <div class="grid-content bg-purple">
        <div class="add-button">
          <el-button type="primary" size="medium" class="right" @click="goback"
            >返回</el-button
          >
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-plus"
            class="right"
            v-permission="{ action: 'sysFieldConfigSupervisionLog:save' }"
            @click="alertModel('add', null)"
            >添加字段</el-button
          >
        </div>
      </div>
      <el-table
        :data="tableList"
        class="table"
        border
        style="width: 100%"
        :header-cell-style="{
          'background-color': '#fafafa',
          color: '#90333',
        }"
      >
        <el-table-column label="部位" prop="dataSource" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.dataSource == 1 ? "顶部" : "body" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据类型" prop="dataType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.dataType == 1 ? "普通" : "表格" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="字段"
          prop="tKey"
          align="center"
        ></el-table-column>
        <el-table-column
          label="替换的字符"
          prop="mark"
          align="center"
        ></el-table-column>
        <el-table-column label="数字类型" prop="mathType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mathType | mathType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="表类型" prop="tableClassify" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.tableClassify | tableClassify }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="表格下标"
          prop="tableIndex"
          align="center"
        ></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-permission="{ action: 'sysFieldConfigSupervisionLog:update' }"
              @click="alertModel('edit', scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-delete"
              @click="deleteItem(scope.row)"
              v-permission="{ action: 'sysFieldConfigSupervisionLog:delete' }"
              >删除</el-button
            >
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
        style="width: 45%"
      >
        <el-form-item label="部位:" prop="dataSource">
          <el-select placeholder="请选择" v-model="editForm.dataSource">
            <el-option label="顶部" :value="1"></el-option>
            <el-option label="body" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型:" prop="dataType">
          <el-select placeholder="请选择" v-model="editForm.dataType">
            <el-option label="普通" :value="1"></el-option>
            <el-option label="表格" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="字段:" prop="key">
          <el-input
            type="text"
            placeholder="字段key"
            v-model="editForm.key"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="desc">
          <el-input
            type="text"
            placeholder="描述"
            v-model="editForm.desc"
            maxlength="100"
          ></el-input>
        </el-form-item>

        <el-form-item label="替换的字符:" prop="mark">
          <el-input
            type="text"
            placeholder="替换的字符"
            v-model="editForm.mark"
            maxlength="100"
          ></el-input>
        </el-form-item>

        <el-form-item label="数值类型:" prop="mathType">
          <el-select placeholder="请选择" v-model="editForm.mathType">
            <el-option label="原始值" :value="1"></el-option>
            <el-option label="最大值" :value="2"></el-option>
            <el-option label="最小值" :value="3"></el-option>
            <el-option label="最新值" :value="4"></el-option>
            <el-option label="求和" :value="5"></el-option>
            <el-option label="合并" :value="6"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="表类型:" prop="tableClassify">
          <el-select placeholder="请选择" v-model="editForm.tableClassify">
            <el-option label="普通表" :value="0"></el-option>
            <el-option label="混凝土表格" :value="1"></el-option>
            <el-option label="钢筋实测信息" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="表格下标:" prop="tableIndex">
          <el-input
            type="text"
            placeholder="表格下标"
            v-model="editForm.tableIndex"
            maxlength="100"
          ></el-input>
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
          v-for="(item, index) in tipList"
          :key="index"
          >{{ item }}</span
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  dictTreeNothing,
  systemWordTipList,
  systemWordLogTempDetailList,
  systemWordLogTempDetailAdd,
  systemWordLogTempDetailUpdate,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    return {
      userid: "",
      token: "",
      dialogTitle: "",
      showModel: false,
      editForm: {
        dataSource: "",
        dataType: "",
        desc: "",
        key: "",
        mark: "",
        mathType: "",
        tableClassify: "",
        tableIndex: "",
      },
      rules: {
        dataSource: [
          {
            required: true,
            message: "部位",
            trigger: "change",
          },
        ],
        dataType: [
          {
            required: true,
            message: "数据类型",
            trigger: "change",
          },
        ],
        desc: [
          {
            required: true,
            message: "描述",
            trigger: "blur",
          },
        ],
        key: [
          {
            required: true,
            message: "字段",
            trigger: "blur",
          },
        ],
        mark: [{ required: true, message: "替换的字符", trigger: "blur" }],
        mathType: [
          {
            required: true,
            message: "mathType",
            trigger: "blur",
          },
        ],
        tableClassify: [
          {
            required: true,
            message: "表类型",
            trigger: "change",
          },
        ],
        tableIndex: [
          {
            required: true,
            message: "表格下标",
            trigger: "blur",
          },
        ],
      },
      currentPage: 1,
      limit: 10,
      total: 0,
      tableList: [],
      itemId: "",
      tipList: [],
      parentid: "",
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
    this.getTipList();
  },
  methods: {
    // 点击字段提示
    getItem(item) {
      this.str = item.split(":");
      this.editForm.key = this.str[1];
      this.editForm.desc = this.str[0];
    },

    goback() {
      this.$router.go(-1);
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
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    // 修改
    async updateWordFun(params) {
      let res = await systemWordLogTempDetailUpdate(params);
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
        systemWordLogTempDetailUpdate(params)
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
      let res = await systemWordLogTempDetailAdd(params);
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
              parentId: this.parentid,
            };
            this.addWordFun(params);
          }
          if (this.dialogTitle === "编辑") {
            let params = {
              ...this.editForm,
              token: this.token,
              userid: this.userid,
              parentId: this.parentid,
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
      this.showModel = true;
      if (action == "add") {
        this.editForm = {
          dataSource: "",
          dataType: "",
          desc: "",
          key: "",
          mark: "",
          mathType: "",
          tableClassify: "",
          tableIndex: "",
        };
        this.dialogTitle = "新增";
      }
      if (action == "edit") {
        this.dialogTitle = "编辑";
        this.editForm.dataSource = item.dataSource;
        this.editForm.dataType = item.dataType;
        this.editForm.desc = item.tDesc;
        this.editForm.key = item.tKey;
        this.editForm.mark = item.mark;
        this.editForm.mathType = item.mathType;
        this.editForm.tableClassify = item.tableClassify;
        this.editForm.tableIndex = item.tableIndex;
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
        parentId: this.parentid,
        token: this.token,
        userid: this.userid,
        pageNum: this.currentPage,
        pageSize: this.limit,
      };
      try {
        let res = await systemWordLogTempDetailList(params);
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
.pointer {
  position: absolute;
  right: 30px;
  top: 60px;
  width: 50%;
  height: 500px;
  overflow: scroll;
}
.tips {
  display: inline-block;
  padding: 3px;
  margin: 5px;
  color: #409eff;
  background-color: #ecf5ff;
  border-color: #d9ecff;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>