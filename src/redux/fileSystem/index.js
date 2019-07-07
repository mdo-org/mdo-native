import slice from "./slice";
import useDropbox from "./useDropbox";

export default {
  reducer: slice.reducer,

  // actions
  set: slice.actions.set,
  reset: slice.actions.reset,
  useDropbox,

  // selectors
  isMounted: state => !!state.fileSystem,
  getAccessToken: state => state.fileSystem.accessToken
};
