import slice from "./slice";
import fileSystem from "../fileSystem";
import loading from "../loading";
import errors from "../errors";
import Dropbox from "../../Dropbox";
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
    const metaData = await Dropbox.writeFile({ accessToken, path, text, rev });
    dispatch(
      currentNode.update({
        rev: metaData.rev,
        path: metaData.path,
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
