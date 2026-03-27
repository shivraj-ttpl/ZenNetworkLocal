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

  // ─── Conditions ─────────────────────────────────────

  static async getConditions(params = {}) {
    return AppDataService.get(`${BASE_URL}/conditions`, { params });
  }

  static async createCondition(data) {
    return AppDataService.post(`${BASE_URL}/conditions`, data);
  }

  static async updateCondition(id, data) {
    return AppDataService.patch(`${BASE_URL}/conditions/${id}`, data);
  }

  static async toggleConditionFavorite(id) {
    return AppDataService.patch(`${BASE_URL}/conditions/${id}/favorite`);
  }

  static async archiveCondition(id) {
    return AppDataService.patch(`${BASE_URL}/conditions/${id}/archive`);
  }

  static async unarchiveCondition(id) {
    return AppDataService.patch(`${BASE_URL}/conditions/${id}/unarchive`);
  }

  // ─── Payers ────────────────────────────────────────

  static async getPayers(params = {}) {
    return AppDataService.get(`${BASE_URL}/payers`, { params });
  }

  static async createPayer(data) {
    return AppDataService.post(`${BASE_URL}/payers`, data);
  }

  static async updatePayer(id, data) {
    return AppDataService.patch(`${BASE_URL}/payers/${id}`, data);
  }

  static async togglePayerStatus(id, data) {
    return AppDataService.patch(`${BASE_URL}/payers/${id}/status`, data);
  }

  static async togglePayerFavorite(id) {
    return AppDataService.patch(`${BASE_URL}/payers/${id}/favorite`);
  }

  static async archivePayer(id) {
    return AppDataService.patch(`${BASE_URL}/payers/${id}/archive`);
  }

  static async unarchivePayer(id) {
    return AppDataService.patch(`${BASE_URL}/payers/${id}/unarchive`);
  }

  static async downloadPayersTemplate() {
    return AppDataService.get(`${BASE_URL}/payers/template`, {
      responseType: 'blob',
    });
  }

  static async importPayers(formData) {
    return AppDataService.post(`${BASE_URL}/payers/import`, formData, {
      isFormData: true,
    });
  }

  // ─── Care Plans ────────────────────────────────────

  static async getCarePlans(params = {}) {
    return AppDataService.get(`${BASE_URL}/care-plans`, { params });
  }

  static async toggleCarePlanFavorite(id) {
    return AppDataService.patch(`${BASE_URL}/care-plans/${id}/favorite`);
  }

  static async archiveCarePlan(id) {
    return AppDataService.patch(`${BASE_URL}/care-plans/${id}/archive`);
  }

  static async unarchiveCarePlan(id) {
    return AppDataService.patch(`${BASE_URL}/care-plans/${id}/unarchive`);
  }

  // ─── Assessments ───────────────────────────────────

  static async getAssessments(params = {}) {
    return AppDataService.get(`${BASE_URL}/assessments`, { params });
  }

  static async toggleAssessmentFavorite(id) {
    return AppDataService.patch(`${BASE_URL}/assessments/${id}/favorite`);
  }

  static async archiveAssessment(id) {
    return AppDataService.patch(`${BASE_URL}/assessments/${id}/archive`);
  }

  static async unarchiveAssessment(id) {
    return AppDataService.patch(`${BASE_URL}/assessments/${id}/unarchive`);
  }

  // ─── Education ─────────────────────────────────────

  static async getEducation(params = {}) {
    return AppDataService.get(`${BASE_URL}/education`, { params });
  }

  static async createEducation(data) {
    return AppDataService.post(`${BASE_URL}/education`, data);
  }

  static async updateEducation(id, data) {
    return AppDataService.patch(`${BASE_URL}/education/${id}`, data);
  }

  static async toggleEducationFavorite(id) {
    return AppDataService.patch(`${BASE_URL}/education/${id}/favorite`);
  }

  static async archiveEducation(id) {
    return AppDataService.patch(`${BASE_URL}/education/${id}/archive`);
  }

  static async unarchiveEducation(id) {
    return AppDataService.patch(`${BASE_URL}/education/${id}/unarchive`);
  }

  static async downloadEducation(id) {
    return AppDataService.get(`${BASE_URL}/education/${id}/download`, {
      responseType: 'blob',
    });
  }
}
