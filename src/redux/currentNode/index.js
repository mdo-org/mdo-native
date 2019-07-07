import slice from "./slice";
import refresh from "./refresh";
import save from "./save";
import {
  isFile,
  isDir,
  isRoot,
  hasPendingChanges,
  getPath,
  getType,
  getContents,
  getRev
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
  save,

  // selectors
  isFile,
  isDir,
  isRoot,
  hasPendingChanges,
  getPath,
  getType,
  getContents,
  getRev
};
