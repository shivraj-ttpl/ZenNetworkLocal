import { takeLatest, all, put } from "redux-saga/effects";
import store from "@/core/store/store";
import { apiCall, createSagaActions } from "@/core/store/sagaHelpers";
import { LOADING_KEYS } from "@/constants/loadingKeys";
import { componentKey, setStats } from "./dashboardSlice";
import DashboardDataService from "@/services/appDataService/DashboardDataService";

// Action creators for saga dispatch
export const dashboardActions = createSagaActions(componentKey, [
  "fetchStats",
  "fetchChart",
]);

// Worker sagas — zero boilerplate loading/error handling
function* fetchStatsSaga(action) {
  
  yield* apiCall({
    loadingKey: LOADING_KEYS.DASHBOARD_GET_STATS,
    apiFunc: () => DashboardDataService.getStats(action.payload),
    onSuccess: function* (response) {
      yield put(setStats(response.data));
    },
  });
}

// Root saga
function* rootSaga() {
  yield all([
    takeLatest(dashboardActions.fetchStats().type, fetchStatsSaga),
  ]);
}

// Register saga
store.sagaManager.addSaga(componentKey, rootSaga);
