// ====================================项目管理=================================
const projectList = {
  path: "/projectList",
  meta: { title: "项目管理-项目列表" },
  component: () => import("@/views/pages/+menu_project/project_list.vue"),
};

const projectBidList = {
  path: "/bidList",
  meta: { title: "标段管理-项目标段列表" },
  component: () => import("@/views/pages/+menu_project/project_bid_list.vue"),
};

const projectBidUnitList = {
  path: "/bidUnitList",
  meta: { title: "参建单位管理-参建单位列表" },
  component: () =>
    import("@/views/pages/+menu_project/project_bid_unit_list.vue"),
};

const projectBuildList = {
  path: "/buildList",
  meta: { title: "楼栋管理-楼栋列表" },
  component: () =>
    import("@/views/pages/+menu_project/project_build_list.vue"),
};

const projectBasementList = {
  path: "/basementList",
  meta: { title: "地下室管理-地下室列表" },
  component: () =>
    import("@/views/pages/+menu_project/project_basement_list.vue"),
};

const routerProject = [
  projectList,
  projectBidList,
  projectBidUnitList,
  projectBuildList,
  projectBasementList,
];

export default routerProject;
