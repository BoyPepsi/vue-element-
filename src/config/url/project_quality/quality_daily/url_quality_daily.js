/**
 * =====================================================
 *                      质量日检
 */

let qualityDailyUrl = {
  qualityInspectList: "/qualityInspect/list", // 项目日检查信息_列表
  qualityInspectSave: "/qualityInspect/save", // 项目日检查信息_新增_无人
  qualityInspectPSave: "/qualityInspect/psave", // 项目日检查信息_新增_有人
  qualityInspectDelete: "/qualityInspect/delete", // 项目日检查信息_删除
  qualityInspectSaveDetail: "/qualityInspect/saveDetail", // 项目日检查问题明细信息_新增
  qualityInspectUpdate: "/qualityInspect/update", // 项目日检查信息_新增
  qualityInspectUpdateDetail: "/qualityInspect/updateDetail", // 项目日检查信息_修改
  qualityInspectQueryunit: "/qualityInspect/queryunit", // 获取地下室区块施工单位
  qualityInspectSaveCache: "/qualityInspect/savecache", // 存储表单缓存
  qualityInspectQuerycache: "/qualityInspect/querycache", //查询表单缓存
  maintableReview: "/maintable/review", //主体结构---复核
};

export default qualityDailyUrl;
