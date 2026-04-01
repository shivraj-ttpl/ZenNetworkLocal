import AppDataService from '@/services/appDataService/AppDataService';

const SETTING_URL = 'settings';

export default class SettingsProfileDataService {
  static getProfile() {
    return AppDataService.get(`${SETTING_URL}/profile`);
  }

  static getOrgProfile() {
    return AppDataService.get('organizations/profile');
  }

  static updateOrgProfile(data) {
    return AppDataService.patch('organizations/profile', data);
  }

  static getUsers(params) {
    return AppDataService.get(`${SETTING_URL}/users`, { params });
  }

  static updateUserStatus(userId, status) {
    return AppDataService.patch(`${SETTING_URL}/users/${userId}/status`, { status });
  }

  static getUserById(userId) {
    return AppDataService.get(`${SETTING_URL}/users/${userId}`);
  }

  static createUser(data) {
    return AppDataService.post(`${SETTING_URL}/users`, data);
  }

  static updateUser(userId, data) {
    return AppDataService.patch(`${SETTING_URL}/users/${userId}`, data);
  }

  static archiveUser(userId) {
    return AppDataService.patch(`${SETTING_URL}/users/${userId}/archive`);
  }

  static unarchiveUser(userId) {
    return AppDataService.patch(`${SETTING_URL}/users/${userId}/unarchive`);
  }

  static sendInvitation(userId) {
    return AppDataService.post(`${SETTING_URL}/users/${userId}/send-invitation`);
  }
}
