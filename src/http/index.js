/**
 * =====================================================
 *                  axios 基本配置
 * =====================================================
 */
import axios from "axios";
// import QS from 'qs';
import store from "@/store";
if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://supervisor.dev.hfhksoft.com/api/"; // 开发环境  域名访问
  // axios.defaults.baseURL = "http://192.168.30.11:10063/supervisor"; // 开发环境  ip访问
  // axios.defaults.baseURL = "http://api.supervisor.test.hbyrzx.top/supervisor"; // 测试环境  域名访问
  // axios.defaults.baseURL = "http://192.168.30.11:10060/supervisor"; // 测试环境  ip访问
  // axios.defaults.baseURL = "http://192.168.30.219:8000/supervisor"; // 汪辉  ip访问
  // axios.defaults.baseURL = "http://192.168.30.137:8000/supervisor"; // 王涛本地地址
  //  axios.defaults.baseURL = "http://192.168.30.228:8000/supervisor"; // 张瑶本地、地址
  // axios.defaults.baseURL =  "http://180.76.124.188:8000/supervisor";  //正式环境
} else {
  axios.defaults.baseURL = "http://api.supervisor.test.hbyrzx.top/supervisor"; // 测试环境  域名访问
  // 生产环境 暂未配置测试环境
  // axios.defaults.baseURL = "http://api.supervisor.dev.hbyrzx.top/supervisor";
  // axios.defaults.baseURL = "http://180.76.124.188:8000/supervisor"; //正式环境
  // axios.defaults.baseURL = "http://supervisor.hfhksoft.com/api"; 
}

// 请求超时时间
axios.defaults.timeout = 100000;

// post请求头
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.withCredentials = true;

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 是否携带token
    // config.headers.Authorization = token
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);

// 拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      // 此处放置 状态码处理 提示消息 response.data.msg = '';?
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response.status) {
      return Promise.reject(error.response);
    }
  }
);

export const requestByGet = (url, params) => {
  return axios.get(url, params);
};

export const requestByPost = (url, params) => {
  let publicUserInfo = {};
  if (store.state.userInfo) {
    publicUserInfo.token = store.state.userInfo.token;
    publicUserInfo.userid = store.state.userInfo.id;
  } else {
    publicUserInfo.token = "";
    publicUserInfo.userid = "";
  }
  let assionParams = Object.assign(publicUserInfo, params);
  return axios.post(url, assionParams);
};
