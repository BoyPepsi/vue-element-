<template>
  <div class="mixed-info">
    <p v-if="showMixedList">混凝土信息</p>
    <div v-if="showMixedList">
      <div v-for="item in mixedList" :key="item.id" class="list-item">
        <el-row>
          <el-col :span="8">
            <el-input v-model="item.level">
              <template slot="prepend">砼强度及抗渗等级:</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <span>使用位置:</span>
            <el-select placeholder="请选择" v-model="item.application" class="select" v-if="!isWall">
              <el-option label="筏板" value="1" key="1"></el-option>
              <el-option label="底板" value="2" key="2"></el-option>
            </el-select>
            <el-select placeholder="请选择" v-model="item.application" class="select" v-if="isWall">
              <el-option label="墙柱楼层" value="1" key="1"></el-option>
              <el-option label="梁板楼层" value="2" key="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input v-model="item.plan">
              <template slot="prepend">预计方量(立方):</template>
            </el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="minxed-list-second">
      <el-row class="list-item">
        <el-col :span="10">
          <el-input
            v-model="mixedListObj.car"
            type="number"
            oninput="if(value.length>11)value=value.slice(0,11)"
          >
            <template slot="prepend">汽车泵:</template>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-input
            v-model="mixedListObj.earth"
            type="number"
            oninput="if(value.length>11)value=value.slice(0,11)"
          >
            <template slot="prepend">地泵:</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row class="list-item">
        <el-col :span="10">
          <el-input
            v-model="mixedListObj.shock"
            type="number"
            oninput="if(value.length>11)value=value.slice(0,11)"
          >
            <template slot="prepend">振动棒:</template>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-input
            v-model="mixedListObj.people"
            type="number"
            oninput="if(value.length>11)value=value.slice(0,11)"
          >
            <template slot="prepend">
              <span class="red">*</span>泥工人数:
            </template>
          </el-input>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { filePut } from "@/http/api.js";
export default {
  name: "mixedInfo",
  data() {
    return {
      mixedList: [
        {
          id: 1,
          level: "",
          application: "1",
          plan: "",
        },
        {
          id: 2,
          level: "",
          application: "1",
          plan: "",
        },
        {
          id: 3,
          level: "",
          application: "1",
          plan: "",
        },
      ],
      mixedListObj: {
        car: "",
        earth: "",
        shock: "",
        people: "",
      },
    };
  },
  props: {
    showMixedList: {
      type: Boolean,
      required: true,
    },
    isWall: {
      type: Boolean,
      required: false,
    },
  },
  watch: {},
  methods: {},
};
</script>

<style scoped lang="less">
p {
  font-size: 14px;
  color: #999;
}
.list-item {
  margin-top: 30px;
  color: #999;
  font-size: 14px;
}
/deep/ .el-input__inner {
  width: 240px;
  display: inline;
}
/deep/ .el-input-group__prepend {
  width: 100px;
  text-align: left !important;
  padding: 0 20px 0 0;
}
.select {
  margin-left: 15px;
}
.minxed-list-second {
  border-top: 1px dashed #ccc;
  padding-top: 10px;
  margin-top: 20px;
}
.red {
  font-size: 18px;
  color: #f00;
}
</style>