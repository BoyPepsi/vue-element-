/**
 * =====================================================
 *                       问题库管理接口
 */

let questionListUrl = {
  questionList: "/questionBase/list", // 问题_列表
  questionSingleList: "/questionBase/singleList", // 问题单选列表
  questionListSearch: "/questionBase/qyueryPart", // 题库子集_查询
  questionSave: "/questionBase/save", // 问题_添加
  questionSavePart: "/questionBase/savePart", // 问题_子集添加
  qestionUpdate: "/questionBase/update", // 问题_修改
  qestionUpdatePart: "/questionBase/updatePart", // 问题_子集修改
  questionDelete: "/questionBase/delete", // 问题_删除
  questionDeletePart: "/questionBase/deletePart", // 题库子集_删除  单选
  questionBaseQtList: "/questionBase/list/nothing", // 题库_包含其他_列表
  questionBaseImportSave: "/questionBase/importSave", //多问题库_导入添加
  questionBaseList: "/questionBase/list/nothing", //题库_列表
};

export default questionListUrl;
