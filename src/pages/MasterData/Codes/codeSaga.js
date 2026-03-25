import { all } from "redux-saga/effects";
import store from "@/core/store/store";
import { createSagaActions } from "@/core/store/sagaHelpers";
import { componentKey } from "./codesSlice";

export const codesActions = createSagaActions(componentKey, []);

function* rootSaga() {
  yield all([]);
}

// Initial registration (module load)
store.sagaManager.addSaga(componentKey, rootSaga);

// Re-register after cleanup removes the saga
export function registerSaga() {
  store.sagaManager.addSaga(componentKey, rootSaga);
}
