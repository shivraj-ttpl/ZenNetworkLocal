import { all } from "redux-saga/effects";
import store from "@/core/store/store";
import { componentKey } from "./settingsProfileSlice";

function* rootSaga() {
  // No side-effects yet — kept for parity with other feature sagas.
  yield all([]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}

