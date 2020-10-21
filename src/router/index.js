import Vue from "vue";
import VueRouter from "vue-router";
import routes from "@/router/routes";

Vue.use(VueRouter);
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.path === "/") {
    next();
  } else {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (!userInfo) {
      next("/");
    } else {
      next();
    }
  }
});

export default router;
