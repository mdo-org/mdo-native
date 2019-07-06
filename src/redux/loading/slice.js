import { createSlice } from "redux-starter-kit";

export default createSlice({
  slice: "isLoading",
  initialState: false,
  reducers: {
    start: () => true,
    stop: () => false
  }
});
