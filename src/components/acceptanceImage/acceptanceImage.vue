<template>
  <div id="quality-inspect-save">
    <el-row class="word">上传验收照片</el-row>
    <el-row class="row-item" type="flex">
      <upload
        id="2020081912345678"
        :fileList="fileList"
        :isChecked="true"
        @removefileList="removeFileList"
      ></upload>
    </el-row>
  </div>
</template>

<script>
import { getDictionarieList } from "@/http/api.js";
export default {
  name: "qualityInspectCushionList",
  props: {},
  data() {
    return {
      fileList: [],
    };
  },
  created() {},
  methods: {
    /**
     * 删除文件
     * params:data,
     * create by YuXiong
     * date:2020-8-19
     */
    removeFileList(data) {
      this.fileList = data.fileList;
    },
  },
};
</script>

<style scoped lang='less'>
.word {
  color: #999;
  font-size: 14px;
}
.row-item {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>