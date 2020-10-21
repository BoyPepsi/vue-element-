<template>
  <div id="quality-inspect">
    <el-form :inline="true" :model="check" class="check-form" :rules="checkRule" ref="check">
      <!--  <el-row :gutter="40">
        <el-col :span="6">
          <el-form-item label="工程阶段">地下室工程</el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="子阶段" prop="secondChild">
            <el-select v-model="check.secondChild" @change="childChange">
              <el-option
                v-for="item in secondChildList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="检查分项" prop="checkBranchCode">
            <el-select v-model="check.checkBranchCode">
              <el-option
                v-for="item in checkBranchCodeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <el-button @click="addCheck" v-permission="{action: 'qualityCheck:save' }">开始检查</el-button>
          </el-form-item>
        </el-col>
      </el-row>-->
    </el-form>

    <div class="search">
      <el-form :inline="true" :model="search">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input
                maxlength="20"
                v-model="search.word"
                clearable
                class="key-word"
                style="width:100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button @click="searchTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- ============================================  表格内容======================================== -->
    <div class="table">
      <el-table
        :data="tableList"
        border
        style="width: 100%"
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
      >
        <el-table-column label="项目名称" prop="projectName" align="center"></el-table-column>
        <el-table-column label="标段" prop="bidName" align="center"></el-table-column>
        <el-table-column label="地下室区块" prop="bidBasementName" align="center"></el-table-column>
        <el-table-column label="层数" prop="floorNum" align="center" width="50"></el-table-column>
        <el-table-column label="检查类型" prop="parentCodeName" align="center"></el-table-column>
        <el-table-column label="检查状态" prop="checkStatus" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.checkStatus_str | checkStaus}}</span>

            <!-- <span v-if="scope.row.checkMark !==''">{{scope.row.checkStatus == "1" ? "已验收" : scope.row.checkStatus == '0'   ? "不合格" : '' }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="检查人员" prop="createor" align="center" width="80"></el-table-column>
        <el-table-column label="检查时间" prop="createTime" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | transformDate2}}</span>
          </template>
        </el-table-column>
        <el-table-column label="复核人" prop="checktor" align="center" width="80"></el-table-column>
        <el-table-column label="复核意见" prop="checkMark" align="center"></el-table-column>
        <el-table-column label="操作" prop="name" align="center" width="280" v-if="false">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-position"
              @click="goToDetail(scope.row)"
              v-permission="{action: 'qualityCheck:detail' }"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit-outline"
              @click="continueCheck(scope.row)"
              v-permission="{action: 'qualityCheck:querycheck' }"
              v-if="(scope.row.checkMark.length == 0) && (scope.row.isMany == '1') && (scope.row.isEnd == '0' ||  scope.row.isEnd =='')"
            >继续检查</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="review(scope.row)"
              v-permission="{action: 'qualityCheck:check' }"
              v-if="scope.row.checkMark.length == 0"
            >复核</el-button>

            <el-button
              size="mini"
              type="text"
              class="gray"
              v-if="scope.row.checkMark.length > 0"
              v-permission="{action: 'qualityCheck:check' }"
            >已复核</el-button>
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-delete"
              @click="deleteItem(scope.row)"
              v-permission="{action: 'qualityCheck:delete' }"
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
  </div>
</template>

