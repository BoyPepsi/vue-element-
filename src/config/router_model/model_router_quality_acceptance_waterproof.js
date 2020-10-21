// ===================================项目质量验收防水工程=================================

// 卷材部分
// 汇总表
const coilSummary = {
  path: "/gzy/coil/summary",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coil/quality_acceptance_coil_summary.vue"
    ),
};

// 基层详情
const coilGrassrootsTreatmentDetail = {
  path: "/coilGrassrootsTreatment/detail",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coil/quality_acceptance_coil_grassroots_treatment_detail.vue"
    ),
};
// 基层新增
const coilGrassrootsTreatmentAdd = {
  path: "/gzy/coilGrassrootsTreatment/add",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coil/quality_acceptance_coil_grassroots_treatment_add.vue"
    ),
};

// 附加层详情
const coilAdditionalLayerDetail = {
  path: "/coilAdditionalLayer/detail",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coil/quality_acceptance_coil_additional_layer_detail.vue"
    ),
};
// 附加层新增
const coilAdditionalLayerAdd = {
  path: "/gzy/coilAdditionalLayer/add",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coil/quality_acceptance_coil_additional_layer_add.vue"
    ),
};

// 卷材验收详情
const coilCoilAcceptanceDetail = {
  path: "/coilCoilAcceptance/detail",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coil/quality_acceptance_coil_acceptance_detail.vue"
    ),
};
// 卷材验收新增
const coilCoilAcceptanceAdd = {
  path: "/gzy/coilCoilAcceptance/add",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coil/quality_acceptance_coil_acceptance_add.vue"
    ),
};

// 涂料部分
// 汇总表
const coatingSummary = {
  path: "/gzy/coating/summary",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coating/quality_acceptance_coating_summary.vue"
    ),
};

// 基层详情
const coatinGrassrootsTreatmentDetail = {
  path: "/coatinGrassrootsTreatment/detail",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coating/quality_acceptance_coating_grassroots_treatment_detail.vue"
    ),
};
// 基层新增
const coatinGrassrootsTreatmentAdd = {
  path: "/gzy/coatinGrassrootsTreatment/add",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coating/quality_acceptance_coating_grassroots_treatment_add.vue"
    ),
};

// 附加层详情
const coatingAdditionalLayerDetail = {
  path: "/coatingAdditionalLayer/detail",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coating/quality_acceptance_coating_additional_layer_detail.vue"
    ),
};
// 附加层新增
const coatingAdditionalLayerAdd = {
  path: "/gzy/coatingAdditionalLayer/add",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coating/quality_acceptance_coating_additional_layer_add.vue"
    ),
};

// 涂料验收详情
const coatingCoilAcceptanceDetail = {
  path: "/coatingCoilAcceptance/detail",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coating/quality_acceptance_coating_acceptance_detail.vue"
    ),
};
// 涂料验收新增
const coatingCoilAcceptanceAdd = {
  path: "/gzy/coatingCoilAcceptance/add",
  meta: { title: "防水工程" },
  component: () =>
    import(
      "@/views/pages/+menu_quality_inspect/quality_acceptance/waterproof/coating/quality_acceptance_coating_acceptance_add.vue"
    ),
};



const routerWaterproofWorks = [
  coilSummary,
  coilGrassrootsTreatmentDetail,
  coilGrassrootsTreatmentAdd,
  coilAdditionalLayerDetail,
  coilAdditionalLayerAdd,
  coilCoilAcceptanceDetail,
  coilCoilAcceptanceAdd,
  // ------------
  coatingSummary,
  coatinGrassrootsTreatmentDetail,
  coatinGrassrootsTreatmentAdd,
  coatingAdditionalLayerDetail,
  coatingAdditionalLayerAdd,
  coatingCoilAcceptanceDetail,
  coatingCoilAcceptanceAdd
];

export default routerWaterproofWorks;
