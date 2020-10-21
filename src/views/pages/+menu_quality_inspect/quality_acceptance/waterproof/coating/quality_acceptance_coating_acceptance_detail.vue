<template>
  <div>
    <div class="item-select">
      <el-row class="row-item">工程名称：{{ projectName }}</el-row>
      <el-row class="row-item">施工单位：{{ detailFromData.bidUnitId | accordingIdFindName(filterList) }}</el-row>
      <el-row
        class="row-item"
      >施工部位： {{ detailFromData.location }}{{ detailFromData.site | accordingIdFindName(filterList) }},{{ detailFromData.floorNum | accordingIdFindName(filterList) }}层</el-row>
      <el-row class="row-item">具体位置： {{ detailFromData.seatCode | accordingIdFindName(filterList) }}</el-row>
      <el-row class="row-item">防水涂料品牌： {{ detailFromData.brand | accordingIdFindName(filterList) }}</el-row>
      <el-row class="row-item">防水涂料型号： {{ detailFromData.model | accordingIdFindName(filterList) }}</el-row>
      <el-row
        class="row-item"
      >涂料设计厚度(mm)： {{ detailFromData.thick | accordingIdFindName(filterList) }}</el-row>
      <el-row
        class="row-item"
      >开始施工时间： {{ detailFromData.worktime | accordingIdFindName(filterList) | transformDate2 }}</el-row>
      <el-row class="row-item">
        <div class="body-title">涂料防水验收</div>
      </el-row>
      <el-row
        class="row-item"
      >涂料防水层的平均厚度实测： {{ detailFromData.thickness.value === "0" ? "合格" : "不合格" }}</el-row>
      <el-row class="row-item" v-if="detailFromData.thickness.fileList.length > 0">
        <img
          @click="priviewBigPicture(item.url)"
          v-for="(item,index) in detailFromData.thickness.fileList"
          :key="index"
          width="100"
          height="100"
          :src="item.url"
          class="imgs"
        />
      </el-row>
      <el-row class="row-item">蓄/淋水试验： {{ detailFromData.rainwater.value === "0" ? "淋水" : "蓄水" }}</el-row>
      <el-row class="row-item" v-if="detailFromData.rainwater.fileList.length > 0">
        <img
          @click="priviewBigPicture(item.url)"
          v-for="(item,index) in detailFromData.rainwater.fileList"
          :key="index"
          width="100"
          height="100"
          :src="item.url"
          class="imgs"
        />
      </el-row>
      <el-row class="row-item">渗漏情况： {{ detailFromData.permeate.value === "0" ? "无" : "有" }}</el-row>
      <el-row class="row-item" v-if="detailFromData.permeate.fileList.length > 0">
        <img
          @click="priviewBigPicture(item.url)"
          v-for="(item,index) in detailFromData.permeate.fileList"
          :key="index"
          width="100"
          height="100"
          :src="item.url"
          class="imgs"
        />
      </el-row>
      <el-row
        class="row-item"
        v-if="detailFromData.permeate.value != '0'"
      >蓄/淋水试验渗漏部位复查： {{ detailFromData.rainreview.value === "0" ? "淋水" : "蓄水" }}</el-row>
      <el-row class="row-item" v-if="detailFromData.rainreview.fileList.length > 0">
        <img
          @click="priviewBigPicture(item.url)"
          v-for="(item,index) in detailFromData.rainreview.fileList"
          :key="index"
          width="100"
          height="100"
          :src="item.url"
          class="imgs"
        />
      </el-row>
      <el-row class="row-item">验收结果： {{ detailFromData.result === '0' ? '不合格' : '合格' }}</el-row>
    </div>

    <el-dialog title="图片预览" :visible.sync="showModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>

    <div class="btn-box">
      <el-row class="row-button">
        <el-button size="medium" type="primary" @click="submit">提交</el-button>
        <el-button size="medium" @click="update" v-if="this.$route.query.continue != 1">修改</el-button>
        <el-button size="medium" @click="cancel" v-else>返回</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { maintableList, maintableUpdate } from "@/http/api.js";
