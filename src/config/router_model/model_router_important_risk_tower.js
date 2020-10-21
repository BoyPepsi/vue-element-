


const importantRiskTowersAdd = {
  path: "/importantRiskTowers/add",
  meta: { title: "塔吊新增" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/project_safe_important_risk/tower/towers_add.vue"
    ),
};

//项目安全---重大风险源----塔吊----详情
const importantRiskTowersDetail = {
  path: "/importantRiskTowers/detail",
  meta: { title: "塔吊详情" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/project_safe_important_risk/tower/towers_detail.vue"
    ),
};

const routerProjectSafeImportantRiskTower = [
  importantRiskTowersAdd,
  importantRiskTowersDetail
];

export default routerProjectSafeImportantRiskTower;
