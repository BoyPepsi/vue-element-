
const qualityInspectMainStructureList = {
    path: "/qualityInspect/inspectMainStructureList",
    meta: { title: "质量日检-主体结构" },
    component: () =>
        import(
            "@/views/pages/+menu_quality_inspect/quality_inspect_daily/mainStructure/quality_inspect_main_structure_list.vue"
        ),
}

const qualityInspectMainStructureAddQuestions = {
    path: "/qualityInspect/inspectMainStructureAddQuestions",
    meta: { title: "质量日检-主体结构-添加问题" },
    component: () =>
        import(
            "@/views/pages/+menu_quality_inspect/quality_inspect_daily/mainStructure/quality_inspect_main_structure_add_questions.vue"
        ),
};

const qualityInspectMainStructureAdd = {
    path: "/qualityInspectMainStructure/add",
    meta: { title: "质量日检-主体结构-添加" },
    component: () =>
        import(
            "@/views/pages/+menu_quality_inspect/quality_inspect_daily/mainStructure/quality_inspect_main_structure_add.vue"
        ),
}

const qualityInspectMainStructureDetail = {
    path: "/qualityInspectMainStructure/detail",
    meta: { title: "质量日检-主体结构-详情" },
    component: () =>
        import(
            "@/views/pages/+menu_quality_inspect/quality_inspect_daily/mainStructure/quality_inspect_main_structure_detail.vue"
        ),
}

const qualityInspectMainStructure = [
    qualityInspectMainStructureAddQuestions,
    qualityInspectMainStructureAdd,
    qualityInspectMainStructureDetail,
    qualityInspectMainStructureList
]

export default qualityInspectMainStructure;