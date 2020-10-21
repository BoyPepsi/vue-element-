<template>
  <div class="proDetails">
    <el-button
      type="success"
      icon="el-icon-back"
      @click="changePageStatus"
      style="margin-left:15px"
    >返回项目列表</el-button>
    <div class="proDetailInfo">
      <div class="infoItem">
        <span class="infoItem_title">当前项目:</span>
        <span class="infoItem_info">{{proDetailData.name}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">项目地址:</span>
        <span class="infoItem_info">{{proDetailData.address}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">项目类型:</span>
        <span class="infoItem_info">{{proDetailData.type | projectType}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">建筑用途:</span>
        <span class="infoItem_info">{{proDetailData.buildUse | buildingUse}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">建筑面积:</span>
        <span class="infoItem_info">{{proDetailData.buildArea}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">建设单位:</span>
        <span class="infoItem_info">{{proDetailData.unitName}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">建设单位负责人:</span>
        <span class="infoItem_info">{{proDetailData.contactPerson}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">联系电话:</span>
        <span class="infoItem_info">{{proDetailData.contactPhoneNumber}}</span>
      </div>
    </div>
    <span class="lines"></span>
    <div class="searchBox">
      <div class="searchItem">
        <div class="searchConditions">
          <div class="bid">
            <span>选择标段:</span>
            <el-select v-model="unitBid" placeholder="请选择标段" value-key="id" clearable>
              <el-option v-for="bid in bidList" :key="bid.id" :label="bid.name" :value="bid"></el-option>
            </el-select>
          </div>
          <div class="bid">
            <div style="margin-right: 15px">
              <span>单位类型:</span>
              <el-select v-model="unitType" placeholder="请选择单位类型:" clearable>
                <el-option
                  v-for="unit in units"
                  :key="unit.label"
                  :label="unit.label"
                  :value="unit.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchByUnitType"
            size="medium"
          >查 询</el-button>
        </div>
        <div class="showLists">
          <el-table
            :data="bidLists"
            border
            style="width: 100%"
            :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
          >
            <el-table-column
              v-for="column in unitTypeHeader"
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :width="column.width"
              align="center"
            ></el-table-column>
          </el-table>
          <paginationBg :totals="unitListTotal" @handleCurrentChange="getUnitCurPage"></paginationBg>
        </div>
      </div>

      <div class="searchItem" style="margin-top: 20px">
        <div class="searchConditions">
          <div class="bid">
            <span>选择标段:</span>
            <el-select v-model="tungBid" placeholder="请选择标段" value-key="id" clearable>
              <el-option v-for="bid in bidList" :key="bid.id" :label="bid.name" :value="bid"></el-option>
            </el-select>
          </div>
          <div class="bid">
            <div>
              <span>选择楼栋号:</span>
              <el-select v-model="tung" placeholder="请选择楼栋号:" clearable>
                <el-option
                  v-for="tug in tungs"
                  :key="tug.name"
                  :label="tug.number"
                  :value="tug.number"
                ></el-option>
              </el-select>
            </div>
          </div>
          <el-button type="primary" icon="el-icon-search" @click="searchByTung" size="medium">查 询</el-button>
        </div>
        <div class="showLists">
          <el-table
            :data="tungBidLists"
            border
            style="width: 100%"
            :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
          >
            <el-table-column
              v-for="column in tungTypeHeader"
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :width="column.width"
              align="center"
            ></el-table-column>
          </el-table>
          <paginationBg :totals="tungListTotal" @handleCurrentChange="getTungCurPage"></paginationBg>
        </div>
      </div>

      <div class="searchItem" style="margin-top: 20px">
        <div class="searchConditions">
          <div class="bid">
            <span>选择标段:</span>
            <el-select v-model="baseBid" placeholder="请选择标段" value-key="id" clearable>
              <el-option v-for="bid in bidList" :key="bid.id" :label="bid.name" :value="bid"></el-option>
            </el-select>
          </div>
          <div class="bid">
            <div>
              <span>地下室区块:</span>
              <el-select v-model="basement" placeholder="请选择地下室区块:" clearable>
                <el-option
                  v-for="base in basements"
                  :key="base.label"
                  :label="base.name"
                  :value="base.name"
                ></el-option>
              </el-select>
            </div>
          </div>
          <el-button type="primary" icon="el-icon-search" @click="searchByBase" size="medium">查 询</el-button>
        </div>
        <div class="showLists">
          <el-table
            :data="baseBidLists"
            border
            style="width: 100%"
            :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
          >
            <el-table-column
              v-for="column in baseTypeHeader"
              :key="column.label"
              :label="column.label"
              :prop="column.prop"
              :width="column.width"
              align="center"
            ></el-table-column>
          </el-table>
          <paginationBg :totals="baseListTotal" @handleCurrentChange="getBaseCurPage"></paginationBg>
        </div>
      </div>
    </div>
  </div>
</template>
</template>

<script>
import { bidList, unitList, tungList, baseList } from "@/http/api.js";
import paginationBg from "@/components/pagination/paginationBg";
import { judgeErroCode } from "@/utils/errorCode.js";

export default {
  name: "proDetails",
  props: {
    proDetailData: Object
  },
  components: {
    paginationBg
  },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      unitBid: "",
      tungBid: "",
      baseBid: "",
      bidList: [],
      unitListTotal: 10, // 单位类型标段 总数
      tungListTotal: 10, // 楼栋类型标段 总数
      baseListTotal: 10, // 地下室标段 总数
      unitType: "", // 单位类型
      units: [
        { label: "建设单位", value: "1" },
        { label: "监理单位", value: "2" },
        { label: "施工单位(总包)", value: "3" },
        { label: "施工单位(分包)", value: "4" },
        { label: "设计单位", value: "5" },
        { label: "勘察单位", value: "6" }
      ],
      tung: "",
      tungs: [],
      basement: "",
      basements: [],
      bidLists: [], // 单位  标段数据列表
      tungBidLists: [], // 楼栋 标段数据列表
      baseBidLists: [], // 地下室 标段数据列表
      unitTypeHeader: [
        { label: "标段", prop: "bidName", width: "120px" },
        { label: "单位类型", prop: "typeName", width: "200px" },
        { label: "单位名称", prop: "name", width: "300px" },
        { label: "联系人", prop: "contactPerson", width: "160px" },
        { label: "联系电话", prop: "contactPhoneNumber", width: "160px" }
      ],
      tungTypeHeader: [
        { label: "标段", prop: "bidName", width: "120px" },
        { label: "楼栋号", prop: "number", width: "100px" },
        { label: "层数", prop: "totalFloorNum", width: "120px" },
        { label: "非标准层", prop: "nonStandardFloorNum", width: "150px" },
        {
          label: "非标准房间数",
          prop: "nonStandardTotalRoomNum",
          width: "160px"
        },
        { label: "标准层数", prop: "standardFloorNum", width: "160px" },
        { label: "标准房间数(单层)", prop: "standardRoomNum", width: "160px" },
        { label: "标准房间数(总数)", prop: "contactPerson", width: "160px" },
        { label: "楼栋总房间数", prop: "totalRoomNum", width: "160px" },
        { label: "楼栋等级", prop: "type", width: "160px" }
      ],
      baseTypeHeader: [
        { label: "标段", prop: "bName" },
        { label: "地下室区块", prop: "name" },
        { label: "层数", prop: "floorNum" }
      ]
    };
  },
  async created() {
    this.getBidList();
    this.getCurProjectTungs();
    this.getCurProjectBase();
    let commonParams = [
      undefined,
      undefined,
      this.$props.proDetailData.id,
      this.$props.proDetailData.name
    ];
    let unitBidList = await this.getUnitBidList(...commonParams);
    let tungBidList = await this.getTungBidList(...commonParams);
    let baseBidList = await this.getBaseBidList(...commonParams);
    if (unitBidList.data.data.list.length > 0) {
      unitBidList.data.data.list.forEach(item => {
        this.units.forEach(ele => {
          if (item.type == ele.value) {
            item.typeName = ele.label;
          }
        });
      });
    }
    this.bidLists = unitBidList.data.data.list;
    this.tungBidLists = tungBidList.data.data.list;
    this.baseBidLists = baseBidList.data.data.list;
    this.unitListTotal = unitBidList.data.data.total;
    this.tungListTotal = tungBidList.data.data.total;
    this.baseListTotal = baseBidList.data.data.total;
  },
  filters: {
    // 项目
    projectType(val) {
      return val === "1"
        ? "住宅建筑"
        : val === "2"
        ? "宿舍建筑"
        : val === "3"
        ? "商业建筑"
        : val === "4"
        ? "办公建筑"
        : val === "5"
        ? "教育建筑"
        : val === "6"
        ? "交通建筑"
        : val === "7"
        ? " 文娱建筑"
        : val === "8"
        ? " 金融建筑"
        : val === "9"
        ? " 体育建筑"
        : "园林建筑";
    },
    // 建筑
    buildingUse(val) {
      return val === "1"
        ? "民用建筑"
        : val === "2"
        ? "居住建筑"
        : val === "3"
        ? "公共建筑"
        : val === "4"
        ? "工业建筑"
        : "农业建筑";
    }
  },
  methods: {
    // ============ search 查询按钮 ==================
    async searchByUnitType() {
      let baseParams = this.getParams("1", "10", this.$props.proDetailData.id);
      let completeParams = {
        ...baseParams,
        bid: this.unitBid.id,
        type: this.unitType
      };
      let { data } = await unitList(completeParams);
      this.unitListTotal = data.data.total;
      if (data.data.list.length > 0) {
        data.data.list.forEach(item => {
          this.units.forEach(ele => {
            if (item.type == ele.value) {
              item.typeName = ele.label;
            }
          });
        });
      }
      this.bidLists = data.data.list;
    },
    async searchByTung() {
      let baseParams = this.getParams("1", "10", this.$props.proDetailData.id);
      let completeParams = {
        ...baseParams,
        number: this.tung, // 楼栋号
        bid: this.tungBid.id,
        id: this.$props.proDetailData.id
      };
      let { data } = await tungList(completeParams);
      this.tungBidLists = data.data.list;
    },
    async searchByBase() {
      let baseParams = this.getParams("1", "10", this.$props.proDetailData.id);
      let completeParams = {
        ...baseParams,
        bid: this.baseBid.id,
        name: this.basement
      };
      let { data } = await baseList(completeParams);
      this.baseBidLists = data.data.list;
    },
    // ============ 分页符数据获取 ==================
    getUnitCurPage(val) {
      let data = this.getUnitBidList(
        val,
        undefined,
        this.$props.proDetailData.id
      );
      data
        .then(res => {
          res.data.data.list.forEach(item => {
            this.units.forEach(ele => {
              if (item.type == ele.value) {
                item.typeName = ele.label;
              }
            });
          });
          this.bidLists = res.data.data.list;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTungCurPage(val) {
      let data = this.getTungBidList(
        val,
        undefined,
        this.$props.proDetailData.id
      );
      data
        .then(res => {
          this.tungBidLists = res.data.data.list;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getBaseCurPage(val) {
      let data = this.getBaseBidList(
        val,
        undefined,
        this.$props.proDetailData.id
      );
      data
        .then(res => {
          this.baseBidLists = res.data.data.list;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取 地下室 标段 list
    async getBaseBidList(pageNum = 1, pageSize = 10, projectid, projectName) {
      let params = this.getParams(pageNum, pageSize, projectid, projectName);
      return await baseList(params);
    },
    // 获取 楼栋 标段 list
    async getTungBidList(pageNum = 1, pageSize = 10, projectid, projectName) {
      let params = this.getParams(pageNum, pageSize, projectid, projectName);
      return await tungList(params);
    },
    // 获取 参建单位标段list
    async getUnitBidList(pageNum = 1, pageSize = 10, projectid, projectName) {
      let params = this.getParams(pageNum, pageSize, projectid, projectName);
      return await unitList(params);
    },
    // 获取当前项目 全部的楼栋号
    async getCurProjectTungs() {
      let params = {
        id: this.$props.proDetailData.id,
        projectName: this.$props.proDetailData.name,
        pageNum: "1",
        pageSize: "10",
        token: this.userInfo.token,
        userid: this.userInfo.id
      };
      let data = await tungList(params);
      this.tungs = data.data.data.list;
    },
    // 获取当前项目下的全部地下室区块
    async getCurProjectBase() {
      let params = {
        id: this.$props.proDetailData.id,
        projectName: this.$props.proDetailData.name,
        pageNum: "1",
        pageSize: "10",
        token: this.userInfo.token,
        userid: this.userInfo.id
      };
      let data = await baseList(params);
      this.basements = data.data.data.list;
    },
    // 获取当前项目标段list
    getBidList() {
      bidList({
        projectid: this.$props.proDetailData.id,
        pageNum: 1,
        pageSize: 10,
        token: this.userInfo.token,
        userid: this.userInfo.id
      })
        .then(res => {
          if (res.data.status === "0") {
            this.bidList = res.data.data.list;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch(err => console.log(err));
    },
    changePageStatus() {
      this.$emit("changePageStatus", true);
    },
    getParams(pageNum, pageSize, projectid, projectName) {
      return {
        pageNum,
        pageSize,
        projectid,
        projectName,
        token: this.userInfo.token,
        userid: this.userInfo.id
      };
    }
  }
};
</script>

<style lang="less" scoped>
.proDetails {
  width: 98%;
  margin: 30px auto;
  padding-bottom: 50px;
  .lines {
    display: block;
    box-sizing: border-box;
    border-bottom: 1px dashed #ccc;
    margin-top: 12px;
  }
  .proDetailInfo {
    margin-top: 15px;
    .infoItem {
      display: inline-block;
      line-height: 40px;
      padding: 0 15px;
      margin-right: 50px;
      .infoItem_title {
        color: #2d3436;
        font-size: 16px;
        margin-right: 15px;
      }
    }
  }
  .searchBox {
    margin-top: 20px;
    margin-left: 15px;
  }
  .bid {
    display: inline-block;
    margin-right: 25px;
    span {
      margin-right: 15px;
    }
  }
  .showLists {
    margin-top: 30px;
  }
}
</style>