const importantRiskHangingBasketAdd = {
    path: "/importantRiskHangingBasket/add",
    meta: { title: "吊篮新增" },
    component: () =>
      import(
        "@/views/pages/+menu_project_safe/project_safe_important_risk/hanging_basket/hanging_basket_add.vue"
      ),
  };
  
  //项目安全---重大风险源----吊篮----详情
  const importantRiskHangingBasketDetail = {
    path: "/importantRiskHangingBasket/detail",
    meta: { title: "吊篮详情" },
    component: () =>
      import(
        "@/views/pages/+menu_project_safe/project_safe_important_risk/hanging_basket/hanging_basket_detail.vue"
      ),
  };

  const routerProjectSafeImportantRiskHangingBasket = [
    importantRiskHangingBasketAdd,
    importantRiskHangingBasketDetail,
  ];

  export default routerProjectSafeImportantRiskHangingBasket;