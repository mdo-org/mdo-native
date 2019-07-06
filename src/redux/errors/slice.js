import { createSlice } from "redux-starter-kit";

export default createSlice({
  slice: "errors",
  initialState: [],
  reducers: {
    push: (state, { payload: { error } }) => state.errors.push(error),
    reset: () => []
  }
});
