import dropboxLoadDir from "./dropboxLoadDir";
import slice from "./slice";
import loading from "../loading";
import errors from "../errors";
import fileSystem from "../fileSystem";

const currentNode = slice.actions;

const refresh = () => async (dispatch, getState) => {
  const state = getState();

  if (loading.isLoading(state)) {
    console.warn("App is loading. Ignored refresh() call.");
    return;
  }

  dispatch(loading.start());

  try {
    const accessToken = fileSystem.getAccessToken(state);
    const { path } = state.currentNode;
    const contents = await dropboxLoadDir({ path, accessToken });
    dispatch(currentNode.setContents(contents));
  } catch (err) {
    dispatch(
      errors.push({ error: err, description: "loading directory from Dropbox" })
    );
  } finally {
    dispatch(loading.stop());
  }
};

export default refresh;
