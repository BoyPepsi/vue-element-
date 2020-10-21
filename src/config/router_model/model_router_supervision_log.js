const supervisionLogList = {
  //监理日志列表
  path: "/managerlog/list",
  meta: { title: "监理日志" },
  component: () =>
    import("@/views/pages/+menu_supervision_statistics/supervision_log/supervision_log_list.vue"),
};
const supervisionLogDetail = {
  //监理日志详细
  path: "/managerlog/detail",
  meta: { title: "监理日志详细" },
  component: () =>
    import("@/views/pages/+menu_supervision_statistics/supervision_log/supervision_log_detail.vue"),
};

const supervisionLogUpdate = {
  //监理日志修改
  path: "/managerlog/update",
  meta: { title: "监理日志详细" },
  component: () =>
    import("@/views/pages/+menu_supervision_statistics/supervision_log/supervision_log_update.vue"),
};

// 监理日志模板
const managerlogMouldList = {
  path: "/managerlogMould/list",
  meta: { title: "监理日志模板" },
  component: () => import("@/views/pages/+menu_supervision_statistics/managerlog_mould/managerlog_mould_list.vue")
}

// =================================== 巡查问题告知单 =================================
// 巡查问题列表
const questionNotificationList = {
  path: "/questionNotification/list",
  meta: { title: "巡查问题列表" },
  component: () => import("@/views/pages/+menu_supervision_statistics/question_notification/list.vue")
}
// 巡查问题详情
const questionNotificationDetail = {
  path: "/questionNotification/detail",
  meta: { title: "巡查问题详情" },
  component: () => import("@/views/pages/+menu_supervision_statistics/question_notification/detail.vue")
}
// 巡查问题新增
const questionNotificationAdd = {
  path: "/questionNotification/add",
  meta: { title: "巡查问题新增" },
  component: () => import("@/views/pages/+menu_supervision_statistics/question_notification/add.vue")
}
// 巡查问题选择
const questionNotificationSelect = {
  path: "/questionNotification/select",
  meta: { title: "巡查问题选择" },
  component: () => import("@/views/pages/+menu_supervision_statistics/question_notification/question_select.vue")
}

// =================================== 工作联系单 =================================
// 联系单列表
const workContactList = {
  path: "/workContact/list",
  meta: { title: "联系单列表" },
  component: () => import("@/views/pages/+menu_supervision_statistics/work_contact/list.vue")
}
// 联系单详情
const workContactDetail = {
  path: "/workContact/detail",
  meta: { title: "联系单详情" },
  component: () => import("@/views/pages/+menu_supervision_statistics/work_contact/detail.vue")
}
// 联系单新增
const workContactAdd = {
  path: "/workContact/add",
  meta: { title: "联系单新增" },
  component: () => import("@/views/pages/+menu_supervision_statistics/work_contact/add.vue")
}
// 联系单问题选择
const workContactSelect = {
  path: "/workContact/select",
  meta: { title: "联系单问题选择" },
  component: () => import("@/views/pages/+menu_supervision_statistics/work_contact/question_select.vue")
}

// =================================== 工程暂停单 =================================
// 暂停单列表
const engineeringPauseList = {
  path: "/engineeringPause/list",
  meta: { title: "暂停单列表" },
  component: () => import("@/views/pages/+menu_supervision_statistics/engineering_pause/list.vue")
}
// 暂停单详情
const engineeringPauseDetail = {
  path: "/engineeringPause/detail",
  meta: { title: "暂停单详情" },
  component: () => import("@/views/pages/+menu_supervision_statistics/engineering_pause/detail.vue")
}
// 暂停单新增
const engineeringPauseAdd = {
  path: "/engineeringPause/add",
  meta: { title: "暂停单新增" },
  component: () => import("@/views/pages/+menu_supervision_statistics/engineering_pause/add.vue")
}
// 暂停单问题选择
const engineeringPauseSelect = {
  path: "/engineeringPause/select",
  meta: { title: "暂停单问题选择" },
  component: () => import("@/views/pages/+menu_supervision_statistics/engineering_pause/question_select.vue")
}

// =================================== 旁站记录 =================================
// 旁站记录
const sideStationSecordList = {
  path: "/sideStationSecord/list",
  meta: { title: "旁站记录" },
  component: () => import("@/views/pages/+menu_supervision_statistics/sideStation_record/list.vue")
}
// 旁站详情
const sideStationSecordDetail = {
  path: "/sideStationSecord/detail",
  meta: { title: "旁站详情" },
  component: () => import("@/views/pages/+menu_supervision_statistics/sideStation_record/detail.vue")
}
// 旁站新增
const sideStationSecordAdd = {
  path: "/sideStationSecord/add",
  meta: { title: "旁站新增" },
  component: () => import("@/views/pages/+menu_supervision_statistics/sideStation_record/add.vue")
}
// 旁站问题选择
const sideStationSecordSelect = {
  path: "/sideStationSecord/select",
  meta: { title: "旁站问题选择" },
  component: () => import("@/views/pages/+menu_supervision_statistics/sideStation_record/question_select.vue")
}

// =================================== 监理通知单 =================================
// 监理通知列表
const supervisionNoticeList = {
  path: "/supervisionNotice/list",
  meta: { title: "监理通知列表" },
  component: () => import("@/views/pages/+menu_supervision_statistics/supervision_notice/list.vue")
}
// 监理通知详情
const supervisionNoticeDetail = {
  path: "/supervisionNotice/detail",
  meta: { title: "监理通知详情" },
  component: () => import("@/views/pages/+menu_supervision_statistics/supervision_notice/detail.vue")
}
// 监理通知新增
const supervisionNoticeAdd = {
  path: "/supervisionNotice/add",
  meta: { title: "监理通知新增" },
  component: () => import("@/views/pages/+menu_supervision_statistics/supervision_notice/add.vue")
}
// 监理通知问题选择
const supervisionNoticeSelect = {
  path: "/supervisionNotice/select",
  meta: { title: "监理通知问题选择" },
  component: () => import("@/views/pages/+menu_supervision_statistics/supervision_notice/question_select.vue")
}

const routerSupervisionLog = [
  supervisionLogList,
  supervisionLogDetail,
  supervisionLogUpdate,
  managerlogMouldList,

  questionNotificationList,
  questionNotificationDetail,
  questionNotificationAdd,
  questionNotificationSelect,

  workContactList,
  workContactDetail,
  workContactAdd,
  workContactSelect,

  engineeringPauseList,
  engineeringPauseDetail,
  engineeringPauseAdd,
  engineeringPauseSelect,

  sideStationSecordList,
  sideStationSecordDetail,
  sideStationSecordAdd,
  sideStationSecordSelect,

  supervisionNoticeList,
  supervisionNoticeDetail,
  supervisionNoticeAdd,
  supervisionNoticeSelect,
];




export default routerSupervisionLog;
