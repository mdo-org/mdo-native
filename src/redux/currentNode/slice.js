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
    update: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    goBack: state => {
      if (!state || state.path === "") return state;
      return {
        path: getParentDir(state.path),
        type: "directory",
        contents: null
      };
    },
    updateBlockText: (state, { payload: { index, text } }) => ({
      ...state,
      contents: state.contents.map((oldText, idx) =>
        idx === index ? text : oldText
      ),
      hasPendingChanges: true
    }),
    moveBlockUp: (state, { payload: { index } }) => {
      const { contents } = state;
      return {
        ...state,
        contents: [
          ...contents.slice(0, index - 1),
          contents[index],
          contents[index - 1],
          ...contents.slice(index + 1)
        ].filter(Boolean),
        hasPendingChanges: true
      };
    },
    moveBlockDown: (state, { payload: { index } }) => {
      const { contents } = state;
      return {
        ...state,
        contents: [
          ...contents.slice(0, index),
          contents[index + 1],
          contents[index],
          ...contents.slice(index + 2)
        ].filter(Boolean),
        hasPendingChanges: true
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
