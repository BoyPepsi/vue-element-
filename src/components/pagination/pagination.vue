<template>
  <div class="pagination">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10,20]"
      layout="total, sizes, prev, pager, next"
      :current-page.sync="currentIndex"
      :pager-count="5"
      :page-size="limit"
      :total="total"
      :small="small"
      ref="pagination"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "pagination",
  data() {
    return {
      currentIndex: this.currentPage
    };
  },
  props: {
    currentPage: {
      required: true,
      default: 1,
      type: Number
    },
    total: {
      required: false,
      default: 0
    },
    limit: {
      required: false,
      default: 10
    },
    small: {
      required: false,
      type: Boolean,
      default: false
    },
    showPage: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  watch: {
    currentPage(val) {
      if (typeof val === "number") {
        this.currentIndex = val;
      }
    }
  },
  methods: {
    // 当前页变化
    handleCurrentChange(val) {
      this.currentIndex = val;
      this.$emit("handleCurrentChange", val);
    },
    // size变化
    handleSizeChange(val) {
      this.currentIndex = 1;
      this.$emit("handleSizeChange", val);
    }
  }
};
</script>

<style scoped>
.pagination {
  margin: 40px 0 !important;
  text-align: center;
}
.pagination >>> .el-pagination button,
.pagination >>> .el-pager li {
  background-color: transparent !important;
  /* color: #b4c2dc !important; */
  border: 1px solid #0672c4;
  padding: 15px 20px !important;
  line-height: 1px !important;
  border-radius: 5px !important;
  vertical-align: middle !important;
}
.pagination
  >>> .el-pagination.is-background
  .el-pager
  li:not(.disabled).active {
  background-color: #0672c4 !important;
}
.el-pagination--small button,
.pagination >>> .el-pagination .el-pagination__total,
.el-pagination--smallspan {
  height: 32px !important;
  line-height: 32px !important;
}
.pagination >>> .el-pagination .btn-next .el-icon,
.pagination >>> .el-pagination .btn-prev .el-icon {
  margin-top: -5px !important;
}
.pagination >>> .el-pager li:last-child {
  border: 1px solid #0672c4;
}
</style>