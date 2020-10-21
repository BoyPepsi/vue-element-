/**
 * =====================================================
 *                        用户管理
 */
let sysUserUrl = {
  list: "/admin/sysadmin/list", // 用户列表
  listNoting: "/admin/sysadmin/list/nothing", //无权限用户列表
  // dictionarie: "/admin/sysdictionaries/list", // 字典列表
  dictionarie: "/admin/sysdictionaries/list/nothing", // 字典列表
  dictionarieNothing: "/admin/sysdictionaries/list/nothing", // 字典列表
  addUser: "/admin/sysadmin/save", // 添加用户
  update: "/admin/sysadmin/update", // 编辑用户
  delUser: "/admin/sysadmin/delete", // 删除用户
  resetPassword: "/admin/sysadmin/reset", // 重置密码
  dictTree: "/admin/sysdictionaries/tree", // 字典树
  dictTreeNothing: "/admin/sysdictionaries/tree/nothing", // 字典树
};

export default sysUserUrl;
