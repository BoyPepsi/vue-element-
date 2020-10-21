/**
 * =====================================================
 *                  全部 请求
 * =====================================================
 */
import { requestByGet, requestByPost } from "./index";
import WebApi from "./api.config";
export const getLogin = (params) => {
  return requestByPost(WebApi.login, params);
};

export const logout = (params) => {
  return requestByPost(WebApi.logout, params);
};

//  用户管理页面
// 用户列表
export const getUserList = (params) => {
  return requestByPost(WebApi.list, params);
};

export const getUserListNothing = (params) => {
  return requestByPost(WebApi.listNoting, params);
};

// 添加用户
export const getAdduser = (params) => {
  return requestByPost(WebApi.addUser, params);
};

// 删除用户
export const delUser = (params) => {
  return requestByPost(WebApi.delUser, params);
};

// 修改用户
export const updateUser = (params) => {
  return requestByPost(WebApi.update, params);
};

// 重置密码
export const resetPasswordUser = (params) => {
  return requestByPost(WebApi.resetPassword, params);
};

/**
 * =====================================================
 *                      url配置
 * =====================================================
 */

// 验收表请求地址配置_新增
export const talbleurlAdd = (params) => {
  return requestByPost(WebApi.talbleurlAdd, params);
};

//验收表请求地址配置_删除
export const talbleurlDelete = (params) => {
  return requestByPost(WebApi.talbleurlDelete, params);
};

// 验收表请求地址配置_列表
export const talbleurlList = (params) => {
  return requestByPost(WebApi.talbleurlList, params);
};

// 验收表请求地址配置_修改
export const talbleurlUpdate = (params) => {
  return requestByPost(WebApi.talbleurlUpdate, params);
};

/**
 * =====================================================
 *                        字典管理
 * =====================================================
 */
// 字典列表
export const getDictionarieList = (params) => {
  return requestByPost(WebApi.dictionarie, params);
};
// 字典列表
export const dictionarieNothing = (params) => {
  return requestByPost(WebApi.dictionarieNothing, params);
};
// 字典管理的树
export const getDicTree = (params) => {
  return requestByPost(WebApi.dictTree, params);
};

// 字典管理的树
export const dictTreeNothing = (params) => {
  return requestByPost(WebApi.dictTreeNothing, params);
};
// 字典管理 --》 新增字典
export const saveSysdictionaries = (params) => {
  return requestByPost(WebApi.saveSysdictionaries, params);
};
// update
export const updateSysdictionaries = (params) => {
  return requestByPost(WebApi.updateSysdictionaries, params);
};
// delete
export const deleteSysdictionaries = (params) => {
  return requestByPost(WebApi.deleteSysdictionaries, params);
};

/**
 * =====================================================
 *            角色管理  接口操作 新增 删除 修改等
 * =====================================================
 */
export const getRoleList = (params) => {
  return requestByPost(WebApi.roleList, params);
};
export const roleListNothing = (params) => {
  return requestByPost(WebApi.roleListNothing, params);
};
// 根据角色id获取权限
export const getFinde = (params) => {
  return requestByPost(WebApi.findRole, params);
};

export const findRoleNothing = (params) => {
  return requestByPost(WebApi.findRoleNothing, params);
};
// save
export const saveRole = (params) => {
  return requestByPost(WebApi.saveRole, params);
};
// update
export const updateRole = (params) => {
  return requestByPost(WebApi.updateRole, params);
};
// 删除
export const deleteRole = (params) => {
  return requestByPost(WebApi.deleteRole, params);
};

/**
 * =====================================================
 *            组织架构  接口操作 新增 删除 修改等
 * =====================================================
 */

export const getSysgroupList = (params) => {
  return requestByPost(WebApi.sysgroupList, params);
};

export const sysgroupListNothing = (params) => {
  return requestByPost(WebApi.sysgroupListNothing, params);
};

export const saveSysgroup = (params) => {
  return requestByPost(WebApi.saveSysgroup, params);
};

export const updateSysgroup = (params) => {
  return requestByPost(WebApi.updateSysgroup, params);
};

