import AppDataService from './AppDataService';

const SUB_ORG_URL = 'sub-organizations';
const PG_URL = 'provider-groups';

export default class ProviderGroupDataService {
  static async getProviderGroups(subOrgId, params = {}) {
    return AppDataService.get(`${SUB_ORG_URL}/${subOrgId}/${PG_URL}`, {
      params,
    });
  }

  static async getProviderGroupById(id) {
    return AppDataService.get(`${PG_URL}/${id}`);
  }

  static async createProviderGroup(subOrgId, data) {
    return AppDataService.post(`${SUB_ORG_URL}/${subOrgId}/${PG_URL}`, data);
  }

  static async updateProviderGroup(id, data) {
    return AppDataService.patch(`${PG_URL}/${id}`, data);
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

  // ─── Provider Group Users ────────────────────────

  static async getProviderGroupUsers(providerGroupId, tenantName, params = {}) {
    return AppDataService.get('provider-group/user', {
      params,
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async createProviderGroupUser(providerGroupId, data) {
    return AppDataService.post('provider-groups/users', data, {
      headers: { 'x-provider-group': providerGroupId },
    });
  }

  static async updateProviderGroupUser(id, data) {
    return AppDataService.patch(`users/${id}`, data);
  }

  static async changeProviderGroupUserStatus(id, status) {
    return AppDataService.patch(`users/${id}/status`, { status });
  }

  static async archiveProviderGroupUser(id) {
    return AppDataService.patch(`users/${id}/archive`);
  }

  static async unarchiveProviderGroupUser(id) {
    return AppDataService.patch(`users/${id}/unarchive`);
  }

  // ─── Fee Schedule ────────────────────────────────

  static async getFeeSchedules(providerGroupId, tenantName, params = {}) {
    return AppDataService.get('provider-groups/fee/schedules', {
      params,
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async createFeeSchedule(providerGroupId, data) {
    return AppDataService.post('provider-groups/fee/schedules', data, {
      headers: { 'x-provider-group': providerGroupId },
    });
  }

  static async updateFeeSchedule(id, data) {
    return AppDataService.patch(`fee-schedules/${id}`, data);
  }

  static async deleteFeeSchedule(id) {
    return AppDataService.delete(`fee-schedules/${id}`);
  }
}
