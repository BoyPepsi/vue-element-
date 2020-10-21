<template>
  <div class="bigbox">
    <div class="search">
      事由：
      <el-select clearable v-model="search.questionType" placeholder="请选择">
        <el-option
          v-for="item in commonData.questionTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span style="margin-left:10px">时间选择：</span>
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
        v-permission="{action: 'supervisionNotice:save' }"
        style="margin-left:50px"
        type="primary"
        @click="goToAdd"
      >生成监理通知单</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column label="事由">
          <template slot-scope="scope">{{ scope.row.questionType | questionType }}问题</template>
        </el-table-column>
        <el-table-column prop="creatorName" label="提交人"></el-table-column>
        <el-table-column label="提交时间">
          <template slot-scope="scope">{{ scope.row.creationTime | transformDate2 }}</template>
        </el-table-column>
        <el-table-column prop="name" label="审核状态">
          <template slot-scope="scope">{{ scope.row.state | supervisionNoticeState }}</template>
        </el-table-column>
        <el-table-column label="审核时间">
          <template slot-scope="scope">{{ scope.row.reviewTime | transformDate2 }}</template>
        </el-table-column>
        <el-table-column prop="reviewName" label="审核人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-permission="{action: 'supervisionNotice:detail' }"
              type="text"
              size="small"
              @click="goToDetail(scope.row)"
            >详情</el-button>
            <el-button
              v-permission="{action: 'supervisionNotice:review' }"
              v-if="scope.row.state == 1"
              type="text"
              size="small"
              @click="goToReview(scope.row)"
            >复核</el-button>
            <el-button
              v-permission="{action: 'supervisionNotice:update' }"
              v-if="scope.row.state == 4"
              type="text"
              size="small"
              @click="goToUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-permission="{action: 'supervisionNotice:download' }"
              v-if="scope.row.state == 2"
              type="text"
              size="small"
              @click="download(scope.row)"
            >下载</el-button>
            <el-button
              v-permission="{action: 'supervisionNotice:delete' }"
              style="color:red"
              type="text"
              size="small"
              @click="remove(scope.row)"
            >删除</el-button>
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
import {
  projectQuestionInformList,
  projectQuestionInformDelete,
} from "@/http/api.js";
import axios from "axios";
export default {
  data() {
    return {
      token: "",
      userid: "",
      projectName: "",
      projectId: "",

      search: {
        time: "",
        currentPage: 1,
        total: 10,
        limit: 10,

        questionType: "",
        startTime: "",
        endTime: "",
      },

      tableData: [],

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
        fromType: "4",
        token: this.token,
        userid: this.userid,
        projectName: this.projectName,
        projectId: this.projectId,
        pageNum: this.search.currentPage,
        pageSize: this.search.limit,

        questionType: this.search.questionType,
        startTime: this.search.startTime.toString(),
        endTime: this.search.endTime.toString(),
      };

      let res = await projectQuestionInformList(param);
      console.log(res.data);

      this.tableData = res.data.data.list;
      this.search.total = res.data.data.total;
    },

    /**
     * 详情跳转
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    goToDetail(item) {
      let query = {
        id: item.id,
        state: item.state,
      };

      this.$router.push({
        path: "/supervisionNotice/detail",
        query,
      });
    },

    /**
     * 复核跳转
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    goToReview(item) {
      let query = { id: item.id, isReview: true };

      this.$router.push({
        path: "/supervisionNotice/detail",
        query,
      });
    },

    /**
     * 修改跳转
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    goToUpdate(item) {
      let query = { id: item.id };

      this.$router.push({
        path: "/supervisionNotice/add",
        query,
      });
    },

    /**
     * 下载文件
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    async download(item) {
      let param = { token: this.token, userid: this.userid, id: item.id };

      let res = await axios({
        method: "POST",
        url: axios.defaults.baseURL + "/projectQuestionInform/download",
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
     * 删除数据
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    remove(item) {
      let param = { token: this.token, userid: this.userid, id: item.id };

      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        projectQuestionInformDelete(param).then((res) => {
          if (res.data.status == 0) {
            this.getTableList();
            this.$message({ type: "success", message: res.data.message });
          }
        });
      });
    },

    /**
     * 新增跳转
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    goToAdd() {
      this.$router.push({
        path: "/supervisionNotice/add",
      });
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

.start-time {
  margin: 0 10px;
  font-size: 12px;
}

.table {
  margin-top: 20px;
}
</style>