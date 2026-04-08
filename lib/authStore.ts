import * as SecureStore from 'expo-secure-store';

export const saveApiKey = async (key: string) => {
  try {
    await SecureStore.setItemAsync('flavortown_api_key', key);
    return true;
  } catch (error) {
    console.error("SecureStore Save Error:", error);
    return false;
  }
};

export const getApiKey = async () => {
  return await SecureStore.getItemAsync('flavortown_api_key');
};

export const deleteApiKey = async () => {
  await SecureStore.deleteItemAsync('flavortown_api_key');
};




export const saveUserID = async (key: string) => {
  try {
    await SecureStore.setItemAsync('flavortown_user_id', key);
    return true;
  } catch (error) {
    console.error("SecureStore Save Error:", error);
    return false;
  }
};

export const getUserID = async () => {
  return await SecureStore.getItemAsync('flavortown_user_id');
};

export const deleteUserID = async () => {
  await SecureStore.deleteItemAsync('flavortown_user_id');
};