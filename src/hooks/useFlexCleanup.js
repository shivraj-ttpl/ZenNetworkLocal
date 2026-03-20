import { useEffect } from "react";
import { useDispatch } from "react-redux";
import store from "@/core/store/store";
import { clearLoadingKeysByPrefix } from "@/core/store/loadingSlice";

/**
 * Auto-cleanup hook — on unmount:
 *  1. Removes the component's dynamic reducer from the store
 *  2. Removes the component's dynamic saga
 *  3. Clears all loadingKeys prefixed with the component key
 *
 * Usage:
 *   useFlexCleanup(COMPONENT_KEYS.DASHBOARD);
 *
 * Options:
 *   useFlexCleanup(key, { keepReducer: true })  — skip reducer removal
 *   useFlexCleanup(key, { keepSaga: true })      — skip saga removal
 */
export function useFlexCleanup(componentKey, options = {}) {
  const dispatch = useDispatch();
  const { keepReducer = false, keepSaga = false } = options;

  useEffect(() => {
    return () => {
      // Clear loading keys belonging to this component
      dispatch(clearLoadingKeysByPrefix(componentKey));

      // Remove dynamic reducer
      if (!keepReducer) {
        store.reducerManager.remove(componentKey);
      }

      // Remove dynamic saga
      if (!keepSaga) {
        store.sagaManager.removeSaga(componentKey);
      }
    };
  }, [componentKey, dispatch, keepReducer, keepSaga]);
}
