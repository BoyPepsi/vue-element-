const projectSecurityList = {
  //安全检查----周检
  path: "/projectSecurityList",
  meta: { title: "安全检查" },
  component: () =>
    import("@/views/pages/+menu_project_safe/check_safe/check_safe_list"),
};

const projectSecurityListOld = {
  //安全检查----周检
  path: "/projectSecurityListOld",
  meta: { title: "安全检查" },
  component: () =>
    import("@/views/pages/+menu_project_safe/check_safe/check_safe_list_old"),
};

const safeWeekAdd = {
  path: "/safeWeek/add",  //安全周检新增
  meta: { title: "安全周检新增" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/check_safe/week/add"
    ),
};

const safeWeekAddQuestion = {
  path: "/safeWeek/addQuestion", //地下室安全检查---新增
  meta: { title: "安全周检新增问题" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/check_safe/week/add_question"
    ),
};

const safeWeekDetail = {
  path: "/safeWeek/detail", //地下室安全检查---新增
  meta: { title: "安全周检详情" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/check_safe/week/detail"
    ),
};

const safeWeekEditQuestion = {
  path : "/safeWeek/editQuestion",
  meta: { title: "安全周检编辑问题" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/check_safe/week/edit_question"
    ),
}

// 安全检查日检

const safeDailyAdd = {
  path: "/safeDaily/add", //日检安全检查---新增
  meta: { title: "安全日检新增" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/check_safe/daily/add"
    ),
};


const safeDailyAddQuestion = {
  path: "/safeDaily/addQuestion", //日检安全检查---新增
  meta: { title: "安全日检新增问题" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/check_safe/daily/add_question"
    ),
};

const safeDailyDetail = {
  path: "/safeDaily/detail", //地下室安全检查---新增
  meta: { title: "安全日检详情" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/check_safe/daily/detail"
    ),
};

const safeDailyEditQuestion = {
  path : "/daliy/editQuestion",
  meta: { title: "安全日检编辑问题" },
  component: () =>
    import(
      "@/views/pages/+menu_project_safe/check_safe/daily/edit_question"
    ),
}

const routerProjectSecurityList = [
  projectSecurityList,
  safeWeekAdd,
  safeWeekAddQuestion,
  safeWeekDetail,
  safeWeekEditQuestion,
  safeDailyAdd,
  safeDailyAddQuestion,
  safeDailyDetail,
  safeDailyEditQuestion,
  projectSecurityListOld
];

export default routerProjectSecurityList;