export const deleteSysgroup = (params) => {
  return requestByPost(WebApi.deleteSysgroup, params);
};

/**
 * =====================================================
 *            检查体系  接口操作 新增 删除 修改等
 * =====================================================
 */

export const getSyscheckList = (params) => {
  return requestByPost(WebApi.syscheckList, params);
};

export const syscheckListNothing = (params) => {
  return requestByPost(WebApi.syscheckListNothing, params);
};
export const saveSyscheck = (params) => {
  return requestByPost(WebApi.saveSyscheck, params);
};

export const updateSyscheck = (params) => {
  return requestByPost(WebApi.updateSyscheck, params);
};

export const deleteSyscheck = (params) => {
  return requestByPost(WebApi.deleteSyscheck, params);
};

/**
 * =====================================================
 *                         菜单管理
 * =====================================================
 */
// 菜单管理的树
export const getMenu = (params) => {
  return requestByPost(WebApi.menuList, params);
};
// 菜单管理无权限
export const menuListNothing = (params) => {
  return requestByPost(WebApi.menuListNothing, params);
};

/**
 * =====================================================
 *                         项目管理
 * =====================================================
 */
// 项目列表
export const proList = (params) => {
  return requestByPost(WebApi.proList, params);
};

// 无权限获取项目列表
export const proListNothing = (params) => {
  return requestByPost(WebApi.proListNothing, params);
};

// 普通用户项目列表
export const listByids = (params) => {
  return requestByPost(WebApi.listByids, params);
};
// 项目添加
export const addPro = (params) => {
  return requestByPost(WebApi.addPro, params);
};
// update
export const updatePro = (params) => {
  return requestByPost(WebApi.updatePro, params);
};

// 项目详情 detail
export const detailPro = (params) => {
  return requestByPost(WebApi.detailPro, params);
};

/**
 * =====================================================
 *                         单位管理
 * =====================================================
 */
// 获取单位列表
export const getUnitList = (params) => {
  return requestByPost(WebApi.getUnitList, params);
};
// 无权限获取单位列表、
export const getUnitListNothing = (params) => {
  return requestByPost(WebApi.getUnitListNothing, params);
};
// 新增单位
export const saveUnit = (params) => {
  return requestByPost(WebApi.saveUnit, params);
};
// 单位详情
export const detailUnit = (params) => {
  return requestByPost(WebApi.detailUnit, params);
};

// 单位更新
export const updateUnit = (params) => {
  return requestByPost(WebApi.updateUnit, params);
};

/**
 * =====================================================
 *                         标段
 * =====================================================
 */
// 标段列表
export const bidList = (params) => {
  return requestByPost(WebApi.bidList, params);
};
// 无权限获取标段
export const bidListNothing = (params) => {
  return requestByPost(WebApi.bidListNothing, params);
};

/**
 * =====================================================
 *                         标段
 * =====================================================
 */
// 标段列表
export const constructionList = (params) => {
  return requestByPost(WebApi.constructionList, params);
};
// 添加标段
export const saveBid = (params) => {
  return requestByPost(WebApi.saveBid, params);
};
// 更新标段
export const updateBid = (params) => {
  return requestByPost(WebApi.updateBid, params);
};
// 标段详情
export const detailDid = (params) => {
  return requestByPost(WebApi.detailDid, params);
};

/**
 * =====================================================
 *                         参见单位
 * =====================================================
 */
//参见单位列表
export const unitList = (params) => {
  return requestByPost(WebApi.unitList, params);
};

// 参见单位无权限
export const unitListNothing = (params) => {
  return requestByPost(WebApi.unitListNothing, params);
};
// 添加参建单位
export const saveUnitSee = (params) => {
  return requestByPost(WebApi.saveUnitSee, params);
};
// 修改参建单位
export const updateUnitList = (params) => {
  return requestByPost(WebApi.updateUnitList, params);
};
// 删除参建单位
export const delUnit = (params) => {
  return requestByPost(WebApi.delUnit, params);
};
/**
 * =====================================================
 *                         楼栋
 * =====================================================
 */
// 楼栋列表
export const tungList = (params) => {
  return requestByPost(WebApi.tungList, params);
};

