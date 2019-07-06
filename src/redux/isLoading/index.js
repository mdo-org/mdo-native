import { createSlice } from "redux-starter-kit";

const isLoading = createSlice({
  slice: "isLoading",
  initialState: false,
  reducers: {
    start: () => true,
    stop: () => false
  }
});

export default isLoading;
