<template>
  <div class="lotDetails">
    <!-- 项目 -->
    <div class="searchBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="项目名称">
          <el-select
            v-model="handle.projectName"
            placeholder="请选择项目名称:"
            @change="hanldPro"
            value-key="id"
            clearable
          >
            <el-option
              v-for="type in projectNameList"
              :key="type.id"
              :label="type.name"
              :value="type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标段">
          <el-select v-model="handle.bid" placeholder="请选择标段:" clearable @change="handleBid">
            <el-option
              v-for="type in bidSelectList"
              :key="type.id"
              :label="type.name"
              :value="type.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="medium" @click="onSearch">查 询</el-button>
          <el-button
            type="success"
            icon="el-icon-back"
            size="medium"
            @click="changePage"
            style="margin-left:15px"
          >返回地下室列表</el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="bid">
            <span>项目名称:</span>
            <el-input v-model="name" clearable style="width:200px;"></el-input>
        </div>
      <el-button type="primary" icon="el-icon-search" size="medium" @click="onSearch">查 询</el-button>-->
      <!-- <el-button
          type="success"
          icon="el-icon-back"
          size="medium"
          @click="changePage"
          style="margin-left:15px"
      >返回地下室列表</el-button>-->
    </div>
    <div class="table" v-if="showDetail">
      <div class="layout">
        <div class="vertical" style="width:100px">地下室状态</div>
        <div class="vertical">
          <span>{{detail.count == 0 ? '暂无地下室': '有地下室'}}</span>
        </div>
      </div>
      <div class="layout">
        <div class="vertical" style="width:100px">地下室区块</div>
        <div class="vertical">
          <span>{{detail.name}}</span>
        </div>
      </div>
      <div class="layout">
        <div class="vertical" style="width:100px">地下室层数</div>
        <div class="vertical">
          <!-- getFloor -->
          <span v-if="detail.floorNum !== ''">{{detail.floorNum}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { serchLit, proList, bidList } from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";

export default {
  name: "baseDetail",
  props: {
    lotData: Object,
  },
  data() {
    return {
      handle: {
        projectid: "", // 项目id
        projectName: "", // 项目name
        bid: "", // 标段id
        userId: "", // 用户id
        toKen: "", // 用户token
      },
      projectNameList: [], // 项目列表
      bidSelectList: [], // 标段列表
      detail: {
        count: 0,
        name: "",
        floorNum: "",
      },
      showDetail: false,
    };
  },
  filters: {
    getFloor(val) {
      console.log(val, "?????");
      let array = val.split(",");
      array.map((element) => {
        return element + "层";
      });
    },
  },
  created() {
    const userInfo = this.$store.state.userInfo;
    this.handle.userId = userInfo.id;
    this.handle.toKen = userInfo.token;

    this.getList();
  },
  methods: {
    // 获取地下室查询列表
    async getFindList(params) {
      try {
        let res = await serchLit(params);
        if (res.data.status === "0") {
          if (res.data.data != null) {
            this.detail = res.data.data;
          } else {
            this.detail = {
              count: 0,
              name: "",
              floorNum: "",
            };
          }
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 加载项目列表
    getList() {
      let params = {
        pageNum: "1",
        pageSize: "10",
        token: this.handle.toKen,
        userid: this.handle.userId,
      };
      proList(params)
        .then((res) => {
          if (res.data.status === "0") {
            this.projectNameList = res.data.data.list;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch((err) => console.log(err));
    },
    // 选择查询项目
    hanldPro(val) {
      this.handle.bid = "";

      this.getDid(val.id);
      this.handle.projectid = val.id;
      this.handle.projectName = val.name;
    },
    // 选择项目后  获取标段列表
    getDid(value) {
      let params = {
        token: this.handle.toKen,
        userid: this.handle.userId,
        pageSize: 10, // 页数
        pageNum: 1, //  页码
        projectid: value, // 项目标识
      };
      bidList(params)
        .then((res) => {
          if (res.data.status === "0") {
            this.bidSelectList = res.data.data.list;
            if (this.handle.projectName == undefined) {
              this.bidSelectList = [];
            }
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch((err) => {
          this.$message({ type: "error", message: "服务器响应失败..." });
        });
    },
    // 标段
    handleBid(val) {
      this.handle.bid = val;
    },
    // 查询
    onSearch() {
      this.showDetail = true;
      if (
        this.handle.bid == "" &&
        this.handle.projectName == undefined &&
        this.handle.projectid == undefined
      ) {
        this.showDetail = false;
      }
      this.getFindList(this.handle);
    },
    // 分页
    handleCurrentChange() {},
    handleSizeChange() {},
    // 返回地下室列表
    changePage() {
      this.$emit("changePage");
    },
  },
};
</script>

<style lang="less" scoped>
.searchBox {
  display: flex;
  margin: 30px 0;
  .bid {
    margin-right: 20px;
    span {
      margin-right: 20px;
    }
    // input 样式
    /deep/ .el-input__inner {
      height: 40px !important;
      line-height: 30px !important;
    }
  }
}
.layout {
  width: 93%;
  margin: 0 20px;
  display: flex;
}
.vertical {
  width: 100%;
  // height: 35px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  // float: left;
  text-align: center;
  line-height: 35px;
  margin-top: -1px;
  word-wrap: break-word;
white-space: normal;
word-break: break-all;
}
.layout span {
  vertical-align: middle;
}
</style>