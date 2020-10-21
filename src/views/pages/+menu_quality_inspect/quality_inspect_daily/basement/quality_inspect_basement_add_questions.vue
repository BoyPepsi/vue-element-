<template>
  <div id="basement-add-question">
    <addQuestionsNew :code="code" ref="addQuestion" :showOtherPostion="true"></addQuestionsNew>
    <div class="action-btn">
      <el-button size="medium" type="default" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { maintableSavequeuecache,maintableSyncdbtocache } from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    return {
      userid: "",
      token: "",
      code: "",
      content: [],
      mainId : '',
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    if (this.$route.query) {
      this.code = this.$route.query.code;
      if (this.$route.query.mainId) {
        //当前用户进行修改操作
        this.mainId = this.$route.query.mainId;
        this.syncdbtocache();
      }
    }
  },
  methods: {

    // 将数据库缓存同步
    async syncdbtocache() {
      let params = {
        code: this.code,
        mainId: this.mainId,
        userId: this.userid,
        token: this.token,
      };
      let res = await maintableSyncdbtocache(params);
      if (res.data.status == "0") {
        console.log("缓存和数据库同步成功");
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },


    async save() {
      let checkList = this.$refs["addQuestion"].checkList;
      let otherList = this.$refs["addQuestion"].otherList;
      if (checkList.length > 0) {
        checkList.map((item) => {
          if (item.isChecked == true) {
            item.code = item.tCode;
            item.tpostion = item.tPostion;
            this.content.push(item);
          }
        });
      }
      if (otherList.length > 0) {
        otherList.map((item) => {
          if (item.isChecked == true) {
            item.code = this.code;
            // item.tCode = this.code;
            item.tpostion = item.tPostion;
            this.content.push(item);
          }
        });
      }
      let params = {
        code: this.code,
        content: JSON.stringify(this.content),
      };
      try {
        let res = await maintableSavequeuecache(params);
        if (res.data.status == "0") {
          this.$message({ type: "success", message: "添加问题成功" });
          this.$router.go(-1);
        } else {
          this.$message({ type: "error", message: res.data.message });
        }
      } catch (error) {
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    // 返回
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>


<style lang="less" scoped>
#basement-add-question {
  margin: 40px;
}
.action-btn {
  width: 400px;
  margin: 20px auto;
}
</style>