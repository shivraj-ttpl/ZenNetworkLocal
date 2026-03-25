import { takeLatest, all, put } from "redux-saga/effects";
import store from "@/core/store/store";
import { apiCall, createSagaActions } from "@/core/store/sagaHelpers";
import { LOADING_KEYS } from "@/constants/loadingKeys";
import { componentKey } from "./authSlice";
import AuthDataService from "../../services/appDataService/AuthDataService";

// Action creators for saga dispatch
export const authActions = createSagaActions(componentKey, [
  "postLogin",
  "postLogout",
  "postForgotPassword",
  "postSetPassword",
  "postResetPassword",
]);

function* postLoginSaga(action) {
  const {payload, onSuccessCb} = action.payload
  yield* apiCall({
    loadingKey: LOADING_KEYS.AUTH_POST_LOGIN,
    apiFunc: () => AuthDataService.postLogin(payload),
    onSuccess: function* (response) {
      onSuccessCb(response)
    },
  });
}

function* postLogoutSaga() {
  yield* apiCall({
    loadingKey: LOADING_KEYS.AUTH_POST_LOGOUT,
    apiFunc: () => AuthDataService.postLogout(),
  });
}

function* postForgotPasswordSaga(action) {
  const { payload, onSuccessCb } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.AUTH_POST_FORGOT_PASSWORD,
    apiFunc: () => AuthDataService.postForgotPassword(payload),
    onSuccess: function* (response) {
      if (onSuccessCb) onSuccessCb(response);
    },
  });
}

function* postSetPasswordSaga(action) {
  const { payload, onSuccessCb } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.AUTH_POST_SET_PASSWORD,
    apiFunc: () => AuthDataService.postSetPassword(payload),
    onSuccess: function* (response) {
      if (onSuccessCb) onSuccessCb(response);
    },
  });
}

function* postResetPasswordSaga(action) {
  const { payload, onSuccessCb } = action.payload;
  yield* apiCall({
    loadingKey: LOADING_KEYS.AUTH_POST_RESET_PASSWORD,
    apiFunc: () => AuthDataService.postResetPassword(payload),
    onSuccess: function* (response) {
      if (onSuccessCb) onSuccessCb(response);
    },
  });
}

// Root saga
function* rootSaga() {
  yield all([
    takeLatest(authActions.postLogin().type, postLoginSaga),
    takeLatest(authActions.postLogout().type, postLogoutSaga),
    takeLatest(authActions.postForgotPassword().type, postForgotPasswordSaga),
    takeLatest(authActions.postSetPassword().type, postSetPasswordSaga),
    takeLatest(authActions.postResetPassword().type, postResetPasswordSaga),
  ]);
}

// Register saga
store.sagaManager.addSaga(componentKey, rootSaga);