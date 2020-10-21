<template>
  <div id="quality-inspect-save">
    <div class="wrap">
      <div class="list-item" v-for="(item) in inputLists" :key="item.id">
        <el-row :gutter="40" type="flex" justify="space-between" class="row-item">
          <el-col :span="4" class="input-word">{{item.label}}</el-col>
          <el-col :span="5">
            <el-input v-model="item.word1"></el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="item.word2"></el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="item.word3"></el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="item.word4"></el-input>
          </el-col>
        </el-row>
        <el-row class="row-item row-upload" type="flex">
          <upload
            :id="item.id"
            :fileList="item.fileList"
            :isChecked="true"
            @removefileList="removeOtherfileList"
          ></upload>
        </el-row>
      </div>

      <el-row class="status">
        <span>是否合格:</span>
        <el-select placeholder="请选择" v-model="status" style="width:33%">
          <el-option key="0" label="不合格" value="0"></el-option>
          <el-option key="1" label="合格" value="1"></el-option>
        </el-select>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  getDictionarieList,
  qualityInspectList,
  qualityInspectUpdate,
  qualityInspectSave,
  qualityInspectDelete,
  qualityInspectSaveDetail,
  qualityInspectUpdateDetail,
  questionBaseQtList,
  qualityInspectQueryunit,
  qualityInspectSaveCache,
  filePut,
  baseList,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "addInputList",
  props: {
    inputLists: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      token: "",
      userid: "",
      loadingInstance: "",
      loadingOptions: {
        lock: true, // 是否锁屏
        text: "正在加载...", // 加载动画的文字
        spinner: "el-icon-loading", // 引入的loading图标
        background: "rgba(0, 0, 0, 0.3)", // 背景颜色
        target: ".sub-main", // 需要遮罩的区域
        body: true,
        customClass: "mask", // 遮罩层新增类名
      },
      status: "1",
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
  },
  watch: {
  },
  methods: {
    /**
     * 删除文件，向父组件传播数据
     * params:data,
     * create by YuXiong
     * date:2020-7-13
     */
    removeOtherfileList(data) {
      this.inputLists.forEach((item) => {
        if (item.id === data.id) {
          item.fileList = data.fileList;
        }
      });
    },
  },
};
</script>

<style scoped lang='less'>
.upload-demo {
  text-align: right;
}
.quality-inspect-save {
  padding-bottom: 60px;
}
.list-item {
  width: 1200px;
  margin: 20px 0 0 0px;
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
.tposition {
  display: flex;
  margin-top: 20px;
  color: #999;
  /deep/ textarea {
    height: 80px;
    width: 500px;
    margin-left: 20px;
  }
}
/deep/ .el-checkbox,
.el-checkbox__input {
  white-space: normal;
  word-break: break-all;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/deep/ input[type="number"] {
  -moz-appearance: textfield;
}
.input-word {
  font-size: 14px;
  color: #999;
  padding-left: 0 !important;
}
.status {
  margin: 40px 0 0 0px;
  font-size: 14px;
  color: #999;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  span {
    padding-right: 20px;
  }
}
</style>