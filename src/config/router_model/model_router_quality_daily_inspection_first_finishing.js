const qualityInspectFirstFinishingAdd = {
    path: "/qualityInspectFirstFinishing/add",
    meta: { title: "质量日检-初装修-添加" },
    component: () =>
        import(
            "@/views/pages/+menu_quality_inspect/quality_inspect_daily/first_finishing/quality_inspect_first_finishing_add.vue"
        ),
}

const qualityInspectFirstFinishingAddQuestion = {
    path: "/qualityInspectFirstFinishing/addQuestion",
    meta: { title: "质量日检-初装修-添加问题" },
    component: () =>
        import(
            "@/views/pages/+menu_quality_inspect/quality_inspect_daily/first_finishing/quality_inspect_first_finishing_add_questions.vue"
        ),
}

const qualityInspectFirstFinishingDetail = {
    path: "/qualityInspectFirstFinishing/detail",
    meta: { title: "质量日检-初装修-详情" },
    component: () =>
        import(
            "@/views/pages/+menu_quality_inspect/quality_inspect_daily/first_finishing/quality_inspect_first_finishing_detail.vue"
        ),
}


const qualityInspectFirstFinishing = [
    qualityInspectFirstFinishingAdd,
    qualityInspectFirstFinishingAddQuestion,
    qualityInspectFirstFinishingDetail
]

export default qualityInspectFirstFinishing;