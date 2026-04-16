import AppDataService from './AppDataService';

const SUB_ORG_URL = 'sub-organizations';
const PG_URL = 'provider-groups';

export default class ProviderGroupDataService {
  static async getProviderGroups(subOrgId, tenantName, params = {}) {
    return AppDataService.get(`${SUB_ORG_URL}/${subOrgId}/${PG_URL}`, {
      params,
      headers: {
        'tenant-name': tenantName,
      },
    });
  }

  static async getProviderGroupById(id, tenantName) {
    return AppDataService.get(`${PG_URL}/${id}`, {
      headers: {
        'tenant-name': tenantName,
      },
    });
  }

  static async createProviderGroup(subOrgId, data, tenantName) {
    return AppDataService.post(`${SUB_ORG_URL}/${subOrgId}/${PG_URL}`, data, {
      headers: {
        'tenant-name': tenantName,
      },
    });
  }

  static async updateProviderGroup(id, tenantName, data) {
    return AppDataService.patch(`${PG_URL}/${id}`, data, {
      headers: {
        'tenant-name': tenantName,
      },
    });
  }

  static async changeStatus(id, status, tenantName) {
    return AppDataService.patch(
      `${PG_URL}/${id}/status`,
      { status },
      {
        headers: {
          'tenant-name': tenantName,
        },
      },
    );
  }

  static async archiveProviderGroup(id, tenantName) {
    return AppDataService.patch(
      `${PG_URL}/${id}/archive`,
      {},
      {
        headers: {
          'tenant-name': tenantName,
        },
      },
    );
  }

  static async unarchiveProviderGroup(id, tenantName) {
    return AppDataService.patch(
      `${PG_URL}/${id}/unarchive`,
      {},
      {
        headers: {
          'tenant-name': tenantName,
        },
      },
    );
  }

  // ─── Provider Group Providers ─────────────────────

  static async getProviderById(providerId, providerGroupId, tenantName) {
    return AppDataService.get(`providers/${providerId}`, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async createProvider(providerGroupId, tenantName, data) {
    return AppDataService.post('provider-groups/providers', data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async updateProvider(providerGroupId, providerId, tenantName, data) {
    return AppDataService.patch(`providers/${providerId}`, data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  // ─── Provider Group Users ────────────────────────

  static async getProviderGroupUsers(providerGroupId, tenantName, params = {}) {
    return AppDataService.get('provider-groups/users', {
      params,
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async getProviderGroupProviders(
    providerGroupId,
    tenantName,
    params = {},
  ) {
    return AppDataService.get('provider-group/provider', {
      params,
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async createProviderGroupUser(providerGroupId, tenantName, data) {
    return AppDataService.post('provider-groups/users', data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async updateProviderGroupUser(id, data) {
    return AppDataService.patch(`users/${id}`, data);
  }

  static async changeProviderGroupUserStatus(id, status) {
    return AppDataService.patch(`users/${id}/status`, { status });
  }

  static async changeProviderStatus(id, providerGroupId, tenantName, status) {
    return AppDataService.patch(
      `providers/${id}/status`,
      { status },
      {
        headers: {
          'x-provider-group': providerGroupId,
          'tenant-name': tenantName,
        },
      },
    );
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

  static async createFeeSchedule(providerGroupId, tenantName, data) {
    return AppDataService.post('provider-groups/fee/schedules', data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async updateFeeSchedule(id, providerGroupId, tenantName, data) {
    return AppDataService.patch(`fee/schedules/${id}`, data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async deleteFeeSchedule(id, providerGroupId, tenantName) {
    return AppDataService.delete(`fee/schedules/${id}`, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  // ─── Provider Availability ─────────────────────────

  static async getAvailabilityCalendar(
    providerGroupId,
    tenantName,
    params = {},
  ) {
    return AppDataService.get(`${PG_URL}/availability`, {
      params,
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async getAvailabilitySlotsForDate(
    providerGroupId,
    tenantName,
    date,
    params = {},
  ) {
    return AppDataService.get(`${PG_URL}/availability/${date}`, {
      params,
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async bulkConfigureAvailability(providerGroupId, tenantName, data) {
    return AppDataService.post(`${PG_URL}/availability/bulk`, data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async addBlockDay(providerGroupId, tenantName, data) {
    return AppDataService.post(`${PG_URL}/availability/block-days`, data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async removeBlockDay(providerGroupId, tenantName, date) {
    return AppDataService.delete(`${PG_URL}/availability/block-days/${date}`, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async convertBlockDay(providerGroupId, tenantName, date, data) {
    return AppDataService.patch(
      `${PG_URL}/availability/block-days/${date}`,
      data,
      {
        headers: {
          'x-provider-group': providerGroupId,
          'tenant-name': tenantName,
        },
      },
    );
  }

  // ─── Provider Group Patients ───────────────────────

  static async getPatients(providerGroupId, tenantName, params = {}) {
    return AppDataService.get(`${PG_URL}/patients`, {
      params,
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async getPatientById(id, providerGroupId, tenantName) {
    return AppDataService.get(`patients/${id}`, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async updatePatient(id, providerGroupId, tenantName, data) {
    return AppDataService.patch(`patients/${id}`, data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async enrollPatient(id, providerGroupId, tenantName, data) {
    return AppDataService.post(`patients/${id}/enroll`, data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async unenrollPatient(id, providerGroupId, tenantName) {
    return AppDataService.post(
      `patients/${id}/unenroll`,
      {},
      {
        headers: {
          'x-provider-group': providerGroupId,
          'tenant-name': tenantName,
        },
      },
    );
  }

  static async inactivatePatient(id, providerGroupId, tenantName, data) {
    return AppDataService.post(`patients/${id}/inactive`, data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async recoverPatient(id, providerGroupId, tenantName, data) {
    return AppDataService.post(`patients/${id}/recover`, data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async importPatientsCsv(providerGroupId, tenantName, formData) {
    return AppDataService.post(`${PG_URL}/patients/import`, formData, {
      isFormData: true,
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  // ─── Configuration ────────────────────────────────

  static async getConfiguration(providerGroupId, tenantName) {
    return AppDataService.get(`${PG_URL}/configuration`, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async createCallerIdVerification(providerGroupId, tenantName, data) {
    return AppDataService.post(`${PG_URL}/configuration/caller-id`, data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async deleteCallerIdVerification(providerGroupId, tenantName) {
    return AppDataService.delete(`${PG_URL}/configuration/caller-id`, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async createSenderEmail(providerGroupId, tenantName, data) {
    return AppDataService.post(`${PG_URL}/configuration/sender-email`, data, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }

  static async deleteSenderEmail(providerGroupId, tenantName) {
    return AppDataService.delete(`${PG_URL}/configuration/sender-email`, {
      headers: {
        'x-provider-group': providerGroupId,
        'tenant-name': tenantName,
      },
    });
  }
}
