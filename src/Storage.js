// Storage provides a way to store/retrieve specific data from AsyncStorage.

import { AsyncStorage } from "react-native";

const KEYS = {
  DROPBOX_TOKEN: "@mdo:dropboxToken"
};

async function getDropboxToken() {
  try {
    const val = await AsyncStorage.getItem(KEYS.DROPBOX_TOKEN);
    return val;
  } catch (err) {
    console.log("Failed getting dropboxToken from AsyncStorage.", err);
    return null;
  }
}

async function setDropboxToken(val) {
  try {
    AsyncStorage.setItem(KEYS.DROPBOX_TOKEN, val);
  } catch (err) {
    console.log("Failed saving dropboxToken in AsyncStorage.", err);
  }
}

async function deleteDropboxToken() {
  try {
    await AsyncStorage.removeItem(KEYS.DROPBOX_TOKEN);
  } catch (err) {
    console.log("Failed removing dropboxToken from AsyncStorage.", err);
  }
}

export { setDropboxToken, getDropboxToken, deleteDropboxToken };