// 无权限楼栋列表
export const tungListNothing = (params) => {
  return requestByPost(WebApi.tungListNothing, params);
};
// 保存楼栋
export const saveTungList = (params) => {
  return requestByPost(WebApi.saveTungList, params);
};
// 修改
export const updateTungList = (params) => {
  return requestByPost(WebApi.updateTungList, params);
};
// 删除
export const delTung = (params) => {
  return requestByPost(WebApi.delTung, params);
};
// 根据区域获取楼层和施工单位
export const queryBasementFloor = (params) => {
  return requestByPost(WebApi.queryBasementFloor, params);
};
/**
 * =====================================================
 *                         地下室区块
 * =====================================================
 */
// 地下室列表
export const baseList = (params) => {
  return requestByPost(WebApi.baseList, params);
};

// 无权限获取地下室列表
export const baseListNothing = (params) => {
  return requestByPost(WebApi.baseListNothing, params);
};

// 添加地下室
export const saveBaseList = (params) => {
  return requestByPost(WebApi.saveBaseList, params);
};
// 修改
export const updateBaseList = (params) => {
  return requestByPost(WebApi.updateBaseList, params);
};
// 删除
export const delBaseList = (params) => {
  return requestByPost(WebApi.delBaseList, params);
};
// 查询
export const serchLit = (params) => {
  return requestByPost(WebApi.serchLit, params);
};

// new  2020.09.01
export const getbasementList = (params) => {
  return requestByPost(WebApi.getbasementList, params);
};
export const getFloors = (params) => {
  return requestByPost(WebApi.getFloors, params);
};

/**
 * =====================================================
 *                         题库模块
 * =====================================================
 */

// 问题_列表
export const questionList = (params) => {
  return requestByPost(WebApi.questionList, params);
};
// 问题_列表 -- 单选
export const questionSingleList = (params) => {
  return requestByPost(WebApi.questionSingleList, params);
};

// 题库子集_查询
export const questionListSearch = (params) => {
  return requestByPost(WebApi.questionListSearch, params);
};

// 问题_添加
export const questionSave = (params) => {
  return requestByPost(WebApi.questionSave, params);
};

// 问题_子集添加
export const questionSavePart = (params) => {
  return requestByPost(WebApi.questionSavePart, params);
};

// 问题_修改
export const qestionUpdate = (params) => {
  return requestByPost(WebApi.qestionUpdate, params);
};

// 问题_子集修改
export const qestionUpdatePart = (params) => {
  return requestByPost(WebApi.qestionUpdatePart, params);
};

// 问题_删除
export const questionDelete = (params) => {
  return requestByPost(WebApi.questionDelete, params);
};

// 问题_删除
export const questionDeletePart = (params) => {
  return requestByPost(WebApi.questionDeletePart, params);
};

// 问题_删除
export const questionBaseQtList = (params) => {
  return requestByPost(WebApi.questionBaseQtList, params);
};

export const questionBaseImportSave = (params) => {
  return requestByPost(WebApi.questionBaseImportSave, params);
};

/**
 * =====================================================
 *                         合同管理模块
 * =====================================================
 */
// 合同列表
export const contractList = (params) => {
  return requestByPost(WebApi.contractList, params);
};

export const contractListNothing = (params) => {
  return requestByPost(WebApi.contractListNothing, params);
};
// 添加合同
export const contractSave = (params) => {
  return requestByPost(WebApi.contractSave, params);
};
// 修改合同
export const contractUpdate = (params) => {
  return requestByPost(WebApi.contractUpdate, params);
};
// 删除
export const contractDelete = (params) => {
  return requestByPost(WebApi.contractDelete, params);
};

/**
 * =====================================================
 *                         质量日检模块
 * =====================================================
 */
// 项目日检查信息_列表
export const qualityInspectList = (params) => {
  return requestByPost(WebApi.qualityInspectList, params);
};

// 项目日检查信息_新增
export const qualityInspectSave = (params) => {
  return requestByPost(WebApi.qualityInspectSave, params);
};
// 项目日检查信息_新增
export const qualityInspectPSave = (params) => {
  return requestByPost(WebApi.qualityInspectPSave, params);
};

