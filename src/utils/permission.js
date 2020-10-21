/**
 * =============================================
 *
 * 此处配置管理自定义指令 处理页面下 按钮 权限
 *
 * =============================================
 */
import Vue from "vue";
import store from "@/store";

Vue.directive("permission", {
  inserted: (el, binding) => {
    let action = binding.value.action;
    let permsList = store.state.permsList;
    if (permsList.length > 0) {
      if (permsList.indexOf(action.replace(/\s/g, "")) === -1) {
        el.parentNode.removeChild(el);
      }
    } else {
      el.parentNode.removeChild(el);
    }
  },
});
