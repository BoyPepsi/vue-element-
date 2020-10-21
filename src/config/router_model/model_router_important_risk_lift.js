//项目安全---重大风险源----列表页
const importantRiskList = {
  path: "/importantRisk/list",
  meta: { title: "项目安全-旧版" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/project_safe_important_risk/inportant_risk_list.vue"
    ),
};

const importantRiskLists = {
  path: "/qualityCheck/risklist",
  meta: { title: "项目安全-新版" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/project_safe_important_risk/inportant_risk_lists.vue"
    ),
};

//项目安全---重大风险源----施工升降机----添加
const importantRiskLiftAdd = {
  path: "/importantRiskLift/add",
  meta: { title: "施工升降机-添加" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/project_safe_important_risk/lift/lift_add.vue"
    ),
};

//项目安全---重大风险源----施工升降机----详情
const importantRiskLiftDetail = {
  path: "/importantRiskLift/detail",
  meta: { title: "施工升降机-详情" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/project_safe_important_risk/lift/lift_detail.vue"
    ),
};



const routerProjectSafeImportantRisk = [
  importantRiskList,
  importantRiskLists,
  importantRiskLiftAdd,
  importantRiskLiftDetail
];

export default routerProjectSafeImportantRisk;
