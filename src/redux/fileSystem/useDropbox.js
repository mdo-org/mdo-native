import dropboxLogin from "./dropboxLogin";
import loading from "../loading";
import slice from "./slice";
import errors from "../errors";

const fileSystem = slice.actions;

// useDropbox() triggers the dropbox login process
const useDropbox = () => async (dispatch, getState) => {
  const state = getState();

  if (loading.isLoading(state)) {
    console.warn("App is loading. Ignored useDropbox() call.");
    return;
  }

  dispatch(loading.start());

  try {
    const accessToken = await dropboxLogin();
    dispatch(fileSystem.set({ type: "dropbox", accessToken }));
  } catch (err) {
    dispatch(errors.push({ error: err, description: "logging in to Dropbox" }));
  } finally {
    dispatch(loading.stop());
  }
};

export default useDropbox;
