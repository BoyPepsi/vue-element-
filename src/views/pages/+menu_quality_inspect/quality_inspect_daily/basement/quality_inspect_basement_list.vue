<template>
  <div id="quality-inspect">
    <el-form :inline="true" :model="check" class="check-form" :rules="checkRule" ref="check">
      <!-- <el-row :gutter="40">
        <el-col :span="8">
          <el-form-item label="工程阶段" prop="projectCode">
            <el-select :disabled="true" v-model="check.projectCode" @change="getCode($event)">
              <el-option
                
                v-for="item in projectList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
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

        <el-col :span="8">
          <el-form-item>
            <el-button v-permission="{action: 'qualityInspect:save' }" @click="addCheck">开始检查</el-button>
          </el-form-item>
        </el-col>
      </el-row>-->
    </el-form>

    <div class="search">
      <el-form :inline="true" :model="search">
        <el-row :gutter="20">
          <!-- <el-col :span="5">
            <el-form-item label="检查分项">
              <el-select v-model="search.checkType" style="width:120px;font-size:12px">
                <el-option
                  v-for="item in checkList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->

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
              <el-input maxlength="20" v-model="search.word" clearable class="key-word"></el-input>
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
        <el-table-column label="检查分项" prop="codeName" align="center"></el-table-column>
        <!-- <el-table-column label="人员种类" prop="peopleTypeName" align="center" v-if="showPeopleTable"></el-table-column>
        <el-table-column label="人员数量" prop="people" align="center" v-if="showPeopleTable"></el-table-column>-->

        <el-table-column label="检查人员" prop="createor" align="center"></el-table-column>
        <el-table-column label="检查时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | transformDate2}}</span>
          </template>
        </el-table-column>
        <el-table-column label="复核人" prop="checker" align="center"></el-table-column>
        <el-table-column label="检查状态" prop="checkStatus" align="center" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.checkStatus | checkStaus}}</span>
            <!-- <span v-if="scope.row.checkMark !==''">{{scope.row.checkStatus == "1" ? "已验收" : scope.row.checkStatus == '0'   ? "不合格" : '' }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="复核理由" prop="checkMark" align="center"></el-table-column>
        <el-table-column label="操作" prop="name" align="center" v-if="false">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="blue"
              icon="el-icon-document"
              @click="showDetail(scope.row)"
              v-permission="{action: 'qualityInspect:detail' }"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              class="blue"
              icon="el-icon-edit"
              @click="updateItem(scope.row)"
              v-permission="{action: 'qualityInspect:update' }"
              v-if="scope.row.checkMark == ''"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              class="blue"
              icon="el-icon-edit"
              @click="reviewItem(scope.row)"
              v-permission="{action: 'qualityInspect:review' }"
              v-if="scope.row.checkMark.length == 0 || scope.row.checkMark == ''"
            >复核</el-button>
            <el-button
              size="mini"
              type="text"
              style="color:#999;"
              v-if="scope.row.checkMark.length > 0 "
              v-permission="{action: 'qualityInspect:review' }"
            >已复核</el-button>
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-delete"
              @click="deleteItem(scope.row)"
              v-permission="{action: 'qualityInspect:delete' }"
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
    <el-dialog title="图片预览" :visible.sync="showModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getDictionarieList,
  qualityInspectList,
  qualityInspectUpdate,
  qualityInspectSave,
  qualityInspectPSave,
  qualityInspectDelete,
  qualityInspectSaveDetail,
  qualityInspectUpdateDetail,
  qualityInspectSaveCache,
  baseList,
  qualityInspectDeletequeuecache, //删除缓存
  maintableDeletequeuecache,
  maintableList,
  maintableDelete,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import { getDate } from "@/utils/transformDate.js";
import { getDate2 } from "@/utils/transformDate2.js";
export default {
  name: "qualityInspect",
  data() {
    return {
      token: "",
      userid: "",
      projectId: "",
      projectList: [],
      checkBranchCodeList: [],
      check: {
        projectCode: "04010101",
        checkBranchCode: "", // 检查分项
      },
      checkRule: {
        projectCode: [
          { required: true, message: "请选择工程", trigger: "change" },
        ],
        checkBranchCode: [
          { required: true, message: "请选择检查分项", trigger: "change" },
        ],
      },
      search: {
        checkType: "2", // 检查分项
        startTime: "",
        endTime: "",
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
      showModel: false,
      currentImg: "",
    };
  },
  filters: {
    getDate2,
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.projectId = userInfo.currProjectId;
    this.token = userInfo.token;
    this.getSelectList("040101", "projectList");
    this.getSelectList(this.check.projectCode, "checkBranchCodeList");
    this.getTableList();
  },
  methods: {
    getCode(e) {
      this.check.checkBranchCode = "";
      this.getSelectList(e, "checkBranchCodeList");
    },

    // 查看详情
    showDetail(row) {
      this.deleteCache();
      //将本地存储的表单数据清空
      localStorage.removeItem("SAVFORMDATA");
      this.$router.push({
        path: "/" + row.urlPO.detailUrl,
        query: {
          id: row.tableId,
          code: row.tCode, // 检查分项
          action: "detail",
        },
      });
    },

    reviewItem(row) {
      this.deleteCache();
      //将本地存储的表单数据清空
      localStorage.removeItem("SAVFORMDATA");
      this.$router.push({
        path: "/" + row.urlPO.detailUrl,
        query: {
          id: row.tableId,
          code: row.tCode, // 检查分项
          action: "review",
        },
      });
    },

    // 清除缓存
    async deleteCache() {
      let params = {
        token: this.token,
        userid: this.userid,
        isDelete: 1,
        isDeleteAll: 1,
        code: this.check.checkBranchCode,
      };
      let res = await maintableDeletequeuecache(params);
    },

    // 修改功能---曹慧敏---2020.7.28
    updateItem(row) {
      this.deleteCache();
      //将本地存储的表单数据清空
      localStorage.removeItem("SAVFORMDATA");
      this.$router.push({
        path: "/" + row.urlPO.tempUrl1,
        query: {
          id: row.tableId,
          code: row.tCode, // 检查分项
          action: "update",
        },
      });
    },

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
          // judgeErroCode(res.data.status, res.data.message);\
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
        // checkType: this.search.checkType,
        code: "04010101",
      };
      if (this.search.startTime == "") {
        params.startTime = "";
      }
      if (this.search.endTime == "") {
        params.endTime = "";
      }
      try {
        let res = await qualityInspectList(params);
        // let res = await maintableList(params);
        if (res.data.status === "0") {
          if (res.data.data.list.length > 0) {
            this.tableList = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.tableList = [];
          }
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this.tableList = [];
        }
      } catch (error) {
        // this.$message({ type: "error", message: res.data.message });
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
        console.log("清除列表数据成功");
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
          // localStorage.SAVFORMDATA = ""; //将本地存储的表单数据清空
          localStorage.removeItem("SAVFORMDATA");
          this.deleteCache();
          // 检查分项跳转路由，施工人数弹窗
          let url = this.checkBranchCodeList.find(
            (item) => item.code === this.check.checkBranchCode
          ).remarks;
          if (url.length > 0) {
            this.clearLocal(this.check.checkBranchCode);
            this.$router.push({
              path: "/" + url,
              // path: "/qualityInspect/inspectMainStructureAdd",
              query: {
                code: this.check.checkBranchCode, // 检查分项
              },
            });
          } else {
            this.$message({ type: "error", message: "模块功能暂缓" });
          }
        }
      });
    },
    /**
     * 图片预览
     * params:none
     * create by YuXiong
     * date:2020-7-13
     */
    priviewBigPicture(url) {
      this.showModel = true;
      this.currentImg = url;
    },
    /**
     * 点击查询
     * params：none
     * create by YuXiong
     * date:2020-6-29
     */
    searchTable() {
      if (this.search.checkType === "1") {
        this.showPeopleTable = true;
      } else {
        this.showPeopleTable = false;
      }
      this.currentPage = 1;
      this.getTableList();
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
</style>