<template>
  <div id="sysdictionariesList">
    <bread-crumb :options="options"></bread-crumb>
    <!--  <div class="handle">
      <el-button type="success" icon="el-icon-back" style="margin-right: 20px" @click="goBack">返回上一级</el-button>
    </div>-->

    <!-- 层级导航 -->
    <div class="brad-nav">
      <div class="left">
        当前层级：
        <span @click="goToFistFlow">第一级</span>
        <span class="word-right" v-if="bradList.length > 0">></span>
      </div>
      <div class="right">
        <span
          v-for="(item, index) in bradList"
          :key="index"
          @click="clickBradItem(item, index)"
          >{{ item.name }}</span
        >
      </div>
      <div class="right-button">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addNewDictionary"
          v-permission="{ action: 'admin:sysdictionaries:save' }"
          >添 加</el-button
        >
      </div>
    </div>
    <div class="main">
      <el-table
        :data="tabledata"
        border
        style="width: 100%; margin-top: 15px; margin-left: 15px"
        :header-cell-style="{
          'background-color': '#fafafa',
          color: '#90333',
        }"
      >
        <el-table-column
          prop="sort"
          label="排序列"
          align="center"
          min-width="15%"
        ></el-table-column>
        <!-- <el-table-column prop="parentid" label="父级ID" min-width="10%" align="center"></el-table-column> -->
        <el-table-column
          prop="name"
          label="名称"
          align="center"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          prop="level"
          label="层级"
          min-width="10%"
          align="center"
        ></el-table-column>
        <!-- <el-table-column prop="code" label="机构码" min-width="10%" align="center"></el-table-column> -->
        <el-table-column
          fixed="right"
          label="操作"
          min-width="25%"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="showAddChild(scope.row)"
              v-permission="{ action: 'admin:sysdictionaries:save' }"
              >添加子级</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="getNextDepth(scope.row)"
              v-permission="{ action: 'admin:sysdictionaries:tree' }"
              >下一级</el-button
            >
            <el-button
              icon="el-icon-edit"
              type="text"
              size="small"
              @click="midEdit(scope.row)"
              v-permission="{ action: 'admin:sysdictionaries:update' }"
              >编辑</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="delMid(scope.row)"
              class="red"
              v-permission="{ action: 'admin:sysdictionaries:delete' }"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :currentPage="currentPage"
        :total="total"
        :limit="limit"
        :small="false"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        :showPage="showPage"
      />
    </div>
    <!-- 编辑-新增-弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showModel"
      width="30%"
      center
    >
      <div class="mainBox">
        <span style="margin-right: 20px">字典名称:</span>
        <el-input
          v-model="roleName"
          placeholder="请输入字典名字:"
          width="200px"
          maxlength="50"
        ></el-input>
      </div>
      <div class="mainBox">
        <span style="margin-right: 40px">状态:</span>
        <el-select v-model="status" placeholder="请选择">
          <el-option label="有效" value="1"> </el-option>
          <el-option label="无效" value="0"> </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="addDictionary" size="mini" v-if="flag"
          >新 增</el-button
        >
        <el-button type="primary" @click="modifyRole" size="mini" v-else
          >修 改</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加子级 -->
    <el-dialog title="添加子级" :visible.sync="showChild" width="30%" center>
      <div class="mainBox">
        <span style="margin-right: 20px">字典名称:</span>
        <el-input
          v-model="child"
          placeholder="请输入字典名字:"
          width="200px"
          maxlength="50"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd" size="mini">取消添加</el-button>
        <el-button type="primary" @click="addChilds" size="mini"
          >添加子级</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDictionarieList,
  saveSysdictionaries,
  updateSysdictionaries,
  deleteSysdictionaries,
  dictionarieNothing,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "sysdictionariesList",
  data() {
    return {
      showPage: false,
      options: {
        secondNav: "系统配置",
        thirdNav: "字典管理",
      },
      token: this.$store.state.userInfo.token,
      userid: this.$store.state.userInfo.id,
      tabledata: [
        { id: 1003, parentid: "0", name: "测试001", level: 1, code: "02" },
      ],
      roleName: "", // 角色
      status: "", // 状态
      midEditShow: true,
      midDeleteShow: true,
      dialogTitle: "新增字典", // 默认新增角色
      showModel: false, // 新增 编辑 弹窗
      flag: true, // 默认 新增 编辑 false
      first: true, // 默认第一级 parentid === 0
      showChild: false,
      child: "",
      childRowInfo: "", // 添加子级时 当前行数据
      modifyRowInfo: "",
      parentid: null, // 保存上一级id
      parentIdArr: [], // 点击下一级，储存父ID的数组
      bradList: [],
      currentPage: 1,
      limit: 10,
      total: 0,
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    if (userInfo.isAdmin === 1) {
      this.parentid = "0";
    } else {
      if (
        userInfo.dicId.length > 0 &&
        userInfo.branchId.length > 0 &&
        userInfo.groupId.length > 0
      ) {
        // 组管理员
        this.parentid = userInfo.groupId;
      } else if (
        // 部门管理员
        userInfo.dicId.length > 0 &&
        userInfo.branchId.length > 0 &&
        userInfo.groupId.length === 0
      ) {
        this.parentid = userInfo.branchId;
      } else if (
        // 公司管理员
        userInfo.dicId.length > 0 &&
        userInfo.branchId.length === 0 &&
        userInfo.groupId.length === 0
      ) {
        this.parentid = userInfo.dicId;
      }
    }
    this.getDictionarieListFun(this.parentid);
    this.originalData = this.tabledata[0];
  },
  methods: {
    /**
     * 获取字典列表
     * params：parentid
     * create by YuSiwei
     * date:2020-6-9
     */
    async getDictionarieListFun(parentid) {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.limit,
        parentid: parentid ? parentid : "0",
        token: this.token,
        userId: this.userid,
      };
      try {
        // let res = await getDictionarieList(params);
        let res = await dictionarieNothing(params);
        if (res.data.status === "0") {
          this.tabledata = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.tabledata = [];
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 层级面包屑导航点击事件，跳转到对应的层级
     * params:{item,index}
     * create by YuSiwei
     * date:2020-6-5
     */
    clickBradItem(item, index) {
      // 如果点击的是最后一项，则不更改数据
      if (index === this.bradList.length - 1) {
        return false;
      }
      this.bradList = this.bradList.slice(0, index + 1);
      this.currentPage = 1;
      this.parentid = item.id;
      this.getDictionarieListFun(item.id);
    },
    /**
     * 点击第一级，回到最高级别，并清空层级面包屑导航
     * params:none
     * create by YuSiwei
     * date:2020-6-5
     */
    goToFistFlow() {
      // 没有下一级，直接不请求
      if (this.bradList.length === 0) {
        return false;
      }
      this.bradList = [];
      this.parentIdArr = [];
      this.currentPage = 1;
      let userInfo = this.$store.state.userInfo;
      if (userInfo.isAdmin === 1) {
        this.parentid = "0";
      } else {
        if (
          userInfo.dicId.length > 0 &&
          userInfo.branchId.length > 0 &&
          userInfo.groupId.length > 0
        ) {
          // 组管理员
          this.parentid = userInfo.groupId;
        } else if (
          // 部门管理员
          userInfo.dicId.length > 0 &&
          userInfo.branchId.length > 0 &&
          userInfo.groupId.length === 0
        ) {
          this.parentid = userInfo.branchId;
        } else if (
          // 公司管理员
          userInfo.dicId.length > 0 &&
          userInfo.branchId.length === 0 &&
          userInfo.groupId.length === 0
        ) {
          this.parentid = userInfo.dicId;
        }
      }
      this.getDictionarieListFun(this.parentid);
    },
    /**
     * 点击分页，重新刷新列表
     * params:val
     * create by YuSiwei
     * date:2020-6-9
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDictionarieListFun(this.parentid);
    },
    /**
     * 当前列表显示数量改变,重新请求第一页数据
     * params:val
     * create by YuSiwei
     * date:2020-6-9
     */
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getDictionarieListFun(this.parentid);
    },
    /**
     * 新增字典，打开模态弹窗，改变标题栏的文字
     * params:none
     * create by YuSiwei
     * date:2020-6-9
     */
    addNewDictionary() {
      this.dialogTitle = "新增字典";
      this.showModel = true;
    },
    /**
     * 添加子级提交按钮,必须输入子集名称
     * params:none
     * create by YuSiwei
     * 2020-6-9
     */
    async addChilds() {
      if (this.child.length === 0) {
        this.$message({ type: "error", message: "请输入字典名称!" });
      } else {
        let chidlParams = {
          name: this.child,
          parentid: this.childRowInfo.id,
          remarks: "",
          token: this.token,
          userid: this.userid,
        };
        try {
          let res = await saveSysdictionaries(chidlParams);
          if (res.data.status === "0") {
            this.$message({
              type: "success",
              message: "操作成功, 成功添加子级!",
            });
            this.showChild = false;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        } catch (error) {
          this.$message({ type: "error", message: "服务器响应失败..." });
        }
      }
    },

    /**
     * 编辑某条字典数据
     * params:row
     * create by YuSiwei
     * date:2020-6-9
     */
    midEdit(row) {
      this.dialogTitle = "修改字典";
      this.showModel = true;
      this.flag = false;
      this.roleName = row.name;
      this.status = row.status;
      this.modifyRowInfo = JSON.parse(JSON.stringify(row));
    },
    /**
     * 当前级添加子级
     * params:row
     * create by YuSiwei
     * date:2020-6-9
     */
    showAddChild(row) {
      this.childRowInfo = JSON.parse(JSON.stringify(row));
      this.child = "";
      this.showChild = true;
    },
    /**
     * 查看下一级,重置分页为第一页，储存当前点击数据的id
     * params{row}
     * create by YuSiwei
     * date:2020-6-9
     */
    async getNextDepth(row) {
      let params = {
        pageNum: 1,
        pageSize: this.limit,
        parentid: row.id,
        token: this.token,
        userId: this.userid,
      };
      try {
        let res = await getDictionarieList(params);
        if (res.data.status === "0") {
          if (res.data.data.list.length === 0) {
            this.$message({
              type: "warning",
              message: "当前字典不存在子级,请添加后查看!",
            });
          } else {
            this.currentPage = 1;
            this.parentid = row.id;
            this.parentIdArr.push(row.parentid);
            let obj = {};
            obj.name = row.name;
            obj.id = row.id;
            this.bradList.push(obj);
            // 去重，去除重复的一项
            this.parentIdArr = [...new Set(this.parentIdArr)];
            this.tabledata = res.data.data.list;
            this.total = res.data.data.total;
          }
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    /**
     * 删除某条字典数据
     * params{row}
     * create by YuSiwei
     * date:2020-6-9
     */
    delMid(row) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: row.id,
            token: this.token,
            userid: this.userid,
          };
          deleteSysdictionaries(params)
            .then((res) => {
              if (res.data.status === "0") {
                this.$message({ type: "success", message: "删除成功！" });
                this.getDictionarieListFun(this.parentid);
              } else {
                judgeErroCode(res.data.status, res.data.message);
              }
            })
            .catch((err) => {
              this.$message({ type: "error", message: "服务器响应失败!" });
              return;
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
     * 新增字典
     * params:none
     * create by YuSiwei
     * date:2020-6-9
     */
    async addDictionary() {
      if (this.roleName === "") {
        this.$message({ type: "error", message: "您有信息未填入!" });
        return;
      }
      let params = {
        name: this.roleName,
        parentid: this.parentid,
        token: this.token,
        userid: this.userid,
      };
      try {
        let res = await saveSysdictionaries(params);
        if (res.data.status === "0") {
          this.$message({ type: "success", message: "添加成功!" });
          this.getDictionarieListFun(this.parentid);
          this.showModel = false;
          this.flag = true;
          this.roleName = "";
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败!" });
      }
    },
    /**
     * 编辑字典数据提交按钮事件
     * params:none
     * create by YuSiwei
     * date:2020-6-9
     */
    async modifyRole() {
      let params = {
        id: this.modifyRowInfo.id,
        name: this.roleName,
        status: this.status,
        remarks: "",
        token: this.token,
        userid: this.userid,
      };

      try {
        let res = await updateSysdictionaries(params);
        if (res.data.status === "0") {
          this.$message({
            type: "success",
            message: "操作成功, 信息修改成功!",
          });
          this.getDictionarieListFun(this.parentid);
          this.showModel = false;
          this.roleName = "";
          this.status = "";
          this.flag = true;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败!" });
      }
    },
    /**
     * 关闭模态框，重置数据
     * params:none
     * create by YuSiwei
     * date:2020-6-9
     */
    cancel() {
      this.showModel = false;
      this.roleName = "";
      this.flag = true;
    },
    /**
     * 取消添加按钮，关闭模态框,重置数据
     * params:none
     * create by YuSiwei
     * date:2020-6-9
     */
    cancelAdd() {
      this.showChild = false;
      this.child = "";
    },
  },
};
</script>

<style scoped lang="less">
#sysdictionariesList {
  padding-bottom: 50px;
  .handle {
    width: 98%;
    margin: 30px auto;
  }
  .mainBox {
    width: 90%;
    margin: 0 auto;
    text-align: center;
    padding: 30px 0;
    /deep/ .el-input {
      width: 300px;
    }
  }
  /deep/ .el-dialog__headerbtn {
    display: none;
  }
  .red {
    color: #ff0000;
  }
}
.brad-nav {
  padding-left: 20px;
  line-height: 12px;
  font-size: 16px;
  color: #999;
  height: 40px;
  overflow: hidden;
  line-height: 40px;
  .left {
    float: left;
    span {
      color: #0672c4;
      cursor: pointer;
    }
    span.word-right {
      color: #999;
      padding: 0 10px;
    }
  }
  .right {
    float: left;
  }
  .right span {
    margin-right: 10px;
    color: #0672c4;
    cursor: pointer;
  }
  .right span::after {
    content: ">";
    padding-left: 10px;
    font-size: 14px;
    color: #999;
    text-decoration: none;
  }
  .right span:last-child {
    color: #999;
    cursor: auto;
  }
  .right span:last-child::after {
    content: "";
  }
  .right-button {
    float: right;
    margin-right: 10px;
  }
}
</style>