<template>
  <div id="indexPage">
    <el-container>
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-container class="container">
        <el-aside class="aside">
          <el-menu
            class="el-menu-vertical-demo"
            :default-active="$route.path"
            :background-color="navigationConfig.background"
            :text-color="navigationConfig.text_color"
            :active-text-color="navigationConfig.active_text_color"
            :unique-opened="navigationConfig.unique"
            :router="navigationConfig.router"
            :default-openeds="arr"
          >
            <!-- 此处动态渲染 navigations 数据保存在 vuex -->
            <el-submenu v-for="nav in menu" :key="nav.name" :index="nav.name">
              <template slot="title">
                <i :class="nav.icon"></i>
                <span>{{nav.name}}</span>
              </template>
              <div v-for="subitem in nav.children" :key="subitem.name">
                <el-menu-item-group>
                  <el-menu-item :index="'/' + subitem.url">{{subitem.name}}</el-menu-item>
                </el-menu-item-group>
              </div>
            </el-submenu>
            <!--  <label v-for="nav in menu" :key="nav.name">
              <el-submenu v-if="nav.children.length !== 0" :index="'/' + nav.path">
                <template slot="title">
                  <i :class="nav.icon"></i>
                  <span>{{nav.name}}</span>
                </template>
                <el-menu-item-group v-for="subitem in nav.children" :key="subitem.name">
                  <el-menu-item :index="'/' + subitem.path">{{subitem.name}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </label>-->
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      // ========== 导航基本配置 =============
      navigationConfig: {
        background: "#324257",
        text_color: "#b0bbd2",
        active_text_color: "#4994ce",
        unique: true,
        router: true,
      },
      navigations: "",
      menu: this.$store.state.menuList,
      arr: [],
      // ========== 导航基本配置 结束 =============,
    };
  },
  created() {
    let iconArr = [
      "el-icon-user",
      "el-icon-reading",
      "el-icon-s-operation",
      "el-icon-coordinate",
      "el-icon-wind-power",
      "el-icon-edit",
      "el-icon-edit-outline",
      "el-icon-discount",
      "el-icon-office-building",
      "el-icon-school",
    ];
    if (this.menu.length > 0) {
      this.menu.forEach((item, index) => {
        item.icon = iconArr[index];
      });
    }
  },
  methods: {},
};
</script>

<style scoped lang="less">
@header_bg: #243041;
@header_bg_alpha: 1;
@main_bg: #fff;
@aside_bg: #324257;

#indexPage {
  width: 100%;
  // height: 100vh;
  overflow: hidden;
  .header {
    height: 60px;
    background: rgba(@header_bg, @header_bg_alpha);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
  }
  .container {
    height: 80%;
    margin-top: 60px;
    .aside {
      width: 12% !important;
      background: @aside_bg;
      overflow: hidden;
    }
    .main {
      margin: 0;
      padding: 0;
      min-height: 93.5vh;
      background: @main_bg;
      overflow: hidden;
    }
  }
  // 消除导航栏 侧边
  /deep/ .el-menu {
    border: none;
  }
}
</style>