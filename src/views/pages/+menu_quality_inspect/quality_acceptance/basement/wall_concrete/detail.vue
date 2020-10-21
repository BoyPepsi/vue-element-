<template>
  <div class="item-select">
    <el-form :model="addCheckForm" label-width="100px">
      <el-row class="row-item">
        <el-form-item label="项目名称:">{{ projectName }}</el-form-item>
      </el-row>
      <el-row class="row-item">
        <el-form-item
          prop="bidBasementId"
          label="施工部位:"
        >{{ addCheckForm.bidBasementId | accordingIdFindName(filterList) }}</el-form-item>
      </el-row>
      <el-row class="row-item">
        <el-form-item
          prop="bidUnitId"
          label="施工单位:"
        >{{ addCheckForm.bidUnitId | accordingIdFindName(filterList) }}</el-form-item>
      </el-row>
      <el-row class="row-item">
        <el-form-item label="墙柱楼层:">{{ addCheckForm.wallNum | accordingIdFindName(filterList) }}</el-form-item>
      </el-row>
      <el-row class="row-item">
        <el-form-item label="梁板楼层:">{{ addCheckForm.beamNum | accordingIdFindName(filterList) }}</el-form-item>
      </el-row>
      <el-row class="row-item">
        <el-form-item
          label="商混供应单位:"
        >{{ addCheckForm.mixedUnitId | accordingIdFindName(filterList) }}</el-form-item>
      </el-row>
    </el-form>

    <!-- /=====================================  以上是头部信息 ===========================================/ -->

    <!-- /========================================== 主表信息===================================================/ -->

    <div>
      <div class="table-title">
        <div class="word">混凝土浇筑前检查</div>
        <div>
          <el-button @click="editMain" v-if="review != 1 && isDetail != 1">修改</el-button>
        </div>
      </div>
      <el-row>
        <p>汽车泵:{{addCheckForm.carPumps}}</p>
        <p>地泵:{{addCheckForm.landPumps}}</p>
        <p>振动棒:{{addCheckForm.vibrateSpear}}</p>
        <p>泥工人数:{{addCheckForm.people}}</p>
      </el-row>
      <div class="table" v-if="tableArr.length > 0">
        <el-table
          :data="tableArr"
          border
          style="width: 100% ;margin-left:15px"
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column prop="mergePostion" label="部位" align="center"></el-table-column>
          <el-table-column prop="content" label="问题描述" align="center"></el-table-column>
          <el-table-column prop="tDescribe" label="规范条款" align="center"></el-table-column>
          <el-table-column label="问题图片" prop="fileList" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.fileList" :key="item.id">
                <img :src="item.url" width="50" height="50" @click="previewImg(item.url)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改图片" prop="bimPic" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.bimPic" :key="item.id">
                <img :src="item" width="50" height="50" @click="previewImg(item)" />
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
          <el-table-column label="操作" align="center">
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
              <!--   <el-button
                size="mini"
                type="text"
                class="red"
                icon="el-icon-delete"
                @click="deleteItem(scope.row,index)"
                v-if="isDetail == false"
              >删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row class="mix-info">混凝土信息</el-row>
        <el-table
          :data="mixInfoList"
          border
          style="width: 100% ;margin-left:15px"
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column prop="level" label="标号及抗渗等级" align="center"></el-table-column>
          <el-table-column prop="application" label="使用位置" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.application == '1'? '墙柱':'梁板'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="plan" label="预计方量(立方)" align="center"></el-table-column>
        </el-table>
        <el-row class="status">
          <span>检查结果:</span>
          <el-select
            placeholder="请选择"
            v-model="addCheckForm.status"
            style="width:78%"
            :disabled="true"
            class="no-down"
          >
            <el-option key="0" label="不合格" value="0"></el-option>
            <el-option key="1" label="合格" value="1"></el-option>
          </el-select>
        </el-row>
      </div>

      <el-row class="infos" v-if="addCheckForm.checkInfo.length != 0">
        <h3>验收信息</h3>
        <p>验收图片:</p>
        <img
          @click="priviewBigPicture(img.url)"
          style="width:100px;height:100px;marginRight:20px"
          v-for="(img, index) in addCheckForm.checkInfo"
          :key="index"
          :src="img.url"
          alt
        />
      </el-row>

      <el-row class="status" v-else></el-row>
    </div>

    <div class="child-list" v-for="(item,index) in childList" :key="item.ywid">
      <div class="table-title" style="border-top:0">
        <div class="word">混凝土浇筑过程中检查</div>
        <div>
          <el-button @click="editChild(item.mainId)" v-if="review != 1 && isDetail != 1">修改</el-button>
        </div>
      </div>
      <el-row>
        <p>汽车泵:{{item.carPumps}}</p>
        <p>地泵:{{item.landPumps}}</p>
        <p>振动棒:{{item.vibrateSpear}}</p>
        <p>泥工人数:{{item.people}}</p>
        <p>混凝土开始时间: {{item.mixInfoTime | transformDate2}}</p>
        <p>提交人员: {{item.createtor}}</p>
        <p>提交时间: {{item.createTime | transformDate2}}</p>
        <p>混凝土是否已浇筑完成: {{item.mixedStatus == '0'? '未完成':'已完成' }}</p>
      </el-row>
      <el-row>
        <el-table
          :data="item.tableList"
          border
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column prop="mergePostion" label="部位" align="center"></el-table-column>
          <el-table-column prop="content" label="问题描述" align="center"></el-table-column>
          <el-table-column prop="tDescribe" label="规范条款" align="center"></el-table-column>
          <el-table-column label="问题图片" prop="fileList" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.fileList" :key="item.id">
                <img :src="item.url" width="50" height="50" @click="previewImg(item.url)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="整改图片" prop="bimPic" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.bimPic" :key="item.id">
                <img :src="item" width="50" height="50" @click="previewImg(item)" />
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
          <el-table-column label="操作" align="center">
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
                @click="deleteChildItem(scope.row,index)"
                v-if="isDetail == false"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="status">
        <span>检查结果:</span>
        <el-select
          placeholder="请选择"
          v-model="item.status"
          style="width:78%"
          :disabled="true"
          class="no-down"
        >
          <el-option key="0" label="不合格" value="0"></el-option>
          <el-option key="1" label="合格" value="1"></el-option>
        </el-select>
      </el-row>

      <el-row>
        <p>混凝土坍落度实测</p>
        <el-table
          :data="item.mixedInfoReal"
          border
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column prop="content" label="描述" align="center"></el-table-column>
          <el-table-column label="图片" prop="fileList" align="center">
            <template slot-scope="scope">
              <div v-for="ele in scope.row.fileList" :key="ele.id">
                <img :src="ele.url" width="50" height="50" @click="priviewBigPicture(ele.url)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row class="infos" v-if="item.allThoseMark != '' || item.checkInfo.length != 0">
        <h3>验收信息</h3>
        <!-- <p>内容: {{ item.allThoseMark }}</p> -->
        <p>验收图片:</p>
        <img
          @click="priviewBigPicture(img.url)"
          style="width:100px;height:100px;marginRight:20px"
          v-for="(img, index) in item.checkInfo"
          :key="index"
          :src="img.url"
          alt
        />
      </el-row>
    </div>

    <el-row class="checke-status-choice" v-if="review == 1 && ischeckMark.length == 0">
      <span style="color:red">*</span>
      <span style="margin-right: 15px;">复核结果:</span>
      <el-select placeholder="请选择" v-model="checkStatus" style="width:20%">
        <el-option key="0" label="不合格" value="0"></el-option>
        <el-option key="1" label="合格" value="1"></el-option>
      </el-select>
    </el-row>

    <el-row class="checke-status-choice" v-if="ischeckMark.length > 0">
      <span style="margin-right: 15px;">复核结果:</span>
      <el-select
        placeholder="请选择"
        v-model="checkStatus"
        style="width:20%"
        :disabled="true"
        class="no-down"
      >
        <el-option key="0" label="不合格" value="0"></el-option>
        <el-option key="1" label="合格" value="1"></el-option>
      </el-select>
    </el-row>

    <el-row class="review" v-if="review == 1 && ischeckMark.length == 0">
      <el-col :span="1.5" style="margin-right: 15px;">
        <span style="color:red">*</span>复核意见:
      </el-col>
      <el-col :span="11">
        <el-input type="textarea" v-model="checkMark"></el-input>
      </el-col>
    </el-row>

    <el-row class="review" v-if="ischeckMark.length > 0">
      <el-col :span="1.5" style="margin-right: 15px;">复核意见:</el-col>
      <el-col :span="10">
        <span>{{checkMark}}</span>
      </el-col>
    </el-row>

    <div class="btn-box">
      <el-row class="row-item row-button">
        <el-button
          size="medium"
          type="primary"
          @click="goToList"
          v-if="ischeckMark.length == 0 && isDetail == false && review != 1"
        >确定</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="reviewUpdate"
          v-if="ischeckMark.length == 0 && isDetail == false && review == 1"
        >复核</el-button>
        <el-button
          size="medium"
          @click="checkChild"
          v-if="ischeckMark.length == 0 && isDetail == false && review != 1"
        >继续检查子表</el-button>
        <el-button
          size="medium"
          @click="cancel"
          v-if="ischeckMark.length > 0 || isDetail == true"
        >返回</el-button>
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
  maintableList,
  maintableReview,
  qualityInspectQueryunit,
  qualityCheckBaseBetonUpdate,
  qualityCheckBaseBetonCheckAdd,
  baseList,
  baseListNothing,
  qualityCheckEditQuestionBimStatus, // 整改操作
  continuecheck,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import { getDate } from "@/utils/transformDate.js";
