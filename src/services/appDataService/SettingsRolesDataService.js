import AppDataService from '@/services/appDataService/AppDataService';

const SETTING_URL = 'settings';

export default class SettingsRolesDataService {
  static getRoles(params) {
    return AppDataService.get(`${SETTING_URL}/roles`, { params });
  }

  // static getRoleById(roleId, subOrgId) {
  //   const query = subOrgId ? `?subOrgId=${Number(subOrgId)}` : '';
  //   return AppDataService.get(`${SETTING_URL}/roles/${roleId}${query}`);
  // }

  static getRoleById(roleId, subOrgId) {
    const query = subOrgId !== undefined ? `?subOrgId=${Number(subOrgId)}` : '';

    return AppDataService.get(`${SETTING_URL}/roles/${roleId}${query}`);
  }

  static createRole(data) {
    return AppDataService.post(`${SETTING_URL}/roles`, data);
  }

  static updateRoleStatus(roleId, status, subOrgId) {
    const payload = {
      status,
      ...(subOrgId && { subOrgId: Number(subOrgId) }),
    };

    return AppDataService.patch(
      `${SETTING_URL}/roles/${roleId}/status`,
      payload,
    );
  }

  static archiveRole(roleId, subOrgId) {
    const query = subOrgId ? `?subOrgId=${Number(subOrgId)}` : '';
    return AppDataService.patch(
      `${SETTING_URL}/roles/${roleId}/archive${query}`,
    );
  }

  static unarchiveRole(roleId, subOrgId) {
    const query = subOrgId ? `?subOrgId=${Number(subOrgId)}` : '';
    return AppDataService.patch(
      `${SETTING_URL}/roles/${roleId}/unarchive${query}`,
    );
  }

  static updateRolePermissions(roleId, data) {
    return AppDataService.patch(`${SETTING_URL}/roles/${roleId}`, data);
  }
}
