import jwtDecode from 'jwt-decode';
import { DecodedToken, DecodedAccessToken } from '../types';


export function accessTokenExpired(): boolean {
  const token = sessionStorage.getItem('accessToken');

  if (!token) return true;  // If there's no token, assume it's expired

  // Decode the token and check its expiry
  const decodedToken: DecodedToken = jwtDecode(token);
  const now = Date.now().valueOf() / 1000;
  return typeof decodedToken.exp !== "undefined" && decodedToken.exp < now;
}

export function decodeAccessToken(): DecodedAccessToken | null {
  const token = sessionStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decodedToken: DecodedAccessToken = jwtDecode(token);
    console.log("Decoded access token:", decodedToken);

    return decodedToken;
  } catch (error) {
    console.error("Error decoding the token:", error);
    return null;
  }
}