import AppDataService from './AppDataService';

const SUB_ORG_URL = 'sub-organizations';
const PG_URL = 'provider-groups';

export default class ProviderGroupDataService {
  static async getProviderGroups(subOrgId, params = {}) {
    return AppDataService.get(`${SUB_ORG_URL}/${subOrgId}/${PG_URL}`, {
      params,
    });
  }

  static async createProviderGroup(subOrgId, data) {
    return AppDataService.post(
      `${SUB_ORG_URL}/${subOrgId}/${PG_URL}`,
      data,
    );
  }

  static async changeStatus(id, status) {
    return AppDataService.patch(`${PG_URL}/${id}/status`, { status });
  }

  static async archiveProviderGroup(id) {
    return AppDataService.patch(`${PG_URL}/${id}/archive`);
  }

  static async unarchiveProviderGroup(id) {
    return AppDataService.patch(`${PG_URL}/${id}/unarchive`);
  }
}
