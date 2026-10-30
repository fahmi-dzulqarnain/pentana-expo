// expo-secure-store has no web implementation. On web the token goes in localStorage,
// which is fine for local development but readable by any script on the page.
const KEY = 'pentana.token';

export const tokenStore = {
  read: async () => localStorage.getItem(KEY),
  write: async (token: string) => localStorage.setItem(KEY, token),
  clear: async () => localStorage.removeItem(KEY),
};
