import slice from "./slice";

export default {
  reducer: slice.reducer,

  // actions
  start: slice.actions.start,
  stop: slice.actions.stop,

  // selectors
  isLoading: state => !!state.isLoading
};
