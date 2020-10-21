<template>
  <div id="quality-inspect-save">
    <div class="wrap">
      <div v-for="(item) in checkList" :key="item.id">
        <div class="list-item">
          <el-row type="flex" justify="space-between" class="row-item">
            <el-col :span="20" class="question-word">
              <el-checkbox v-model="item.isChecked" class="check-word">{{item.content}}</el-checkbox>
            </el-col>
            <el-col :span="4" class="right right-button">
              <el-popover
                placement="bottom"
                width="200"
                heigt="30"
                trigger="click"
                :content="item.tDescribe"
              >
                <el-button slot="reference">对应条款</el-button>
              </el-popover>
            </el-col>
          </el-row>

          <el-row v-if="item.isShowPosition">
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
          <el-row class="row-item row-upload" type="flex">
            <upload
              :id="item.id"
              :fileList="item.fileList"
              :isChecked="item.isChecked"
              @removefileList="removefileList"
            ></upload>
          </el-row>
        </div>
      </div>

      <div class="list-item" v-for="(item,index) in otherList" :key="index">
        <el-row class="row-item">
          <el-col :span="2">
            <el-checkbox v-model="item.isChecked">其他</el-checkbox>
          </el-col>
          <el-col :span="18">
            <el-input type="text" maxlength="50" v-model="item.content" size="medium"></el-input>
          </el-col>
          <el-col :span="4" class="other-delete">
            <el-button size="medium" icon="el-icon-delete" @click="deleteOther(item.id)"></el-button>
          </el-col>
        </el-row>

        <el-row class="other-position" v-if="showOtherPostion">
          <el-col :span="2">问题部位</el-col>
          <el-col :span="18">
            <el-input type="text" maxlength="50" v-model="item.tPostion" size="medium"></el-input>
          </el-col>
        </el-row>

        <el-row class="row-item row-upload" type="flex">
          <upload
            :id="item.id"
            :fileList="item.fileList"
            :isChecked="item.isChecked"
            @removefileList="removeOtherfileList"
          ></upload>
        </el-row>
      </div>

      <el-row class="row-item">
        <el-button size="medium" icon="el-icon-plus" class="plus" @click="addOther"></el-button>
      </el-row>
      <div class="qualified">
        检查意见:
        <span>{{qualified === '0'?'不合格':'合格'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { questionBaseQtList } from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import { getDate } from "@/utils/transformDate.js";
export default {
  name: "qualityInspectCushionList",
  props: {
    code: {
      type: String,
      required: true,
    },
    showOtherPostion: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      token: "",
      userid: "",
      checkList: [],
      checkedArr: [], // 选中的问题，做回显
      qualified: "0",
      otherList: [
        {
          content: "",
          id: Date.parse(new Date()).toString(),
          fileList: [],
          isChecked: false,
          tPostion: "",
          primaryId: "",
        },
      ],
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.getQuestionList();
  },
  watch: {
    code(newVal, oldVal) {
      this.getQuestionList();
    },
    checkList: {
      handler(newValue) {
        let num = 0;
        newValue.forEach((item) => {
          if (item.isChecked === true) {
            num++;
          }
        });
        this.otherList.forEach((item) => {
          if (item.isChecked === true) {
            num++;
          }
        });
        if (num > 0) {
          this.qualified = "0";
        } else {
          this.qualified = "1";
        }
      },
      deep: true,
    },
    otherList: {
      handler(newValue) {
        let num = 0;
        newValue.forEach((item) => {
          if (item.isChecked === true) {
            num++;
          }
        });
        this.checkList.forEach((item) => {
          if (item.isChecked === true) {
            num++;
          }
        });
        if (num > 0) {
          this.isQualified = false;
          this.qualified = "0";
        } else {
          this.isQualified = true;
          this.qualified = "1";
        }
      },
      deep: true,
    },
    checkedArr: {
      handler(newValue, oldValue) {
        if (newValue && newValue.length > 0) {
          this.checkList.forEach((item) => {
            newValue.forEach((ele) => {
              if (ele.id === item.id) {
                item.isChecked = true;
                item.fileList = ele.fileList;
              }
            });
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     * 获取问题列表
     * params:none
     * create by YuXiong
     * date:2020-6-28
     */
    async getQuestionList() {
      let params = {
        code: this.code,
        pageNum: 1,
        pageSize: 100,
        token: this.token,
        userid: this.userid,
      };
      try {
        let res = await questionBaseQtList(params);
        if (res.data.status === "0") {
          if (res.data.data.list.length > 0) {
            res.data.data.list.forEach((item) => {
              item.isChecked = false;
              item.fileList = [];
              item.mark = "";
              if (item.tPostion.length > 0) {
                item.isShowPosition = true;
              } else {
                item.isShowPosition = false;
              }
            });
          }
          this.checkList = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
          this.checkList = [];
        }
      } catch (error) {
        this.$message({ type: "error", message: res.data.message });
      }
    },
    /**
     * 添加其他的选项
     * params:none
     * create by YuXiong
     * date:2020-7-13
     */
    addOther() {
      let arr = [
        {
          content: "",
          id: Date.parse(new Date()).toString(),
          fileList: [],
          isChecked: false,
          tPostion: "",
          primaryId: "",
        },
      ];
      this.otherList = [...arr, ...this.otherList];
    },
    /**
     * 删除其他问题的图片
     * params:data,
     * create by YuXiong
     * date:2020-8-19
     */
    removeOtherfileList(data) {
      this.otherList.forEach((item) => {
        if (item.id === data.id) {
          item.fileList = data.fileList;
        }
      });
    },

    /**
     * 删除文件，向父组件传播数据
     * params:data,
     * create by YuXiong
     * date:2020-8-19
     */
    removefileList(data) {
      this.checkList.forEach((item) => {
        if (item.id === data.id) {
          item.fileList = data.fileList;
        }
      });
    },

    /**
     * 删除其他项
     * params:id,
     * create by YuXiong
     * date:2020-8-19
     */
    deleteOther(id) {
      if (this.otherList.length === 1) {
        this.$message({ type: "error", message: "必须保留此项" });
        return false;
      } else {
        this.otherList = this.otherList.filter((item) => item.id !== id);
      }
    },
  },
};
</script>

<style scoped lang='less'>
.wrap {
  width: 1200px;
}
.upload-demo {
  text-align: right;
}
.quality-inspect-save {
  padding-bottom: 60px;
}
.list-item {
  width: 1200px;
  margin: 40px 0 0 0px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 20px;
  .row-item {
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding: 0 !important;
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
.tposition {
  display: flex;
  margin-top: 10px;
  color: #999;
  /deep/ textarea {
    height: 80px;
    width: 480px;
    margin-left: 20px;
  }
  .tposition-word-input {
    width: 100%;
  }
}
.tposition-word {
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
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/deep/ input[type="number"] {
  -moz-appearance: textfield;
}
.qualified {
  margin-top: 40px;
  color: #999;
  margin-left: 0px;
  span {
    font-weight: bold;
  }
}
.plus {
  margin: 20px 0 0 0px;
}
/deep/ textarea {
  height: 80px;
  width: 480px;
  margin-left: 20px;
}
.other-position {
  margin-top: 20px;
  font-size: 14px;
  color: #999;
}
.right-button {
  height: 30px;
  overflow: hidden;
  line-height: 30px;
  button {
    height: 28px;
    padding: 0 20px;
  }
}
.other-delete {
  text-align: right;
}
</style>