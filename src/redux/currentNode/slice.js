/* eslint no-param-reassign:[0] */

import { createSlice } from "redux-starter-kit";
import fileSystem from "../fileSystem";

function getParentDir(path) {
  return path
    .split("/")
    .slice(0, -1)
    .join("/");
}

export default createSlice({
  slice: "currentNode",
  initialState: null,
  reducers: {
    set: (state, { payload }) => payload,
    setContents: (state, { payload }) => {
      return {
        ...state,
        contents: payload
      };
    },
    goBack: state => {
      if (!state || state.path === "") return state;
      return {
        path: getParentDir(state.path),
        type: "directory",
        contents: null
      };
    }
  },
  extraReducers: {
    // reset state when a new fileSystem is selected
    [fileSystem.set]: () => ({
      path: "",
      type: "directory",
      contents: null
    }),
    [fileSystem.reset]: () => null
  }
});
