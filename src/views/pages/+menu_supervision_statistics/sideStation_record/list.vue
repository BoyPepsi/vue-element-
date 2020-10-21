<template>
  <div class="bigbox">
    <div class="search">
      <span style="margin:0 10px">检查项目：</span>

      <el-input style="width:200px" v-model="search.word" placeholder="请输入内容"></el-input>

      <span style="margin:0 10px">施工阶段：</span>

      <el-select v-model="search.stageCode" style="width:120px;">
        <el-option
          v-for="item in stageCodeList"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        ></el-option>
      </el-select>

      <span style="margin:0 10px">时间选择：</span>

      <el-date-picker
        v-model="search.startTime"
        value-format="timestamp"
        type="datetime"
        :editable="false"
        :picker-options="pickerStartDate"
        placeholder="选择开始日期"
        class="start-time"
      ></el-date-picker>至
      <el-date-picker
        v-model="search.endTime"
        value-format="timestamp"
        type="datetime"
        :editable="false"
        :picker-options="pickerEndDate"
        placeholder="选择结束日期"
        class="start-time"
      ></el-date-picker>

      <el-button style="margin-left:50px" @click="getTableList">查询</el-button>
      <el-button
        v-permission="{action: 'sideLog:create' }"
        style="margin-left:50px"
        type="primary"
        @click="goToAdd"
      >生成旁站记录</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="codeName" label="检查项目"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="stageName" label="旁站类型"></el-table-column>
        <el-table-column prop="buildNum" label="楼栋号"></el-table-column>
        <el-table-column label="生成时间">
          <template slot-scope="scope">{{ scope.row.createTime | transformDate2 }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-permission="{action: 'sideLog:detail' }"
              type="text"
              size="small"
              @click="goToDetail(scope.row)"
            >详情</el-button>
            <el-button
              v-permission="{action: 'sideLog:update' }"
              type="text"
              size="small"
              @click="goToUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-permission="{action: 'sideLog:down' }"
              type="text"
              size="small"
              @click="goToDownload(scope.row)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      :currentPage="search.currentPage"
      :total="search.total"
      :limit="search.limit"
      :small="true"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { sideLogList, managerlogCombox, sideLogCreate } from "@/http/api.js";
import axios from "axios";
export default {
  data() {
    return {
      token: "",
      userid: "",
      projectName: "",
      projectId: "",

      search: {
        startTime: "",
        endTime: "",
        stageCode: "",
        word: "",

        currentPage: 1,
        total: 10,
        limit: 10,
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

      tableData: [],

      stageCodeList: [],
    };
  },
  watch: {
    "search.startTime"(value) {
      if (value == null) {
        this.search.startTime = "";
      }
    },
    "search.endTime"(value) {
      if (value == null) {
        this.search.endTime = "";
      }
    },
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;

    this.getTableList();
    this.getSelectList();
  },
  methods: {
    /**
     * 获取列表数据
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    async getTableList() {
      let param = {
        token: this.token,
        userid: this.userid,
        pageNum: this.search.currentPage,
        pageSize: this.search.limit,

        startTime: this.search.startTime,
        endTime: this.search.endTime,

        stageCode: this.search.stageCode,
        word: this.search.word,
      };

      let res = await sideLogList(param);

      this.tableData = res.data.data.list;
      this.search.total = res.data.data.total;
    },

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
          this.stageCodeList = res.data.data.stageList;
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this.stageCodeList = [];
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    /**
     * 新增跳转
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    async goToAdd() {
      let param = { token: this.token, userid: this.userid };

      let res = await sideLogCreate();

      if (res.data.status == 0) {
        this.$message({ type: "success", message: res.data.message });
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
      this.getTableList();
    },

    /**
     * 新增跳转
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    goToDetail(item) {
      let query = {
        id: item.id,
      };
      this.$router.push({
        path: "/sideStationSecord/detail",
        query,
      });
    },

    /**
     * 新增跳转
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    goToUpdate(item) {
      let query = {
        id: item.id,
        update: 1,
      };

      this.$router.push({
        path: "/sideStationSecord/detail",
        query,
      });
    },

    /**
     * 下载
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    async goToDownload(item) {
      let param = {
        token: this.token,
        userid: this.userid,
        id: item.id,
      };

      let res = await axios({
        method: "POST",
        url: axios.defaults.baseURL + "/sideLog/down",
        responseType: "blob",
        data: param,
      });

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
     * 分页点击事件,分页点击的时候，初始化搜索选项
     * params:val
     * create by YuXiong
     * date:2020-6-28
     */
    handleCurrentChange(val) {
      this.search.currentPage = val;
      this.getTableList();
    },
    /**
     * 分页每条数目改变，则回到第一页数据，列表重新加载
     * params:val
     * create by YuXiong
     * date:2020-6-28
     */
    handleSizeChange(val) {
      this.search.limit = val;
      this.search.currentPage = 1;
      this.getTableList();
    },
  },
};
</script>

<style lang="less" scoped>
.bigbox {
  padding: 40px;
  padding-bottom: 0px;
}

.table {
  margin-top: 20px;
}
</style>