export default {
  data() {
    return {
      token: "",
      userid: "",
      projectName: "",
      projectId: "",
      tcode: "",
      currentImg: "",
      showModel: false,
      detailFromData: {
        location: "",
        bidUnitId: "",
        block: "",
        floor: "",
        seatCode: "",
        brand: "",
        model: "",
        thick: "",
        worktime: "",
        floorNum: "",
        site: "",
        result: "合格",

        rainwater: {
          fileList: [],
        },
        permeate: {
          fileList: [],
        },
        rainreview: {
          fileList: [],
        },
        thickness: {
          fileList: [],
        },
      },

      filterList: [],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;

    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;
    this.tcode = this.$route.query.code;

    this.getEchoData();
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    /**
     * 获取回显数据
     * params: param
     * create by gzy
     * date: 2020-08-24
     */
    async getEchoData() {
      let param = {
        token: this.token,
        userid: this.userid,
        parentId: this.$route.query.parentId,
        mainId: this.$route.query.mainId,
        pageNum: 1,
        pageSize: 10000,
      };

      let res = await maintableList(param);
      if (res.data.status === "0") {
        if (res.data.data.headParam && res.data.data.headParam.length != 0) {
          // 头部信息处理
          this.filterList = res.data.data.headParam;
          this.detailFromData = this.$formMap(
            res.data.data.headParam,
            this.detailFromData
          );
          this.projectName = res.data.data.projectName;
          res.data.data.headParam.forEach((item) => {
            if (item.key === "bidBasementId" && item.value != "") {
              this.detailFromData.site = item.value;
              this.detailFromData.location = "地下室区块";
            } else if (item.key === "buildId" && item.value != "") {
              this.detailFromData.site = item.value;
              this.detailFromData.location = "楼栋号";
            }
          });
          // 表格信息处理
          res.data.data.publiList[0].bodyParam.forEach((item) => {
            if (item.key === "rainwater") {
              this.detailFromData.rainwater = item.comboxfile;
            } else if (item.key === "permeate") {
              this.detailFromData.permeate = item.comboxfile;
            } else if (item.key === "rainreview") {
              this.detailFromData.rainreview = item.comboxfile;
            } else if (item.key === "thickness") {
              this.detailFromData.thickness = item.comboxfile;
            }
          });
          // 底部信息处理
          res.data.data.publiList[0].bodyParam.forEach((item) => {
            if (item.key === "status" && item.value != "") {
              this.detailFromData.result = item.value;
            }
          });
        }
      }
    },
    /**
     * 图片预览
     * params:none
     * create by gzy
     * date:2020-08-19
     */
    priviewBigPicture(url) {
      this.showModel = true;
      this.currentImg = url;
    },
    /**
     * 修改跳转
     * params: param
     * create by gzy
     * date: 2020-08-24
     */
    update() {
      this.$router.push({
        path: "/gzy/coatingCoilAcceptance/add",
        query: {
          parentId: this.$route.query.parentId,
          mainId: this.$route.query.mainId,
          continue: 1,
        },
      });
    },
    /**
     * 问题提交
     * params: param
     * create: by gzy
     * date: 2020-08-17
     */
    async submit() {
      let param = {
        token: this.token,
        userid: this.userid,
        projectId: this.projectId,
        isMain: "0",
        isMany: "1",
        isQuestion: "0",
        tcode: "040102030203",
        tableId: this.$route.query.parentId,

        bidUnitIdToName: this.detailFromData.bidUnitIdToName,
        bidUnitId: this.detailFromData.bidUnitId,
        seatCode: this.detailFromData.seatCode,
        brand: this.detailFromData.brand,
        model: this.detailFromData.model,
        thick: this.detailFromData.thick,
        worktime: this.detailFromData.worktime.toString(),
        buildId: this.detailFromData.block,
        floorNum: this.detailFromData.floorNum,
        status: this.detailFromData.result,

        rainwater: {},
        permeate: {},
        rainreview: {},
        thickness: {},
      };

      param.rainwater = {
        value: this.detailFromData.rainwater.value,
        fileList: this.detailFromData.rainwater.fileList,
        id: 1,
      };

      param.permeate = {
        value: this.detailFromData.permeate.value,
        fileList: this.detailFromData.permeate.fileList,
        id: 2,
      };

      param.rainreview = {
        value: this.detailFromData.rainreview.value,
        fileList: this.detailFromData.rainreview.fileList,
        id: 3,
      };

      param.thickness = {
        value: this.detailFromData.thickness.value,
        fileList: this.detailFromData.thickness.fileList,
        id: 4,
      };

      let res = await maintableUpdate(param);
      if (res.data.status === "0") {
        this.$router.push({
          path: "/qualityInspect/mainStructureList",
        });
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },
  },
};
</script>

<style scoped lang='less'>
.item-select {
  width: 600px;
  margin: 40px 0 0 40px;
  .row-item {
    padding: 10px 0;
    .body-title {
      font-size: 20px;
    }
    span {
      width: 140px;
      display: inline-block;
      color: #999;
      font-size: 14px;
    }
  }
}

.btn-box {
  height: 70px;
  box-sizing: border-box;
  padding-top: 20px;
  .row-button {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>