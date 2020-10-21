/**
 * =====================================================
 *                  全部 请求 url
 * =====================================================
 */
import urls from "@/config/url/index";
import { Message } from "element-ui";
function addUrl(data) {
  let urlObj = {};
  if (!data || data.length === 0) return {};
  urls.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (urlObj.hasOwnProperty(key) === true) {
        Message.error(`url配置${key}项有重复,请仔细检查`);
      } else {
        urlObj[key] = item[key];
      }
    });
  });
  return urlObj;
}
let WebApi = addUrl(urls);
export default WebApi;
