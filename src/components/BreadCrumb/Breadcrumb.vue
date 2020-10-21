<template>
  <div class="breadCrumbBox">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{options.secondNav}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="options.thirdNav">{{options.thirdNav}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "breadcrumb",
  props: {
    options: Object
  }
};
</script>

<style lang="less" scoped>
.breadCrumbBox {
  background: #fff;
  .el-breadcrumb {
    padding-left: 15px;
    line-height: 3;
  }
}
</style>