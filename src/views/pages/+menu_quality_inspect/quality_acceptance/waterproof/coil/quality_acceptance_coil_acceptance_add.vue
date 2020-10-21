<template>
  <div>
    <div class="item-select">
      <el-form
        ref="addFromData"
        :model="addFromData"
        :rules="rules"
        label-width="135px"
        label-position="left"
      >
        <el-row class="row-item">
          <el-form-item label="工程名称:">
            <el-input disabled v-model="projectName" style="width:79%"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="施工单位:" prop="bidUnitIdToName">
            <el-input disabled v-model="addFromData.bidUnitIdToName" style="width:79%"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="施工部位:" prop="floor">
            <el-select
              v-model="addFromData.site"
              placeholder
              style="width:25%"
              @change="getBaseMentList"
              disabled
            >
              <el-option
                v-for="item in this.commonData.waterproofConstruction"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="addFromData.block"
              placeholder
              style="width:25%;margin-left:10px"
              @change="getFool"
              disabled
            >
              <el-option
                v-for="item in baseMentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-model="addFromData.floorNum"
              placeholder
              style="width:25%;margin-left:10px"
              disabled
            >
              <el-option v-for="(item) in floorList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="具体位置:">
            <el-select v-model="addFromData.seatCode" placeholder="请选择" style="width:79%" disabled>
              <el-option
                v-for="item in projectList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="防水卷材品牌:">
            <el-input v-model="addFromData.brand" style="width:79%" disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="防水卷材型号:">
            <el-input v-model="addFromData.model" style="width:79%" disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="卷材设计厚度(mm):">
            <el-input v-model="addFromData.thick" style="width:79%" disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="开始施工时间:">
            <el-date-picker
              v-model="addFromData.worktime"
              type="datetime"
              placeholder="选择日期时间"
              style="width:79%"
              value-format="timestamp"
              disabled
            ></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <div class="body-title">防水卷材验收</div>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="蓄/淋水试验:">
            <el-select v-model="addFromData.storage" placeholder="请选择" style="width:79%">
              <el-option label="淋水" value="0"></el-option>
              <el-option label="蓄水" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label>
            <div style="float:left">
              <upload
                :isChecked="true"
                :fileList="storageFileList"
                @removefileList="fileRemove($event, 'storageFileList')"
              ></upload>
            </div>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="渗漏情况:">
            <el-select
              v-model="addFromData.leakage"
              placeholder="请选择"
              style="width:79%"
              @change="questionChange($event, 'leakage')"
            >
              <el-option label="无" value="0"></el-option>
              <el-option label="有" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="row-item" v-if="addFromData.leakage === '1'">
          <el-form-item label>
            <div style="float:left">
              <upload
                :isChecked="true"
                :fileList="leakageFileList"
                @removefileList="fileRemove($event, 'leakageFileList')"
              ></upload>
            </div>
          </el-form-item>
        </el-row>
        <el-row class="row-item" v-if="addFromData.leakage === '1'">
          <el-form-item label="蓄/淋水试验渗漏部位复查:">
            <el-select
              v-model="addFromData.review"
              placeholder="请选择"
              style="width:79%"
              @change="questionChange($event, 'review')"
            >
              <el-option label="淋水" value="0"></el-option>
              <el-option label="蓄水" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="row-item" v-if="addFromData.leakage === '1'">
          <el-form-item label>
            <div style="float:left">
              <upload
                :isChecked="true"
                :fileList="reviewFileList"
                @removefileList="fileRemove($event, 'reviewFileList')"
              ></upload>
            </div>
          </el-form-item>
        </el-row>
        <el-row class="row-item">
          <el-form-item label="验收结果:">
            <el-select v-model="addFromData.result" placeholder="请选择" style="width:79%">
              <el-option label="合格" value="1"></el-option>
              <el-option label="不合格" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="btn-box">
      <el-row class="row-button">
        <el-button size="medium" type="primary" @click="save">保存</el-button>
        <el-button size="medium" @click="cancel">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  baseListNothing,
  qualityInspectQueryunit,
  getBuildList,
  getQueryBuildFloor,
  getDictionarieList,
  maintableAdd,
  maintableUpdate,
  maintableList,
} from "@/http/api.js";
export default {
  data() {
    return {
      token: "",
      userid: "",
      projectName: "",
      projectId: "",
      checkMark: "",
      tcode: "",
      addFromData: {
        bidUnitIdToName: "",
        block: "",
        floorNum: "",
        seatCode: "",
        brand: "",
        model: "",
        thick: "",
        worktime: "",

        storage: "0",
        leakage: "0",
        review: "0",
        result: "0",

        site: "2",
      },
      rules: {
        floorNum: [
          { required: true, message: "请选择施工部位", trigger: "blur" },
        ],
      },
      baseMentList: [],
      floorList: [],
      projectList: [],
      leakageFileList: [],
      storageFileList: [],
      reviewFileList: [],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;

    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;
    this.tcode = "040102030103";

    if (this.$route.query.parentId) {
      this.getEchoData();
    }

    this.getSelectList("03010202", "projectList");
  },
  methods: {
    cancel() {
      let obj = {
        parentId: this.$route.query.parentId,
        checkMark: this.checkMark.length,
        isCheck: 1,
      };
      this.$router.push({
        path: "/gzy/coil/summary",
        query: obj,
      });
    },
    /**
     * 获取回显数据
     * params: param
     * create by gzy
     * date: 2020-08-21
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
          this.addFromData = this.$formMap(
            res.data.data.headParam,
            this.addFromData
          );
          this.projectName = res.data.data.projectName;
          this.projectId = res.data.data.projectId;
          this.checkMark = res.data.data.checkMark;
          res.data.data.headParam.forEach((item) => {
            if (item.key === "bidBasementId" && item.value != "") {
              this.addFromData.block = item.value;
              this.addFromData.site = "1";
            } else if (item.key === "buildId" && item.value != "") {
              this.addFromData.block = item.value;
              this.addFromData.site = "2";
            }
          });
          await this.getBasementList(this.addFromData.site);
          await this.getFool(this.addFromData.block);

          if (this.$route.query.continue == 1) {
            res.data.data.publiList[0].bodyParam.forEach((item) => {
              if (item.key === "rainwater") {
                this.$set(this.addFromData, "storage", item.comboxfile.value);
                this.storageFileList = item.comboxfile.fileList;
              } else if (item.key === "permeate") {
                this.$set(this.addFromData, "leakage", item.comboxfile.value);
                this.leakageFileList = item.comboxfile.fileList;
              } else if (item.key === "rainreview") {
                this.$set(this.addFromData, "review", item.comboxfile.value);
                this.reviewFileList = item.comboxfile.fileList;
              }
            });
          }
        }
      }
    },
    /**
     * 问题切换
     * params:file,fileList
     * create by gzy
     * date:2020-8-19
     */
    questionChange(value, showData) {
      if (showData === "storage") {
        this.storageFileList = [];
      } else if (showData === "leakage") {
        this.addFromData.review = "0";
        this.leakageFileList = [];
        this.reviewFileList = [];
      } else if (showData === "review") {
        this.reviewFileList = [];
      }
    },
    /**
     * 文件移除
     * params:file,fileList
     * create by gzy
     * date:2020-8-19
     */
    fileRemove(listData, imgList) {
      this[imgList] = listData.fileList;
    },
    /**
     * 获取具体位置下拉数据
     * params：code
     * create by gzy
     * date:2020-08-19
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
     * 获取地下室列表 二位获取
     * params:none
     * create by gzy
     * date:2020-08-17
     */
    async getBaseMentList(data) {
      this.baseMentList = [];
      this.floorList = [];
      this.addFromData.block = "";
      this.addFromData.floor = "";
      this.getBasementList(data);
    },
    async getBasementList(data) {
      let params = {
        token: this.token,
        userid: this.userid,
        pageNum: 1,
        pageSize: 10000,
        projectid: this.projectId,
      };
      let res;
      if (data === "1") {
        params.type = 1;
        res = await baseListNothing(params);
        this.baseMentList = res.data.data.list;
      } else {
        res = await getBuildList(params);
        if (res.data.data.length > 0) {
          res.data.data.forEach((item) => {
            let obj = {};
            obj.id = item.id;
            obj.name = item.number;
            this.baseMentList.push(obj);
          });
        }
      }
      if (res.data.status != "0") {
        this.baseMentList = [];
      }
    },
    /**
     * 获取楼层列表 三位获取
     * params：code
     * create by gzy
     * date:2020-08-17
     */
    async getFool(id) {
      this.floorList = [];
      let params = {
        token: this.token,
        userid: this.userid,
        id: id,
        kind: "2",
      };
      let res = await getQueryBuildFloor(params);
      // if (this.baseMentList.type === 1) {
      //   params.bid = id;
      //   res = await qualityInspectQueryunit(params);
      // } else {
      //   params.id = id;
      //   res = await getQueryBuildFloor(params);
      // }
      if (res.data.status === "0") {
        this.floorList = res.data.data.floorlist;
        this.addFromData.bidUnitIdToName = res.data.data.unitlist[0].name;
        this.addFromData.bidUnitId = res.data.data.unitlist[0].id;
      } else {
        this.floorList = [];
      }
    },
    /**
     * 问题保存
     * params: param
     * create: by gzy
     * date: 2020-08-17
     */
    async save() {
      this.$refs.addFromData.validate((valid) => {
        if (valid) {
          if (this.storageFileList.length === 0) {
            this.$message({ type: "error", message: "请上传蓄/淋水图片" });
            return false;
          } else if (
            this.leakageFileList.length === 0 &&
            this.addFromData.leakage == "1"
          ) {
            this.$message({ type: "error", message: "请上传渗漏图片" });
            return false;
          } else if (
            this.reviewFileList.length === 0 &&
            this.addFromData.leakage == "1"
          ) {
            this.$message({ type: "error", message: "请上传复查图片" });
            return false;
          }

          let param = {
            token: this.token,
            userid: this.userid,
            projectId: this.projectId,
            isMain: "0",
            isMany: "1",
            isQuestion: "0",
            tcode: "040102030103",
            tableId: this.$route.query.parentId,

            bidUnitIdToName: this.addFromData.bidUnitIdToName,
            bidUnitId: this.addFromData.bidUnitId,
            seatCode: this.addFromData.seatCode,
            brand: this.addFromData.brand,
            model: this.addFromData.model,
            thick: this.addFromData.thick,
            worktime: this.addFromData.worktime.toString(),
            buildId: this.addFromData.block,
            floorNum: this.addFromData.floorNum,
            status: this.addFromData.result,

            rainwater: {},
            permeate: {},
            rainreview: {},
          };

          if (
            this.addFromData.storage === "1" ||
            this.addFromData.leakage === "1" ||
            this.addFromData.review === "1"
          ) {
            param.isQuestion = "1";
          }

          param.rainwater = {
            value: this.addFromData.storage,
            fileList: this.storageFileList,
            id: 1,
          };

          param.permeate = {
            value: this.addFromData.leakage,
            fileList: this.leakageFileList,
            id: 2,
          };

          param.rainreview = {
            value: this.addFromData.review,
            fileList: this.reviewFileList,
            id: 3,
          };

          if (this.$route.query.continue == 1) {
            param.mainId = this.$route.query.mainId;
            param.tableId = this.$route.query.parentId;
            maintableUpdate(param).then((res) => {
              if (res.data.status === "0") {
                this.$router.push({
                  path: "/coilCoilAcceptance/detail",
                  query: {
                    parentId: res.data.data.tableId,
                    mainId: res.data.data.mainId,
                  },
                });
              } else {
                this.$message({ type: "error", message: res.data.message });
              }
            });
          } else {
            maintableAdd(param).then((res) => {
              if (res.data.status === "0") {
                this.$router.push({
                  path: "/coilCoilAcceptance/detail",
                  query: {
                    parentId: res.data.data.tableId,
                    mainId: res.data.data.mainId,
                  },
                });
              } else {
                this.$message({ type: "error", message: res.data.message });
              }
            });
          }
        } else {
          this.$message({ type: "error", message: "请确认必填信息" });
          return false;
        }
      });
    },
  },
};
</script>

<style scoped lang='less'>
.item-select {
  width: 600px;
  margin: 40px 0 0 40px;
  .row-item {
    .body-title {
      padding: 20px 0;
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