// 项目日检查信息_删除
export const qualityInspectDelete = (params) => {
  return requestByPost(WebApi.qualityInspectDelete, params);
};

// 项目日检查问题明细信息_新增
export const qualityInspectSaveDetail = (params) => {
  return requestByPost(WebApi.qualityInspectSaveDetail, params);
};

// 项目日检查信息_修改
export const qualityInspectUpdateDetail = (params) => {
  return requestByPost(WebApi.qualityInspectUpdateDetail, params);
};

// 项目日检查信息————修改2
export const qualityInspectUpdate = (params) => {
  return requestByPost(WebApi.qualityInspectUpdate, params);
};

//  获取地下室区块施工单位
export const qualityInspectQueryunit = (params) => {
  return requestByPost(WebApi.qualityInspectQueryunit, params);
};
//  存储表单缓存
export const qualityInspectSaveCache = (params) => {
  return requestByPost(WebApi.qualityInspectSaveCache, params);
};

export const maintableReview = (params) => {
  return requestByPost(WebApi.maintableReview, params);
};

/**
 * =====================================================
 *                         质量验收模块
 * =====================================================
 */

//  质量验收_列表
export const qualityCheckList = (params) => {
  return requestByPost(WebApi.qualityCheckList, params);
};

// 质量验收_主体结构_新增
export const maintableAdd = (params) => {
  return requestByPost(WebApi.maintableAdd, params);
};

// 质量验收_主体结构_查询
export const maintableList = (params) => {
  return requestByPost(WebApi.maintableList, params);
};

// 质量验收_主体结构_删除
export const maintableDelete = (params) => {
  return requestByPost(WebApi.maintableDelete, params);
};
// 质量验收_主体结构_编辑
export const maintableUpdate = (params) => {
  return requestByPost(WebApi.maintableUpdate, params);
};

// 主体结构缓存新增
export const maintableSavequeuecache = (params) => {
  return requestByPost(WebApi.maintableSavequeuecache, params);
};

// 主体结构缓存查询
export const maintableQuerysecuritydata = (params) => {
  return requestByPost(WebApi.maintableQuerysecuritydata, params);
};
// 主体结构删除缓存
export const maintableDeletequeuecache = (params) => {
  return requestByPost(WebApi.maintableDeletequeuecache, params);
};
// 数据库数据同步到缓存
export const maintableSyncdbtocache = (params) => {
  return requestByPost(WebApi.maintableSyncdbtocache, params);
};

//  筏板基础钢筋质量验收表_新增
export const qualityCheckrebarAdd = (params) => {
  return requestByPost(WebApi.qualityCheckrebarAdd, params);
};

//  筏板基础钢筋质量验收表_编辑
export const qualityCheckrebarUpdate = (params) => {
  return requestByPost(WebApi.qualityCheckrebarUpdate, params);
};

// 筏板基础模板质量验收表2地下室钢管扣件模板、支撑架检查3垫层施工检查验收表4地下室模板拆除检查5垫层施工检查验收表5砖模施工检查验收表6基坑验槽检查_新增
export const qualityCheckPublicAdd = (params) => {
  return requestByPost(WebApi.qualityCheckPublicAdd, params);
};

export const qualityCheckPublicUpdate = (params) => {
  return requestByPost(WebApi.qualityCheckPublicUpdate, params);
};

// 筏板基础钢筋质量验收表_多个修改
export const qualityCheckBatchupdate = (params) => {
  return requestByPost(WebApi.qualityCheckBatchupdate, params);
};

// 列表删除
export const qualityCheckDelete = (params) => {
  return requestByPost(WebApi.qualityCheckDelete, params);
};

//  查询表单缓存
export const qualityInspectQuerycache = (params) => {
  return requestByPost(WebApi.qualityInspectQuerycache, params);
};

// 地下室墙柱钢筋检查验收表_新增
export const qualityWallIronAdd = (params) => {
  return requestByPost(WebApi.qualityWallIronAdd, params);
};

