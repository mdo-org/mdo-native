import { createSlice } from "redux-starter-kit";
import fileSystem from "../fileSystem";

const currentNode = createSlice({
  slice: "currentNode",
  initialState: null,
  reducers: {},
  extraReducers: {
    // reset state when a new fileSystem is selected
    [fileSystem.actions.set]: () => ({
      path: "/",
      type: "directory",
      contents: null
    })
  }
});

export default currentNode;
