import AppDataService from '@/services/appDataService/AppDataService';

const SETTING_URL = 'settings';

export default class SettingsRolesDataService {
  static getRoles(params) {
    return AppDataService.get(`${SETTING_URL}/roles`, { params });
  }

  static getRoleById(roleId) {
    return AppDataService.get(`${SETTING_URL}/roles/${roleId}`);
  }

  static createRole(data) {
    return AppDataService.post(`${SETTING_URL}/roles`, data);
  }

  static updateRoleStatus(roleId, status) {
    return AppDataService.patch(`${SETTING_URL}/roles/${roleId}/status`, {
      status,
    });
  }

  static archiveRole(roleId) {
    return AppDataService.patch(`${SETTING_URL}/roles/${roleId}/archive`);
  }

  static unarchiveRole(roleId) {
    return AppDataService.patch(`${SETTING_URL}/roles/${roleId}/unarchive`);
  }

  static updateRolePermissions(roleId, data) {
    return AppDataService.patch(`${SETTING_URL}/roles/${roleId}`, data);
  }
}
