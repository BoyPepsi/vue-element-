<template>
  <div id="wrap">
    <div class="form">
      <div>上午</div>
      <div class="input-item">
        <el-input v-model="baseInfo[0].weather">
          <template slot="prepend">天气情况：</template>
        </el-input>
      </div>
      <div class="input-item">
        <el-input v-model="baseInfo[0].air">
          <template slot="prepend">气温（℃）：</template>
        </el-input>
      </div>
      <div class="input-item">
        <el-input v-model="baseInfo[0].temperature">
          <template slot="prepend">湿度：</template>
        </el-input>
      </div>
      <div class="input-item">
        <el-input v-model="baseInfo[0].wind">
          <template slot="prepend">风向：</template>
        </el-input>
      </div>
      <div class="input-item">
        <el-input v-model="baseInfo[0].windpow">
          <template slot="prepend">风力：</template>
        </el-input>
      </div>
      <div>下午</div>
      <div class="input-item">
        <el-input v-model="baseInfo[1].weather">
          <template slot="prepend">天气情况：</template>
        </el-input>
      </div>
      <div class="input-item">
        <el-input v-model="baseInfo[1].air">
          <template slot="prepend">气温（℃）：</template>
        </el-input>
      </div>
      <div class="input-item">
        <el-input v-model="baseInfo[1].temperature">
          <template slot="prepend">湿度：</template>
        </el-input>
      </div>
      <div class="input-item">
        <el-input v-model="baseInfo[1].wind">
          <template slot="prepend">风向：</template>
        </el-input>
      </div>
      <div class="input-item">
        <el-input v-model="baseInfo[1].windpow">
          <template slot="prepend">风力：</template>
        </el-input>
      </div>
    </div>
    <h3>材料、设备、构配件情况</h3>
    <textarea v-model="template1"></textarea>
    <h3>监理工作情况（导入土建质量、安装质量、安全等内容）</h3>
    <el-row class="tmp2-check">
      <el-select placeholder="请选择" v-model="tmp2Type" style="width:100%" clearable>
        <el-option
          v-for="item in tmp2TypeList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-row>
    <textarea v-model="template2" :disabled="tmp2Type.length > 0"></textarea>
    <h3>测量定位复核</h3>
    <textarea v-model="template3"></textarea>
    <h3>工程验收情况</h3>
    <textarea v-model="template4"></textarea>
    <h3>
      <span>现场存在问题</span>
      <!-- <span class="right" @click="showModel">修改</span> -->
    </h3>
    <textarea v-model="template5"></textarea>
    <h3>现场周检、例会专题会议情况</h3>
    <div class="log-upload">
      <upload
        id="logUpdate8"
        :fileList="fileList6"
        :isChecked="true"
        @removefileList="removefileList($event,6)"
      ></upload>
    </div>
    <div class="log-upload log-upload-pdf">
      <uploadFile fileaccept=".PDF,.pdf" ref="weekfileurl"></uploadFile>
    </div>
    <h3>培训、交底、识图情况</h3>
    <div class="log-upload">
      <upload
        id="logUpdate7"
        :fileList="fileList7"
        :isChecked="true"
        @removefileList="removefileList($event,7)"
      ></upload>
    </div>
    <div class="log-upload log-upload-pdf">
      <uploadFile fileaccept=".PDF,.pdf" ref="trainfileurl"></uploadFile>
    </div>
    <h3>签证、变更原始资料登记</h3>
    <div class="log-upload">
      <upload
        id="logUpdate8"
        :fileList="fileList8"
        :isChecked="true"
        @removefileList="removefileList($event,8)"
      ></upload>
    </div>
    <div class="log-upload log-upload-pdf">
      <uploadFile fileaccept=".PDF,.pdf" ref="visafileurl"></uploadFile>
    </div>
    <h3>图纸会审、规划（方案）审查、监理规划（细则）编制、专家论证</h3>
    <textarea v-model="trial"></textarea>
    <h3>考察情况</h3>
    <textarea v-model="expedition"></textarea>
    <h3>其他项目(包括：第三方检查、建管站检查、公司检查、业主领导检查等)</h3>
    <div class="log-upload">
      <upload
        id="logUpdate8"
        :fileList="fileList9"
        :isChecked="true"
        @removefileList="removefileList($event,9)"
      ></upload>
    </div>
    <div class="log-upload log-upload-pdf">
      <uploadFile fileaccept=".PDF,.pdf" ref="otherfileurl"></uploadFile>
    </div>
    <div class="actions">
      <el-button size="medium" @click="save" type="primary">保存</el-button>
      <el-button size="medium" @click="goBack">返回</el-button>
    </div>

    <el-dialog title="现场存在问题" :visible.sync="showQuestionModel" width="800px" center>
      <div class="full-check">
        <el-checkbox class="check-word" v-model="fullChecked" @change="fullCheckedChange">全选</el-checkbox>
      </div>
      <div class="question-list" v-for="(item,index) in template6.list" :key="index">
        <h3>{{item.codeName}}</h3>
        <el-row class="check-input" v-for="(item,i) in item.detalList" :key="i">
          <el-checkbox
            class="check-word"
            v-model="item.isChecked"
            @change="checkboxChange"
          >{{item.content}}</el-checkbox>
        </el-row>
      </div>
      <el-row>监理通知单:</el-row>
      <el-row class="check-textarea">
        <el-input type="textarea" v-model="noticeInfo" maxlength="300"></el-input>
      </el-row>
      <el-row>工程暂停单:</el-row>
      <el-row class="check-textarea">
        <el-input type="textarea" v-model="projectStopInfo" maxlength="300"></el-input>
      </el-row>
      <el-row>建管部门函件:</el-row>
      <el-row class="check-textarea">
        <el-input type="textarea" v-model="buildStopInfo" maxlength="300"></el-input>
      </el-row>
      <el-row class="check-buttons">
        <el-button type="primary" @click="saveTemp6">保存</el-button>
        <el-button @click="cancelModel">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { managerlogDetail, managerlogUpdate } from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "qualityInspect",
  data() {
    return {
      projectId: "",
      id: "",
      baseInfo: [
        {
          weather: "",
          air: "",
          temperature: "",
          wind: "",
          windpow: "",
        },
        {
          weather: "",
          air: "",
          temperature: "",
          wind: "",
          windpow: "",
        },
      ],
      template1: [],
      template2: [],
      tmp2Type: "",
      tmp2TypeList: this.commonData.tmp2TypeList,
      template3: [],
      template4: [],
      template5: [],
      template6: [],
      fileList6: [],
      fileList7: [],
      fileList8: [],
      fileList9: [],
      trial: [],
      expedition: [],
      createor: "",
      createTime: "",
      checktor: "",
      checkTime: "",
      noticeInfo: "",
      projectStopInfo: "",
      buildStopInfo: "",
      showQuestionModel: false,
      fullChecked: true,
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.projectId = userInfo.currProjectId;
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getInfo();
    }
  },
  methods: {
    /**
     * 获取详细信息
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    async getInfo() {
      let params = {
        id: this.id,
      };
      let res = await managerlogDetail(params);
      if (res.data.status === "0") {
        this.baseInfo = res.data.data.managerBaseInfoPO;
        this.template1 = res.data.data.template1;
        for (let i = 1; i < 6; i++) {
          this["template" + i] = res.data.data["template" + i].join("\n");
        }
        res.data.data.template6.list.forEach((item) => {
          if (item.detalList.length > 0) {
            item.detalList.forEach((ele) => {
              ele.isChecked = Boolean(ele.isChecked);
            });
          }
        });
        this.template6 = res.data.data.template6;
        this.tmp2Type = res.data.data.tmp2Type;
        this.createor = res.data.data.createor;
        this.createTime = res.data.data.createTime;
        this.checktor = res.data.data.checktor;
        this.checkTime = res.data.data.checkTime;
        this.fileList6 = res.data.data.weekpicurl; // 现场周检、例会专题会议情况 图片
        this.noticeInfo = res.data.data.template6.noticeInfo;
        this.projectStopInfo = res.data.data.template6.projectStopInfo;
        this.buildStopInfo = res.data.data.template6.buildStopInfo;
        this.$refs["weekfileurl"].fileList = res.data.data.weekfileurl; // 现场周检、例会专题会议情况 文件
        this.fileList7 = res.data.data.trainpicurl; // 培训、交底、识图情况 图片
        this.$refs["trainfileurl"].fileList = res.data.data.trainfileurl; // 培训、交底、识图情况 文件
        this.fileList8 = res.data.data.visapicurl; // 签证、变更原始资料登记 图片
        this.$refs["visafileurl"].fileList = res.data.data.visafileurl; // 签证、变更原始资料登记 文件
        this.trial = res.data.data.trial.join("\n"); // 图纸会审、规划（方案）审查、监理规划（细则）编制、专家论证
        this.expedition = res.data.data.expedition.join("\n"); // 考察情况
        this.fileList9 = res.data.data.otherpicurl; // 其他项目图片
        this.$refs["otherfileurl"].fileList = res.data.data.otherfileurl; //其他项目文件
      } else {
        judgeErroCode(res.data.status, res.data.message);
      }
    },
    /**
     * 点击修改
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */

    showModel() {
      this.showQuestionModel = true;
    },

    /**
     * 全选change
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    fullCheckedChange() {
      this.template6.list.forEach((item) => {
        if (item.detalList.length > 0) {
          item.detalList.forEach((ele) => {
            ele.isChecked = this.fullChecked;
          });
        }
      });
    },
    /**
     * 单个复选框change
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    checkboxChange() {
      let num = 0;
      let checkNum = 0;
      this.template6.list.forEach((item) => {
        if (item.detalList.length > 0) {
          num += item.detalList.length;
          item.detalList.forEach((ele) => {
            if (ele.isChecked === true) {
              checkNum++;
            }
          });
        }
      });
      if (num === checkNum) {
        this.fullChecked = true;
      } else {
        this.fullChecked = false;
      }
    },
    /**
     * 弹窗保存
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    async saveTemp6() {
      this.template6.noticeInfo = this.noticeInfo;
      this.template6.projectStopInfo = this.projectStopInfo;
      this.template6.buildStopInfo = this.buildStopInfo;
      let arr = [];
      this.template6.list.forEach((item) => {
        if (item.detalList.length > 0) {
          item.detalList.forEach((ele) => {
            arr.push(ele.content);
          });
        }
      });
      let wordArr = [];
      wordArr[0] = "监理通知单:" + this.noticeInfo.replace(/\n/g, "、");
      wordArr[1] = "工程暂停单:" + this.projectStopInfo.replace(/\n/g, "、");
      wordArr[2] = "建管部门函件:" + this.buildStopInfo.replace(/\n/g, "、");

      /*  let noticeInfoArr =
        this.noticeInfo.length > 0 ? this.noticeInfo.split("\n") : "";
      let projectStopInfoArr =
        this.projectStopInfo.length > 0 ? this.projectStopInfo.split("\n") : "";
      let buildStopInfoArr =
        this.buildStopInfo.length > 0 ? this.buildStopInfo.split("\n") : "";
      if (noticeInfoArr.length > 0) {
        noticeInfoArr[0] = "监理通知单:" + noticeInfoArr[0];
      }
      if (projectStopInfoArr.length > 0) {
        projectStopInfoArr[0] = "工程暂停单:" + projectStopInfoArr[0];
      }
      if (buildStopInfoArr.length > 0) {
        buildStopInfoArr[0] = "建管部门函件:" + buildStopInfoArr[0];
      } */
      let arr1 = [...arr, ...wordArr];
      let params = {
        id: this.id,
        template6: this.template6,
        template5: arr1,
      };
      let res = await managerlogUpdate(params);
      if (res.data.status === "0") {
        this.showQuestionModel = false;
        this.getInfo();
      } else {
        judgeErroCode(res.data.status, res.data.message);
      }
    },
    /**
     * 保存信息
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    async save() {
      let params = {
        id: this.id,
        baseInfoPO: this.baseInfo,
        template1: this.template1.length > 0 ? this.template1.split("\n") : "",
        template2: this.template2.length > 0 ? this.template2.split("\n") : "",
        template3: this.template3.length > 0 ? this.template3.split("\n") : "",
        template4: this.template4.length > 0 ? this.template4.split("\n") : "",
        template5: this.template5.length > 0 ? this.template5.split("\n") : "",
        weekpicurl: this.fileList6, // 现场周检、例会专题会议情况图片
        weekfileurl: this.$refs["weekfileurl"].fileList, // 现场周检、例会专题会议情况文件
        trainpicurl: this.fileList7, // 培训、交底、识图情况 图片
        trainfileurl: this.$refs["trainfileurl"].fileList, // 培训、交底、识图情况 文件
        visapicurl: this.fileList8, // 签证、变更原始资料登记 图片
        visafileurl: this.$refs["visafileurl"].fileList, // 签证、变更原始资料登记 文件
        trial: this.trial.length > 0 ? this.trial.split("\n") : "", // 图纸会审、规划（方案）审查、监理规划（细则）编制、专家论证
        expedition:
          this.expedition.length > 0 ? this.expedition.split("\n") : "", // 考察情况
        otherpicurl: this.fileList9, // 其他项目图片
        otherfileurl: this.$refs["otherfileurl"].fileList, //其他项目文件
        tmp2Type: this.tmp2Type,
      };
      let res = await managerlogUpdate(params);
      if (res.data.status === "0") {
        this.$router.go(-1);
      } else {
        judgeErroCode(res.data.status, res.data.message);
      }
    },
    /**
     * 弹框点击取消
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    cancelModel() {
      this.showQuestionModel = false;
    },
    /**
     * 返回
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    goBack() {
      this.$router.go(-1);
    },
    /**
     * 删除文件，向父组件传播数据
     * params:data,
     * create by YuXiong
     * date:2020-7-13
     */
    removefileList(data, index) {
      this["fileList" + index] = data.fileList;
    },
  },
};
</script>

