<template>
  <div id="wrap">
    <div class="log-table">
      <h1>监理日志</h1>
      <el-row class="log-table-date">
        <el-col :span="12" class="border">日期：{{Number(baseInfo[0].createTime) | transformDate}}</el-col>
        <el-col :span="12">星期：{{baseInfo[0].week}}</el-col>
      </el-row>
      <el-row class="log-table-info">
        <el-col :span="4" class="border">上午</el-col>
        <el-col :span="4" class="border">天气：{{baseInfo[0].weather}}</el-col>
        <el-col :span="4" class="border">气温：{{baseInfo[0].air}}℃</el-col>
        <el-col :span="4" class="border">湿度：{{baseInfo[0].temperature}}</el-col>
        <el-col :span="4" class="border">风向：{{baseInfo[0].wind}}</el-col>
        <el-col :span="4">风力：{{baseInfo[0].windpow}}</el-col>
      </el-row>
      <el-row class="log-table-info">
        <el-col :span="4" class="border">下午</el-col>
        <el-col :span="4" class="border">天气：{{baseInfo[1].weather}}</el-col>
        <el-col :span="4" class="border">气温：{{baseInfo[1].air}}℃</el-col>
        <el-col :span="4" class="border">湿度：{{baseInfo[1].temperature}}</el-col>
        <el-col :span="4" class="border">风向：{{baseInfo[1].wind}}</el-col>
        <el-col :span="4">风力：{{baseInfo[1].windpow}}</el-col>
      </el-row>
      <h3>1,材料、设备、构配件情况</h3>
      <div class="word">
        <p v-for="(item,index) in template1" :key="index">{{item}}</p>
        <p v-if="template1.length == 0">无</p>
      </div>
      <h3>2,监理工作情况（导入土建质量、安装质量、安全等内容）</h3>
      <div class="word">
        <p v-for="(item,index) in template2" :key="index">{{item}}</p>
        <p v-if="template2.length == 0">无</p>
      </div>
      <h3>3,测量定位复核</h3>
      <div class="word">
        <p v-for="(item,index) in template3" :key="index">{{item}}</p>
        <p v-if="template3.length == 0">无</p>
      </div>
      <h3>4,工程验收情况</h3>
      <div class="word">
        <p v-for="(item,index) in template4" :key="index">{{item}}</p>
        <p v-if="template4.length == 0">无</p>
      </div>
      <h3>5,现场存在问题</h3>
      <div class="word">
        <p v-for="(item,index) in template5" :key="index">{{item}}</p>
        <p v-if="template5.length == 0">无</p>
      </div>
      <h3>6,现场周检、例会专题会议情况</h3>
      <div class="instrust">图片列表：</div>
      <div class="img">
        <img
          v-for="(item,index) in imgList6"
          :key="index"
          :src="item.url"
          width="50"
          height="50"
          @click="priviewImg(item.url)"
        />
      </div>
      <div class="file">
        <div class="instrust">文件列表：</div>
        <span
          v-for="(item,index) in fileList6"
          :key="index"
          @click="priviewFile(item.url)"
        >{{item.name}}</span>
      </div>
      <h3>7,培训、交底、识图情况</h3>
      <div class="instrust">图片列表：</div>
      <div class="img">
        <img
          v-for="(item,index) in imgList7"
          :key="index"
          :src="item.url"
          width="50"
          height="50"
          @click="priviewImg(item.url)"
        />
      </div>
      <div class="file">
        <div class="instrust">文件列表：</div>
        <span
          v-for="(item,index) in fileList7"
          :key="index"
          @click="priviewFile(item.url)"
        >{{item.name}}</span>
      </div>
      <h3>8,签证、变更原始资料登记</h3>
      <div class="instrust">图片列表：</div>
      <div class="img">
        <img
          v-for="(item,index) in imgList8"
          :key="index"
          :src="item.url"
          width="50"
          height="50"
          @click="priviewImg(item.url)"
        />
      </div>
      <div class="instrust">文件列表：</div>
      <div class="file">
        <span
          v-for="(item,index) in fileList8"
          :key="index"
          @click="priviewFile(item.url)"
        >{{item.name}}</span>
      </div>
      <h3>9,图纸会审、规划（方案）审查、监理规划（细则）编制、专家论证</h3>
      <div class="word">
        <p v-for="(item,index) in trial" :key="index">{{item}}</p>
        <p v-if="trial.length == 0">无</p>
      </div>
      <h3>10,考察情况</h3>
      <div class="word">
        <p v-for="(item,index) in expedition" :key="index">{{item}}</p>
        <p v-if="expedition.length == 0">无</p>
      </div>
      <h3>其他项目</h3>
      <div class="instrust">图片列表：</div>
      <div class="img">
        <img
          v-for="(item,index) in  imgList9"
          :key="index"
          :src="item.url"
          width="50"
          height="50"
          @click="priviewImg(item.url)"
        />
      </div>
      <div class="instrust">文件列表：</div>
      <div class="file">
        <span
          v-for="(item,index) in fileList9"
          :key="index"
          @click="priviewFile(item.url)"
        >{{item.name}}</span>
      </div>
      <div class="createor bottom-word">日志填写人:{{createor}}</div>
      <div class="bottom-word">申请时间:{{Number(createTime) | transformDate}}</div>
      <h3>总工程师签约意见</h3>
      <p class="check-mark">签阅意见:{{checkMark}}</p>
      <div class="bottom-word">签阅人:{{checktor}}</div>
      <div class="bottom-word">签阅时间:{{Number(checkTime) | transformDate}}</div>
    </div>

    <div class="actions">
      <el-button size="medium" @click="goToEdit" v-if="checkStatus != 1">修改</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="showCheck"
        v-if="checkStatus != 1"
        v-permission="{action: 'managerlog:logcheck' }"
      >签阅</el-button>
      <el-button size="medium" @click="goBack">返回</el-button>
    </div>

    <el-dialog title="图片预览" :visible.sync="showImgModel" width="650px" center class="preview-img">
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>

    <el-dialog title="文件预览" :visible.sync="showFileModel" width="50%" center>
      <embed :src="currentFileUrl" type="application/pdf" width="100%" height="550" />
    </el-dialog>

    <el-dialog title="签阅" :visible.sync="showCheckModel" width="50%" center>
      <el-row>签阅意见:</el-row>
      <el-row class="check-input">
        <el-input type="textarea" v-model="checkMark" maxlength="300"></el-input>
      </el-row>
      <el-row class="check-buttons">
        <el-button type="primary" @click="sureCheck">保存</el-button>
        <el-button @click="cancelModel">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  managerlogDetail,
  managerlogUpdate,
  managerlogLogcheck,
} from "@/http/api.js";
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
          createTime: "",
          week: "",
        },
        {
          weather: "",
          air: "",
          temperature: "",
          wind: "",
          windpow: "",
          createTime: "",
          week: "",
        },
      ],
      template1: [],
      template2: [],
      template3: [],
      template4: [],
      template5: [],
      fileList6: [],
      imgList6: [],
      fileList7: [],
      imgList7: [],
      fileList8: [],
      imgList8: [],
      fileList9: [],
      imgList9: [],
      trial: [],
      expedition: [],
      createor: "",
      createTime: "",
      checktor: "",
      checkTime: "",
      showFileModel: false,
      showImgModel: false,
      showCheckModel: false,
      currentImg: "",
      currentFileUrl: "",
      checkMark: "",
      checkStatus: "0",
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
        for (let i = 1; i < 7; i++) {
          this["template" + i] = res.data.data["template" + i];
        }
        this.imgList6 = res.data.data.weekpicurl; // 现场周检、例会专题会议情况 图片
        this.fileList6 = res.data.data.weekfileurl; // 现场周检、例会专题会议情况 文件
        this.imgList7 = res.data.data.trainpicurl; // 培训、交底、识图情况 图片
        this.fileList7 = res.data.data.trainfileurl; // 培训、交底、识图情况 文件
        this.imgList8 = res.data.data.visapicurl; // 签证、变更原始资料登记 图片
        this.fileList8 = res.data.data.visafileurl; // 签证、变更原始资料登记 文件
        this.trial = res.data.data.trial; // 图纸会审、规划（方案）审查、监理规划（细则）编制、专家论证
        this.expedition = res.data.data.expedition; // 考察情况
        this.imgList9 = res.data.data.otherpicurl; // 其他项目图片
        this.fileList9 = res.data.data.otherfileurl; //其他项目文件
        this.createor = res.data.data.createor;
        this.createTime = res.data.data.createTime;
        this.checktor = res.data.data.checktor;
        this.checkTime = res.data.data.checkTime;
        this.checkStatus = res.data.data.checkStatus;
        this.checkMark = res.data.data.checkMark;
      } else {
        judgeErroCode(res.data.status, res.data.message);
      }
    },
    /**
     * 图片查看
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    priviewImg(url) {
      this.currentImg = url;
      this.showImgModel = true;
    },

    /**
     * 文件查看
     * params:url
     * create by YuXiong
     * date:2020-8-3
     */
    priviewFile(url) {
      this.currentFileUrl = url;
      this.showFileModel = true;
    },
    /**
     * 点击签阅按钮
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    showCheck() {
      this.showCheckModel = true;
      this.checkMark = "";
    },
    /**
     * 关闭弹窗
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    cancelModel() {
      this.showCheckModel = false;
    },
    /**
     * 签阅保存
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    async sureCheck() {
      if (this.checkMark.length === 0) {
        this.$message({ type: "error", message: "请先填写签阅意见" });
        return false;
      }
      let params = {
        id: this.id,
        checkMark: this.checkMark,
      };
      let res = await managerlogLogcheck(params);
      if (res.data.status === "0") {
        this.showCheckModel = false;
        this.getInfo();
      } else {
        judgeErroCode(res.data.status, res.data.message);
      }
    },
    /**
     * 修改信息
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    goToEdit() {
      this.$router.push({
        path: "/managerlog/update",
        query: {
          id: this.id,
        },
      });
    },

    /**
     * 返回
     * params:none
     * create by YuXiong
     * date:2020-8-3
     */
    goBack() {
      this.$router.push({
        path: "/managerlog/list",
      });
    },
  },
};
</script>

