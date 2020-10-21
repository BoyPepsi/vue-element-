// 共用方法
exports.install = function(Vue, router) {
  Vue.prototype.$formMap = function(list, obj) {
    if (!list || list.length === 0) {
      return obj;
    }
    if (!obj) {
      return {};
    }
    Object.keys(obj).forEach((key) => {
      list.forEach((item) => {
        if (item.key === key) {
          obj[key] = item.value;
        }
      });
    });
    return obj;
  };
  // 通过add，获取detailurl
  Vue.prototype.$getDetailUrl = () => {
    let currentUrl = router.history.current.path;
    let detailUrl = "";
    if (currentUrl.indexOf("add") > -1) {
      detailUrl = currentUrl.replace("add", "detail");
    } else {
      detailUrl = currentUrl;
    }
    return detailUrl;
  };
};
