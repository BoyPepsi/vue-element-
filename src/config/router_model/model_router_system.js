// ====================================系统管理=================================
const sysAdminList = {
  path: "/sysadminList",
  meta: { title: "用户管理-用户列表" },
  component: () => import("@/views/pages/+menu_system/sys_admin_list.vue"),
};

const sysDictionariesList = {
  path: "/sysdictionariesList",
  meta: { title: "字典管理-字典列表" },
  component: () =>
    import("@/views/pages/+menu_system/sys_dictionaries_list.vue"),
};

const sysMenuList = {
  path: "/sysmenuList",
  meta: { title: "菜单管理-菜单列表" },
  component: () => import("@/views/pages/+menu_system/sys_menu_list.vue"),
};

const sysRoleList = {
  path: "/roleList",
  meta: { title: "角色管理-角色列表" },
  component: () => import("@/views/pages/+menu_system/sys_role_list.vue"),
};

const sysGroupList = {
  path: "/sysgroupList",
  meta: { title: "组织架构列表" },
  component: () => import("@/views/pages/+menu_system/sys_group_list.vue"),
};

const sysCheckList = {
  path: "/syscheckList",
  meta: { title: "检查体系列表" },
  component: () => import("@/views/pages/+menu_system/sys_check_list.vue"),
};

const sysUrlConfig = {
  path: "/sysUrlConfig",
  meta: { title: "url配置" },
  component: () => import("@/views/pages/+menu_system/sys_url_config.vue"),
};

const sysAppVersion = {
  path : '/appVersion',
  meta : {title : "app版本"},
  component: () => import("@/views/pages/+menu_system/sys_app_version_list.vue"),
}


const sysFieldConfig= {
  path : '/sysFieldConfigBasicReport',
  meta : {title : "字段配置-基础报表"},
  component: () => import("@/views/pages/+menu_system/sys_field_config/basic_report_config.vue"),
}
const sysFieldConfigSupervisionLogMould= {
  path : '/sysFieldConfigSupervisionLogMould',
  meta : {title : "字段配置-监理日志模板"},
  component: () => import("@/views/pages/+menu_system/sys_field_config/supervision_log_mould_config.vue"),
}
const sysFieldConfigSupervisionLogMouldChild = {
  path : '/sysFieldConfigSupervisionLogMouldChild',
  meta : {title : "字段配置-监理日志模板"},
  component: () => import("@/views/pages/+menu_system/sys_field_config/supervision_log_mould_child_config.vue"),
}
const sysFieldConfigSupervisionLog = {
  path : '/sysFieldConfigSupervisionLog',
  meta : {title : '字段配置-监理日志'},
  component: () => import("@/views/pages/+menu_system/sys_field_config/supervision_log_config.vue"),
}

const routerSystem = [
  sysAdminList,
  sysDictionariesList,
  sysMenuList,
  sysRoleList,
  sysGroupList,
  sysCheckList,
  sysUrlConfig,
  sysAppVersion,
  sysFieldConfig,
  sysFieldConfigSupervisionLogMould,
  sysFieldConfigSupervisionLogMouldChild,
  sysFieldConfigSupervisionLog
];

export default routerSystem;
