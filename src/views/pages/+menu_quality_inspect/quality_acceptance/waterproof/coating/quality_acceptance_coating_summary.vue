<template>
  <div>
    <div class="bigbox" style="margin-top:40px">
      <div class="title">
        <div class="text">
          <span class="block"></span>
          基层处理检查
        </div>
        <el-button
          class="btn"
          @click="goUpdate(header.mainId, header.parentId, '/gzy/coatinGrassrootsTreatment/add')"
          v-if="$route.query.isCheck == 1"
        >修改</el-button>
      </div>

      <div class="item-select">
        <el-row class="row-item">工程名称：{{ detailFromData.projectName }}</el-row>
        <el-row
          class="row-item"
        >施工单位：{{ detailFromData.bidUnitId | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >施工部位： {{ detailFromData.location }}{{ detailFromData.site | accordingIdFindName(filterList) }},{{ detailFromData.floorNum | accordingIdFindName(filterList) }}层</el-row>
        <el-row
          class="row-item"
        >具体位置： {{ detailFromData.seatCode | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >防水涂料品牌： {{ detailFromData.brand | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >防水涂料型号： {{ detailFromData.model | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >涂料设计厚度(mm)： {{ detailFromData.thick | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >开始施工时间： {{ detailFromData.worktime | accordingIdFindName(filterList) | transformDate2 }}</el-row>
      </div>

      <div class="table">
        <el-table
          :data="treatmentListData"
          border
          style="width: 75%"
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column label="问题描述" prop="content" align="center"></el-table-column>
          <el-table-column label="规范条款" prop="tDescribe" align="center"></el-table-column>
          <el-table-column label="问题图片" prop="fileList" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.fileList" :key="item.id">
                <img :src="item.url" width="50" height="50" @click="priviewBigPicture(item.url)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改图片" prop="bimPic" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.bimPic" :key="item.id">
                <img :src="item" width="50" height="50" @click="priviewBigPicture(item)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改后图片" prop="bimUpdatePic" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.bimUpdatePic" :key="item.id">
                <img :src="item" width="50" height="50" @click="priviewBigPicture(item)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改状态" align="center">
            <template slot-scope="scope">{{ scope.row.bimStatus | bimStatus }}</template>
          </el-table-column>
          <el-table-column label="操作" prop="name" align="center">
            <template slot-scope="scope" v-if="scope.row.bimStatus === '1'">
              <el-button
                size="mini"
                type="text"
                class="green"
                icon="el-icon-check"
                @click="showProcess(scope.row, 'pass')"
              >整改通过</el-button>
              <el-button
                size="mini"
                type="text"
                class="red"
                icon="el-icon-close"
                @click="showProcess(scope.row, 'fail')"
              >整改未通过</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="img-upload">
        <el-row class="row-item">检查结果： {{ header.result === '0' ? '不合格' : '合格' }}</el-row>
        <el-row class="row-item" v-if="header.checkInfo.length != 0">
          验收图片：
          <img
            @click="priviewBigPicture(item.url)"
            v-for="(item,index) in header.checkInfo"
            :key="index"
            width="100"
            height="100"
            :src="item.url"
            class="imgs"
          />
        </el-row>
      </div>

      <div class="border"></div>
    </div>

    <div v-for="item in layerListData" :key="item.mainId" class="bigbox">
      <div class="title">
        <div class="text">附加层、涂膜层检查</div>
        <el-button
          class="btn"
          @click="goUpdate(item.mainId, item.parentId, '/gzy/coatingAdditionalLayer/add')"
          v-if="$route.query.isCheck == 1"
        >修改</el-button>
      </div>

      <div class="item-select">
        <el-row class="row-item">工程名称：{{ detailFromData.projectName }}</el-row>
        <el-row
          class="row-item"
        >施工单位：{{ detailFromData.bidUnitId | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >施工部位： {{ detailFromData.location }}{{ detailFromData.site | accordingIdFindName(filterList) }},{{ detailFromData.floorNum | accordingIdFindName(filterList) }}层</el-row>
        <el-row
          class="row-item"
        >具体位置： {{ detailFromData.seatCode | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >防水涂料品牌： {{ detailFromData.brand | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >防水涂料型号： {{ detailFromData.model | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >涂料设计厚度(mm)： {{ detailFromData.thick | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >开始施工时间： {{ detailFromData.worktime | accordingIdFindName(filterList) | transformDate2 }}</el-row>
      </div>

      <div class="table">
        <el-table
          :data="item.tableList"
          border
          style="width: 75%"
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column label="问题描述" prop="content" align="center"></el-table-column>
          <el-table-column label="规范条款" prop="tDescribe" align="center"></el-table-column>
          <el-table-column label="问题图片" prop="fileList" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.fileList" :key="item.id">
                <img :src="item.url" width="50" height="50" @click="priviewBigPicture(item.url)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改图片" prop="bimPic" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.bimPic" :key="item.id">
                <img :src="item" width="50" height="50" @click="priviewBigPicture(item)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改后图片" prop="bimUpdatePic" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.bimUpdatePic" :key="item.id">
                <img :src="item" width="50" height="50" @click="priviewBigPicture(item)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改状态" align="center">
            <template slot-scope="scope">{{ scope.row.bimStatus | bimStatus }}</template>
          </el-table-column>
          <el-table-column label="操作" prop="name" align="center">
            <template slot-scope="scope" v-if="scope.row.bimStatus === '1'">
              <el-button
                size="mini"
                type="text"
                class="green"
                icon="el-icon-check"
                @click="showProcess(scope.row, 'pass')"
              >整改通过</el-button>
              <el-button
                size="mini"
                type="text"
                class="red"
                icon="el-icon-close"
                @click="showProcess(scope.row, 'fail')"
              >整改未通过</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="img-upload">
        <el-row class="row-item">检查结果： {{ item.result === '0' ? '不合格' : '合格' }}</el-row>
        <el-row class="row-item" v-if="item.checkInfo.length != 0">
          验收图片：
          <img
            @click="priviewBigPicture(item.url)"
            v-for="(item,index) in item.checkInfo"
            :key="index"
            width="100"
            height="100"
            :src="item.url"
            class="imgs"
          />
        </el-row>
      </div>

      <div class="border"></div>
    </div>

    <div v-for="item in acceptanceListData" :key="item.mainId" class="bigbox">
      <div class="title">
        <div class="text">涂料防水验收</div>
        <el-button
          class="btn"
          @click="goUpdate(item.mainId, item.parentId, '/gzy/coatingCoilAcceptance/add')"
          v-if="$route.query.isCheck == 1"
        >修改</el-button>
      </div>

      <div class="item-select">
        <el-row class="row-item">工程名称：{{ detailFromData.projectName }}</el-row>
        <el-row
          class="row-item"
        >施工单位：{{ detailFromData.bidUnitId | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >施工部位： {{ detailFromData.location }}{{ detailFromData.site | accordingIdFindName(filterList) }},{{ detailFromData.floorNum | accordingIdFindName(filterList) }}层</el-row>
        <el-row
          class="row-item"
        >具体位置： {{ detailFromData.seatCode | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >防水涂料品牌： {{ detailFromData.brand | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >防水涂料型号： {{ detailFromData.model | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >涂料设计厚度(mm)： {{ detailFromData.thick | accordingIdFindName(filterList) }}</el-row>
        <el-row
          class="row-item"
        >开始施工时间： {{ detailFromData.worktime | accordingIdFindName(filterList) | transformDate2 }}</el-row>

        <el-row class="row-item">
          <div class="body-title">涂料防水验收</div>
        </el-row>

        <el-row class="row-item">涂料防水层的平均厚度实测： {{ item.thickness.value === "0" ? "合格" : "不合格" }}</el-row>
        <el-row class="row-item" v-if="item.thickness.fileList.length > 0">
          <img
            @click="priviewBigPicture(item.url)"
            v-for="(item,index) in item.thickness.fileList"
            :key="index"
            width="100"
            height="100"
            :src="item.url"
            class="imgs"
          />
        </el-row>
        <el-row class="row-item">蓄/淋水试验： {{ item.rainwater.value === "0" ? "淋水" : "蓄水" }}</el-row>
        <el-row class="row-item" v-if="item.rainwater.fileList.length > 0">
          <img
            @click="priviewBigPicture(item.url)"
            v-for="(item,index) in item.rainwater.fileList"
            :key="index"
            width="100"
            height="100"
            :src="item.url"
            class="imgs"
          />
        </el-row>
        <el-row class="row-item">渗漏情况： {{ item.permeate.value === "0" ? "无" : "有" }}</el-row>
        <el-row class="row-item" v-if="item.permeate.fileList.length > 0">
          <img
            @click="priviewBigPicture(item.url)"
            v-for="(item,index) in item.permeate.fileList"
            :key="index"
            width="100"
            height="100"
            :src="item.url"
            class="imgs"
          />
        </el-row>
        <el-row
          class="row-item"
          v-if="item.permeate.value != '0'"
        >蓄/淋水试验渗漏部位复查： {{ item.rainreview.value === "0" ? "淋水" : "蓄水" }}</el-row>
        <el-row class="row-item" v-if="item.rainreview.fileList.length > 0">
          <img
            @click="priviewBigPicture(item.url)"
            v-for="(item,index) in item.rainreview.fileList"
            :key="index"
            width="100"
            height="100"
            :src="item.url"
            class="imgs"
          />
        </el-row>
      </div>

      <div class="img-upload">
        <el-row class="row-item">检查结果： {{ item.result === '0' ? '不合格' : '合格' }}</el-row>
      </div>

      <div class="border"></div>
    </div>

    <div class="footer">
      <el-form
        ref="detailFromData"
        :model="detailFromData"
        label-width="auto"
        v-if="$route.query.checkMark != 0 || $route.query.isReview == 1"
      >
        <div v-if="$route.query.isReview == 1">
          <el-row class="row-item">
            <el-form-item label="复核状态：">
              <el-select
                v-model="detailFromData.checkStatus"
                placeholder="请选择"
                style="width:25%"
                :disabled="$route.query.checkMark != 0"
              >
                <el-option label="通过" value="0"></el-option>
                <el-option label="不通过" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row class="row-item">
            <el-form-item label="复核意见：">
              <el-input
                v-model="detailFromData.checkMark"
                style="width:25%"
                :readonly="$route.query.checkMark != 0"
              ></el-input>
            </el-form-item>
          </el-row>
        </div>
        <div v-else>
          <el-row class="row-item">复核状态： {{ detailFromData.checkStatus == '0' ? '通过' : '不通过' }}</el-row>
          <el-row class="row-item">复核意见： {{ detailFromData.checkMark }}</el-row>
        </div>
      </el-form>

      <div class="btn-box">
        <el-row class="row-button">
          <el-button
            size="medium"
            type="primary"
            @click="review"
            v-if="$route.query.checkMark == 0 && $route.query.isReview == 1"
          >复核</el-button>
          <el-button size="medium" @click="cancel">返回</el-button>
          <el-button size="medium" @click="goCheck" v-if="$route.query.isCheck == 1">继续检查</el-button>
        </el-row>
      </div>
    </div>

    <el-dialog :title="processDialogTitle" :visible.sync="processDialog" width="30%">
      <upload :isChecked="true" :fileList="processFileList" @removefileList="fileRemove"></upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processDialogHide">取 消</el-button>
        <el-button type="primary" @click="processDialogSumbit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="图片预览" :visible.sync="showModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>
  </div>
</template>

<script>
import { maintableList, maintableReview } from "@/http/api.js";
export default {
  data() {
    return {
      currentImg: "",
      token: "",
      userid: "",
      projectId: "",

      showModel: false,

      detailFromData: {
        projectName: "",
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

        result: "0",
        checkInfo: [],
        checkMark: "",
        checkStatus: "",
      },

      header: {
        result: "",
        checkInfo: [],
      },
      footer: {
        result: "",
      },

      treatmentListData: [],
      layerListData: [],
      acceptanceListData: [],

      filterList: [],

      processDialog: false,
      processDialogTitle: "",
      processFileList: [],
      processData: [],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;

    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.projectId = userInfo.currProjectId;

    this.getEchoData();
  },
  methods: {
    cancel() {
      this.$router.push({
        path: "/qualityInspect/mainStructureList",
      });
    },
    goUpdate(mainId, parentId, url) {
      this.$router.push({
        path: url,
        query: {
          mainId: mainId,
          parentId: parentId,
          continue: 1,
        },
      });
    },
    goCheck() {
      let obj = {
        parentId: this.$route.query.parentId,
        continue: 0,
      };
      this.$router.push({
        path: "/gzy/coatingAdditionalLayer/add",
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
          this.detailFromData.projectName = res.data.data.projectName;
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
          const headerData = res.data.data.publiList.filter((item) => {
            return item.codeName === "基层处理检查";
          });
          this.header.mainId = headerData[0].mainId;
          this.header.parentId = headerData[0].parentId;
          headerData[0].bodyParam.forEach((item) => {
            if (item.key === "checkInfo") {
              this.header.checkInfo = eval(item.value);
            }
            if (item.key === "status") {
              this.header.result = item.value;
            }
          });
          this.treatmentListData = [
            ...headerData[0].quessVOList,
            ...headerData[0].otherquessVOList,
          ];
          this.treatmentListData.forEach((item) => {
            item.bimPic = eval(item.bimPic);
            item.bimUpdatePic = eval(item.bimUpdatePic);
          });

          const bodyData = res.data.data.publiList.filter((item) => {
            return item.codeName === "附加层、涂膜层检查";
          });
          bodyData.forEach((item) => {
            item.tableList = [...item.quessVOList, ...item.otherquessVOList];
            item.tableList.forEach((item) => {
              item.bimPic = eval(item.bimPic);
              item.bimUpdatePic = eval(item.bimUpdatePic);
            });
            item.bodyParam.forEach((ele) => {
              if (ele.key === "checkInfo") {
                item.checkInfo = eval(ele.value);
              } else if (ele.key === "status") {
                item.result = ele.value;
              }
            });
            this.layerListData.push(item);
          });

          const footerData = res.data.data.publiList.filter((item) => {
            return item.codeName === "涂料防水验收";
          });
          footerData.forEach((item) => {
            item.bodyParam.forEach((ele) => {
              if (ele.key === "rainwater") {
                item.rainwater = ele.comboxfile;
              } else if (ele.key === "permeate") {
                item.permeate = ele.comboxfile;
              } else if (ele.key === "rainreview") {
                item.rainreview = ele.comboxfile;
              } else if (ele.key === "thickness") {
                item.thickness = ele.comboxfile;
              } else if (ele.key === "status") {
                item.result = ele.value;
              }
            });
            this.acceptanceListData.push(item);
          });

          this.detailFromData.checkMark = res.data.data.checkMark;
          this.detailFromData.checkStatus = res.data.data.checkStatus;
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
     * 复核提交
     * params: param
     * create: by gzy
     * date: 2020-08-20
     */
    async review() {
      let param = {
        token: this.token,
        userid: this.userid,
        tableId: this.$route.query.parentId,
        checkStatus: this.detailFromData.checkStatus,
        checkMark: this.detailFromData.checkMark,
      };

      if (this.detailFromData.checkMark.length === 0) {
        this.$message({ type: "error", message: "请输入复核意见" });
        return false;
      }

      let res = await maintableReview(param);
      if (res.data.status === "0") {
        this.$router.push({
          path: "/qualityInspect/mainStructureList",
        });
      }
    },

    /**
     * 问题描述表格 点击整改操作显示弹窗
     * params:item
     * create by gzy
     * date:2020-8-13
     */
    showProcess(rowData, status) {
      this.processDialog = true;
      this.processData = rowData;
      if (status === "pass") {
        this.processDialogTitle = "整改通过";
      } else {
        this.processDialogTitle = "整改未通过";
      }
    },
    /**
     * 操作整改图片上传弹窗 确定操作
     * params:item
     * create by gzy
     * date:2020-8-13
     */
    processDialogSumbit() {
      let urls = [];
      this.processFileList.forEach((item) => {
        urls.push(item.url);
      });
      if (this.processDialogTitle === "整改通过") {
        this.processPass(this.processData, urls);
      } else {
        this.processFail(this.processData, urls);
      }
    },
    /**
     * 操作整改图片上传弹窗 取消操作
     * params:item
     * create by gzy
     * date:2020-8-13
     */
    processDialogHide() {
      this.processDialog = false;
      this.processFileList = [];
    },
    /**
     * 文件移除
     * params:file,fileList
     * create by gzy
     * date:2020-8-13
     */
    fileRemove(listData) {
      this.processFileList = listData.fileList;
    },

    /**
     * 问题描述表格 点击整改通过
     * params:item
     * create by gzy
     * date:2020-8-6
     */
    async processPass(item, urls) {
      let params = {
        projectId: this.projectId,
        questiondDetailId: item.id,
        bimStatus: "2",
        id: item.id,
        bimId: item.bimId,
        bimUpdatePic: urls,
      };

      let res = await qualityCheckEditQuestionBimStatus(params);
      if (res.data.status === "0") {
        this.getEchoData();
        this.processDialog = false;
        this.$message({ type: "success", message: res.data.message });
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },
    /**
     * 问题描述表格 点击整改未通过
     * params:item
     * create by gzy
     * date:2020-8-6
     */
    async processFail(item, urls) {
      let params = {
        projectId: this.projectId,
        questiondDetailId: item.id,
        bimStatus: "0",
        id: item.id,
        bimId: item.bimId,
        bimUpdatePic: urls,
      };

      let res = await qualityCheckEditQuestionBimStatus(params);
      if (res.data.status === "0") {
        this.getEchoData();
        this.processDialog = false;
        this.$message({ type: "success", message: res.data.message });
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },
  },
};
</script>

<style scoped lang='less'>
.bigbox {
  margin-bottom: 40px;
  .title {
    width: 75%;
    margin-left: 40px;
    .text {
      display: inline-block;
      font-size: 18px;
      border-left: 5px solid #409eff;
      padding-left: 10px;
      font-weight: normal;
      height: 30px;
      line-height: 30px;
    }
    .btn {
      margin-left: 310px;
      float: right;
    }
  }
  .border {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    border-bottom: 1px solid #ccc;
  }
}

.item-select {
  width: 600px;
  margin: 20px 40px;
  .row-item {
    padding: 20px 0;
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
  .imgs {
    display: inline-block;
    padding: 0 10px;
  }
}

.img-upload {
  width: 200px;
  margin: 20px 40px;
  .row-item {
    padding: 20px 0;
  }
  .imgs {
    display: inline-block;
    padding: 0 10px;
  }
}

.table {
  width: 100%;
  margin-left: 40px;
}

.footer {
  margin-left: 90px;
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