export const debounceFn = (callbackFn) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callbackFn(...args);
    }, 500);
  };
};

export const removeDuplicateNotifications = (arr) => {
  let result = [];
  arr.forEach((item) => {
    const objIndex = result.findIndex((obj) => obj.chat._id === item.chat._id);
    if (objIndex !== -1) {
      result[objIndex].count++;
    } else {
      result.push({ ...item, count: 1 });
    }
  });
  return result;
};
