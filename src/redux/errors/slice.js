import { createSlice } from "redux-starter-kit";
import stringifyError from "./stringifyError";

export default createSlice({
  slice: "errors",
  initialState: [],
  reducers: {
    push: (state, { payload: { error, description } }) => [
      ...state,
      stringifyError(error, description)
    ],
    reset: () => []
  }
});
