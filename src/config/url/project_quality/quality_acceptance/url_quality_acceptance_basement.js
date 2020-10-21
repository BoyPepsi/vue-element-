/**
 * =====================================================
 *                      质量验收---地下室结构
 */

let qualityAcceptanceBasementUrl = {
  qualityCheckList: "/qualityCheck/list", //质量验收_列表
  qualityCheckrebarAdd: "/qualityCheck/rebar_install_add", // 筏板基础钢筋质量验收表_新增
  qualityCheckrebarUpdate: "/qualityCheck/rebar_install_update", // 筏板基础钢筋质量验收表_编辑
  qualityCheckPublicAdd: "/qualityCheck/qualitypublic_add", //筏板基础模板质量验收表2地下室钢管扣件模板、支撑架检查3垫层施工检查验收表4地下室模板拆除检查5垫层施工检查验收表5砖模施工检查验收表6基坑验槽检查_新增
  qualityCheckPublicUpdate: "/qualityCheck/qualitypublic_update",
  qualityWallIronAdd: "/qualityCheck/wall_column_add", //地下室墙柱钢筋检查验收表/新增
  qualityWallIronUpdate: "/qualityCheck/wall_column_update", //地下室墙柱钢筋检查验收表/更新
  qualityCheckBatchupdate: "/qualityCheck/rebar_install_batchupdate", // 筏板基础钢筋质量验收表_多个修改
  qualityCheckDelete: "/qualityCheck/delete", // 列表删除
  qualityChecBaseBetonAdd: "/qualityCheck/base_beton_add", //1-筏板混凝土浇筑检查-11混凝土浇筑前检查12混凝土浇筑过程检查2-地下室墙柱、梁板混凝土浇筑检查-11混凝土浇筑前检查12混凝土浇筑过程检查_新增
  qualityChecBaseBetonquery: "/qualityCheck/base_beton_query", // 子表查询列表数据
  qualityCheckBaseBetonUpdate: "qualityCheck/base_beton_update", // 混泥土表复核
  qualityCheckBaseBetonCheckAdd: "qualityCheck/base_beton_checkadd", // 是否能够继续检查
  qualityCheckEditQuestionBimStatus: "/qualityCheck/editQuestionBimStatus", // 质量验收详情
  qualityCheckGetQuestionBimStatus: "qualityCheck/getQuestionBimStatus", // 获取质量日检详情状态
  maintableRebarcheckitem: "/maintable/rebarcheckitem", // 筏板基础钢筋质量验收表-继续检查-判断到第几项
};

export default qualityAcceptanceBasementUrl;
