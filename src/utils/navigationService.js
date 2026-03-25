let _navigate = null;

export const setNavigateRef = (navigateFn) => {
  _navigate = navigateFn;
};

export const appNavigate = (path, options) => {
  if (_navigate) {
    _navigate(path, options);
  }
};
