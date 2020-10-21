// 共用过滤器

const publicFilters = {

  mathType(val){
    switch(val){
      case 1: return '原始值';
      case 2: return '最大值';
      case 3: return '最小值';
      case 4: return '最新值';
      case 5: return '求和';
      case 6: return '合并';
    }
  },

  tableClassify(val) {
    switch (val) {
      case 0: return '普通表';
      case 1: return '混凝土表格';
      case 2: return '钢筋实测信息';
    }
  },

  fieldOperate(val) {
    switch (val) {
      case 1: return '合并';
      case 2: return '循环';
      case 3: return '混凝土类型表施工人数循环';
    }
  },

  fieldDataTypeLog(val) {
    switch (val) {
      case 1: return '地下室-质量日志';
      case 2: return '主体结构-质量日志';
      case 3: return '安全日志';
    }
  },

  fieldDataType(val) {
    switch (val) {
      case 1: return '输入框';
      case 2: return '问题项';
      case 3: return '其他问题项';
      case 4: return '图片';
      case 5: return '下拉框';
      case 6: return '下拉框选的值不需要返回';
      case 7: return '修改问题项=其他问题项+问题项';
      case 8: return '上传图片';
      case '': return '暂无数据';
    }
  },

  appType(val) {
    switch (val) {
      case '0': return '安卓';
      case '1': return 'IOS';
      case '': return '暂无数据'
    }
  },
  IsUpdate(val) {
    switch (val) {
      case '0': return '是';
      case '1': return '否';
      case '': return '暂无数据'
    }
  },

  checkStaus(val) {
    switch (val) {
      case "0":
        return "不合格";
      case "1":
        return "已验收";
      case "2":
        return "整改中";
    }
  },
  bimStatus(val) {
    switch (val) {
      case "0":
        return "未整改";
      case "1":
        return "整改中";
      case "2":
        return "已整改";
      case "":
        return "暂无数据";
    }
  },
  tagType(val) {
    switch (val) {
      case "1":
        return "巡查中";
      case "2":
        return "检查中";
    }
  },
  questionType(val) {
    switch (val) {
      case "1":
        return "质量";
      case "2":
        return "安全";
      case "3":
        return "进度";
    }
  },
  supervisionNoticeState(val) {
    switch (val) {
      case "1":
        return "待审核";
      case "2":
        return "已通过";
      case "3":
        return "未通过";
      case "4":
        return "已退回";
    }
  },
  accordingIdFindName(val, list = []) {
    let name = "";
    if (!list || list.length === 0) {
      return "";
    }
    list.forEach((item) => {
      if (item.value === val) {
        name = item.name;
      }
    });
    return name;
  },
  application(val) {
    switch (val) {
      case "1":
        return "筏板";
      case "2":
        return "底板";
    }
  },
  transformDate(timestmp) {
    if (!timestmp || timestmp.length === 0) {
      return "";
    }
    let time = new Date(Number(timestmp));
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    let date = time.getDate();
    date = date >= 10 ? date : "0" + date;
    return year + "-" + month + "-" + date;
  },

  transformDate2(timestmp) {
    if (!timestmp || timestmp.length === 0) {
      return "";
    }
    let time = new Date(Number(timestmp));
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    let date = time.getDate();
    date = date >= 10 ? date : "0" + date;
    let hours = time.getHours();
    hours = hours >= 10 ? hours : "0" + hours;
    let min = time.getMinutes();
    min = min >= 10 ? min : "0" + min;
    let sec = time.getSeconds();
    return year + "-" + month + "-" + date + " " + hours + ":" + min;
  },

  transformDate3(timestmp) {
    if (!timestmp || timestmp.length === 0) {
      return "";
    }
    let time = new Date(Number(timestmp));
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    let date = time.getDate();
    date = date >= 10 ? date : "0" + date;
    let hours = time.getHours();
    hours = hours >= 10 ? hours : "0" + hours;
    let min = time.getMinutes();
    min = min >= 10 ? min : "0" + min;
    let sec = time.getSeconds();
    return year + "年" + month + "月" + date + "日" + hours + ":" + min + "时";
  },
};

export default publicFilters;
