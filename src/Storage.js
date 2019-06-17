// Storage provides a way to store/retrieve specific data from AsyncStorage.

import { AsyncStorage } from "react-native";

const KEYS = {
  DROPBOX_TOKEN: "@mdo:dropboxToken",
  DIRPATH: "@mdo:dirpath",
  FILEPATH: "@mdo:filepath"
};

async function getItem(key) {
  try {
    const val = await AsyncStorage.getItem(key);
    return val;
  } catch (err) {
    console.log(`Failed getting ${key} from AsyncStorage.`, err);
    return null;
  }
}

async function setItem(key, val) {
  try {
    AsyncStorage.setItem(key, val);
  } catch (err) {
    console.log(`Failed saving ${key} in AsyncStorage.`, err);
  }
}

async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log(`Failed removing ${key} from AsyncStorage.`, err);
  }
}

export function getDropboxToken() {
  return getItem(KEYS.DROPBOX_TOKEN);
}

export function setDropboxToken(val) {
  return setItem(KEYS.DROPBOX_TOKEN, val);
}

export function deleteDropboxToken() {
  return removeItem(KEYS.DROPBOX_TOKEN);
}

export function setPaths({ dirpath, filepath }) {
  return Promise.all([
    setItem(KEYS.DIRPATH, dirpath),
    setItem(KEYS.FILEPATH, filepath)
  ]);
}

export async function getPaths() {
  const dirpath = (await getItem(KEYS.DIRPATH)) || "";
  const filepath = (await getItem(KEYS.FILEPATH)) || "";
  return { dirpath, filepath };
}
