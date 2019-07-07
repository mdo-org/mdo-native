import slice from "./slice";
import refresh from "./refresh";
import {
  isFile,
  isDir,
  isRoot,
  getPath,
  getType,
  getContents
} from "./selectors";

export default {
  reducer: slice.reducer,

  // actions
  set: slice.actions.set,
  update: slice.actions.update,
  goBack: slice.actions.goBack,
  refresh,

  // file-specific actions
  updateBlockText: slice.actions.updateBlockText,
  moveBlockUp: slice.actions.moveBlockUp,
  moveBlockDown: slice.actions.moveBlockDown,

  // selectors
  isFile,
  isDir,
  isRoot,
  getPath,
  getType,
  getContents
};
