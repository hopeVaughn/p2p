import jwtDecode from 'jwt-decode';
import { DecodedToken } from '../types';


export function accessTokenExpired(): boolean {
  const token = localStorage.getItem('accessToken');

  if (!token) return true;  // If there's no token, assume it's expired

  // Decode the token and check its expiry
  const decodedToken: DecodedToken = jwtDecode(token);
  const now = Date.now().valueOf() / 1000;
  return typeof decodedToken.exp !== "undefined" && decodedToken.exp < now;
}

export function refreshTokenExpired(): boolean {
  const refreshExpiry = localStorage.getItem('refreshExpiry');

  if (!refreshExpiry) return true;  // If there's no expiry date, assume it's expired

  const now = new Date();
  return new Date(refreshExpiry) < now;
}
