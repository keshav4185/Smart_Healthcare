// Secure storage: sessionStorage expires when browser tab closes
// Better than localStorage for sensitive tokens (reduces XSS window)

const PREFIX = 'hc_';

const encode = (value) => btoa(encodeURIComponent(JSON.stringify(value)));
const decode = (value) => {
  try {
    return JSON.parse(decodeURIComponent(atob(value)));
  } catch {
    return null;
  }
};

export const secureStorage = {
  set: (key, value) => {
    sessionStorage.setItem(PREFIX + key, encode(value));
  },
  get: (key) => {
    const item = sessionStorage.getItem(PREFIX + key);
    return item ? decode(item) : null;
  },
  remove: (key) => {
    sessionStorage.removeItem(PREFIX + key);
  },
  clear: () => {
    Object.keys(sessionStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => sessionStorage.removeItem(k));
  },
};
