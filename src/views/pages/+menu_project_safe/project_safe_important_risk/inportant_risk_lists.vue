<template>
  <div id="quality-inspect">
    <el-form :inline="true" :model="check" class="check-form" :rules="checkRule" ref="check">
      <el-row :gutter="40">
        <el-col :span="8">
          <el-form-item label="检查表单" prop="formCode">
            <el-select v-model="check.formCode" @change="formCodeChange">
              <el-option
                v-for="item in formList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="检查表单项目" prop="projectCode">
            <el-select v-model="check.projectCode">
              <el-option
                v-for="item in projectCodeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <el-button @click="addCheck" v-permission="{action: 'qualityCheck:riskcheck_add' }">开始检查</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="search">
      <el-form :inline="true" :model="search">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="选择时间">
              <el-date-picker
                v-model="search.startTime"
                type="datetime"
                :editable="false"
                :picker-options="pickerStartDate"
                placeholder="选择开始日期"
                class="start-time"
              ></el-date-picker>至
              <el-date-picker
                v-model="search.endTime"
                type="datetime"
                :editable="false"
                :picker-options="pickerEndDate"
                placeholder="选择结束日期"
                class="start-time"
              ></el-date-picker>
            </el-form-item>
          </el-col>
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
        <el-table-column label="检查类型" prop="parentCodeName" align="center"></el-table-column>
        <el-table-column label="检查分项" prop="codeName" align="center" width="80"></el-table-column>
        <el-table-column label="检查人员" prop="createor" align="center" width="80"></el-table-column>
        <el-table-column label="检查时间" prop="createTime" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | transformDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="复核人" prop="checktor" align="center" width="80"></el-table-column>
        <el-table-column label="检查状态" prop="checkStatusStr" align="center" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.checkStatusStr | checkStaus}}</span>
            <!-- <span v-if="scope.row.checkMark !==''">{{scope.row.checkStatus == "1" ? "已验收" : scope.row.checkStatus == '0'   ? "不合格" : '' }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="复核意见" prop="checkMark" align="center"></el-table-column>
        <el-table-column label="操作" prop="name" align="center" width="280">
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
              icon="el-icon-edit"
              @click="review(scope.row)"
              v-permission="{action: 'qualityCheck:riskcheck_update' }"
              v-if="scope.row.checkMark.length == 0"
            >复核</el-button>
            <el-button
              size="mini"
              type="text"
              class="gray"
              v-if="scope.row.checkMark.length > 0"
            >已复核</el-button>
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-delete"
              @click="deleteItem(scope.row)"
              v-permission="{action: 'qualityCheck:riskcheck_delete' }"
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
  qualityInspectSaveCache,
  maintableList,
  maintableDelete,
  childCheckCombox
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "qualityInspect",
  data() {
    return {
      token: "",
      userid: "",
      projectList: [],
      checkBranchCodeList: [],
      secondChildList: [],
      projectId: "",
      check: {
        formCode: "",
        projectCode: "",
      },
      formList: [],
      projectCodeList: [],
      checkRule: {
        formCode: [
          { required: true, message: "请选择表单", trigger: "change" },
        ],
        projectCode: [
          { required: true, message: "请选择表单项目", trigger: "change" },
        ],
      },
      search: {
        word: "",
        startTime: "",
        endTime: "",
      },
      pickerStartDate: {
        disabledDate: (time) => {
          if (this.search.endTime) {
            return time.getTime() > this.search.endTime;
          }
        },
      },
      pickerEndDate: {
        disabledDate: (time) => {
          return time.getTime() < this.search.startTime;
        },
      },
      currentPage: 1,
      limit: 10,
      total: 0,
      tableList: [],
      showPeopleTable: false,
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.projectId = userInfo.currProjectId;
    this.getSelectList("040202", "formList");
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
        parentCode: code,
        token: this.token,
        userId: this.userid,
        pageNum: 1,
        pageSize: 10000,
      };
      try {
        let res = await childCheckCombox(params);
        if (res.data.status === "0") {
          // this[list] = res.data.data.list;
           this[list] = res.data.data;
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
        token: this.token,
        userid: this.userid,
        pageNum: this.currentPage,
        pageSize: this.limit,
        startTime: new Date(this.search.startTime).getTime(),
        endTime: new Date(this.search.endTime).getTime(),
        word: this.search.word,
        code: "040202",
      };

      if (this.search.startTime == "") {
        params.startTime = "";
      }
      if (this.search.endTime == "") {
        params.endTime = "";
      }

      try {
        let res = await maintableList(params);
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

    formCodeChange(code) {
      this.check.projectCode = "";
      this.getSelectList(code, "projectCodeList");
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
          let url = this.projectCodeList.find(
            (item) => item.code === this.check.projectCode
          ).remarks;
          if (url.length > 0) {
            this.clearLocal(this.check.projectCode);
            this.$router.push({
              path: "/" + url,
              query: {
                code: this.check.projectCode, // 检查项目
                action: "add",
              },
            });
          } else {
            this.$message({ type: "error", message: "模块功能暂缓" });
          }
        } else {
          this.$message({ type: "error", message: "请填写表单所有的项" });
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
      if (item.urlPO.detailUrl.length > 0) {
        this.$router.push({
          path: "/" + item.urlPO.detailUrl,
          query: {
            id: item.tableId,
            code: item.tCode, // 检查分项
            action: "detail",
          },
        });
      } else {
        this.$message({ type: "error", message: "数据详细页url未配置" });
      }
    },

    /**
     * 复核
     * params：item
     * create by YuXiong
     * date:2020-7-7
     */
    review(item) {
      if (item.urlPO.detailUrl.length > 0) {
        this.$router.push({
          path: "/" + item.urlPO.detailUrl,
          query: {
            id: item.tableId,
            code: item.tCode, // 检查分项
            action: "review",
          },
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
            tableId: item.tableId,
            token: this.token,
            userid: this.userid,
          };
          maintableDelete(params).then((res) => {
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