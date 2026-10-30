// Set EXPO_PUBLIC_API_URL in .env (see .env.example). On a device, use your machine's LAN IP, not localhost.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
