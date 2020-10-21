<template>
  <div class="upload">
    <el-row class="row-item row-upload" v-if="isChecked == true">
      <el-upload
        class="upload-demo"
        action="#"
        :auto-upload="false"
        :file-list="fileList"
        :multiple="true"
        list-type="picture"
        accept=".JPG, .PNG, .JPEG"
        ref="fileuUpload"
        :before-upload="acceptFile"
        :on-change="(file, fileList) => fileGet(id, file, fileList)"
        :on-preview="previewImg"
        :on-remove="(file, fileList) => fileRemove(id, file, fileList)"
        :on-exceed="flieExceed"
      >
        <!-- <el-button size="small" type="primary">上传图片</el-button> -->
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-row>

    <el-dialog
      title="图片预览"
      :visible.sync="showModel"
      width="650px"
      center
      class="preview-img"
      append-to-body
    >
      <img :src="currentImg" alt width="600" height="600" />
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
      showModel: false,
      currentImg: "",
    };
  },
  props: {
    id: {
      type: String,
      required: false,
    },
    isChecked: {
      type: Boolean,
      required: false,
    },
    fileList: {
      type: Array,
      required: false,
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
      if (["jpg", "png", "jpeg"].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message({
          type: "warning",
          message: "请上传后缀名为jpg、png、或jpeg的文件！",
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
    async fileGet(id, file, fileList) {
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
    fileRemove(id, file, fileList) {
      let data = {
        id: id,
        fileList: fileList,
      };
      this.$emit("removefileList", data);
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
    previewImg(file) {
      this.showModel = true;
      this.currentImg = file.url;
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
            arr.splice(j, 1);
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
.upload-demo {
  text-align: right;
}
/deep/ .el-upload-list {
  float: left;
  margin-right: 20px;
  max-width: 1070px;
  li {
    float: left;
    width: 200px;
    height: 70px;
    margin-right: 20px;
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
/deep/ .el-upload {
  float: right;
  width: 70px;
}
/deep/ .el-upload-list__item-name {
  width: 100%;
  position: absolute;
  z-index: 3;
  left: -50px;
  top: 0;
  text-indent: 140px;
  .el-icon-document {
    display: none;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  border: 1px dashed #ddd;
  width: 70px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  border-radius: 5px;
  margin-top: 10px;
}
</style>