<template>
  <div>
    
    <el-row style="margin:40px">
      <el-button
        type="primary"
        @click="alertModel('add',null)"
        size="medium"
        icon="el-icon-plus"
        v-permission="{ action: 'app:save' }"
      >添加</el-button>
    </el-row>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" center>
      <el-form :model="form" :rules="rule" ref="form">
        <el-form-item label="标题:" label-width="120px" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题："></el-input>
        </el-form-item>
        <el-form-item label="版本号:" label-width="120px" prop="versions">
          <el-input v-model="form.versions" placeholder="请输入版本号："></el-input>
        </el-form-item>

        <el-form-item label="类型:" label-width="120px" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="安卓" value="0"></el-option>
            <el-option label="iOS" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="强制更新:" label-width="120px" prop="isUpdated">
          <el-select v-model="form.isUpdated" placeholder="请选择">
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件:" label-width="120px" prop="url">
          <el-upload
            class="upload-demo"
            action="#"
            :limit="1"
            accept=".apk,.ipa"
            :before-upload="acceptFile"
            :on-remove="removeFile"
            :on-exceed="flieExceed"
            :file-list="fileList"
            :on-error="GetFile"
            :show-file-list="true"
          >
            <el-button size="small" type="default">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注描述:" label-width="120px">
          <el-input type="textarea" :rows="2" placeholder="请输入备注描述：" v-model="form.marks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>

    <div class="table">
      <el-table
        :data="tableList"
        border
        style="width: 100%"
        :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
      >
        <el-table-column label="标题" prop="title" min-width="10%" align="center"></el-table-column>
        <el-table-column label="版本号" prop="versions" min-width="10%" align="center"></el-table-column>
        <!-- <el-table-column label="文件地址" prop="url" min-width="20%" align="center">
          <template slot-scope="scope">
            <a style="color:#606266" href="scope.row.url" download="标题暂无">下载模板</a>
          </template>
        </el-table-column>-->
        <el-table-column label="创建时间" prop="createTime" align="center" min-width="20%">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | transformDate2}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" min-width="10%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.type | appType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注描述" prop="marks" min-width="30%" align="center"></el-table-column>
        <el-table-column label="强制更新" prop="isUpdated" min-width="10%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isUpdated | IsUpdate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="20%" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="alertModel('edit',scope.row)"
              v-permission="{ action: 'app:update' }"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              class="red"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-permission="{action: 'app:delete' }"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  appVersionList,
  appVersionSave,
  filePut,
  appVersionDelete,
  appVersionUpdate
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  title: "app版本",
  data() {
    return {
      userid: "",
      token: "",
      dialogFormVisible: false,
      dialogTitle: "",
      form: {
        title: "",
        versions: "",
        url: "",
        type: "",
        marks: "",
        isUpdated: "",
        fileName : '',
      },
      rule: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        versions: [
          { required: true, message: "请输入版本号", trigger: "change" },
        ],
        url: [{ required: true, message: "请输入地址", trigger: "change" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        marks: [{ required: true, message: "请输入描述", trigger: "change" }],
        isUpdated: [
          { required: true, message: "请选择是否强制更新", trigger: "change" },
        ],
      },
      tableList: [],
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
      loadingInstance: "",
      itemId : '',
    };
  },
  created() {
    const userInfo = this.$store.state.userInfo;
    this.userid = userInfo.id;
    this.token = userInfo.token;
    this.getTableList();
  },
  methods: {
    // 删除--chm-2020.08.27
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: row.id,
            userid: this.userid,
            token: this.token,
          };
          appVersionDelete(params).then((res) => {
            if (res.data.status == "0") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getTableList();
            } else {
              this.$message({ type: "error", message: res.data.message });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 保存----chm----2020.08.26
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid == true) {
          if (this.dialogTitle == "新增") {
            let params = {
              ...this.form,
              url: this.form.url,
            };
            appVersionSave(params)
              .then((res) => {
                if (res.data.status == "0") {
                  this.$message({ type: "success", message: "添加成功" });
                  this.dialogFormVisible = false;
                  this.getTableList();
                }else{
                  this.$message({ type: "error", message: res.data.message })
                }
              })
              .catch((err) => {
                this.$message({ type: "error", message: "服务器异常..." });
              });
          }else{
            let params = {
              id : this.itemId,
              ...this.form,
              url: this.form.url,
            };
            appVersionUpdate(params).then(res => {
              if (res.data.status == '0') {
                this.$message({ type: "success", message: "修改成功" });
                  this.dialogFormVisible = false;
                  this.getTableList();
              }else{
                  this.$message({ type: "error", message: res.data.message })
                }
            })
          }
        } else {
          this.$message({ type: "error", message: "请输入必填项" });
        }
      });
    },

    alertModel(action, item) {
      
      this.dialogFormVisible = true;
      if (action == "add") {
        this.fileList = [];
        this.form = {};
        this.dialogTitle = "新增";
      }
      if (action == "edit") {
        this.fileList = [];
        this.dialogTitle = "编辑";
        this.itemId = item.id;
        this.form.title = item.title;
        this.form.versions = item.versions;
        this.form.type = item.type;
        this.form.marks = item.marks;
        this.form.isUpdated = item.isUpdated;
        this.form.url = item.url;
        this.form.fileName = item.fileName;
        let obj = {};
        obj.url = item.url;
        obj.name = item.fileName;
        this.fileList.push(obj);
      }
    },

    // 获取表格数据
    async getTableList() {
      let params = {
        pageNum: 1,
        pageSize: 1000,
        token: this.token,
        userid: this.userid,
      };
      let res = await appVersionList(params);
      if (res.data.status == "0") {
        this.tableList = res.data.data.list;
      } else {
        this.$message({ type: "error", message: res.data.message });
        judgeErroCode(res.data.status, res.data.message);
      }
    },

    /**
     * 通告书文件转为base64,并上传
     * params:event,file,fileList
     * create by YuXiong
     * date:2020-6-19
     */
    GetFile(event, file, fileList) {
      this.loadingInstance = this.$loading(this.loadingOptions);
      this.getBase64(file.raw).then((res) => {
        let params = {
          fileName: [file.name],
          fileStr: [res.split("base64,")[1]],
          token: this.token,
          userid: this.userid,
        };
        filePut(params)
          .then((fileResult) => {
            if (fileResult.data.status === "0") {
              let obj = {};
              obj.name = fileResult.data.data.fileNames[0];
              this.form.fileName = fileResult.data.data.fileNames[0];
              obj.url = fileResult.data.data.urls[0];
              this.fileList.push(obj);
              this.form.url = fileResult.data.data.urls[0];
            }
            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              this.loadingInstance.close();
            });
          })
          .catch((err) => {
            this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              this.loadingInstance.close();
            });
          });
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
      if (['apk', 'ipa'].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message({
          type: "warning",
          message: "请上传后缀名为.apk, .ipa的文件！",
        });
        return false;
      }
    },

    /**
     * 通告书文件转为base64
     * params:event,file,fileList
     * create by YuXiong
     * date:2020-6-19
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
     * 文件上传超出个数提示
     * params:file,fileList
     * create by YuXiong
     * date:2020-6-19
     */
    flieExceed(files, fileList) {
      this.$message({ type: "error", message: "只能上传一个文件" });
    },
    /**
     * 移除合同书文件
     * params:file,fileList
     * create by YuXiong
     * date:2020-6-19
     */
    removeFile() {
      this.fileList = [];
      this.form.url = '',
      this.form.fileName = '';
    },
  },
};
</script>


<style lang="less" scoped>
.table {
  margin: 40px;
  .red {
    color: red;
  }
}
</style>
