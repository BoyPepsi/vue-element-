<template>
  <div class="upload">
    <el-row class="row-item row-upload" type="flex" justify="end">
      <el-upload
        class="upload-demo-file"
        action="#"
        :auto-upload="false"
        :file-list="fileList"
        :multiple="true"
        ref="fileUpload"
        list-type="picture"
        :accept="fileaccept"
        :before-upload="acceptFile"
        :on-change="(file,fileList)=> fileGet(file,fileList)"
        :on-preview="previewFile"
        :on-remove="(file, fileList)=> fileRemove(file,fileList)"
        :on-exceed="flieExceed"
      >
        <el-button size="small">上传文件</el-button>
      </el-upload>
    </el-row>

    <el-dialog title="文件预览" :visible.sync="showFileModel" width="50%" center>
      <embed :src="currentFileUrl" type="application/pdf" width="100%" height="550" />
    </el-dialog>
  </div>
</template>

<script>
import { filePut } from "@/http/api.js";
export default {
  name: "upload",
  data() {
    return {
      loadingInstance: "",
      fileList: [],
      loadingOptions: {
        lock: true, // 是否锁屏
        text: "正在加载...", // 加载动画的文字
        spinner: "el-icon-loading", // 引入的loading图标
        background: "rgba(0, 0, 0, 0.3)", // 背景颜色
        target: ".sub-main", // 需要遮罩的区域
        body: true,
        customClass: "mask", // 遮罩层新增类名
      },
      requestFlag: true,
      showFileModel: false,
      currentFileUrl: "",
    };
  },
  props: {
    fileaccept: {
      type: String,
      required: true,
    },
  },
  watch: {},
  methods: {
    /**
     * 上传之前，限制文件的格式
     * params:file
     * create by YuXiong
     * date:2020-7-13
     */
    acceptFile(file) {
      var FileExt = file.name.replace(/.+\./, "");
      if ([this.fileaccept].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message({
          type: "warning",
          message: "请上传后缀名为" + this.fileaccept + "的文件！",
        });
        return false;
      }
    },
    /**
     * 文件转为base64
     * params:event,file,fileList
     * create by YuXiong
     * date:2020-7-13
     */
    async fileGet(file, fileList) {
      let FileExt = file.name.replace(/.+\./, ".");
      if (this.fileaccept.split(",").indexOf(FileExt.toLowerCase()) === -1) {
        this.$message({
          type: "warning",
          message: "请上传后缀名为" + this.fileaccept + "的文件！",
        });
        this.fileList = fileList.filter((item) => item.uid != file.uid);
        return false;
      }
      this.loadingInstance = this.$loading(this.loadingOptions);
      let res = await this.getBase64(file.raw);
      let fileStr = res.split("base64,")[1];
      let fileName = file.name;
      let params = {
        fileName: [fileName],
        fileStr: [fileStr],
      };
      this.fileUploadFun(params);
    },
    /**
     * 公用文件上传接口
     * params:none
     * create by YuXiong
     * date:2020-6-29
     */
    fileUploadFun(params) {
      filePut(params).then((fileResult) => {
        if (fileResult.data.status === "0") {
          let obj = {};
          obj.name = fileResult.data.data.fileNames[0];
          obj.url = fileResult.data.data.urls[0];
          this.fileList.push(obj);
          this.fileList = this.removeDuplicatedItem(this.fileList);
        }
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          this.loadingInstance.close();
        });
      });
    },
    /**
     * 文件移除
     * params:file,fileList
     * create by YuXiong
     * date:2020-7-13
     */
    fileRemove(file, fileList) {
      this.fileList = fileList;
    },

    /**
     * 文件上传超出个数提示
     * params:file,fileList
     * create by YuXiong
     * date:2020-6-29
     */
    flieExceed() {
      this.$message({ type: "error", message: "只能上传一个文件" });
    },

    /**
     * params:file
     * create by YuXiong
     * date:2020-7-13
     */
    previewFile(file) {
      this.showFileModel = true;
      this.currentFileUrl = file.url;
    },
    /**
     * 转为base64的方法
     * params:file
     * create by YuXiong
     * date:2020-7-13
     */
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function (ev) {
          imgResult = ev.target.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },

    /**
     * 数组去重
     */
    removeDuplicatedItem(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].url == arr[j].url) {
            arr.splice(j, 1); //console.log(arr[j]);
            j--;
          }
        }
      }
      return arr;
    },
  },
};
</script>

<style scoped lang="less">
.upload-demo-file {
  text-align: right;
}
/deep/ .el-upload-list {
  li {
    float: right;
    width: 200px;
    height: 70px;
    margin-left: 20px;
    cursor: pointer;
    position: relative;
    img {
      width: 70px;
      height: 50px;
      position: absolute;
      z-index: 2;
      top: 10px;
      margin-left: -175px;
    }
  }
}
.upload-demo-file {
  /deep/ .el-upload-list__item-name {
    width: 100%;
    position: absolute;
    z-index: 3;
    left: -50px;
    top: 0;
    text-indent: 140px;
    .el-icon-document {
      display: block !important;
      font-size: 32px;
      position: absolute;
      left: -40px;
      top: 15px;
    }
  }
}
</style>