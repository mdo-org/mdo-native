import dropboxWriteFile from "./dropboxWriteFile";
import slice from "./slice";
import fileSystem from "../fileSystem";
import loading from "../loading";
import errors from "../errors";
import { getPath, getContents, getRev, hasPendingChanges } from "./selectors";

const currentNode = slice.actions;

const save = () => async (dispatch, getState) => {
  const state = getState();

  if (loading.isLoading(state)) {
    console.log("App is loading. save() call ignored.");
    return;
  }

  if (!hasPendingChanges(state)) {
    console.log("No pending changes. save() call ignored.");
    return;
  }

  dispatch(loading.start());

  const accessToken = fileSystem.getAccessToken(state);
  const path = getPath(state);
  const text = getContents(state).join("\n");
  const rev = getRev(state);

  try {
    const metaData = await dropboxWriteFile({ accessToken, path, text, rev });
    dispatch(
      currentNode.update({
        rev: metaData.rev || rev,
        path: metaData.path_lower || path,
        hasPendingChanges: false
      })
    );
  } catch (err) {
    dispatch(
      errors.push({ error: err, description: "saving data to Dropbox" })
    );
  } finally {
    dispatch(loading.stop());
  }
};

export default save;
