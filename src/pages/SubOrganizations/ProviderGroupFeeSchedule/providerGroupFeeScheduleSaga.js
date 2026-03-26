import { all } from "redux-saga/effects";
import store from "@/core/store/store";
import { componentKey } from "./providerGroupFeeScheduleSlice";

function* rootSaga() {
  yield all([]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