<script>
import {
  getDictionarieList,
  qualityCheckList,
  qualityInspectUpdate,
  qualityInspectSave,
  qualityInspectPSave,
  qualityInspectDelete,
  qualityInspectSaveDetail,
  qualityInspectUpdateDetail,
  qualityInspectSaveCache,
  qualityCheckrebarAdd,
  qualityCheckDelete,
  baseList,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import { getDate2 } from "@/utils/transformDate.js";
export default {
  name: "qualityInspect",
  data() {
    return {
      token: "",
      userid: "",
      checkBranchCodeList: [],
      secondChildList: [],
      projectId: "",
      check: {
        secondChild: "", // 土方
        checkBranchCode: "", // 检查分项
      },
      checkRule: {
        secondChild: [
          { required: true, message: "请选择子阶段", trigger: "change" },
        ],
        checkBranchCode: [
          { required: true, message: "请选择检查分项", trigger: "change" },
        ],
      },
      search: {
        word: "",
      },
      checkList: [
        {
          name: "施工人数",
          id: "1",
        },
        {
          name: "检查分项",
          id: "2",
        },
      ],
      currentPage: 1,
      limit: 10,
      total: 0,
      tableList: [],
      showPeopleTable: false,
    };
  },
  filters: {
    getDate2,
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.projectId = userInfo.currProjectId;
    this.getSelectList("04010201", "secondChildList");
    this.getTableList();
  },
  methods: {
    /**
     * 获取下拉数据
     * params：code
     * create by YuXiong
     * date:2020-6-28
     */
    async getSelectList(code, list) {
      this[list] = [];
      let params = {
        pcode: code,
        token: this.token,
        userId: this.userid,
        pageNum: 1,
        pageSize: 10000,
      };
      try {
        let res = await getDictionarieList(params);

        if (res.data.status === "0") {
          this[list] = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this[list] = [];
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    /**
     * 获取表格数据
     * params：code
     * create by YuXiong
     * date:2020-6-28
     */
    async getTableList() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.limit,
        word: this.search.word,
      };

      try {
        let res = await qualityCheckList(params);
        if (res.data.status === "0") {
          this.tableList = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this.tableList = [];
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
      this.getTableList();
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
     * 子阶段change事件
     * params:val
     * create by YuXiong
     * date:2020-7-3
     */
    childChange(code) {
      this.check.checkBranchCode = "";
      this.getSelectList(code, "checkBranchCodeList");
    },

    /**
     * 保存或者清除缓存数据
     * params:none
     * create by YuXiong
     * date:2020-7-2
     */
    async clearLocal(code) {
      let params = {
        code: code,
        content: "",
        token: this.token,
        userid: this.userid,
        isDelete: 1,
      };
      let res = await qualityInspectSaveCache(params);
      if (res.data.status === "0") {
      }
    },
    /**
     * 点击开始检查
     * params：none
     * create by YuXiong
     * date:2020-6-28
     */
    addCheck() {
      if (this.projectId.length === 0) {
        this.$message({ type: "error", message: "请先选择项目" });
        return false;
      }
      this.$refs.check.validate((valid) => {
        if (valid === true) {
          let url = this.checkBranchCodeList.find(
            (item) => item.code === this.check.checkBranchCode
          ).remarks;
          let code = this.check.checkBranchCode;
          if (url.length > 0) {
            this.clearLocal(this.check.checkBranchCode);
            this.clearLocal(this.check.secondChild);
            this.$router.push({
              path: "/" + url,
              query: {
                code: code,
              },
            });
          } else {
            this.$message({ type: "error", message: "模块功能暂缓" });
          }
        }
      });
    },
    /**
     * 点击查询
     * params：none
     * create by YuXiong
     * date:2020-6-29
     */
    searchTable() {
      this.currentPage = 1;
      this.getTableList();
    },

    /**
     * 跳转到详细页，要带上code和id
     * params:item
     * create by YuXiong
     * date:2020-7-7
     */
    async goToDetail(item) {
      await this.clearLocal(item.parentCode);
      let query = {};
      if (item.baseIds.tableId.length > 0) {
        query.mainId = item.baseIds.mainId;
        query.tableId = item.baseIds.tableId;
      } else {
        query.id = item.id;
      }
      query.code = item.parentCode;
      query.isDetail = 1;
      if (item.detailUrl.length > 0) {
        this.$router.push({
          path: "/" + item.detailUrl,
          query: query,
        });
      } else {
        this.$message({ type: "error", message: "数据详细页url未配置" });
      }
    },
    /**
     * 继续检查，要带上code和id
     * params:item
     * create by YuXiong
     * date:2020-7-7
     */
    async continueCheck(item) {
      await this.clearLocal(item.parentCode);
      let query = {};
      if (item.baseIds.tableId.length > 0) {
        query.mainId = item.baseIds.mainId;
        query.tableId = item.baseIds.tableId;
      } else {
        query.id = item.id;
      }
      query.code = item.parentCode;
      if (item.continueUrl.length > 0) {
        this.$router.push({
          path: "/" + item.continueUrl,
          query: query,
        });
      } else {
        this.$message({ type: "error", message: "数据继续检查url未配置" });
      }
    },

    /**
     * 复核
     * params：item
     * create by YuXiong
     * date:2020-7-7
     */
    review(item) {
      let query = {};
      if (item.baseIds.tableId.length > 0) {
        query.mainId = item.baseIds.mainId;
        query.tableId = item.baseIds.tableId;
      } else {
        query.id = item.id;
      }
      query.code = item.parentCode;
      query.review = 1;
      if (item.detailUrl.length > 0) {
        this.$router.push({
          path: "/" + item.detailUrl,
          query: query,
        });
      } else {
        this.$message({ type: "error", message: "数据详细页url未配置" });
      }
    },
    /**
     * 删除表格某条数据
     * params：item
     * create by YuXiong
     * date:2020-6-29
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
            isDeleted: "1",
          };
          qualityCheckDelete(params).then((res) => {
            if (res.data.status === "0") {
              this.$message({ type: "success", message: "删除成功!" });
              this.currentPage = 1;
              this.getTableList();
            } else {
              this.$message({ type: "error", message: res.data.message });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped lang='less'>
.check-form {
  width: calc(100% - 80px);
  margin: 40px auto;
  border-bottom: 1px solid #eee;
}
.start-time {
  width: 135px;
  margin: 0 10px;
  font-size: 12px;
}
.search {
  overflow: hidden;
  margin-left: 40px;
}
.table {
  width: calc(100% - 80px);
  margin: 20px auto;
}
.red {
  color: #f00;
}
.key-word {
  width: 140px;
  font-size: 12px;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/deep/ input[type="number"] {
  -moz-appearance: textfield;
}
.btns {
  text-align: center;
  margin-top: 40px;
  width: 80%;
}
.gray {
  color: #999;
  font-size: 12px;
}
</style>