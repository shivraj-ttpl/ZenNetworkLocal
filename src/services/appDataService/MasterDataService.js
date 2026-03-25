import AppDataService from './AppDataService';

const BASE_URL = 'master-data';

export default class MasterDataService {
  static async getCodes(type, params = {}) {
    return AppDataService.get(`${BASE_URL}/codes/${type}`, { params });
  }

  static async createCode(type, data) {
    return AppDataService.post(`${BASE_URL}/codes/${type}`, data);
  }

  static async updateCode(type, id, data) {
    return AppDataService.patch(`${BASE_URL}/codes/${type}/${id}`, data);
  }

  static async toggleFavorite(type, id) {
    return AppDataService.patch(`${BASE_URL}/codes/${type}/${id}/favorite`);
  }

  static async archiveCode(type, id) {
    return AppDataService.patch(`${BASE_URL}/codes/${type}/${id}/archive`);
  }

  static async unarchiveCode(type, id) {
    return AppDataService.patch(`${BASE_URL}/codes/${type}/${id}/unarchive`);
  }

  static async downloadTemplate(type) {
    return AppDataService.get(`${BASE_URL}/codes/${type}/template`, {
      responseType: 'blob',
    });
  }

  static async importCodes(type, formData) {
    return AppDataService.post(`${BASE_URL}/codes/${type}/import`, formData, {
      isFormData: true,
    });
  }

  static async getConditions(params = {}) {
    return AppDataService.get(`${BASE_URL}/conditions`, { params });
  }

  static async getPayers(params = {}) {
    return AppDataService.get(`${BASE_URL}/payers`, { params });
  }

  static async getCarePlans(params = {}) {
    return AppDataService.get(`${BASE_URL}/care-plans`, { params });
  }

  static async getAssessments(params = {}) {
    return AppDataService.get(`${BASE_URL}/assessments`, { params });
  }

  static async getEducation(params = {}) {
    return AppDataService.get(`${BASE_URL}/education`, { params });
  }
}
