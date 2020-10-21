/**
 * =====================================================
 *                       项目管理
 */

let projectListUrl = {
  listByids: "/construction/project/listByids", //普通用户项目列表
  proList: "/construction/project/list", // 项目列表
  proListNothing: "/construction/project/list/nothing", // 项目列表
  addPro: "/construction/project/save", // 添加项目
  updatePro: "/construction/project/update",
  detailPro: "/construction/project/detail",
  projectImport: "/construction/project/importSave", //项目导入
  bidImport: "/construction/project/bid/importSave", //标段导入
  bidUnitImport: "/construction/project/bid/unit/importSave", //参建单位导入
  basementImport : '/construction/project/bid/basement/importSave', //地下室导入
  buildImport : '/construction/project/bid/build/importSave', //楼栋导入
};

export default projectListUrl;
