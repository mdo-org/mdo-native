import slice from "./slice";

export default {
  reducer: slice.reducer,

  // actions
  push: slice.actions.push,
  reset: slice.actions.reset,

  // selectors
  allMessages: state => state.errors.map(err => err.message).filter(Boolean)
};
