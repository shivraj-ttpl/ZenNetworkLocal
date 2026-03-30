import AppDataService from './AppDataService';

const BASE_URL = 'sub-organizations';

export default class SubOrganizationDataService {
  static async getSubOrganizations(params = {}) {
    return AppDataService.get(BASE_URL, { params });
  }

  static async createSubOrganization(data) {
    return AppDataService.post(BASE_URL, data);
  }

  static async getSubOrganizationById(id) {
    return AppDataService.get(`${BASE_URL}/${id}`);
  }

  static async updateSubOrganization(id, data) {
    return AppDataService.patch(`${BASE_URL}/${id}`, data);
  }

  static async changeStatus(id, status) {
    return AppDataService.patch(`${BASE_URL}/${id}/status`, { status });
  }

  static async archiveSubOrganization(id) {
    return AppDataService.patch(`${BASE_URL}/${id}/archive`);
  }

  static async unarchiveSubOrganization(id) {
    return AppDataService.patch(`${BASE_URL}/${id}/unarchive`);
  }
}
