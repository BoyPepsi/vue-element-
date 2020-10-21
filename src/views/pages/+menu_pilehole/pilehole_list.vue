<template>
  <div id="roleList">
    桩孔信息
  </div>
</template>

<script>
import {
  getDictionarieList,
  getRoleList,
  getFinde,
  getMenu,
  saveRole,
  updateRole,
  deleteRole
} from "@/http/api.js";
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "pileholeLis",
  data() {
    return {
    };
  },
  created() {
    let userInfo = this.$store.state.userInfo;
  },
  methods: {
    
  }
};
</script>

<style scoped lang='less'>
  
</style>