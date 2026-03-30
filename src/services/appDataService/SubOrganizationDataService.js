import AppDataService from './AppDataService';

const BASE_URL = 'sub-organizations';

export default class SubOrganizationDataService {
  static async getSubOrganizations(params = {}) {
    return AppDataService.get(BASE_URL, { params });
  }

  static async createSubOrganization(data) {
    return AppDataService.post(BASE_URL, data);
  }

  static async changeStatus(id, status) {
    return AppDataService.patch(`${BASE_URL}/${id}/status`, { status });
  }
}