export const qualityWallIronUpdate = (params) => {
  return requestByPost(WebApi.qualityWallIronUpdate, params);
};
// 筏板混凝土浇筑检查_新增
export const qualityChecBaseBetonAdd = (params) => {
  return requestByPost(WebApi.qualityChecBaseBetonAdd, params);
};

// 筏板混凝土浇筑检查_子表查询表格数据
export const qualityChecBaseBetonquery = (params) => {
  return requestByPost(WebApi.qualityChecBaseBetonquery, params);
};

// 混泥土表复核
export const qualityCheckBaseBetonUpdate = (params) => {
  return requestByPost(WebApi.qualityCheckBaseBetonUpdate, params);
};

// 是否能够继续检查
export const qualityCheckBaseBetonCheckAdd = (params) => {
  return requestByPost(WebApi.qualityCheckBaseBetonCheckAdd, params);
};

// 质量验收问题处理
export const qualityCheckEditQuestionBimStatus = (params) => {
  return requestByPost(WebApi.qualityCheckEditQuestionBimStatus, params);
};

// 质量日检详情状态获取
export const qualityCheckGetQuestionBimStatus = (params) => {
  return requestByPost(WebApi.qualityCheckGetQuestionBimStatus, params);
};

// 质量验收(质量日检)获取楼栋列表
export const getBuildList = (params) => {
  return requestByPost(WebApi.getBuildList, params);
};

// 质量验收(质量日检)根据楼栋获取楼层
export const getFloorByBuild = (params) => {
  return requestByPost(WebApi.getFloorByBuild, params);
};

// 质量验收(质量日检)根据楼栋获取楼层---new
export const getQueryBuildFloor = (params) => {
  return requestByPost(WebApi.getQueryBuildFloor, params);
};

// 质量验收(质量日检)根据楼栋获取楼层
export const queryBuildFloor = (params) => {
  return requestByPost(WebApi.queryBuildFloor, params);
};

// 质量验收继续检查
export const continuecheck = (params) => {
  return requestByPost(WebApi.continuecheck, params);
};

// 筏板基础钢筋质量验收表-继续检查-判断到第几项
export const maintableRebarcheckitem = (params) => {
  return requestByPost(WebApi.maintableRebarcheckitem, params);
};

// 字典表获取检查分项-list
export const childCheckCombox = (params) => {
  return requestByPost(WebApi.childCheckCombox, params);
};

/**
 * =====================================================
 *                        题库
 * =====================================================
 */
export const questionBaseList = (params) => {
  return requestByPost(WebApi.questionBaseList, params);
};

/**
 * =====================================================
 *                       文件上传
 * =====================================================
 */
export const filePut = (params) => {
  return requestByPost(WebApi.filePut, params);
};

/**
 * =====================================================
 *                       项目安全
 * =====================================================
 */

export const securityCheckAdd = (params) => {
  //项目安全保存
  return requestByPost(WebApi.securityCheckAdd, params);
};

export const securityCheckList = (params) => {
  //项目列表
  return requestByPost(WebApi.securityCheckList, params);
};

//安全检查，安全日检 复核删除
export const securityCheckUpdate = (params) => {
  return requestByPost(WebApi.securityCheckUpdate, params);
};

//安全检查，问题缓存
export const qualityInspectSavequeuecache = (params) => {
  return requestByPost(WebApi.qualityInspectSavequeuecache, params);
};

//安全检查，问题缓存查询
export const qualityInspectQueryqueuecache = (params) => {
  return requestByPost(WebApi.qualityInspectQueryqueuecache, params);
};

export const qualityInspectDeletequeuecache = (params) => {
  return requestByPost(WebApi.qualityInspectDeletequeuecache, params);
};

export const qualityInspectUpdatequeuecache = (params) => {
  return requestByPost(WebApi.qualityInspectUpdatequeuecache, params);
};
// 安全检查 ，表格数据查询
export const qualityInspectQuerysecuritydata = (params) => {
  return requestByPost(WebApi.qualityInspectQuerysecuritydata, params);
};

//重大高风险源列表
export const qualityCheckRisklist = (params) => {
  return requestByPost(WebApi.qualityCheckRisklist, params);
};