import { getDate2 } from "@/utils/transformDate2.js";
export default {
  name: "acceptanceRaftRebarDetail",
  data() {
    return {
      code: "",
      projectId: "",
      projectName: "",
      userid: "",
      token: "",
      addCheckForm: {
        bidBasementId: "",
        bidUnitId: "",
        wallNum: "",
        beamNum: "",
        mixedUnitId: "",
        carPumps: "",
        landPumps: "",
        vibrateSpear: "",
        people: "",
      },
      filterList: [],

      baseMentList: [],
      unitList: [],
      tabledata: [],
      id: "",
      mainId: "",
      status: "",
      tableArr: [],
      mixInfoList: [],
      checkMark: "",
      ischeckMark: "",
      review: 0,
      checkStatus: "",
      otherList: [],
      childList: [],
      showModel: false,
      currentImg: "",
      isDetail: false,
      listData: [],
      processDialog: false,
      processDialogTitle: "",
      processFileList: [],
      processData: [],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.projectId = userInfo.currProjectId;
    this.projectName = userInfo.currProjectName;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    if (this.$route.query) {
      this.code = this.$route.query.code;
    }
    if (this.$route.query.tableId) {
      this.id = this.$route.query.tableId;
      this.getChcekedData();
    }

    if (this.$route.query.review) {
      this.review = this.$route.query.review;
    }
    if (this.$route.query.isDetail) {
      this.isDetail = true;
    }
    this.getBaseMentList();
  },
  methods: {
    previewImg(url) {
      this.showModel = true;
      this.currentImg = url;
    },
    /**
     * 获取回选数据
     * params:none
     * create by YuXiong
     * date:2020-7-7
     */
    async getChcekedData() {
      let params = {
        token: this.token,
        userid: this.userid,
        parentId: this.$route.query.tableId,
        pageNum: 1,
        pageSize: 10000,
      };
      let res = await maintableList(params);
      if (res.data.status === "0") {
        if (res.data.data.headParam && res.data.data.headParam.length != 0) {
          // 头部信息处理
          this.filterList = res.data.data.headParam;
          this.addCheckForm = this.$formMap(
            res.data.data.headParam,
            this.addCheckForm
          );
          this.checkStatus = res.data.data.checkStatus;
          this.checkMark = res.data.data.checkMark;
          this.ischeckMark = res.data.data.checkMark;
          this.projectName = res.data.data.projectName;
          res.data.data.headParam.forEach((item) => {
            if (item.key == "mixedInfo" && item.value != "") {
              this.mixInfoList = eval(item.value);
            }
          });

          // 表格处理
          const headerData = res.data.data.publiList.filter((item) => {
            return item.codeName === "混凝土浇筑前检查";
          });
          this.mainId = headerData[0].mainId;
          headerData[0].bodyParam.forEach((item) => {
            if (item.key == "carPumps" && item.value != "") {
              this.addCheckForm.carPumps = item.value;
            } else if (item.key == "landPumps" && item.value != "") {
              this.addCheckForm.landPumps = item.value;
            } else if (item.key == "vibrateSpear" && item.value != "") {
              this.addCheckForm.vibrateSpear = item.value;
            } else if (item.key == "people" && item.value != "") {
              this.addCheckForm.people = item.value;
            } else if (item.key == "status" && item.value != "") {
              this.addCheckForm.status = item.value;
            } else if (item.key == "checkInfo" && item.value != "") {
              this.addCheckForm.checkInfo = eval(item.value);
            }
          });
          console.log(this.addCheckForm);
          this.tableArr = [
            ...headerData[0].quessVOList,
            ...headerData[0].otherquessVOList,
          ];
          this.tableArr.forEach((item) => {
            item.bimPic = eval(item.bimPic);
            item.bimUpdatePic = eval(item.bimUpdatePic);
          });
          const bodyData = res.data.data.publiList.filter((item) => {
            return item.codeName === "混凝土浇筑过程检查";
          });
          bodyData.forEach((item) => {
            let obj = {
              allThoseMark: "",
            };
            obj.tableList = [...item.quessVOList, ...item.otherquessVOList];
            obj.tableList.forEach((item) => {
              item.bimPic = eval(item.bimPic);
              item.bimUpdatePic = eval(item.bimUpdatePic);
            });
            obj.createTime = item.createTime;
            obj.mainId = item.mainId;
            item.bodyParam.forEach((ele) => {
              if (ele.key == "carPumps" && ele.value != "") {
                obj.carPumps = ele.value;
              } else if (ele.key == "landPumps" && ele.value != "") {
                obj.landPumps = ele.value;
              } else if (ele.key == "vibrateSpear" && ele.value != "") {
                obj.vibrateSpear = ele.value;
              } else if (ele.key == "people" && ele.value != "") {
                obj.people = ele.value;
              } else if (ele.key == "mixInfoTime" && ele.value != "") {
                obj.mixInfoTime = ele.value;
              } else if (ele.key == "createtor" && ele.value != "") {
                obj.createtor = ele.value;
              } else if (ele.key == "createTime" && ele.value != "") {
                obj.createTime = ele.value;
              } else if (ele.key == "mixedStatus" && ele.value != "") {
                obj.mixedStatus = ele.value;
              } else if (ele.key == "mixedInfoReal" && ele.value != "") {
                obj.mixedInfoReal = eval(ele.value);
              } else if (ele.key == "status" && ele.value != "") {
                obj.status = ele.value;
              } else if (ele.key == "allThoseMark" && ele.value != "") {
                obj.allThoseMark = ele.value;
              } else if (ele.key == "checkInfo" && ele.value != "") {
                obj.checkInfo = eval(ele.value);
              }
            });
            console.log(obj);
            this.childList.push(obj);
          });
        }
      }
    },

    /**
     * 数据转换
     * params:list
     * create by YuXiong
     * date:2020-7-16
     *
     */
    mapList(list, otherList) {
      list.forEach((item) => {
        item.list.forEach((childItem) => {
          if (childItem.checkId && childItem.checkId !== "202012345678") {
            childItem.imgList = childItem.questionContenVO;
            if (otherList) {
              otherList = [];
            }
          } else {
            childItem.checkId = "202012345678";
            childItem.questionId = "202012345678";
            childItem.checkPic = childItem.fileList;
            childItem.imgList = childItem.fileList;
            childItem.questionConten = childItem.fileList;
            if (otherList) {
              otherList.push(childItem);
            }
          }
        });
      });
    },
    /**
     * 获取地下室列表
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    async getBaseMentList() {
      let params = {
        pageNum: 1,
        pageSize: 10000,
        projectid: this.projectId,
        type: "1",
      };
      // let res = await baseList(params);
      let res = await baseListNothing(params);
      if (res.data.status === "0") {
        this.baseMentList = res.data.data.list;
      } else {
        this.baseMentList = [];
      }
    },

    /**
     * 获取施工单位列表
     * params：code
     * create by YuXiong
     * date:2020-7-1
     */
    async getUnitList(bid) {
      this.unitList = [];
      let params = {
        bid: bid,
        token: this.token,
        userid: this.userid,
      };
      try {
        let res = await qualityInspectQueryunit(params);
        if (res.data.status === "0") {
          this.unitList = res.data.data.unitlist;
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this.unitList = [];
        }
      } catch (error) {
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
        projectId: this.listData.qualityTableMainBasePO.projectId,
        questiondDetailId: item.id,
        bimStatus: "2",
        id: this.listData.qualityTableMainBasePO.id,
        bimId: item.bimId,
        bimUpdatePic: urls,
      };

      try {
        let res = await qualityCheckEditQuestionBimStatus(params);
        if (res.data.status === "0") {
          this.getChcekedData();
          this.processDialog = false;
          this.$message({ type: "success", message: res.data.message });
        }
      } catch (error) {
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
        projectId: this.listData.qualityTableMainBasePO.projectId,
        questiondDetailId: item.id,
        bimStatus: "0",
        id: this.listData.qualityTableMainBasePO.id,
        bimId: item.bimId,
        bimUpdatePic: urls,
      };

      try {
        let res = await qualityCheckEditQuestionBimStatus(params);
        if (res.data.status === "0") {
          this.getChcekedData();
          this.processDialog = false;
          this.$message({ type: "success", message: res.data.message });
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },
    /**
     * 删除某条数据
     * params：{item,index}
     * create by YuXiong
     * date:2020-7-6
     */
    deleteItem(item, index) {
      this.tableArr.forEach((ele, i) => {
        if (i === index) {
          ele.list = ele.list.filter((listItem) => listItem.id !== item.id);
        }
      });
      this.tableArr.forEach((ele) => {
        if (ele.list.length === 0) {
          ele.status = "1";
        }
      });
    },

    /**
     * 删除子表某条数据
     * params：{item,index}
     * create by YuXiong
     * date:2020-7-6
     */
    deleteChildItem(item, index) {
      this.childList.forEach((ele, i) => {
        if (i === index) {
          ele.list = [
            ...ele.list.filter((listItem) => listItem.id !== item.id),
          ];
          this.$forceUpdate();
        }
      });
      this.childList.forEach((ele) => {
        if (ele.list.length === 0) {
          ele.status = "1";
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
     * 复核提交
     * params: param
     * create: by gzy
     * date: 2020-08-20
     */
    async reviewUpdate() {
      let param = {
        token: this.token,
        userid: this.userid,
        tableId: this.$route.query.tableId,
        checkMark: this.checkMark,
        checkStatus: this.checkStatus,
      };
      if (this.review > 0 && this.checkMark.length === 0) {
        this.$message({ type: "error", message: "复核意见必须填写!" });
        return false;
      }
      if (this.review > 0 && this.checkStatus == "") {
        this.$message({ type: "error", message: "复核结果必须选择!" });
        return false;
      }

      let res = await maintableReview(param);
      if (res.data.status === "0") {
        this.$router.push({
          path: "/qualityInspect/mainStructureList",
        });
      }
    },

    goToList() {
      this.$router.push({
        path: "/qualityInspect/mainStructureList",
      });
    },
    /**
     *修改
     * params:none
     * create by YuXiong
     * date:2020-7-7
     */
    goToAdd() {
      this.$router.push({
        path: "/acceptanceWallRebar/add",
        query: {
          code: this.code, // 检查分项
          id: this.id,
          review: this.review,
        },
      });
    },
    /**
     *修改主表
     * params:none
     * create by YuXiong
     * date:2020-7-15
     */
    editMain() {
      this.$router.push({
        path: "/acceptanceWallConcrete/add",
        query: {
          tableId: this.id,
          mainId: this.mainId,
          isUpdate: "1",
          review: this.review,
        },
      });
    },

    /**
     *修改子表
     * params:none
     * create by YuXiong
     * date:2020-7-15
     */
    editChild(mainId) {
      this.$router.push({
        path: "/acceptanceWallConcreteChild/add",
        query: {
          tableId: this.id,
          mainId: mainId,
          isUpdate: "1",
          review: this.review,
        },
      });
    },
    /**
     *检查子表
     * params:none
     * create by YuXiong
     * date:2020-7-15
     */
    async checkChild() {
      let params = {
        tableId: this.id,
      };
      let res = await continuecheck(params);
      if (res.data.data === "0") {
        this.$router.push({
          path: "/acceptanceWallConcreteChild/add",
          query: {
            code: this.code, // 检查分项
            review: this.review,
            tableId: this.id,
            isUpdate: "1",
          },
        });
      } else {
        this.$message({ type: "warning", message: res.data.message });
      }
    },
    /**
     * 点击取消，退回列表页
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang='less'>
.list-item {
  width: 1200px;
  margin: 40px 0 0 40px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 20px;
  .row-item {
    margin-left: 0 !important;
    margin-right: 0 !important;
    color: #000;
  }

  .item-button {
    width: 120px;
    height: 30px;
    padding: 0;
  }
  .right {
    text-align: right;
  }
}
/deep/ .el-form-item__content {
  color: #999 !important;
}
.red-span {
  color: #f00;
}
.row-upload {
  margin: 20px 0 0 0;
  overflow: hidden;
  padding-right: 20px;
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
/deep/ textarea {
  height: 80px;
}
.item-select {
  width: 1200px;
  margin: 40px 0 40px 40px;
  .row-item {
    span {
      width: 140px;
      display: inline-block;
      color: #000;
      font-size: 14px;
    }
  }
}
/deep/.el-input.is-disabled .el-input__inner {
  background-color: transparent;
  border: 0;
}

/deep/ .no-down.el-select .el-input .el-select__caret {
  display: none;
}
.status {
  margin: 10px 0 0 10px;
  color: #000;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 15px;
  span {
    font-size: 14px;
    color: #999;
  }
}
.check-status {
  margin: 20px 0;
  span {
    margin: 10px;
  }
}
.input-list {
  width: 1200px;
  color: #999;
  margin-left: 10px;
  font-size: 14px;
  .img-wrap {
    margin-top: 20px;
  }
}
.review {
  margin-top: 40px;
  color: #999;
  font-size: 14px;
}
.title {
  /deep/ .el-input.is-disabled .el-input__inner {
    color: #409eff;
    font-size: 16px;
  }
}
.red {
  color: #f00;
}
.no-boder {
  background-color: transparent;
  border: 0;
  padding: 0 0 0 15px;
  margin: 20px 0 0 0;
  resize: none;
  span {
    margin-left: 15px;
  }
}
.img-item {
  float: left;
  margin-left: 20px;
  padding-bottom: 10px;
}
/deep/ .el-form-item {
  margin-bottom: 0;
}
/deep/ .el-form-item__label {
  text-align: left;
  width: 100px;
}
.table-title {
  height: 60px;
  display: flex;
  justify-content: space-between;
  margin: 20px 0 10px 0;
  border-top: 1px dashed #ccc;
  padding-top: 20px;
  .word {
    font-size: 18px;
    color: #333;
    border-left: 5px solid #409eff;
    padding-left: 10px;
    font-weight: normal;
    height: 30px;
    line-height: 30px;
  }
}
.table {
  margin-left: -15px;
}
.mix-info {
  font-size: 14px;
  line-height: 60px;
  padding-left: 15px;
}
.child-list {
  p {
    font-size: 14px;
    color: #999;
  }
}
.checke-status-choice {
  margin-top: 40px;
  border-top: 1px dashed #ccc;
  padding-top: 20px;
  font-size: 14px;
  color: #999;
}
.infos {
  margin-top: 30px;
  border-top: 1px dotted #ccc;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 20px;
}
</style>