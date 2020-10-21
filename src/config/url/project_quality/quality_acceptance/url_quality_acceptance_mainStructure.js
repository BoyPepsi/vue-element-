/**
 * =====================================================
 *                      质量验收---主体结构
 */

let qualityAcceptanceMainStructureUrl = {
  getBuildList: "/construction/project/bid/build/list/querybuild", //获取楼栋
  getFloorByBuild: "/construction/project/bid/build/list/querybuildFloor", //楼栋_根据楼栋获取楼层
  getQueryBuildFloor: "/buildfloor/querybuildFloor", // 楼栋_根据楼栋获取楼层---new
  maintableAdd: "/maintable/add", //质量验收_主体结构_新增
  maintableList: "/maintable/list", //质量验收_主体结构_查询数据
  maintableDelete: "/maintable/delete", //质量验收主体结构删除
  maintableUpdate: "/maintable/update", //质量验收_主体结构_编辑信息
  maintableSavequeuecache: "maintable/savequeuecache", //安全检查，问题缓存
  maintableQuerysecuritydata: "/maintable/querysecuritydata", // 安全检查 ，表格数据查询
  maintableDeletequeuecache: "maintable/deletequeuecache", //安全检查，问题缓存删除某条数据
  maintableSyncdbtocache: "/maintable/syncdbtocache", //数据库数据同步到缓存
  queryBuildFloor: "/buildfloor/querybuildFloor", //根据楼栋获取楼层和施工单位
  continuecheck: "/maintable/continuecheck", // 继续检查判断
  childCheckCombox: "buildfloor/childCheckCombox", //  字典表获取检查分项-list
};

export default qualityAcceptanceMainStructureUrl;
