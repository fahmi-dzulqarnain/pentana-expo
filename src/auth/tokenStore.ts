// The Sanctum token lives in the Keychain / Android Keystore via expo-secure-store, never in AsyncStorage.
import * as SecureStore from 'expo-secure-store';

const KEY = 'pentana.token';

export const tokenStore = {
  read: () => SecureStore.getItemAsync(KEY),
  write: (token: string) => SecureStore.setItemAsync(KEY, token),
  clear: () => SecureStore.deleteItemAsync(KEY),
};