//质量重大风险源_新增
export const qualityCheckRiskcheckAdd = (params) => {
  return requestByPost(WebApi.qualityCheckRiskcheckAdd, params);
};

//重大风险源_复核删除
export const qualityCheckRiskcheckUpdate = (params) => {
  return requestByPost(WebApi.qualityCheckRiskcheckUpdate, params);
};

//安全检查_复核删除某条数据
export const qualityInspectDeleteQuestionbyPrimaryid = (params) => {
  return requestByPost(WebApi.qualityInspectDeleteQuestionbyPrimaryid, params);
};

// new----chm---2020.09.02
// 安全检查--项目获取施工单位
export const getBuildUnit = (params) => {
  return requestByPost(WebApi.getBuildUnit, params);
};
// 安全检查--项目获取分包单位
export const getSubUnit = (params) => {
  return requestByPost(WebApi.getSubUnit, params);
};

// 菜单管理接口————————————————————————————
// 保存菜单
export const adminSysmenuSave = (params) => {
  return requestByPost(WebApi.adminSysmenuSave, params);
};
// 删除菜单
export const adminSysmenuDelete = (params) => {
  return requestByPost(WebApi.adminSysmenuDelete, params);
};

// 修改菜单
export const adminSysmenuUpdate = (params) => {
  return requestByPost(WebApi.adminSysmenuUpdate, params);
};

// 菜单列表
export const adminSysmenuList = (params) => {
  return requestByPost(WebApi.adminSysmenuList, params);
};

// 监理日志列表
export const managerlogList = (params) => {
  return requestByPost(WebApi.managerlogList, params);
};

// 监理日志下拉框
export const managerlogCombox = (params) => {
  return requestByPost(WebApi.managerlogCombox, params);
};
// 监理日志删除
export const managerlogDelete = (params) => {
  return requestByPost(WebApi.managerlogDelete, params);
};

// 监理日志删除
export const managerlogDetail = (params) => {
  return requestByPost(WebApi.managerlogDetail, params);
};
// 监理日志修改
export const managerlogUpdate = (params) => {
  return requestByPost(WebApi.managerlogUpdate, params);
};

// 监理日志生成
export const managerlogCreate = (params) => {
  return requestByPost(WebApi.managerlogCreate, params);
};

// 监理日志下载
export const managerlogDown = (params) => {
  return requestByPostPdf(WebApi.managerlogDown, params);
};

// 监理日志批阅
export const managerlogLogcheck = (params) => {
  return requestByPost(WebApi.managerlogLogcheck, params);
};

// 监理日志模板接口+++++++++++++++++++++++++++++++++++

// 监理日志模板列表
export const logTemplateList = (params) => {
  return requestByPost(WebApi.logTemplateList, params);
};

// 监理日记模板新增
export const logTemplateAdd = (params) => {
  return requestByPost(WebApi.logTemplateAdd, params);
};

// 监理日志模板修改
export const logTemplateUpdate = (params) => {
  return requestByPost(WebApi.logTemplateUpdate, params);
};
// 监理日志删除
export const logTemplateDelete = (params) => {
  return requestByPost(WebApi.logTemplateDelete, params);
};

/**
 * =====================================================
 *              巡查问题通知单
 *                工作暂停单
 *                工作联系单
 *                 旁站记录
 * =====================================================
 */
// 列表
export const projectQuestionInformList = (params) => {
  return requestByPost(WebApi.projectQuestionInformList, params);
};
// 新增
export const projectQuestionInformSave = (params) => {
  return requestByPost(WebApi.projectQuestionInformSave, params);
};
// 修改
export const projectQuestionInformUpdate = (params) => {
  return requestByPost(WebApi.projectQuestionInformUpdate, params);
};
// 详情
export const projectQuestionInformDetail = (params) => {
  return requestByPost(WebApi.projectQuestionInformDetail, params);
};
// 删除
export const projectQuestionInformDelete = (params) => {
  return requestByPost(WebApi.projectQuestionInformDelete, params);
};
// 下载
export const projectQuestionInformDownload = (params) => {
  return requestByPost(WebApi.projectQuestionInformDownload, params);
};
// 查询当天问题
export const qualityQuestionDetailByProjectId = (params) => {
  return requestByPost(WebApi.qualityQuestionDetailByProjectId, params);
};
// 旁站列表
export const sideLogList = (params) => {
  return requestByPost(WebApi.sideLogList, params);
};
// 旁站新增
export const sideLogCreate = (params) => {
  return requestByPost(WebApi.sideLogCreate, params);
};
// 旁站详情
export const sideLogDetail = (params) => {
  return requestByPost(WebApi.sideLogDetail, params);
};
// 旁站修改
export const sideLogUpdate = (params) => {
  return requestByPost(WebApi.sideLogUpdate, params);
};

