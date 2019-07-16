/* eslint no-param-reassign:[0] */

import { createSlice } from "redux-starter-kit";
import { BlockHelper } from "@mdo-org/mdo-core";
import fileSystem from "../fileSystem";

const { COMPLETE_TASK, INCOMPLETE_TASK } = BlockHelper.TYPES;

function getParentDir(path) {
  return path
    .split("/")
    .slice(0, -1)
    .join("/");
}

// when the toggleCheckbox action is executed, return the new type for the block
const nextType = currentType => {
  if (currentType === COMPLETE_TASK) return INCOMPLETE_TASK;
  if (currentType === INCOMPLETE_TASK) return COMPLETE_TASK;
  return currentType;
};

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
    toggleCheckbox: (state, { payload: { index } }) => {
      let pendingChanges = state.hasPendingChanges;
      return {
        ...state,
        contents: state.contents.map((oldText, idx) => {
          if (idx !== index) return oldText;
          const block = BlockHelper.fromString(oldText);
          block.type = nextType(block.type);
          const newText = BlockHelper.toString(block);
          pendingChanges = pendingChanges || oldText !== newText;
          return newText;
        }),
        hasPendingChanges: pendingChanges
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
