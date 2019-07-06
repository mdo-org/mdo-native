import { createSlice } from "redux-starter-kit";

const errors = createSlice({
  slice: "errors",
  initialState: [],
  reducers: {
    push: (state, { payload: { error } }) => state.errors.push(error),
    reset: () => []
  }
});

export default errors;