<style scoped lang='less'>
.log-table {
  width: 1000px;
  overflow: hidden;
  margin: 40px auto;
  border: 1px solid #ddd;
  color: #999;
  line-height: 40px;
  .border {
    border-right: 1px solid #ddd;
  }
  h1 {
    font-size: 16px;
    text-align: center;
    color: #333;
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    margin: 0;
    padding: 0;
  }
  .log-table-date,
  .log-table-info {
    text-align: center;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
  }
  h3 {
    background-color: #eee;
    margin: 0;
    padding: 0;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: normal;
    text-indent: 20px;
  }
  .word {
    font-size: 14px;
    padding-left: 20px;
    min-height: 140px;
    overflow: hidden;
  }
  .img {
    img {
      margin: 0 20px;
      cursor: pointer;
    }
  }
  .file {
    span {
      margin: 0 20px;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .instrust {
    margin: 20px 0 0 20px;
    font-size: 12px;
  }
}
.createor {
  border-top: 1px solid #ddd;
  padding-top: 20px;
}
.bottom-word {
  font-size: 14px;
  padding-left: 20px;
}
.actions {
  text-align: center;
  margin-bottom: 60px;
}
.check-input {
  margin: 20px 0;
  /deep/ .el-textarea__inner {
    height: 100px;
  }
}
.check-buttons {
  text-align: center;
}
.check-mark {
  font-size: 14px;
  padding: 0 20px;
}
</style>