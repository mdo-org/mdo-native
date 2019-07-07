import loading from "../loading";
import slice from "./slice";
import errors from "../errors";
import Dropbox from "../../Dropbox";

const fileSystem = slice.actions;

// useDropbox() triggers the dropbox login process
const useDropbox = () => async (dispatch, getState) => {
  const state = getState();

  if (loading.isLoading(state)) {
    console.log("App is loading. Ignored useDropbox() call.");
    return;
  }

  dispatch(loading.start());

  try {
    const accessToken = await Dropbox.login();
    dispatch(fileSystem.set({ type: "dropbox", accessToken }));
  } catch (err) {
    dispatch(errors.push({ error: err, description: "logging into Dropbox" }));
  } finally {
    dispatch(loading.stop());
  }
};

export default useDropbox;
