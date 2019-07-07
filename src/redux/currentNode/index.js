import slice from "./slice";
import refresh from "./refresh";

export default {
  reducer: slice.reducer,

  // actions
  set: slice.actions.set,
  goBack: slice.actions.goBack,
  refresh,

  // selectors
  isFile: state => !!(state.currentNode && state.currentNode.type === "file"),
  isRoot: state => !!(state.currentNode && state.currentNode.path === ""),
  path: state => {
    if (!state.currentNode) return null;
    return state.currentNode.path;
  },
  contents: state => {
    if (!state.currentNode) return null;
    return state.currentNode.contents;
  }
};
