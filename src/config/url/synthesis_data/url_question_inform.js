/**
 * =====================================================
 *                       巡查问题通知单
 *                         工作暂停单
 *                         工作联系单
 *                          旁站记录
 */

let questionInformUrl = {
    projectQuestionInformList: "/projectQuestionInform/list", // 列表
    projectQuestionInformSave: "/projectQuestionInform/save", // 新增
    projectQuestionInformUpdate: "/projectQuestionInform/update", // 修改
    projectQuestionInformDetail: "/projectQuestionInform/detail", // 详情
    projectQuestionInformDelete: "/projectQuestionInform/delete", // 删除
    qualityQuestionDetailByProjectId: "/projectQuestionInform/qualityQuestionDetailByProjectId", // 查询当天问题
    projectQuestionInformDownload: "/projectQuestionInform/download", // 下载

    sideLogList: '/sideLog/list', // 旁站记录列表
    sideLogCreate: '/sideLog/create', // 旁站记录新增
    sideLogDetail: '/sideLog/detail', // 旁站记录详情
    sideLogUpdate: '/sideLog/update', // 旁站记录修改
};

export default questionInformUrl;
