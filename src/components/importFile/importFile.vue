<template>
  <div class="import-file">
    <el-button type="default" @click="showDialog">信息导入</el-button>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%" center>
      <el-form :model="form" width="50%">
        <el-row>
          <el-form-item label="项目" label-width="80px" v-if="projectDis">
            <el-select @change="getBid" size="medium" v-model="form.project" placeholder="请选择项目">
              <el-option
                v-for="type in projectNameList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="标段:" label-width="80px" v-if="bidDis">
            <el-select v-model="form.bid" placeholder="请选择标段:">
              <el-option
                v-for="type in bidSelectList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="导入" label-width="80px">
            <el-upload
              class="upload-demo"
              action="#"
              :limit="1"
              ref="fileImport"
              accept=".xls,.xlsx"
              :before-upload="acceptFile"
              :on-error="fileGet"
              :on-exceed="flieExceed"
            >
              <el-button size="medium" icon="el-icon-plus" type="primary">导入文件</el-button>
            </el-upload>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  filePut,
  questionBaseImportSave,
  projectImport,
  bidUnitImport,
  proListNothing,
  bidListNothing,
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "import-file",
  data() {
    return {
      http: "",
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
      dialogFormVisible: false,
      projectNameList: [],
      form: {
        project: "",
        bid: "",
      },
      bidSelectList: [],
      projectDis: false,
      bidDis: false,
    };
  },

  props: {
    fileaccept: {
      type: String,
      required: false,
    },
    importFile: {
      type: Function,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    params : {
      type : Object,
      required : false
    }
  },
  created() {
    this.getHttp();
    let userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    console.log(this.params);
    this.getProList();

    if (this.title == "标段导入") {
      this.projectDis = true;
    }

    if (
      this.title == "参建单位导入" ||
      this.title == "地下室导入" ||
      this.title == "楼栋导入"
    ) {
      this.projectDis = true;
      this.bidDis = true;
    }
  },
  methods: {
    async getHttp() {
      this.http = await this.importFile();
    },

    showDialog() {
      this.dialogFormVisible = true;
      this.form.project = "";
      this.form.bid = "";
    },

    // 切换项目
    getBid() {
      this.form.bid = "";
      this.getBidList();
    },

    // 获取标段列表
    async getBidList() {
      let params = {
        token: this.token,
        userid: this.userid,
        pageSize: 10000, // 页数
        pageNum: 1, //  页码
        name: "",
        projectId: this.form.project, // 项目标识
      };

      let res = await bidListNothing(params);
      if (res.data.status == "0") {
        this.bidSelectList = res.data.data.list;
      } else {
        judgeErroCode(res.data.status, res.data.message);
        this.$message({ type: "error", message: res.data.message });
      }
    },

    // 获取项目列表
    async getProList() {
      let params = {
        pageNum: 1,
        pageSize: 10000,
        token: this.token,
        userid: this.userid,
      };
      let res = await proListNothing(params);
      if (res.data.status == "0") {
        this.projectNameList = res.data.data.list;
      } else {
        this.$message({ type: "error", message: res.data.message });
        judgeErroCode(res.data.status, res.data.message);
      }
    },

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
     * 上传之前，限制文件的格式
     * params:file
     * create by YuXiong
     * date:2020-7-13
     */
    acceptFile(file) {
      var FileExt = file.name.replace(/.+\./, "");
      if (['xls', 'xlsx'].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message({
          type: "warning",
          message: "请上传后缀名为.xls, .xlsx的文件！",
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

    // 导入文件
    fileGet(res, file) {
      const testfunction = this.importFile();
      let FileExt = file.name.replace(/.+\./, ".");
      this.loadingInstance = this.$loading(this.loadingOptions);
      this.getBase64(file.raw).then((res) => {
        if (this.title == "标段导入") {
          if (!this.form.project) {
            this.$message({ type: "error", message: "请选择项目" });
            this.loadingInstance.close();
            return false;
          }
        }

        if (
          this.title == "参建单位导入" ||
          this.title == "地下室导入" ||
          this.title == "楼栋导入"
        ) {
          if (!this.form.project || !this.form.bid) {
            this.$message({ type: "error", message: "项目或标段未选择" });
            this.loadingInstance.close();
            return false;
          }
        }
        let params = {
          fileBase64: res.split("base64,")[1],
          fileStr: res.split("base64,")[1],
          projectId: this.form.project,
          bid: this.form.bid,
        };

        this.http(params).then((result) => {
          if (result.data.status == "0") {
            this.$message({ type: "success", message: "导入成功" });
            this.dialogFormVisible = false;
            console.log(this.params);
            this.$emit("getList");
          } else {
            this.$message({ type: "error", message: result.data.message });
            judgeErroCode(result.data.status, result.data.message);
          }
        });

        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          this.loadingInstance.close();
        });
      });
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
          // this.fileList.push(obj);
          // this.fileList = this.removeDuplicatedItem(this.fileList);
        }
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          this.loadingInstance.close();
        });
      });
    },
    flieExceed() {
      this.$message({ type: "error", message: "只能上传一个文件" });
    },
  },
};
</script>

<style lang="less" scoped>
.import-file {
  margin-left: 20px;
  margin-right: 20px;
}
</style>