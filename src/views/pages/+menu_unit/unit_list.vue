<template>
  <div id="roleList">
    <bread-crumb :options="options"></bread-crumb>
    <div class="content">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="单位名称">
          <el-input v-model="handle.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearch" size="medium" icon="el-icon-search">查询</el-button>
          <el-button
            type="primary"
            @click="detailForm(0,'')"
            v-permission="{action: 'unit:save' }"
            size="medium"
            icon="el-icon-plus"
          >添加</el-button>
        </el-form-item>
      </el-form>
      <div class="table">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="{
            'background-color': '#fafafa',
            'color': '#90333',
          }"
        >
          <el-table-column label="单位" prop="name" min-width="20%" align="center"></el-table-column>
          <el-table-column label="单位类型" prop="type" min-width="20%" align="center">
            <template slot-scope="scope">
              <span>
                {{scope.row.type==='1'?
                '建设单位'
                :scope.row.type==='2'
                ? '监理单位'
                :scope.row.type==='3'
                ? '施工单位(总包)'
                :scope.row.type==='4'
                ? '施工单位(分包)'
                :scope.row.type==='5'
                ? '设计单位'
                : scope.row.type==='6'
                ? "勘察单位"
                : scope.row.type==='7'
                ? "检测单位"
                : scope.row.type==='8'
                 ? "监测单位" : "商混供应单位"
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="联系人" prop="contactPerson" min-width="10%" align="center"></el-table-column>
          <el-table-column label="联系电话" prop="contactPhoneNumber" min-width="20%" align="center"></el-table-column>
          <el-table-column label="操作" min-width="20%" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="detailForm(1,scope.row)"
                v-permission="{action: 'unit:update' }"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :currentPage="currentPage"
          :total="total"
          :limit="limit"
          :small="true"
          :showPage="showPage"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        />
      </div>
      <!--单位-弹窗 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="showModel"
        width="40%"
        :before-close="handleClose"
        center
      >
        <el-form
          :model="editForm"
          :rules="userRule"
          ref="editForm"
          label-width="100px"
          class="form_class"
        >
          <el-form-item label="单位类型:" prop="type">
            <el-select placeholder="请选择单位类型:" v-model="editForm.type" @change="changeType">
              <el-option
                v-for="item in typeList"
                :key="item.type"
                :label="item.label"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位名称:" prop="name">
            <el-select
              placeholder="请选择单位名称:"
              v-model="editForm.name"
              value-key="id"
              @change="nameChange"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人:">
            <el-input v-model="editForm.contactPerson" style="width:37%"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:">
            <el-input maxlength="11" v-model="editForm.contactPhoneNumber" style="width:37%"></el-input>
          </el-form-item>
          <el-form-item label="单位资质:" v-if="showCheck">
            <div class="check_class">
              <el-checkbox-group v-model="qualifications" @change="changeCheckbox">
                <el-checkbox
                  v-for="item in buildData"
                  :label="item.value"
                  :key="item.name"
                  :value="item.value"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="editForm.remark" style="width:37%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitButton" size="mini">{{btnText}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getUnitList,
  getUnitListNothing,
  saveUnit,
  detailUnit,
  updateUnit,
  getDictionarieList,
  dictionarieNothing
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
import pagination from "@/components/pagination/pagination";

export default {
  name: "unitList",
  components: {
    pagination
  },
  data() {
    return {
      options: {
        secondNav: "单位管理",
        thirdNav: "单位列表"
      },
      name: "", // 单位名称
      tableData: [], // 单位列表
      dialogTitle: "添加单位",

      showModel: false, // 隐藏模态框
      // 新增or修改
      // nameSelect: {
      //   id:'',
      //   name: ''
      // },
      editForm: {
        type: "", // 单位类型
        sysId: "", // 单位id
        sysCode: "", // 单位code
        name: {}, // 名称
        contactPerson: "", // 联系人
        contactPhoneNumber: "", // 联系电话
        remark: "" // 备注
      },
      nameDan: "",
      // 单位类型
      typeList: [
        {
          type: "1",
          label: "建设单位"
        },
        {
          type: "2",
          label: "监理单位"
        },
        {
          type: "3",
          label: "施工单位(总包)"
        },
        {
          type: "4",
          label: "施工单位(分包)"
        },
        {
          type: "5",
          label: "设计单位"
        },
        {
          type: "6",
          label: "勘察单位"
        },
        {
          type : "7",
          label : "检测单位"
        },
        {
          type : "8",
          label : "监测单位"
        },
        {
          type : "9",
          label : "商混供应单位"
        }
      ],
      btnText: "提 交", // 模态框按钮文字
      userRule: {
        name: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
        type:[{ required: true, message: "请选择单位类型", trigger: "blur" }]
      },
      currentPage: 1, // 页码
      limit: 10, // 一页5条数据
      total: 0,
      showPage: true, // 分页显示
      myBtn: false, // 模态框按钮
      handle: {
        userId: "", // 用户id
        toKen: "", // 用户token
        pageSize: 10, // 页数
        pageNum: 1, //  页码
        name: ""
      },
      companyList: [],
      // 单位资质
      qualifications: [],
      buildData: [
        { value: "1", name: "桩基单位" },
        { value: "2", name: "门窗单位" },
        { value: "3", name: "消防单位" },
        { value: "4", name: "弱电单位" },
        { value: "5", name: "园林单位" },
        { value: "6", name: "幕墙单位" },
        { value: "7", name: "栏杆百叶窗单位" },
        { value: "8", name: "暖通单位" },
        { value: "9", name: "电梯单位" },
        { value: "10", name: "人防单位" }
      ],
      showCheck: false
    };
  },
  created() {
    const userInfo = this.$store.state.userInfo;
    this.handle.userId = userInfo.id;
    this.handle.toKen = userInfo.token;

    this.handle.pageSize = this.limit;
    this.handle.pageNum = this.currentPage;
    this.getDictionarieData(this.handle);
    this.getCompanyList();
  },
  methods: {
    // 获取单位列表
    getDictionarieData(params) {
      // getUnitList(params)
      getUnitListNothing(params)  //无权限获取单位列表
        .then(res => {
          if (res.data.status === "0") {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch(err => {
          this.$message({ type: "error", message: "服务器响应失败..." });
        });
    },
    // 获取公司列表
    async getCompanyList(parentId) {
      parentId = "bc7b99932b23464fa0917b147ab62dc6";
      let params = {
        pageNum: 1,
        pageSize: 10000,
        parentid: parentId,
        token: this.handle.toKen,
        userId: this.handle.userId
      };
      try {
        // let res = await getDictionarieList(params);
        // 改为无权限获取公司列表
        let res = await dictionarieNothing(params);
        if (res.data.status === "0") {
          this.companyList = res.data.data.list;
        } else {
          judgeErroCode(res.data.status, res.data.message);
        }
      } catch (error) {
        this.$message({ type: "error", message: "服务器响应失败..." });
      }
    },
    // 选择单位类型
    changeType(val) {
      if (val === "4") {
        this.showCheck = true;
      } else {
        this.showCheck = false;
      }
    },
    // 选择公司名称
    nameChange(val) {
      this.editForm.sysId = val.id;
      this.editForm.sysCode = val.code;
      this.nameDan = val.name;
    },
    // 查询
    onSearch() {
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getDictionarieData(this.handle);
    },

    // 新增 or 编辑
    detailForm(s, row) {
      this.showModel = true;
      // 新增
      if (s === 0) {
        this.dialogTitle = "新增单位";
        this.btnText = "提交";
      } else if (s === 1) {
        // 编辑
        this.dialogTitle = "编辑单位";
        this.btnText = "修改";
        this.getDetail(row.id);
      }
    },
    // 选择单位资质
    changeCheckbox(val) {},
    // 获取单位详情
    getDetail(id) {
      let params = {
        id: id,
        token: this.handle.toKen,
        userId: this.handle.userId
      };
      detailUnit(params)
        .then(res => {
          if (res.data.status === "0") {
            this.editForm = res.data.data;
            this.nameDan = res.data.data.name;
            if (res.data.data.type === "4") {
              this.showCheck = true;
              this.qualifications = res.data.data.qualification;
            } else {
              this.showCheck = false;
            }
          } else {
            judgeErroCode(res.data.status, res.data.message);
          }
        })
        .catch(res => {});
    },
    // 关闭模态框
    handleClose() {
      this.showModel = false;
      this.editForm = {};
      this.qualifications = [];
      this.showCheck = false;
      this.$refs.editForm.resetFields();
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handle.pageNum = val;
      this.getDictionarieData(this.handle);
    },
    /**
     * 分页每条数目改变，则回到第一页数据，列表重新加载
     */
    handleSizeChange(val) {
      this.limit = val;
      this.handle.pageSize = val;
      this.currentPage = 1;
      this.handle.pageNum = 1;
      this.getDictionarieData(this.handle);
    },
    // 提交模态框确认按钮
    submitButton() {
      let params = {
        type: this.editForm.type, // 单位类型
        name: this.nameDan, // 名称
        qualifications: this.qualifications,
        sysCode: this.editForm.sysCode,
        sysId: this.editForm.sysId,
        contactPerson: this.editForm.contactPerson, // 联系人
        contactPhoneNumber: this.editForm.contactPhoneNumber, // 联系电话
        remark: this.editForm.remark, // 备注
        token: this.handle.toKen,
        userId: this.handle.userId
      };
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.dialogTitle === "新增单位") {
            saveUnit(params)
              .then(res => {
                if (res.data.status === "0") {
                  this.$message({ type: "success", message: "添加成功!" });
                  this.handleClose();
                  this.getDictionarieData(this.handle);
                } else {
                  judgeErroCode(res.data.status, res.data.message);
                }
              })
              .catch(res => {
                this.$message({ type: "error", message: "服务器响应失败..." });
              });
          } else if (this.dialogTitle === "编辑单位") {
            let params = {
              type: this.editForm.type, // 单位类型
              name: this.nameDan, // 名称
              qualifications: this.qualifications,
              sysId: this.editForm.sysId,
              id: this.editForm.id,
              sysCode: this.editForm.sysCode,
              contactPerson: this.editForm.contactPerson, // 联系人
              contactPhoneNumber: this.editForm.contactPhoneNumber, // 联系电话
              remark: this.editForm.remark, // 备注
              token: this.handle.toKen,
              userId: this.handle.userId
            };
            updateUnit(params)
              .then(res => {
                if (res.data.status === "0") {
                  this.$message({ type: "success", message: "修改成功!" });
                  this.handleClose();
                  this.getDictionarieData(this.handle);
                } else {
                  judgeErroCode(res.data.status, res.data.message);
                }
              })
              .catch(res => {
                this.$message({ type: "error", message: "服务器响应失败..." });
              });
          }
        }
      });
    },
    // 重置一些
    resetSth() {}
  }
};
</script>

<style scoped lang='less'>
.content {
  padding-left: 15px;
  // input 样式
  /deep/ .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
  }
  // 分页
  .pagination {
    margin-top: 15px;
    text-align: center;
  }
  .table {
    padding: 30px;
  }
  // 模态框的form
  .form_class {
    margin-left: 10%;
  }
}
.pagination {
  margin-top: 15px;
  text-align: center;
}
/* // 表格-删除按钮 */
.red {
  color: #ff0000;
}
</style>