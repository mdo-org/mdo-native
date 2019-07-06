import { combineReducers } from "redux";
import loading from "./loading";
import errors from "./errors";
import fileSystem from "./fileSystem";
import currentNode from "./currentNode";

const reducer = combineReducers({
  isLoading: loading.reducer,
  errors: errors.reducer,
  fileSystem: fileSystem.reducer,
  currentNode: currentNode.reducer
});

export default reducer;
