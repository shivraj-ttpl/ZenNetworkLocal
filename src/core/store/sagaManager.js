// Dynamic saga registration — sagas are injected at page mount time
export function createSagaManager(sagaMiddleware) {
  const injectedSagas = new Map();

  return {
    addSaga(key, saga) {
      if (injectedSagas.has(key)) return; // Already running
      const task = sagaMiddleware.run(saga);
      injectedSagas.set(key, task);
    },

    removeSaga(key) {
      const task = injectedSagas.get(key);
      if (task) {
        task.cancel();
        injectedSagas.delete(key);
      }
    },

    hasKey(key) {
      return injectedSagas.has(key);
    },
  };
}
