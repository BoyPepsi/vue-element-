<template>
  <div id="quality-inspect">
    <el-form :inline="true" :model="search" class="check-form" :rules="searchRule" ref="search">
      <el-row :gutter="40">
        <el-col :span="3" class="add-log">
          <el-form-item>
            <el-button
              type="primary"
              @click="creatLog"
              v-permission="{action: 'managerlog:create' }"
            >生成监理日志</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="检查项目" prop="typeCode">
            <el-select v-model="search.typeCode" style="width:120px;">
              <el-option
                v-for="item in typeCodeList"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="施工阶段" prop="stageCode">
            <el-select v-model="search.stageCode" style="width:120px;">
              <el-option
                v-for="item in stageCodeList"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="生成时间" prop="projectCode">
            <el-date-picker
              v-model="search.startTime"
              type="date"
              :editable="false"
              placeholder="选择开始日期"
              class="start-time"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-button @click="searchTable">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
        <el-table-column prop="checkName" label="检查项目" align="center"></el-table-column>
        <el-table-column prop="stageName" label="施工阶段" align="center"></el-table-column>
        <el-table-column label="楼栋号" prop="buildNum" align="center" width="80"></el-table-column>
        <el-table-column label="生成时间" prop="createTime" align="center" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | transformDate2}}</span>
          </template>
        </el-table-column>
        <el-table-column label="批阅状态" prop="checkStatus" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.checkStatus == 0? '未批阅':'已批阅'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="批阅时间" prop="checkTime" align="center" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.checkTime | transformDate2}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="goToDetail(scope.row)"
              type="text"
              size="small"
              v-permission="{action: 'managerlog:detail' }"
            >详情</el-button>
            <el-button
              @click="goToUpdate(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.checkStatus != 1"
              v-permission="{action: 'managerlog:update' }"
            >修改</el-button>
            <el-button
              @click="downFile(scope.row)"
              type="text"
              size="small"
              v-permission="{action: 'managerlog:down' }"
            >下载</el-button>
            <el-button
              @click="deleteInfo(scope.row)"
              v-permission="{action: 'managerlog:delete' }"
              type="text"
              size="small"
              class="red"
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
  qualityInspectDeletequeuecache,
  securityCheckList,
  securityCheckUpdate,
  managerlogCombox,
  managerlogList,
  managerlogDelete,
  managerlogCreate,
  managerlogDown,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import axios from "axios";
export default {
  name: "qualityInspect",
  data() {
    return {
      projectId: "",
      searchRule: {
        typeCode: [
          { required: false, message: "请选择检查项目", trigger: "change" },
        ],
        stageCode: [
          { required: false, message: "请选择施工阶段", trigger: "change" },
        ],
        startTime: [
          { required: false, message: "请选择生成时间", trigger: "change" },
        ],
      },
      search: {
        typeCode: "",
        stageCode: "",
        startTime: "",
      },
      typeCodeList: [],
      stageCodeList: [],
      currentPage: 1,
      limit: 10,
      total: 0,
      tableList: [],
      showPeopleTable: false,
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.projectId = userInfo.currProjectId;
    this.getSelectList();
    this.getTableList();
  },
  methods: {
    /**
     * 获取下拉数据
     * params：code
     * create by YuXiong
     * date:2020-6-28
     */
    async getSelectList() {
      let params = {};
      try {
        let res = await managerlogCombox(params);
        if (res.data.status === "0") {
          this.typeCodeList = res.data.data.checkList;
          this.stageCodeList = res.data.data.stageList;
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this.typeCodeList = [];
          this.stageCodeList = [];
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
        typeCode: this.search.typeCode,
        stageCode: this.search.stageCode,
        startTime: new Date(this.search.startTime).getTime(),
      };

      let res = await managerlogList(params);
      if (res.data.status === "0") {
        this.tableList = res.data.data.list;
        this.total = res.data.data.total;
      } else {
        judgeErroCode(res.data.status, res.data.message);
        this.tableList = [];
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
     * 生成监理日志
     * params：none
     * create by YuXiong
     * date:2020-6-29
     */
    async creatLog() {
      let params = {};
      let res = await managerlogCreate(params);
      if (res.data.status === "0") {
        this.$message({ type: "success", message: res.data.message });
        this.getTableList();
      } else {
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    /**
     * 跳转到详细页，要带上code和id
     * params:item
     * create by YuXiong
     * date:2020-7-7
     */
    async goToDetail(item) {
      this.$router.push({
        path: "/managerlog/detail",
        query: {
          id: item.id,
        },
      });
    },
    /**
     * 跳转到修改页，要带上code和id
     * params:item
     * create by YuXiong
     * date:2020-7-7
     */
    goToUpdate(item) {
      this.$router.push({
        path: "/managerlog/update",
        query: {
          id: item.id,
        },
      });
    },
    /**
     * 文件下载
     * params:item
     * create by YuXiong
     * date:2020-7-7
     */
    async downFile(item) {
      let userInfo = this.$store.state.userInfo;
      let params = {
        id: item.id,
        userid: userInfo.id,
        token: userInfo.token,
      };
      let res = await axios({
        method: "POST",
        url: axios.defaults.baseURL + "/managerlog/down",
        responseType: "blob",
        data: params,
      });
      // const fileName = res.headers["Content-Disposition"].split("=")[1];
      let blob = new Blob([res.data], { type: `application/pdf` });
      let a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = item.id + "-" + item.checkName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blob);
    },

    /**
     * 删除表格某条数据
     * params：item
     * create by YuXiong
     * date:2020-6-29
     */
    deleteInfo(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: item.id,
          };
          managerlogDelete(params).then((res) => {
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
.red {
  color: #f00;
}
.add-log {
  border-right: 1px solid #ccc;
  height: 40px;
}
</style>