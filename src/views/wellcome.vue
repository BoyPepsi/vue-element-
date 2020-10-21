<template>
  <div id="wellcomePage">
  </div>
</template>

<script>
import { judgeErroCode } from "@/utils/errorCode.js";
export default {
  name: "wellcome",
  data() {
    return {
      token: "",
      userid: "",
      isAdmin: "",
      proList: [], //项目列表
      swiperProList: []
    };
  },
  created() {

  },
  methods: {
    
  }
};
</script>

<style scoped lang='less'>
#wellcomePage {
  width: 100%;
  height: 100%;
  background: white;

  

  
  
}
</style>