// ====================================合同管理=================================
const contractList = {
  path: "/contractList",
  meta: { title: "合同列表" },
  component: () => import("@/views/pages/+menu_contract/contract_list.vue"),
};

const routerContract = [contractList];

export default routerContract;
