import DataService from "../utils/dataservice/DataService";

// Default app-wide data service instance (uses VITE_API_URL)
class AppDataService extends DataService {}

export default new AppDataService();
