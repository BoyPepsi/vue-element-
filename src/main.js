import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import component from "@/utils/component";
import "./plugins/element.js";
import "./utils/permission.js";
import "normalize.css";
import "default-passive-events";
import D2Crud from "@d2-projects/d2-crud";
import "babel-polyfill";
import VueBus from "vue-bus";
import publicFilters from "@/utils/filter.js";
import all from "@/utils/help.js";
import data from "@/config/json/commonData.json";

for (let key in publicFilters) {
  Vue.filter(key, publicFilters[key]);
}
Vue.config.productionTip = false;
Vue.use(component);
Vue.use(D2Crud);
Vue.use(VueBus);
Vue.prototype.commonData = data;
Vue.use(all,router);
new Vue({
  router,
  store,
  render: (h) => h(App),
  data: {
    eventHub: new Vue(),
  },
}).$mount("#app");
