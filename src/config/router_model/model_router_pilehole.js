// ====================================桩孔信息=================================
const pileholeList = {
  path: "/pileholeList",
  meta: { title: "桩孔信息列表" },
  component: () => import("@/views/pages/+menu_pilehole/pilehole_list.vue"),
};

const routerPilehole = [pileholeList];

export default routerPilehole;
