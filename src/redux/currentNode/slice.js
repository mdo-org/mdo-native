import { createSlice } from "redux-starter-kit";
import fileSystem from "../fileSystem";

export default createSlice({
  slice: "currentNode",
  initialState: null,
  reducers: {},
  extraReducers: {
    // reset state when a new fileSystem is selected
    [fileSystem.set]: () => ({
      path: "/",
      type: "directory",
      contents: null
    })
  }
});
