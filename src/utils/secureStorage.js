// sessionStorage expires when browser tab closes — better than localStorage for tokens.
// Note: btoa/atob is base64 ENCODING, not encryption. Suitable for demo only.
// For production, use HttpOnly cookies or a proper encryption library.

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
