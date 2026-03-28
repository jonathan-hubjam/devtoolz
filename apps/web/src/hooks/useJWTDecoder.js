import { useState, useEffect } from 'react';

/**
 * Base64URL decode helper function
 * Converts base64url encoded string to UTF-8 string
 */
const base64UrlDecode = (str) => {
  console.log('[JWT Decoder] Decoding base64 string:', str);
  try {
    // Convert base64url to base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    console.log('[JWT Decoder] Normalized base64:', base64);
    
    // Decode base64 to binary string
    const binaryString = atob(base64);
    console.log('[JWT Decoder] Binary string length:', binaryString.length);
    
    // Convert binary string to UTF-8
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decode UTF-8 bytes to string
    const decoded = new TextDecoder('utf-8').decode(bytes);
    console.log('[JWT Decoder] Decoded string:', decoded);
    return decoded;
  } catch (error) {
    console.error('[JWT Decoder] Base64 decode error:', error);
    throw new Error(`Invalid base64 encoding: ${error.message}`);
  }
};

const formatUTCDate = (timestamp) => {
  const d = new Date(timestamp * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (n) => n.toString().padStart(2, '0');
  return `${months[d.getUTCMonth()]} ${pad(d.getUTCDate())} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
};

const calculateTimeRemaining = (expTs) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = expTs - now;
  if (diff <= 0) return null;
  
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (parts.length === 0) parts.push('< 1m');
  
  return parts.join(' ');
};

/**
 * Custom hook for JWT token decoding and validation
 * @param {string} token - The JWT token to decode
 * @returns {Object} - Decoded data, error state, validation status, and timestamp metadata
 */
const useJWTDecoder = (token) => {
  const [decoded, setDecoded] = useState({
    header: null,
    payload: null,
    signature: null,
    headerRaw: null,
    payloadRaw: null,
    signatureRaw: null
  });
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [timestampMetadata, setTimestampMetadata] = useState([]);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    console.log('[JWT Decoder] Hook triggered with token:', token);

    // Reset state if token is empty
    if (!token || token.trim() === '') {
      console.log('[JWT Decoder] Empty token, resetting state.');
      setDecoded({
        header: null, payload: null, signature: null,
        headerRaw: null, payloadRaw: null, signatureRaw: null
      });
      setError(null);
      setIsValid(false);
      setTimestampMetadata([]);
      setIsExpired(false);
      return;
    }

    try {
      // Remove ALL whitespace (spaces, tabs, newlines) which often break atob()
      const cleanToken = token.replace(/\s+/g, '');
      console.log('[JWT Decoder] Cleaned token (whitespace removed):', cleanToken);
      
      const parts = cleanToken.split('.');
      console.log('[JWT Decoder] Token parts count:', parts.length);
      
      // Validate JWT structure (must have exactly 3 parts)
      if (parts.length !== 3) {
        throw new Error(`Invalid JWT format. Expected 3 parts separated by dots, but found ${parts.length} part${parts.length !== 1 ? 's' : ''}.`);
      }

      const [headerB64, payloadB64, signatureB64] = parts;

      // Check for empty parts
      if (!headerB64 || !payloadB64 || !signatureB64) {
        throw new Error('Invalid JWT format. One or more parts are empty.');
      }

      // Decode and parse header
      console.log('[JWT Decoder] Processing Header B64:', headerB64);
      const headerJson = base64UrlDecode(headerB64);
      console.log('[JWT Decoder] Header JSON string:', headerJson);
      let header;
      try {
        header = JSON.parse(headerJson);
        console.log('[JWT Decoder] Parsed Header object:', header);
      } catch (e) {
        console.error('[JWT Decoder] Header JSON parse error:', e);
        throw new Error('Invalid JWT header. The header is not valid JSON.');
      }

      // Decode and parse payload
      console.log('[JWT Decoder] Processing Payload B64:', payloadB64);
      const payloadJson = base64UrlDecode(payloadB64);
      console.log('[JWT Decoder] Payload JSON string:', payloadJson);
      let payload;
      try {
        payload = JSON.parse(payloadJson);
        console.log('[JWT Decoder] Parsed Payload object:', payload);
      } catch (e) {
        console.error('[JWT Decoder] Payload JSON parse error:', e);
        throw new Error('Invalid JWT payload. The payload is not valid JSON.');
      }

      // Signature is kept as-is (base64url encoded string)
      const signature = signatureB64;
      console.log('[JWT Decoder] Signature:', signature);

      // Process timestamp claims
      const tsClaims = ['exp', 'iat', 'nbf', 'auth_time'];
      const metadata = [];
      let tokenExpired = false;

      if (payload && typeof payload === 'object') {
        tsClaims.forEach(claim => {
          if (payload[claim] && typeof payload[claim] === 'number') {
            const value = payload[claim];
            const formattedDate = formatUTCDate(value);
            const meta = { claim, value, formattedDate };

            if (claim === 'exp') {
              const now = Math.floor(Date.now() / 1000);
              if (value <= now) {
                meta.isExpired = true;
                tokenExpired = true;
              } else {
                meta.isExpired = false;
                meta.timeRemaining = calculateTimeRemaining(value);
              }
            }
            metadata.push(meta);
          }
        });
      }

      // Pretty-print JSON with 2-space indentation
      const headerPretty = JSON.stringify(header, null, 2);
      const payloadPretty = JSON.stringify(payload, null, 2);

      console.log('[JWT Decoder] Successfully decoded token. Setting state.');

      // Set decoded data
      setDecoded({
        header: headerPretty,
        payload: payloadPretty,
        signature: signature,
        headerRaw: header,
        payloadRaw: payload,
        signatureRaw: signature
      });
      setTimestampMetadata(metadata);
      setIsExpired(tokenExpired);
      setError(null);
      setIsValid(true);
    } catch (err) {
      // Set error state
      console.error('[JWT Decoder] Validation error caught:', err.message);
      setError(err.message);
      setDecoded({
        header: null, payload: null, signature: null,
        headerRaw: null, payloadRaw: null, signatureRaw: null
      });
      setTimestampMetadata([]);
      setIsExpired(false);
      setIsValid(false);
    }
  }, [token]);

  return { decoded, error, isValid, timestampMetadata, isExpired };
};

export default useJWTDecoder;