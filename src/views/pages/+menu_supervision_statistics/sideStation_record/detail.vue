<template>
  <div class="bigbox">
    <table class="table">
      <tr>
        <th class="header-title" colspan="4">旁站记录</th>
      </tr>
      <tr class="header">
        <td class="title">工程名称</td>
        <td class="content">{{ detailFormData.projectName }}</td>
        <td class="title">编号</td>
        <td class="content">暂无</td>
      </tr>
      <tr class="header">
        <td class="title">旁站的关键部位/工序</td>
        <td class="content">{{ detailFormData.codeName }}</td>
        <td class="title">施工单位</td>
        <td class="content">{{ detailFormData.bidUnitIdToName }}</td>
      </tr>
      <tr class="header">
        <td class="title">旁站开始时间</td>
        <td class="content">{{ detailFormData.startTime | transformDate2 }}</td>
        <td class="title">旁站结束时间</td>
        <td class="content">{{ detailFormData.endTime | transformDate2 }}</td>
      </tr>
      <tr>
        <td class="border-none question-title" colspan="4">
          旁站的关键部位/工序施工情况
        </td>
      </tr>
      <tr>
        <td class="border-none question-content" colspan="4">
          <div v-for="(item, i) in detailFormData.content" :key="i">
            {{ i + 1 + "、" + item }}
          </div>
        </td>
      </tr>
      <tr>
        <td class="border-none question-title" colspan="4">
          旁站问题及处理情况
        </td>
      </tr>
      <tr>
        <td class="border-none question-content" colspan="4">
          <div v-for="(item, i) in detailFormData.questionList" :key="i">
            <div>{{ i + 1 + "、" + item.content }}</div>
            <img
              v-for="(ele, i) in item.fileList"
              :key="i"
              :src="ele.url"
              alt
              @click="priviewBigPicture(ele.url)"
            />
          </div>

          <div style="margin-top: 30px">
            处理情况文本：<span>{{ detailFormData.remark }}</span>
          </div>
        </td>
      </tr>
    </table>

    <el-dialog
      title="图片预览"
      :visible.sync="showModel"
      width="650px"
      center
      class="preview-img"
    >
      <img :src="currentImg" alt width="600" height="600" />
    </el-dialog>

    <div class="footer">
      <el-button v-if="$route.query.update == 1" @click="goUpdate"
        >修改处理情况</el-button
      >
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import { sideLogDetail, sideLogUpdate } from "@/http/api.js";
export default {
  data() {
    return {
      token: "",
      userid: "",
      id: "",

      detailFormData: {
        projectName: "",
        codeName: "",
        bidUnitIdToName: "",
        startTime: "",
        endTime: "",
        remark: "",
        content: [],
        questionList: [],
      },

      showModel: false,
      currentImg: "",
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.id = this.$route.query.id;

    this.getDetail();
  },
  methods: {
    /**
     * 获取详情
     * params: param
     * create by gzy
     * date:2020.09.07
     */
    async getDetail() {
      let param = { token: this.token, userid: this.userid, id: this.id };

      let res = await sideLogDetail(param);
      if (res.data.status == 0) {
        this.detailFormData.projectName = res.data.data.projectName;
        this.detailFormData.codeName = res.data.data.codeName;
        this.detailFormData.bidUnitIdToName = res.data.data.bidUnitIdToName;
        this.detailFormData.startTime = res.data.data.startTime;
        this.detailFormData.endTime = res.data.data.endTime;
        this.detailFormData.content = eval(res.data.data.content);
        this.detailFormData.questionList = res.data.data.quessVOList.concat(
          res.data.data.otherquessVOList
        );
        this.detailFormData.remark = res.data.data.remark;
      }
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
     * 返回上一页
     * params: none
     * create by gzy
     * date:2020.09.07
     */
    goUpdate() {
      this.$prompt("请输入处理情况", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        let param = {
          token: this.token,
          userid: this.userid,
          id: this.id,
          remark: value,
        };
        sideLogUpdate(param).then((res) => {
          if (res.data.status == 0) {
            this.$router.go(-1);
          }
        });
      });
    },

    /**
     * 返回上一页
     * params: none
     * create by gzy
     * date:2020.09.07
     */
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.bigbox {
  padding: 40px;
  padding-bottom: 0px;
}

.table {
  width: 1000px;
  border-collapse: collapse;
  border: 1px solid #ccc;
  margin: 0 auto;
  color: #999;
  .header {
    text-align: center;
    .content {
      color: #999;
    }
    .title {
      color: #000;
    }
  }

  .header-title {
    padding: 20px;
    color: #000;
  }

  .border-none {
    border-top: none;
    border-bottom: none;
  }

  .question-title {
    background-color: #eee;
    margin: 0;
    padding: 0;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: normal;
    text-indent: 20px;
  }

  .question-content {
    font-style: 14px;
    padding-left: 20px;
    min-height: 100px;
    overflow: hidden;
    div {
      line-height: 50px;
      margin: 10px 0;
      overflow: hidden;
    }
    .signature {
      float: right;
      margin-right: 50px;
      text-align: right;
    }
    img {
      width: 50px;
      height: 50px;
      margin: 0 10px;
      vertical-align: middle;
      float: right;
    }
  }
  th {
    padding: 10px;
  }

  td {
    border: 1px solid #ccc;
    width: 210px;
    padding: 10px;
    overflow: hidden;
  }
}

.footer {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>