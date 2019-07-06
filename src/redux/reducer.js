import { combineReducers } from "redux";
import isLoading from "./isLoading";
import errors from "./errors";
import fileSystem from "./fileSystem";
import currentNode from "./currentNode";

const reducer = combineReducers({
  isLoading: isLoading.reducer,
  errors: errors.reducer,
  fileSystem: fileSystem.reducer,
  currentNode: currentNode.reducer
});

export default reducer;
