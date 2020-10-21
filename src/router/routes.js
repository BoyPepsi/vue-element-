// 此处添加动态路由
import routerSystem from "@/config/router_model/model_router_system";
import routerUnit from "@/config/router_model/model_router_unit";
import routerProject from "@/config/router_model/model_router_project";
import routerQuestion from "@/config/router_model/model_router_question";
import routerPilehole from "@/config/router_model/model_router_pilehole";
import routerContract from "@/config/router_model/model_router_contract";
import routerQualityDailyInspection from "@/config/router_model/model_router_quality_daily_inspection_basement";
import routerQualityAcceptance from "@/config/router_model/model_router_quality_acceptance_basement";
import routerWaterproofWorks from "@/config/router_model/model_router_quality_acceptance_waterproof";
import routerQualityAcceptanceMainSturcture from "@/config/router_model/model_router_quality_acceptance_main_structure";
import routerProjectSecurityList from "@/config/router_model/model_router_check_safe";
import routerProjectSafeImportantRisk from "@/config/router_model/model_router_important_risk_lift";
import routerProjectSafeImportantRiskTower from "@/config/router_model/model_router_important_risk_tower";
import routerSupervisionLog from "@/config/router_model/model_router_supervision_log";
import qualityInspectMainStructure from "../config/router_model/model_router_quality_daily_inspection_mainstructure";
import qualityInspectFirstFinishing from "../config/router_model/model_router_quality_daily_inspection_first_finishing"
import routerProjectSafeImportantRiskMaterialHoist from "../config/router_model/model_router_important_risk_material_hoist";
import routerProjectSafeImportantRiskHangingBasket from "../config/router_model/model_router_important_risk_hanging_basket";
// 导出该角色拥有的全部路由信息 用于动态加载
export const roleMap = [
  // 系统管理
  ...routerSystem,

  // 单位管理
  ...routerUnit,

  //项目管理
  ...routerProject,

  // 问题库
  ...routerQuestion,

  // 桩孔信息
  ...routerPilehole,

  // 合同管理
  ...routerContract,

  // 项目质量--- 日检查
  ...routerQualityDailyInspection,

  // 项目质量--- 验收
  ...routerQualityAcceptance,

  // 项目质量---验收---主体结构
  ...routerQualityAcceptanceMainSturcture,

  // 项目质量--- 防水工程
  ...routerWaterproofWorks,

  // 安全检查--列表
  ...routerProjectSecurityList,

  // 项目安全----重大风险源
  ...routerProjectSafeImportantRisk,

  //项目安全----重大风险源----塔吊
  ...routerProjectSafeImportantRiskTower,

  // 项目安全---重大风险源---物料提升机
  ...routerProjectSafeImportantRiskMaterialHoist,

  // 项目安全---重大风险源--吊篮
  ...routerProjectSafeImportantRiskHangingBasket,

  // 监理日志
  ...routerSupervisionLog,

  // 质量日检主体结构
  ...qualityInspectMainStructure,

  // 质量日检初装修
  ...qualityInspectFirstFinishing
];

const routes = [
  // 去掉name属性，当路由有children子集的时候，要去掉name属性，不然会有警告
  {
    path: "/",
    // name: 'login',
    meta: { title: "登 录-监理检查系统" },
    component: () => import("../views/login.vue"),
  },
  {
    path: "/home",
    // name: 'index',
    redirect: "/wellcome",
    component: () => import("../views/index.vue"),
    children: [
      {
        path: "/",
        meta: { title: "欢迎使用-监理检查系统" },
        component: () => import("../views/wellcome.vue"),
      },
      ...roleMap,
    ],
  },
];
export default routes;
