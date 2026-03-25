import AppDataService from "./AppDataService";
const BASE_URL = "auth";

export default class AuthDataService {
  static async postLogin(data) {
    return AppDataService.post(`${BASE_URL}/login`, data , {withCredentials: true});
  }
 
  static async postLogout() {
    return AppDataService.post(`${BASE_URL}/logout`, {} , {withCredentials: true});
  }

  static async postForgotPassword(data) {
    return AppDataService.post(`${BASE_URL}/forgot-password`, data);
  }

  static async postSetPassword(data) {
    return AppDataService.post(`${BASE_URL}/set-password`, data);
  }

  static async postResetPassword(data) {
    return AppDataService.post(`${BASE_URL}/reset-password`, data);
  }
}