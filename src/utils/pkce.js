export function base64UrlEncode(bytes) {
    const binaryString = String.fromCharCode(...bytes);
    return btoa(binaryString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generateCodeVerifier() {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return base64UrlEncode(randomBytes);
}

export async function generateCodeChallenge(verifier) {
  // 1. Convert the verifier string into a Uint8Array of bytes using TextEncoder
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  // 2. Hash the bytes using crypto.subtle.digest('SHA-256', ...)
  //    Remember: this returns a Promise, so use await
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // 3. The result is an ArrayBuffer. Convert it to a Uint8Array so base64UrlEncode can use it.
  //    Hint: new Uint8Array(arrayBuffer)
  const hashArray = new Uint8Array(hashBuffer);
  
  // 4. Pass that to base64UrlEncode() and return the result
  return base64UrlEncode(hashArray);
}