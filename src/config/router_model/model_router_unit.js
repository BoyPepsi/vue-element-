// ====================================单位管理=================================
const unitList = {
  path: "/unitList",
  meta: { title: "单位管理-单位列表" },
  component: () => import("@/views/pages/+menu_unit/unit_list.vue"),
};

const routerUnit = [unitList];

export default routerUnit;
