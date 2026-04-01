import AppDataService from './AppDataService';

const BASE_URL = 'settings/labels';

export default class SettingsLabelsDataService {
  static async getLabels(params = {}) {
    return AppDataService.get(BASE_URL, { params });
  }

  static async updateLabels(data) {
    return AppDataService.patch(BASE_URL, data);
  }

  static async getDefaultLabels() {
    return AppDataService.get(`${BASE_URL}/defaults`);
  }

  static async getLabelsBySubOrg(subOrgId) {
    return AppDataService.get(`${BASE_URL}/sub-org/${subOrgId}`);
  }
}
