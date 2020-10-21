<template>
  <div class="raise-list">
    <el-row v-for="item in raiseList" :key="item.index">
      <el-col :span="1">{{item.index}}</el-col>
      <el-col :span="5" v-if="item.cumulative !=null">
        <el-input v-model="item.cumulative">
          <template slot="prepend">{{item.label5}}:</template>
        </el-input>
      </el-col>
      <el-col :span="4" v-if="item.standard !=null">
        <el-input v-model="item.standard">
          <template slot="prepend">{{item.label1}}:</template>
        </el-input>
      </el-col>

      <el-col :span="4" v-if="item.penetration !=null">
        <el-input v-model="item.penetration">
          <template slot="prepend">{{item.label2}}:</template>
        </el-input>
      </el-col>
      <el-col :span="4" v-if="item.condition !=null">
        <el-input v-model="item.condition">
          <template slot="prepend">{{item.label3}}:</template>
        </el-input>
      </el-col>
      <el-col :span="6" class="right" v-if="item.isCheck !=null">
        <span>{{item.label4}}</span>
        <el-select placeholder="请选择" v-model="item.isCheck">
          <el-option key="0" label="不合格" value="0"></el-option>
          <el-option key="1" label="合格" value="1"></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "raise",
  props: {
    raiseList: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang='less'>
.raise-list {
  font-size: 14px;
  line-height: 60px;
  color: #999;
  /deep/ .el-select {
    margin-left: 15px;
    .el-input__inner {
      width: 90px;
    }
  }
  .right {
    text-align: right;
  }
}
</style>