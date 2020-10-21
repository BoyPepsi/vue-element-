// ===================================项目质量验收=================================

const qualityAcceptanceList = {
  path: "/qualityCheck/list",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/quality_acceptance_basement_list.vue"
    ),
};

//  筏板基础钢筋质量验收表---添加
const qualityAcceptanceRaftRebarAdd = {
  path: "/acceptanceRaftRebar/add",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/raft_base/add.vue"
    ),
};

//  筏板基础钢筋质量验收表---详细
const qualityAcceptanceRaftRebarDetail = {
  path: "/acceptanceRaftRebar/detail",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/raft_base/detail.vue"
    ),
};

//  基坑验槽检查/添加
const qualityAcceptanceFoundationAdd = {
  path: "/acceptanceFoundation/add",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/quality_acceptance_foundation_add.vue"
    ),
};

//  基坑验槽检查/详细
const qualityAcceptanceFoundationDetail = {
  path: "/acceptanceFoundation/detail",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/quality_acceptance_foundation_detail.vue"
    ),
};

// 地下室墙柱钢筋检查验收/添加-----曹慧敏---2020.07.07
const qualityAcceptanceWallIronAdd = {
  path: "/acceptanceWallIron/add",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/basement_wall/add.vue"
    ),
};

// 地下室墙柱钢筋检查验收/详情-----曹慧敏---2020.07.09
const qualityAcceptanceWallIronDetail = {
  path: "/acceptanceWallIron/detail",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/basement_wall/detail.vue"
    ),
};

//筏板混泥土验收表---添加
const qualityAcceptanceRaftConcreteAdd = {
  path: "/acceptanceRaftConcrete/add",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/raft_concrete/add.vue"
    ),
};

//筏板混泥土验收表---添加子表
const qualityAcceptanceRaftConcreteChildAdd = {
  path: "/acceptanceRaftConcreteChild/add",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/raft_concrete/add_child.vue"
    ),
};

//筏板混泥土验收表---详细
const qualityAcceptanceRaftConcreteDetail = {
  path: "/acceptanceRaftConcrete/detail",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/raft_concrete/detail.vue"
    ),
};

//地下室墙板梁柱混泥土---添加
const qualityAcceptanceWallConcreteAdd = {
  path: "/acceptanceWallConcrete/add",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/wall_concrete/add.vue"
    ),
};

//地下室墙板梁柱混泥土---添加子表
const qualityAcceptanceWallConcreteChildAdd = {
  path: "/acceptanceWallConcreteChild/add",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/wall_concrete/child_add.vue"
    ),
};

//地下室墙板梁柱混泥土---详细
const qualityAcceptanceWallConcreteDetail = {
  path: "/acceptanceWallConcrete/detail",
  meta: { title: "质量验收" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/basement/wall_concrete/detail.vue"
    ),
};

const routerQualityAcceptance = [
  qualityAcceptanceList,
  qualityAcceptanceRaftRebarAdd,
  qualityAcceptanceRaftRebarDetail,
  qualityAcceptanceFoundationAdd,
  qualityAcceptanceFoundationDetail,
  qualityAcceptanceWallIronAdd,
  qualityAcceptanceWallIronDetail,
  qualityAcceptanceRaftConcreteAdd,
  qualityAcceptanceRaftConcreteDetail,
  qualityAcceptanceRaftConcreteChildAdd,
  qualityAcceptanceWallConcreteAdd,
  qualityAcceptanceWallConcreteChildAdd,
  qualityAcceptanceWallConcreteDetail,
];

export default routerQualityAcceptance;
