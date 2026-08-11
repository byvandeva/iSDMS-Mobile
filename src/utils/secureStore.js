import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'sdms_auth_token_mobile';
const USER_KEY = 'sdms_auth_user_mobile';

let memoryStorage = {};

export async function setSecureToken(token) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (e) {
    memoryStorage[TOKEN_KEY] = token;
  }
}

export async function getSecureToken() {
  try {
    const val = await SecureStore.getItemAsync(TOKEN_KEY);
    return val || memoryStorage[TOKEN_KEY] || null;
  } catch (e) {
    return memoryStorage[TOKEN_KEY] || null;
  }
}

export async function setSecureUser(user) {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch (e) {
    memoryStorage[USER_KEY] = JSON.stringify(user);
  }
}

export async function getSecureUser() {
  try {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    const str = raw || memoryStorage[USER_KEY];
    return str ? JSON.parse(str) : null;
  } catch (e) {
    return null;
  }
}

export async function clearSecureAuth() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (e) {}
  memoryStorage = {};
}
