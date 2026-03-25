import store from "@/core/store/store";
import { COMPONENT_KEYS } from "@/constants/componentKeys";

export const componentKey = COMPONENT_KEYS.AUTH;

const { actions } = store.reducerManager.add({
  key: componentKey,
  addedReducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setCurrentUserRole: (state, action) => {
      state.currentUserRole = action.payload;
    },
  },
  initialReducerState: {
    loggedInUser: null,
    isAuthenticated:false,
    currentUserRole:null
  },
});

export const { setLoggedInUser, setIsAuthenticated, setCurrentUserRole} = actions;