function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decode(token) {
  if (!token || typeof token !== 'string') return null;

  const [, payload] = token.split('.');
  if (!payload) return null;

  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

export default { decode };
