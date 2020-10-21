<template>
  <div>
    <div class="item-select">
      <el-row class="row-item">工程名称：{{ projectName }}</el-row>
      <el-row class="row-item">施工单位：{{ detailFromData.bidUnitId | accordingIdFindName(filterList) }}</el-row>
      <el-row
        class="row-item"
      >施工部位： {{ detailFromData.location }}{{ detailFromData.site | accordingIdFindName(filterList) }},{{ detailFromData.floorNum | accordingIdFindName(filterList) }}层</el-row>
      <el-row class="row-item">具体位置： {{ detailFromData.seatCode | accordingIdFindName(filterList) }}</el-row>
      <el-row class="row-item">防水卷材品牌： {{ detailFromData.brand | accordingIdFindName(filterList) }}</el-row>
      <el-row class="row-item">防水卷材型号： {{ detailFromData.model | accordingIdFindName(filterList) }}</el-row>
      <el-row
        class="row-item"
      >卷材设计厚度(mm)： {{ detailFromData.thick | accordingIdFindName(filterList) }}</el-row>
      <el-row
        class="row-item"
      >开始施工时间： {{ detailFromData.worktime | accordingIdFindName(filterList) | transformDate2 }}</el-row>
    </div>

    <div class="table">
      <el-table
        :data="tableData"
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
          <template slot-scope="scope">
            <span v-if="scope.row.bimStatus === '1' ">
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
            </span>
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-delete"
              @click="deleteItem(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="img-upload">
      <el-row class="row-item">检查结果： {{ this.detailFromData.result === '0' ? '不合格' : '合格' }}</el-row>
      <el-row class="row-item" v-if="detailFromData.checkInfo.length != 0">
        验收图片：
        <img
          @click="priviewBigPicture(item.url)"
          v-for="(item,index) in detailFromData.checkInfo"
          :key="index"
          width="100"
          height="100"
          :src="item.url"
          class="imgs"
        />
      </el-row>
    </div>

    <div class="btn-box">
      <el-row class="row-button">
        <el-button size="medium" type="primary" @click="submit">提交</el-button>
        <el-button size="medium" @click="update" v-if="this.$route.query.continue != 1">修改</el-button>
        <el-button size="medium" @click="cancel" v-else>返回</el-button>
      </el-row>
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
import {
  baseListNothing,
  qualityInspectQueryunit,
  getBuildList,
  getFloorByBuild,
  maintableList,
  maintableUpdate,
  qualityCheckEditQuestionBimStatus,
} from "@/http/api.js";
export default {
  data() {
    return {
      token: "",
      userid: "",
      projectName: "",
      projectId: "",
      currentImg: "",
      tableId: "",
      mainId: "",
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
        checkInfo: [],
      },
      baseMentList: [],
      floorList: [],
      tableData: [],
      filterList: [],
      showModel: false,

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
    this.projectName = userInfo.currProjectName;
    this.projectId = userInfo.currProjectId;

    if (this.$route.query.parentId) {
      this.getEchoData();
    }
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
          this.tableData = [
            ...res.data.data.publiList[0].quessVOList,
            ...res.data.data.publiList[0].otherquessVOList,
          ];
          this.tableData.forEach((item) => {
            item.bimPic = eval(item.bimPic);
            item.bimUpdatePic = eval(item.bimUpdatePic);
          });
          this.tableId = res.data.data.tableId;
          this.mainId = res.data.data.publiList[0].mainId;
          // 底部信息处理
          res.data.data.publiList[0].bodyParam.forEach((item) => {
            if (item.key === "status" && item.value != "") {
              this.detailFromData.result = item.value;
            }
            if (item.key === "checkInfo" && item.value != "") {
              this.detailFromData.checkInfo = eval(item.value);
            }
          });
        }
      }
    },
    /**
     * 修改跳转
     * params: param
     * create by gzy
     * date: 2020-08-24
     */
    update() {
      this.$router.push({
        path: "/gzy/coilAdditionalLayer/add",
        query: {
          parentId: this.$route.query.parentId,
          mainId: this.$route.query.mainId,
          continue: 1,
        },
      });
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
     * 删除某条数据
     * params：{item,index}
     * create by gzy
     * date:2020-08-19
     */
    deleteItem(item) {
      this.tableData = this.tableData.filter(
        (listItem) => listItem.id !== item.id
      );

      if (this.tableData.length === 0) {
        this.detailFromData.result = "1";
      } else {
        this.detailFromData.result = "0";
      }
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
        projectId: this.projectId, // 项目id
        bidUnitId: this.detailFromData.bidUnitId, // 施工单位id
        isMain: "0",
        isMany: "1",
        isQuestion: this.tableData.length > 0 ? "1" : "0", // 是否含有问题项
        tcode: "040102030102", // 问题id
        mainId: this.mainId,
        tableId: this.tableId,

        seatCode: this.detailFromData.seatCode, // 具体位置
        buildId: this.detailFromData.site,
        floorNum: this.detailFromData.floorNum,
        brand: this.detailFromData.brand, // 品牌
        model: this.detailFromData.model, // 型号
        thick: this.detailFromData.thick, // 厚度
        tableList: this.tableData,
        worktime: this.detailFromData.worktime.toString(), // 施工时间
        status: this.detailFromData.result, // 合格1 不合格0
        checkInfo: this.detailFromData.checkInfo, // 验收图片
      };

      // 楼栋号 地下室处理
      // if (this.detailFromData.location === "楼栋号") {
      //   param.bidUnitId = this.detailFromData.site;
      // } else {
      //   param.bidBasementId = this.detailFromData.site;
      // }

      let res = await maintableUpdate(param);
      if (res.data.status === "0") {
        this.$router.push({
          path: "/qualityInspect/mainStructureList",
        });
      } else {
        this.$message({ type: "error", message: res.data.message });
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
.item-select {
  width: 600px;
  margin: 40px 0 0 40px;
  .row-item {
    margin-top: 20px;
    span {
      width: 140px;
      display: inline-block;
      color: #999;
      font-size: 14px;
    }
  }
}

.table {
  margin-top: 20px;
  margin-left: 40px;
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

.img-upload {
  width: 200px;
  margin-left: 40px;
  margin-top: 20px;
}

.imgs {
  margin-right: 20px;
}
</style>