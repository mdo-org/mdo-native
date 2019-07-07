import dropboxLoadDir from "./dropboxLoadDir";
import dropboxLoadFile from "./dropboxLoadFile";
import slice from "./slice";
import loading from "../loading";
import errors from "../errors";
import fileSystem from "../fileSystem";
import { isDir, isFile, getType, getPath } from "./selectors";

const currentNode = slice.actions;

const getLoadFunction = state => {
  if (isDir(state)) return dropboxLoadDir;
  if (isFile(state)) return dropboxLoadFile;
  return null;
};

const refresh = () => async (dispatch, getState) => {
  const state = getState();

  if (loading.isLoading(state)) {
    console.log("App is loading. refresh() call ignored.");
    return;
  }

  const load = getLoadFunction(state);
  if (!load) {
    console.log(`Cannot load file with type: ${getType(state)}`);
    return;
  }

  dispatch(loading.start());

  try {
    const accessToken = fileSystem.getAccessToken(state);
    const path = getPath(state);
    const result = await load({ path, accessToken });
    dispatch(currentNode.update(result));
  } catch (err) {
    dispatch(
      errors.push({ error: err, description: "loading data from Dropbox" })
    );
  } finally {
    dispatch(loading.stop());
  }
};

export default refresh;
