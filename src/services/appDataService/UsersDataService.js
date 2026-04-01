import AppDataService from '@/services/appDataService/AppDataService';

export default class UsersDataService {
  static getUserById(userId) {
    return AppDataService.get(`users/${userId}`);
  }

  static updateUser(userId, data) {
    return AppDataService.patch(`users/${userId}`, data);
  }
}
