import * as types from "./types";

const mutations = {
  [types.SAVE_USERINFO](state, userInfo) {
    state.userInfo = userInfo;
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
  },
  [types.RECEIVE_MENU_LIST](state, menuList) {
    state.menuList = menuList;
    sessionStorage.setItem("menuList", JSON.stringify(menuList));
  },
  [types.LOGIN_INFO](state, loginInfo) {
    localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
  },
  [types.PERMS_LIST](state, permsList) {
    state.permsList = permsList;
    sessionStorage.setItem("permsList", JSON.stringify(permsList));
  },
  [types.QUALITY_CHECKLIST](state, qualityList) {
    localStorage.setItem("qualityList", JSON.stringify(qualityList));
  },
  [types.ROMOVE_QUALITY_CHECKLIST](state) {
    localStorage.removeItem("qualityList");
  },
  [types.SAVFORMDATA](state, formData) {
    localStorage.setItem("SAVFORMDATA", JSON.stringify(formData));
  },
  [types.REMOVE_FORMDATA](state) {
    localStorage.removeItem("SAVFORMDATA");
  },
};

export default mutations;
