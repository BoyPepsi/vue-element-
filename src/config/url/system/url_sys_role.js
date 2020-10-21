/**
 * =====================================================
 *                        角色管理
 */

let sysRoleUrl = {
  roleList: "/admin/role/list", // 角色管理
  roleListNothing: "/admin/role/list/nothing", //无权限角色管理
  findRole: "/admin/role/find", // 根据角色id获取权限
  findRoleNothing: "/admin/role/find/nothing",
  saveRole: "/admin/role/save", // 新增角色
  updateRole: "/admin/role/update", // 修改
  deleteRole: "/admin/role/delete", // 删除角色
};

export default sysRoleUrl;
