<template>
  <div id="quality-inspect-save">
    <div class="wrap">
      <div class="list-item" v-for="(item,index) in mixedUploadList" :key="index">
        <el-row :gutter="40" type="flex" justify="space-between" class="row-item">
          <el-col :span="4"><span>{{item.flag}}</span>{{item.label}}</el-col>
          <el-col :span="18">
            <el-input  maxlength="50" v-model="item.content" size="medium"></el-input>
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
  baseList
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import { getDate } from "@/utils/transformDate.js";
export default {
  name: "qualityInspectCushionList",
  props: {},
  data() {
    return {
      mixedUploadList: [
        {
          flag: "*",
          content: "",
          id: "1",
          fileList: [],
          isChecked: true,
          label: "混凝土坍落度实测"
        },
        {
          flag: "",
          content: "",
          id: "2",
          fileList: [],
          isChecked: true,
          label: ""
        }
      ]
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
  },
  watch: {},
  methods: {
    /**
     * 删除文件，向父组件传播数据
     * params:data,
     * create by YuXiong
     * date:2020-7-13
     */
    removeOtherfileList(data) {
      this.mixedUploadList.forEach(item => {
        if (item.id === data.id) {
          item.fileList = data.fileList;
        }
      });
    }
  }
};
</script>

<style scoped lang='less'>
.list-item {
  width: 1200px;
  margin: 40px 0 0 10px;
  font-size: 14px;
  color: #999;
  .row-item {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  /deep/ .el-button {
    margin: 20px 20px 0 0;
  }
  .right {
    text-align: right;
  }
  span{
    color: #f00;
    font-size: 18px;
    line-height: 30px;
    display: inline-block;
  }
}
</style>