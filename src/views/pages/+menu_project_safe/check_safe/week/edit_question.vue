<template>
  <div class="week-safe-edit-question">
    <div class="wrap">
      <div v-for="(item) in questionList" :key="item.id">
        <h3>检查项目:{{item.codeName}}</h3>
        <div class="list-item">
          <el-row class="row-item">
            <el-col :span="20" class="question-word">
              <el-checkbox v-model="item.isChecked" class="check-word">{{item.content}}</el-checkbox>
            </el-col>
            <el-col :span="4" class="right">
              <el-popover placement="bottom" width="200" trigger="click" :content="item.tDescribe">
                <el-button slot="reference">对应条款</el-button>
              </el-popover>
            </el-col>
          </el-row>

          <el-row v-if="item.tPostion.length > 0">
            <el-col :span="2">
              <div class="tposition-word">问题部位</div>
            </el-col>
            <el-col :span="22">
              <div class="tposition">
                <div class="tposition-word-input">
                  <el-input type="text" maxlength="50" v-model="item.tPostion" size="medium"></el-input>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row class="row-item row-upload" justify="end">
            <upload
              :id="item.id"
              :fileList="item.fileList"
              :isChecked="item.isChecked"
              @removefileList="removefileList"
            ></upload>
          </el-row>
        </div>

        <div v-if="item.checkId == '202012345678'" class="list-item">
          <el-row class="row-item">
            <el-col :span="2">
              <el-checkbox v-model="item.isChecked">其他</el-checkbox>
            </el-col>
            <el-col :span="18">
              <el-input type="text" maxlength="50" v-model="item.content" size="medium"></el-input>
            </el-col>
          </el-row>
          <el-row class="other-position">
            <el-col :span="2">问题部位</el-col>
            <el-col :span="18">
              <el-input type="text" maxlength="50" v-model="item.tPostion" size="medium"></el-input>
            </el-col>
          </el-row>
          <el-row class="row-item row-upload">
            <upload
              :id="item.id"
              :fileList="item.fileList"
              :isChecked="item.isChecked"
              @removefileList="removefileList"
            ></upload>
          </el-row>
        </div>
      </div>
      <div class="actions">
        <el-button type="primary" size="medium" @click="save">保存</el-button>
        <el-button size="medium" @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  maintableQuerysecuritydata,
  maintableSavequeuecache,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  data() {
    return {
      token: "",
      userid: "",
      code: "",
      mainId: "",
      questionList: [],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    if (this.$route.query) {
      this.code = this.$route.query.code;
      this.mainId = this.$route.query.mainId;
    }
    this.getSecurityData();
  },
  methods: {
    async save() {
      //存缓存
      let checkedArr = this.questionList.filter(
        (item) => item.isChecked === true
      );
      checkedArr.map(item => {
        console.log(item);
        item.tCode = item.code;
      })
      let params = {
        code: this.code,
        content: checkedArr,
      };
      let res = await maintableSavequeuecache(params);
      if (res.data.status == "0") {
        console.log(res);
        this.$router.go(-1);
      } else {
        this.$message({ type: "error", message: res.data.message });
      }
    },

    // 获取缓存数据---chm---2020.09.01
    async getSecurityData() {
      let params = {
        mainId: this.mainId,
        token: this.token,
        userid: this.userid,
        code: this.code,
      };
      try {
        let res = await maintableQuerysecuritydata(params);
        if (res.data.status == "0") {
          console.log(res);
          let data = [
            ...res.data.data.quessVOList,
            ...res.data.data.otherquessVOList,
          ];
          data.map((item) => {
            item.isChecked = true;
          });
          this.questionList = data;
        } else {
          this.$message({ type: "error", message: res.data.message });
        }
      } catch (err) {
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    goBack() {
      this.$router.go(-1);
    },

    /**
     * 删除文件，向父组件传播数据
     * params:data,
     * create by YuXiong
     * date:2020-7-13
     */
    removefileList(data) {
      this.questionList.forEach((item) => {
        if (item.id === data.id) {
          item.fileList = data.fileList;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  width: 1200px;
  margin: 40px 0 0 60px;
  h3 {
    font-size: 14px;
    color: #999;
  }
}
.quality-inspect-save {
  padding-bottom: 60px;
}
.list-item {
  width: 1200px;
  margin: 40px 0 0 0;
  border-bottom: 1px dashed #eee;
  padding-bottom: 20px;
  .row-item {
    margin-left: 0 !important;
    margin-right: 0 !important;
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
.red-span {
  color: #f00;
}
.row-upload {
  margin: 20px 0 0 0;
  overflow: hidden;
  padding-right: 20px;
}
.row-button {
  width: 1200px;
  text-align: center;
  margin-top: 60px;
  padding-bottom: 60px;
  button {
    margin-right: 20px;
  }
}
/deep/ textarea {
  height: 80px;
}
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
/deep/ textarea {
  height: 80px;
  width: 480px;
  margin-left: 20px;
}
.tposition {
  display: flex;
  margin-top: 20px;
  color: #999;
  .tposition-word-input {
    width: 100%;
  }
}
.tposition-word {
  font-size: 12px;
  font-size: 14px;
  width: 100px;
  line-height: 60px;
  color: #999;
}
/deep/ .el-checkbox,
.el-checkbox__input {
  white-space: normal;
  word-break: break-all;
}
/deep/ .check-word .el-checkbox__input {
  width: 20px;
  float: left;
}
/deep/ .check-word .el-checkbox__label {
  width: 500px;
  float: left;
  margin: 0;
  padding: 0;
}

.other-position {
  margin-top: 20px;
  font-size: 14px;
  color: #999;
}
.actions {
  margin: 40px 0 40px 0;
  text-align: center;
}
</style>