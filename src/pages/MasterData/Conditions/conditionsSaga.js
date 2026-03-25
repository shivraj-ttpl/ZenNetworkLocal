import { all } from "redux-saga/effects";
import store from "@/core/store/store";
import { createSagaActions } from "@/core/store/sagaHelpers";
import { componentKey } from "./conditionsSlice";

export const conditionsActions = createSagaActions(componentKey, []);

function* rootSaga() {
  yield all([]);
}

store.sagaManager.addSaga(componentKey, rootSaga);

export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
