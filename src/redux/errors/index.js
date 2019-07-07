import slice from "./slice";

export default {
  reducer: slice.reducer,

  // actions
  push: slice.actions.push,
  reset: slice.actions.reset,

  // selectors
  all: state => state.errors.filter(Boolean)
};
