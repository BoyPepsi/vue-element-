//项目安全---重大风险源----物料提升机----添加
const importantRiskMaterialHoistAdd = {
    path: "/importantRiskMaterialHoist/add",
    meta: { title: "物料提升机新增" },
    component: () =>
      import(
        "@/views/pages/+menu_project_safe/project_safe_important_risk/material_hoist/material_hoist_add.vue"
      ),
  };
  
  //项目安全---重大风险源----物料提升机----详情
  const importantRiskMaterialHoistDetail = {
    path: "/importantRiskMaterialHoist/detail",
    meta: { title: "物料提升机详情" },
    component: () =>
      import(
        "@/views/pages/+menu_project_safe/project_safe_important_risk/material_hoist/material_hoist_detail.vue"
      ),
  };

  const routerProjectSafeImportantRiskMaterialHoist = [
    importantRiskMaterialHoistAdd,
    importantRiskMaterialHoistDetail,
  ];

  export default routerProjectSafeImportantRiskMaterialHoist;
  