<style scoped lang='less'>
.form {
  width: 1200px;
  margin: 40px 0 0 40px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 40px;
  .input-item {
    margin-top: 20px;
  }
  /deep/ .el-input__inner {
    width: 450px;
  }
  /deep/ .el-input-group__prepend {
    width: 100px;
    text-align: left;
    padding: 0 20px 0 0;
    background-color: transparent;
    border: 0;
  }
}
h3 {
  margin: 40px 40px 0 40px;
  font-size: 14px;
  color: #999;
  width: 820px;
  .right {
    float: right;
    font-size: 14px;
    font-weight: normal;
    border: 1px solid #ddd;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
  }
}
textarea {
  white-space: pre-line;
  width: 800px;
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0 0 40px;
  height: 180px;
  font-size: 14px;
  color: #999;
  line-height: 30px;
  resize: none;
}
textarea:focus {
  outline: none;
}
.actions {
  text-align: center;
  margin: 40px 0 60px 0;
  width: 1200px;
}
.log-upload {
  width: 1200px;
  margin-left: 40px;
  overflow: hidden;
}
.log-upload-pdf {
  margin-top: 50px;
}
.tmp2-check {
  width: 820px;
  margin: 20px 0 20px 40px;
  color: #999;
}
.question-list {
  overflow: hidden;
  margin-bottom: 20px;
  border-bottom: 1px dashed #ddd;
  h3 {
    margin: 0;
    padding: 0;
    font-weight: normal;
    margin-bottom: 20px;
    border-bottom: 1px dashed #ddd;
    padding-bottom: 10px;
  }
  .check-input {
    margin-bottom: 15px;
    overflow: hidden;
    .check-word {
      height: 20px;
      overflow: hidden;
    }
    /deep/ .el-checkbox__label {
      width: 700px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      line-height: 14px;
      height: 14px;
    }
  }
}
.check-buttons {
  text-align: center;
}
.check-textarea {
  margin: 20px 0;
}
.full-check {
  margin-bottom: 20px;
}
</style>