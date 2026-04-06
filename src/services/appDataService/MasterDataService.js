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

  static async archiveCode(type, id, data) {
    return AppDataService.patch(
      `${BASE_URL}/codes/${type}/${id}/archive`,
      data,
    );
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

  static async archiveCondition(id, data) {
    return AppDataService.patch(`${BASE_URL}/conditions/${id}/archive`, data);
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

  static async archivePayer(id, data) {
    return AppDataService.patch(`${BASE_URL}/payers/${id}/archive`, data);
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

  static async archiveCarePlan(id, data) {
    return AppDataService.patch(`${BASE_URL}/care-plans/${id}/archive`, data);
  }

  // ─── Assessments ───────────────────────────────────

  static async getAssessments(params = {}) {
    return AppDataService.get(`${BASE_URL}/assessments`, { params });
  }

  static async toggleAssessmentFavorite(id) {
    return AppDataService.patch(`${BASE_URL}/assessments/${id}/favorite`);
  }

  static async archiveAssessment(id, data) {
    return AppDataService.patch(`${BASE_URL}/assessments/${id}/archive`, data);
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

  static async archiveEducation(id, data) {
    return AppDataService.patch(`${BASE_URL}/education/${id}/archive`, data);
  }

  static async downloadEducation(id) {
    return AppDataService.get(`${BASE_URL}/education/${id}/download`, {
      responseType: 'blob',
    });
  }

  // ─── Allergies ─────────────────────────────────────

  static async getAllergies(params = {}) {
    return AppDataService.get(`${BASE_URL}/allergies`, { params });
  }

  static async createAllergy(data) {
    return AppDataService.post(`${BASE_URL}/allergies`, data);
  }

  static async updateAllergy(id, data) {
    return AppDataService.patch(`${BASE_URL}/allergies/${id}`, data);
  }

  static async toggleAllergyFavorite(id) {
    return AppDataService.patch(`${BASE_URL}/allergies/${id}/favorite`);
  }

  static async archiveAllergy(id, data) {
    return AppDataService.patch(`${BASE_URL}/allergies/${id}/archive`, data);
  }

  static async importAllergies(formData) {
    return AppDataService.post(`${BASE_URL}/allergies/import`, formData, {
      isFormData: true,
    });
  }

  // ─── Symptoms ──────────────────────────────────────

  static async getSymptoms(params = {}) {
    return AppDataService.get(`${BASE_URL}/symptoms`, { params });
  }

  static async createSymptom(data) {
    return AppDataService.post(`${BASE_URL}/symptoms`, data);
  }

  static async updateSymptom(id, data) {
    return AppDataService.patch(`${BASE_URL}/symptoms/${id}`, data);
  }

  static async toggleSymptomFavorite(id) {
    return AppDataService.patch(`${BASE_URL}/symptoms/${id}/favorite`);
  }

  static async archiveSymptom(id, data) {
    return AppDataService.patch(`${BASE_URL}/symptoms/${id}/archive`, data);
  }

  static async importSymptoms(formData) {
    return AppDataService.post(`${BASE_URL}/symptoms/import`, formData, {
      isFormData: true,
    });
  }

  // ─── Medications ───────────────────────────────────

  static async getMedications(params = {}) {
    return AppDataService.get(`${BASE_URL}/medications`, { params });
  }

  static async createMedication(data) {
    return AppDataService.post(`${BASE_URL}/medications`, data);
  }

  static async updateMedication(id, data) {
    return AppDataService.patch(`${BASE_URL}/medications/${id}`, data);
  }

  static async toggleMedicationFavorite(id) {
    return AppDataService.patch(`${BASE_URL}/medications/${id}/favorite`);
  }

  static async archiveMedication(id, data) {
    return AppDataService.patch(`${BASE_URL}/medications/${id}/archive`, data);
  }

  static async importMedications(formData) {
    return AppDataService.post(`${BASE_URL}/medications/import`, formData, {
      isFormData: true,
    });
  }
}