// 项目导入
export const projectImport = (params) => {
  return requestByPost(WebApi.projectImport, params);
};
// 标段导入
export const bidImport = (params) => {
  return requestByPost(WebApi.bidImport, params);
};
// 参建单位导入
export const bidUnitImport = (params) => {
  return requestByPost(WebApi.bidUnitImport, params);
};
// 地下室导入
export const basementImport = (params) => {
  return requestByPost(WebApi.basementImport, params);
};
// 楼栋导入
export const buildImport = (params) => {
  return requestByPost(WebApi.buildImport, params);
};
// APP list接口
export const appVersionList = (params) => {
  return requestByPost(WebApi.appVersionList, params);
};
// APP 新增接口
export const appVersionSave = (params) => {
  return requestByPost(WebApi.appVersionSave, params);
};
// APP 删除
export const appVersionDelete = (params) => {
  return requestByPost(WebApi.appVersionDelete, params);
};
// APP 更新
export const appVersionUpdate = (params) => {
  return requestByPost(WebApi.appVersionUpdate, params);
};


// =========================字段配置=========================
export const systemWordTipList = (params) => {
  return requestByPost(WebApi.systemWordTipList, params); //系统报表-字段配置_提示
}

export const systemWordAdd = (params) => {  //系统报表-字段配置__新增
  return requestByPost(WebApi.systemWordAdd, params);
}
export const systemWordList = (params) => { //系统报表-字段配置_列表
  return requestByPost(WebApi.systemWordList, params);
}
export const systemWordUpdate = (params) => { //系统报表-字段配置_修改
  return requestByPost(WebApi.systemWordUpdate, params);
}

export const systemWordLogTempList = (params) => {  //监理日志模板-字段配置_列表
  return requestByPost(WebApi.systemWordLogTempList, params);
}
export const systemwordLogTempAdd = (params) => {
  return requestByPost(WebApi.systemwordLogTempAdd, params);  //监理日志模板-字段配置_新增
}
export const systemwordLogTempUpdate = (params) => {
  return requestByPost(WebApi.systemwordLogTempUpdate, params); //监理日志模板-字段配置_修改
}
export const systemwordLogTempDelete = (params) => {
  return requestByPost(WebApi.systemwordLogTempDelete, params); //监理日志模板-字段配置_删除
}

export const systemWordLogRelevancyList = (params) => {
  return requestByPost(WebApi.systemWordLogRelevancyList, params);  //监理日志模板-层级关系_列表
}
export const systemWordLogRelevancyAdd = (params) => {
  return requestByPost(WebApi.systemWordLogRelevancyAdd, params); //监理日志模板-层级关系_新增
}
export const systemWordLogRelevancyUpdate = (params) => {
  return requestByPost(WebApi.systemWordLogRelevancyUpdate, params);  //监理日志模板-层级关系_修改
}

export const systemWordLogTempDetailList = (params) => {
  return requestByPost(WebApi.systemWordLogTempDetailList, params); //监理日志-详细字段配置_列表
}
export const systemWordLogTempDetailAdd = (params) => {
  return requestByPost(WebApi.systemWordLogTempDetailAdd, params);  //监理日志-详细字段配置_新增
}
export const systemWordLogTempDetailUpdate = (params) => {
  return requestByPost(WebApi.systemWordLogTempDetailUpdate, params); ////监理日志-详细字段配置_修改
}