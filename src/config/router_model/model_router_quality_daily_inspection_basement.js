// ===================================项目质量=================================

//  ！！！！！！！！！！！！！！！！！！！！地下室！！！！！！！！！！！！！！！！
/**
 * 垫层日检表-----砖模日检表-----筏板基础模板日检表          加载模板1
 *
 * 筏板基础钢筋日检表                                   加载模板2
 *
 * 地下室钢管扣件模板、支撑架日检表-----地下室墙柱钢筋日检表---地下室梁板钢筋日检表   加载模板3
 *
 * 冠梁混凝土支撑钢筋、模板日检表                    加载模板4
 *
 */

const qualityInspectList = {
  path: "/qualityInspect/list",
  meta: { title: "质量日检" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_basement_list.vue"
    ),
};

const qualityInspectBasementAdd = {
  path: "/qualityInspectBasement/add",
  meta: { title: "质量日检-地下室-新增" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_basement_add.vue"
    ),
};


const qualityInspectBasementAddQuestions = {
  path: "/qualityInspect/inspectBasementAddQuestions",
  meta: { title: "质量日检-地下室-添加问题" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_basement_add_questions.vue"
    ),
};

const qualityInspectBasementDetail = {
  path: "/qualityInspectBasement/detail",
  meta: { title: "质量日检-地下室-详情" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_basement_detail.vue"
    ),
}


// const qualityInspectAddQuestions = {
//   path: "/qualityInspect/inspectAddQuestions",
//   meta: { title: "质量日检-添加问题" },
//   component: () =>
//     import(
//       "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_add_questions.vue"
//     ),
// };

// const qualityInspectAdd = {
//   path: "/inspectCushion/list",
//   // meta: { title: "质量日检-垫层日检表" },
//   meta: { title: "质量日检" },
//   component: () =>
//     import(
//       "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_template1.vue"
//     ),
// };

// const qualityInspectDetail = {
//   path: "/inspectCushion/detail",
//   // meta: { title: "质量日检-垫层日检表" },
//   meta: { title: "质量日检详情" },
//   component: () =>
//     import(
//       "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_template1_detail.vue"
//     ),
// };

// const qualityInspectRaftRebar = {
//   path: "/inspectRaftRebar/list",
//   // meta: { title: "质量日检-筏板基础钢筋日检表" },
//   meta: { title: "质量日检" },
//   component: () =>
//     import(
//       "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_template2.vue"
//     ),
// };

// const qualityInspectRaftRebarDetail = {
//   path: "/inspectRaftRebar/detail",
//   // meta: { title: "质量日检-垫层日检表" },
//   meta: { title: "质量日检详情" },
//   component: () =>
//     import(
//       "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_template2_detail.vue"
//     ),
// };

// const qualityInspectBasementBeamList = {
//   path: "/inspectBasementBeam/list",
//   // meta: { title: "质量日检-地下室梁板钢筋日检表" },
//   meta: { title: "质量日检" },
//   component: () =>
//     import(
//       "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_template3.vue"
//     ),
// };

// const qualityInspectBasementBeamDetail = {
//   path: "/inspectBasementBeam/detail",
//   // meta: { title: "质量日检-垫层日检表" },
//   meta: { title: "质量日检详情" },
//   component: () =>
//     import(
//       "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_template3_detail.vue"
//     ),
// };

// const qualityInspectCrownList = {
//   path: "/inspectCrown/list",
//   // meta: { title: "质量日检-冠梁混凝土支撑钢筋、模板日检表" },
//   meta: { title: "质量日检" },
//   component: () =>
//     import(
//       "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_template4.vue"
//     ),
// };

// const qualityInspectCrownDetail = {
//   path: "/inspectCrown/detail",
//   // meta: { title: "质量日检-垫层日检表" },
//   meta: { title: "质量日检详情" },
//   component: () =>
//     import(
//       "@/views/pages/+menu_quality_inspect/quality_inspect_daily/basement/quality_inspect_template4_detail.vue"
//     ),
// };

const routerQualityDailyInspection = [
  qualityInspectList,
  // qualityInspectAdd,
  // qualityInspectRaftRebar,
  // qualityInspectAddQuestions,
  // qualityInspectBasementBeamList,
  // qualityInspectCrownList,
  // qualityInspectDetail,
  // qualityInspectRaftRebarDetail,
  // qualityInspectBasementBeamDetail,
  // qualityInspectCrownDetail,
  qualityInspectBasementAdd,
  qualityInspectBasementAddQuestions,
  qualityInspectBasementDetail
];

export default routerQualityDailyInspection;
