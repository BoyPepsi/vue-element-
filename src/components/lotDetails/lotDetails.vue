<template>
  <div class="lotDetails">
    <div class="btn">
        <el-button
            @click="bidGo"
            style="margin:0 100px"
            >标段信息
        </el-button>
        <el-button
            @click="companyGo"
            style="margin:0 100px"
            >单位信息
        </el-button>
        <el-button
            @click="buildingGo"
            style="margin:0 100px"
            >楼栋信息
        </el-button>
        <el-button
            @click="basementGo"
            style="margin:0 100px"
            >地下室信息
        </el-button>
    </div>
    <span class="lines"></span>
    <div class="proDetailInfo">
      <div class="infoItem">
        <span class="infoItem_title">当前项目:</span>
        <span class="infoItem_info">{{lotData.projectName}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">项目地址:</span>
        <span class="infoItem_info">{{lotData.projectAddress}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">标段:</span>
        <span class="infoItem_info">{{lotData.name}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">项目类型:</span>
        <span class="infoItem_info">{{lotData.type | projectType}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">建筑用途:</span>
        <span class="infoItem_info">{{lotData.buildUse | buildingUse}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">建筑面积:</span>
        <span class="infoItem_info">{{lotData.buildArea}}m²</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">建设单位:</span>
        <span class="infoItem_info">{{lotData.unitName}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">建设单位负责人:</span>
        <span class="infoItem_info">{{lotData.contactPerson}}</span>
      </div>
      <div class="infoItem">
        <span class="infoItem_title">联系电话:</span>
        <span class="infoItem_info">{{lotData.contactPhoneNumber}}</span>
      </div>
    </div>
    <!-- 单位 -->
    <div class="searchBox">
        <div class="bid">
            <span>单位类型:</span>
            <el-select v-model="unitsType" placeholder="请选择单位类型" value-key="id" clearable>
              <el-option 
                  v-for="unit in units" 
                  :key="unit.value" 
                  :label="unit.label" 
                  :value="unit.value"></el-option>
            </el-select>
        </div>
        <el-button type="primary" icon="el-icon-search" size="medium" @click="searchCompany">查 询</el-button>
        <el-button
          type="success"
          icon="el-icon-back"
          size="medium"
          @click="changePage"
          style="margin-left:15px"
        >返回项目列表</el-button>
    </div>
    <div class="showLists">
      <el-table
        :data="companyData"
        border
        style="width: 100%"
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column label="单位" prop="projectName" min-width="20%" align="center"></el-table-column>
          <el-table-column label="单位名称" prop="name" min-width="20%" align="center"></el-table-column>
          <el-table-column label="单位类型" prop="type" min-width="10%" align="center">
              <template slot-scope="scope">
                  <span>{{scope.row.type | unitType}}</span>
              </template>
          </el-table-column>
          <el-table-column label="联系人" prop="contactPerson" min-width="20%" align="center"></el-table-column>
          <el-table-column label="联系电话" prop="contactPhoneNumber" min-width="20%" align="center"></el-table-column>
      </el-table>
      <paginationBg :totals="companyTotal" @handleCurrentChange="getCompanyPage"></paginationBg>
    </div>
    <!-- 楼栋 -->
    <div class="searchBox">
        <div class="bid">
            <span>楼栋号:</span>
            <el-select v-model="tungNumber" placeholder="请选择楼栋号" value-key="id" clearable>
              <el-option v-for="tug in tungs" :key="tug.name" :label="tug.number" :value="tug.number"></el-option>
            </el-select>
        </div>
        <el-button type="primary" icon="el-icon-search" size="medium" @click="searchBuild">查 询</el-button>
    </div>
    <div class="showLists">
      <el-table
        :data="buildData"
        border
        style="width: 100%"
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column label="楼栋号" prop="number" min-width="10%" align="center"></el-table-column>
          <el-table-column label="总楼层" prop="totalFloorNum" min-width="10%" align="center"></el-table-column>
          <el-table-column label="非标准层数" prop="nonStandardFloorNum" min-width="20%" align="center"></el-table-column>
          <el-table-column label="非标准层总房间数" prop="nonStandardTotalRoomNum" min-width="20%" align="center"></el-table-column>
          <el-table-column label="标准层数" prop="standardFloorNum" min-width="10%" align="center"></el-table-column>
          <el-table-column label="标准层房间数(单层)" prop="standardRoomNum" min-width="20%" align="center"></el-table-column>
          <el-table-column label="标准层房间数(总数)" prop="totalStandardRoomNum" min-width="20%" align="center"></el-table-column>
          <el-table-column label="楼栋总房间数" prop="totalRoomNum" min-width="20%" align="center"></el-table-column>
          <el-table-column label="楼栋类型" prop="type" min-width="20%" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.type | buildType}}</span>
            </template>
          </el-table-column>
      </el-table>
      <paginationBg :totals="buildTotal" @handleCurrentChange="getBuildPage"></paginationBg>

    </div>
    <!-- 地下室 -->
    <div class="searchBox">
        <div class="bid">
            <span>地下室区块:</span>
            <el-select v-model="basement" placeholder="请选择地下室区块" value-key="id" clearable>
              <el-option v-for="base in basements" 
                        :key="base.id" 
                        :label="base.name" 
                        :value="base.name"></el-option>
            </el-select>
        </div>
        <el-button type="primary" icon="el-icon-search" size="medium" @click="searchBase">查 询</el-button>
    </div>
    <div class="showLists">
      <el-table
        :data="basementData"
        border
        style="width: 100%"
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
        <el-table-column
          v-for="column in columnBase"
          :key="column.id"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          align="center"
        ></el-table-column>
      </el-table>
      <paginationBg :totals="baseTotal" @handleCurrentChange="getBasePage"></paginationBg>
    </div>
  </div>
</template>

<script>
import {
  unitList,  
  tungList,
  baseList,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import paginationBg from "@/components/pagination/paginationBg";

export default {
  name: "lotDetails",
  props: {
    lotData: Object
  },
  components: {
    paginationBg
  },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      // 单位类型
      units: [
        { label: "建设单位", value: "1" },
        { label: "监理单位", value: "2" },
        { label: "施工单位(总包)", value: "3" },
        { label: "施工单位(分包)", value: "4" },
        { label: "设计单位", value: "5" },
        { label: "勘察单位", value: "6" }
      ],
      tungs:[],
      // 楼栋号
      build:[],
      // 地下室区块
      basements:[],
      columnBuilding: [
        { label: "楼栋号", prop: "number", },
        { label: "总楼层", prop: "totalFloorNum", },
        { label: "非标准层数", prop: "nonStandardFloorNum", },
        { label: "非标准层总房间数", prop: "nonStandardTotalRoomNum", },
        { label: "标准层数", prop: "standardFloorNum", },
        { label: "标准层房间数(单层)", prop: "standardRoomNum", },
        { label: "标准层房间数(总数)", prop: "totalStandardRoomNum", },
        { label: "楼栋总房间数", prop: "totalRoomNum", },
        { label: "楼栋类型", prop: "type", },
      ],
      columnBase: [
        { label: "地下室区块", prop: "name" },
        { label: "层数", prop: "floorNum" }
      ],
      companyData: [],  // 单位列表
      buildData:[],   // 楼栋列表
      basementData: [],   //地下室列表
      bidList:[],
      pageCompant: 1,
      companyTotal: 10,
      pageBuild: 1,
      buildTotal: 10,
      pageBase: 1,
      baseTotal: 10,
      unitsType: '',  //单位类型
      tungNumber: '',  // 楼栋号
      basement: '',    // 地下室
    };
  },
  filters:{
      // 项目
       projectType (val) {
           return val === '1' ? '住宅建筑' : 
                  val === '2' ? '宿舍建筑' :
                  val === '3' ? '商业建筑' :
                  val === '4' ? '办公建筑' :
                  val === '5' ? '教育建筑' :
                  val === '6' ? '交通建筑' :
                  val === '7' ? ' 文娱建筑' :
                  val === '8' ? ' 金融建筑' :
                  val === '9' ? ' 体育建筑' : '园林建筑'
       },
       // 建筑
       buildingUse (val) {
           return val == '1' ? '民用建筑' :
                  val == '2' ? '居住建筑' :
                  val == '3' ? '公共建筑' :
                  val == '4' ? '工业建筑' : '农业建筑'
       },
      // 单位类型
       unitType (val) {
          return val == '1' ? '建设单位' :
                val == '2' ? '监理单位' :
                val == '3' ? '施工单位(总包)' :
                val == '4' ? '施工单位(分包)' :
                val == '5' ? '设计单位' : '勘察单位'
       },
        // 项目
       // 楼栋类型
       buildType (val ) {
         return val === '0' ? '主楼':'楼栋'
       }
    },
  created() {
      console.log(this.lotData,'lotData');
      this.getCurProjectBase();
      this.getTung();

      this.getUnitList(this.pageCompant, this.lotData.id);
      this.getTungList(this.pageBuild, this.lotData.id);
      this.getBasementList(this.pageBase, this.lotData.id)
  },
  methods: {

    // 获取单位列表
    async getUnitList (pageNum ,bid){
      let params = {
        pageNum: pageNum,
        pageSize: 10,
        bid: bid,
        projectName:this.lotData.projectName,
        token: this.userInfo.token,
        userId: this.userInfo.id
      };
      try {
        let res = await unitList(params);
        if(res.data.status === '0' ) {
          this.companyData = res.data.data.list;
          console.log(this.companyData,'companyData')
          this.companyTotal = res.data.data.total;
        } else {
          judgeErroCode(res.data.status,res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取楼栋号列表
    async getTungList (pageNum, bid){
      let params = {
        pageNum: pageNum,
        pageSize: 10,
        bid: bid,
        projectName: this.$props.lotData.projectName,
        token: this.userInfo.token,
        userId: this.userInfo.id
      };
      try {
        let res = await tungList(params);
        if(res.data.status === '0' ) {
          this.buildData = res.data.data.list;
          this.buildTotal = res.data.data.total;
        } else {
          judgeErroCode(res.data.status,res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    //获取当前项目的所有楼栋号--查询
    async getTung (){
      let params = {
        bid: this.$props.lotData.id,
        projectName: this.$props.lotData.projectName,
        pageNum: 1,
        pageSize: 10,
        token: this.userInfo.token,
        userid: this.userInfo.id
      };
      try {
        let res = await tungList(params);
        if(res.data.status === '0' ) {
          this.tungs = res.data.data.list;
        } else {
          judgeErroCode(res.data.status,res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 获取当前项目下的全部地下室区块
    async getCurProjectBase() {
      let params = {
        bid: this.$props.lotData.id,
        projectId: this.$props.lotData.projectId,
        projectName: this.$props.lotData.projectName,
        pageNum: 1,
        pageSize: 10,
        token: this.userInfo.token,
        userid: this.userInfo.id
      };
      let data = await baseList(params);
      this.basements = data.data.data.list;
      
    },

    // 获取地下室列表
    async getBasementList (pageNum, bid){
      let params = {
        pageNum: pageNum,
        pageSize: 10,
        bid: bid,
        projectId: this.$props.lotData.projectId,
        projectName: this.$props.lotData.projectName,
        token: this.userInfo.token,
        userId: this.userInfo.id
      };
      try {
        let res = await baseList(params);
        if(res.data.status === '0' ) {
          this.basementData = res.data.data.list;
          this.baseTotal = res.data.data.total;
        } else {
          judgeErroCode(res.data.status,res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 查询按钮---- 单位
    async searchCompany(){
      let params = {
        bid:this.lotData.id,     // 标段id
        projectName:this.lotData.projectName,   //项目名称
        type: this.unitsType,    // 单位类型
        token: this.userInfo.token,
        userId: this.userInfo.id,
        pageSize: 10, // 页数
        pageNum: 1, //  页码
      }
      try {
        let res = await unitList(params);
        if(res.data.status === '0' ) {
          this.companyData = res.data.data.list;
          this.companyTotal = res.data.data.total;
        } else {
          judgeErroCode(res.data.status,res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 查询按钮---楼栋
    async searchBuild(){
      let params = {
        pageNum: 1,
        pageSize: 10,
        bid: this.$props.lotData.id,
        projectName:this.lotData.projectName,
        number: this.tungNumber,  // 楼栋号
        token: this.userInfo.token,
        userId: this.userInfo.id
      };
      try {
        let res = await tungList(params);
        if(res.data.status === '0' ) {
          this.buildData = res.data.data.list;
          this.buildTotal = res.data.data.total;
        } else {
          judgeErroCode(res.data.status,res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async searchBase(){
      let params = {
        pageNum: 1,
        pageSize: 10,
        bid: this.$props.lotData.id,
        name: this.basement,
        projectId: this.$props.lotData.projectId,
        projectName: this.$props.lotData.projectName,
        token: this.userInfo.token,
        userId: this.userInfo.id
      };
      try {
        let res = await baseList(params);
        if(res.data.status === '0' ) {
          this.basementData = res.data.data.list;
          this.baseTotal = res.data.data.total;
        } else {
          judgeErroCode(res.data.status,res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 返回
    changePage() {
      this.$emit("changePage");
    },
    // 分页
    getCompanyPage(val){
      this.getUnitList(val, this.lotData.projectId);
    },
    getBuildPage(val){
      this.getTungList(val, this.lotData.projectId);
    },
    getBasePage(val){
       this.getBasementList(val, this.lotData.projectId);
    },
    // 跳转到标段
    bidGo(){
      this.$emit("changePage");
    },
    // 跳转到单位
    companyGo(){
      this.$router.push({path: "/bidUnitList",query:{
          projectName:this.lotData.projectName,
          projectId:this.lotData.projectId,
          name:this.lotData.name,
          id:this.lotData.id
      }})
    },
    // 跳转到楼栋
    buildingGo(){
      this.$router.push({path: "/buildList",query:{
          projectName:this.lotData.projectName,
          projectId:this.lotData.projectId,
          name:this.lotData.name,
          id:this.lotData.id
      }})
    },
    // 跳转到地下室
    basementGo(){
      this.$router.push({path: "/basementList",query:{
          projectName:this.lotData.projectName,
          projectId:this.lotData.projectId,
          name:this.lotData.name,
          id:this.lotData.id
      }})
      
    },
  }
};
</script>

<style lang="less" scoped>
.lotDetails {
  width: 98%;
  margin: 30px auto;
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
      margin-right: 90px;
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