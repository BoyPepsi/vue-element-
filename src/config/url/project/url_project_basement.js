/**
 * =====================================================
 *                        地下室管理
 */

let projectBasementUrl = {
  // baseList: "/construction/project/bid/basement/list",  //列表
  baseList: "/construction/project/bid/basement/list/nothing", //列表
  baseListNothing: "/construction/project/bid/basement/list/nothing",
  saveBaseList: "/construction/project/bid/basement/save", // 添加
  updateBaseList: "/construction/project/bid/basement/update", // 修改
  delBaseList: "/construction/project/bid/basement/delete", // 删除
  serchLit: "/construction/project/bid/basement/find", // 查询

  // new-----2020.09.1
  getbasementList : '/buildfloor/basementlist',  //项目id-地下室区域集合
  getFloors : '/buildfloor/querybasementFloor', //地下室区域_根据地下室区域获取楼层和施工单位
};

export default projectBasementUrl;
