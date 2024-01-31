export const debounceFn = (callbackFn) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callbackFn(...args);
    }, 400);
  };
};
