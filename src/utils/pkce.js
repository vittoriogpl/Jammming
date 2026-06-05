// String.fromCharCode(...bytes) spreads the byte values as arguments and turns them into a character string.
// btoa() does the standard base64 encoding (but it produces the URL-unsafe version because of the +, /  and =).
// The three .replace() calls convert standard base64 to URL-safe base64url.

export function base64UrlEncode(bytes) {
    const binaryString = String.fromCharCode(...bytes);
    return btoa(binaryString) 
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // removes any = padding at the end of the string
}

// Uint8Array is a special kind of array that holds bytes (numbers from 0 to 255). 
// We use it because the crypto API works on bytes, not regular strings or numbers.

export function generateCodeVerifier() {
    const randomBytes = new Uint8Array(32); // first create an empty container of the right size, then pass it in to be filled
    crypto.getRandomValues(randomBytes); // a method that fills the empty array container with cryptographically secure random numbers. 
    // Regular Math.random() is not secure enough for this purpose.
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
  const hashArray = new Uint8Array(hashBuffer);
  
  // 4. Pass that to base64UrlEncode() and return the result
  return base64UrlEncode(hashArray);
}