import slice from "./slice";
import useDropbox from "./useDropbox";
import isMounted from "./isMounted";

export default {
  reducer: slice.reducer,

  // actions
  set: slice.actions.set,
  useDropbox,

  // selectors
  isMounted
};
