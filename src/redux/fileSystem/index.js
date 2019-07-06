import { createSlice } from "redux-starter-kit";
import isLoadingSlice from "../isLoading";
import errorsSlice from "../errors";
import Dropbox from "./Dropbox";

const { actions: isLoadingActions } = isLoadingSlice;
const { actions: errorActions } = errorsSlice;

const fileSystem = createSlice({
  slice: "fileSystem",
  initialState: null,
  reducers: {
    set: (state, { payload: { type, accessToken } }) => {
      if (type !== "dropbox") {
        throw new Error(`Invalid fileSystem type: ${type}`);
      }
      if (!accessToken || !accessToken.length) {
        throw new Error("accessToken is required");
      }
      return { type, accessToken };
    }
  }
});

// useDropbox() triggers the dropbox login process
fileSystem.actions.useDropbox = () => async (dispatch, getState) => {
  const { isLoading } = getState();

  if (isLoading) {
    console.warn("App is loading. Ignored useDropbox() call.");
    return;
  }

  dispatch(isLoadingActions.start());

  try {
    const accessToken = await Dropbox.login();
    dispatch(fileSystem.actions.set({ type: "dropbox", accessToken }));
  } catch (err) {
    dispatch(errorActions.push(err));
  } finally {
    dispatch(isLoadingActions.stop());
  }
};

export default fileSystem;
