// ===================  全部的component 在此 注册  挂载全局 ===================
import Breadcrumb from "@/components/BreadCrumb/Breadcrumb";
import Header from "@/components/Header/Header";
import proDetails from "@/components/proDetails/proDetails";
import lotDetails from "@/components/lotDetails/lotDetails";
import pagination from "@/components/pagination/pagination";
import baseDetail from "@/components/baseDetail/baseDetail";
import addQustions from "@/components/addQuestions/add_questions";
import addQuestionsNew from "@/components/addQuestionsNew/addQuestionsNew";
import addInputList from "@/components/addInputList/add_input_list";
import upload from "@/components/upload/upload";
import mixedInfo from "@/components/mixedInfo/mixedInfo";
import mixedImgUpload from "@/components/mixedImgUpload/mixedImgUpload";
import uploadFile from "@/components/uploadFile/uploadFile";
import acceptanceImage from "@/components/acceptanceImage/acceptanceImage";
import importFile from "@/components/importFile/importFile";
import raiseInfo from "@/components/raiseInfo/raiseInfo";
import questionTransfer from "@/components/questionTransfer/questionTransfer";

export default (Vue) => {
  Vue.component("BreadCrumb", Breadcrumb);
  Vue.component("Header", Header);
  Vue.component("proDetails", proDetails);
  Vue.component("lotDetails", lotDetails);
  Vue.component("pagination", pagination);
  Vue.component("baseDetail", baseDetail);
  Vue.component("addQustions", addQustions);
  Vue.component("addInputList", addInputList);
  Vue.component("upload", upload);
  Vue.component("mixedInfo", mixedInfo);
  Vue.component("mixedImgUpload", mixedImgUpload);
  Vue.component("uploadFile", uploadFile);
  Vue.component("acceptanceImage", acceptanceImage);
  Vue.component("addQuestionsNew", addQuestionsNew);
  Vue.component("importFile", importFile);
  Vue.component("raiseInfo", raiseInfo);
  Vue.component("questionTransfer", questionTransfer);
};
