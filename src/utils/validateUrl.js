export function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}
