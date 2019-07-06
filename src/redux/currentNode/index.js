import slice from "./slice";

export default {
  reducer: slice.reducer,

  // selectors
  isFile: state => !!(state.currentNode && state.currentNode.type === "file")
};
