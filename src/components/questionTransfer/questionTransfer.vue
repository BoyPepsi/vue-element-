<template>
  <el-transfer
    filterable
    :filter-method="filterMethod"
    filter-placeholder="请输入问题"
    v-model="selectData"
    :data="questionData"
    :titles="['问题总表', '已选择问题列表']"
    :render-content="renderFunc"
  ></el-transfer>
</template>

<script>
import { qualityQuestionDetailByProjectId } from "@/http/api.js";
export default {
  name: "questionTransfer",
  props: {},
  data() {
    return {
      token: "",
      userid: "",
      projectId: "",
      projectName: "",

      questionData: [],
      selectData: [],
    };
  },
  watch: {},
  created() {
    let userInfo = this.$store.state.userInfo;
    this.token = userInfo.token;
    this.userid = userInfo.id;
    this.projectId = userInfo.currProjectId;
    this.projectName = userInfo.currProjectName;
  },
  methods: {
    /**
     * 穿梭框搜索函数
     * params: none
     * create by gzy
     * date:2020.09.07
     */
    filterMethod(query, item) {
      return item.showText.indexOf(query) > -1;
    },
    /**
     * 穿梭框显示修改函数
     * params: none
     * create by gzy
     * date:2020.09.07
     */
    renderFunc(h, option) {
      return (
        <span title={option.showText}>{option.showText}</span>
        // ({option.mergePostion}){option.content}
      );
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-transfer-panel {
  width: 294px !important;
}
</style>