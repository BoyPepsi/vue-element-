// ====================================问题库=================================
const questionListMultiple = {
  path: "/questionBaseList",
  meta: { title: "问题库-多选问题列表" },
  component: () =>
    import("@/views/pages/+menu_questions/questions_multiple.vue"),
};
const questionListSingle = {
  path: "/questionBase/singleList",
  meta: { title: "问题库-单选问题列表" },
  component: () =>
    import("@/views/pages/+menu_questions/questions_single.vue"),
};

const routerQuestion = [questionListMultiple, questionListSingle];

export default routerQuestion;
