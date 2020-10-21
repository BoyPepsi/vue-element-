/**
 * =====================================================
 *                        项目安全
 */

let projectSafeUrl = {
  // baseList: "/construction/project/bid/basement/list",  //列表
  securityCheckAdd: "/qualityCheck/securitycheck_add", //项目安全保存
  securityCheckList: "/qualityCheck/securitylist", //项目列表
  securityCheckUpdate: "/qualityCheck/securitycheck_update", //安全检查，安全日检 复核删除
  qualityInspectSavequeuecache: "qualityInspect/savequeuecache", //安全检查，问题缓存
  qualityInspectQueryqueuecache: "qualityInspect/queryqueuecache", //安全检查，问题缓存查询
  qualityInspectDeletequeuecache: "qualityInspect/deletequeuecache", //安全检查，问题缓存删除某条数据
  qualityInspectDeleteQuestionbyPrimaryid:
    "qualityInspect/deleteQuestionbyPrimaryid", // 删除某条数据
  qualityInspectUpdatequeuecache: "qualityInspect/updatequeuecache", //安全检查，更新缓存
  qualityCheckRisklist: "/qualityCheck/risklist", // 质量重大风险源_列表
  qualityInspectQuerysecuritydata: "/qualityInspect/querysecuritydata", // 安全检查 ，表格数据查询
  qualityCheckRiskcheckAdd: "/qualityCheck/riskcheck_add", // 质量重大风险源_新增
  qualityCheckRiskcheckUpdate: "/qualityCheck/riskcheck_update", // 重大风险源_复核删除
  getBuildUnit : "/buildfloor/baseBuildUnit", //项目查-(总包)施工单位
  getSubUnit : "/buildfloor/baseSubUnit", //查所有-(分包)施工单位
};

export default projectSafeUrl;
