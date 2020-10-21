// ===================================项目质量验收-----主体结构=================================

const qualityAcceptanceMainStructureList = {
  path: "/qualityInspect/mainStructureList",
  meta: { title: "质量验收-主体结构-列表页" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/main_structure/quality_acceptance_main_structure_list.vue"
    ),
};

const qualityAcceptanceMainWallRebarAdd = {
  path: "/qualityCheck/mainStructure/wallRebar/add",
  meta: { title: "质量验收-主体结构-墙柱钢筋" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/main_structure/main_wall_rebar/add.vue"
    ),
};

const qualityAcceptanceMainWallRebarDetail = {
  path: "/qualityCheck/mainStructure/wallRebar/detail",
  meta: { title: "质量验收-主体结构-墙柱钢筋" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/main_structure/main_wall_rebar/detail.vue"
    ),
};
const qualityAcceptanceMainConcreteAdd = {
  path: "/qualityCheck/mainStructure/concrete/add",
  meta: { title: "质量验收-主体结构-梁板混泥土" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/main_structure/main_concrete/add.vue"
    ),
};

const qualityAcceptanceMainConcreteDetail = {
  path: "/qualityCheck/mainStructure/concrete/detail",
  meta: { title: "质量验收-主体结构-梁板混泥土" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/main_structure/main_concrete/detail.vue"
    ),
};
const qualityAcceptanceMainConcreteAddChild = {
  path: "/qualityCheck/mainStructure/concrete/addChild",
  meta: { title: "质量验收-主体结构-梁板混泥土" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/main_structure/main_concrete/add_child.vue"
    ),
};

const qualityAcceptanceSceondConstractAdd = {
  path: "/yu/qualityCheck/mainStructure/SceondConstract/add",
  meta: { title: "质量验收-主体结构-二次结构检查验收添加" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/main_structure/main_second_constract/add.vue"
    ),
};

const qualityAcceptanceSceondConstractDetail = {
  path: "/yu/qualityCheck/mainStructure/SceondConstract/detail",
  meta: { title: "质量验收-二次结构检查验收详细" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/main_structure/main_second_constract/detail.vue"
    ),
};

const routerQualityAcceptanceMainSturcture = [
  qualityAcceptanceMainStructureList,
  qualityAcceptanceMainWallRebarAdd,
  qualityAcceptanceMainWallRebarDetail,
  qualityAcceptanceMainConcreteAdd,
  qualityAcceptanceMainConcreteDetail,
  qualityAcceptanceMainConcreteAddChild,
  qualityAcceptanceSceondConstractAdd,
  qualityAcceptanceSceondConstractDetail,
];

export default routerQualityAcceptanceMainSturcture;
