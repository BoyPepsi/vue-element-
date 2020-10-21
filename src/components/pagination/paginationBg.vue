<template>
  <div class="paginationBg">
    <!-- 蓝色背景块儿 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :total="totals"
      :page-size="pageLimit"
      :small="small"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "pagination",
  data() {
    return {
      currentPage: 1
    };
  },
  props: {
    totals: {
      required: false,
      default: 0
    },
    pageLimit: {
      required: false,
      default: 10
    },
    small: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  watch: {
    currentPage(val) {
      if (typeof val === "number") {
        this.currentPage = val;
      }
    }
  },
  methods: {
    // 当前页变化
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    }
  }
};
</script>

<style scoped>
.paginationBg {
  margin: 20px 0;
  text-align: center;
}
</style>