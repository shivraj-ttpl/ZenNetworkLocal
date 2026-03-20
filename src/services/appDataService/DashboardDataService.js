import AppDataService from "./AppDataService";
const BASE_URL = "/dashboard";
// Example service — one static method per API endpoint
export default class DashboardDataService {
  static async getStats(params) {
    return AppDataService.get(`${BASE_URL}/stats`, { params });
  }

  static async getChartData(params) {
    return AppDataService.get(`${BASE_URL}/chart`, { params });
  }
}
