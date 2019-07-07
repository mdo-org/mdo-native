import slice from "./slice";
import loading from "../loading";
import errors from "../errors";
import { getContents } from "./selectors";
import MDo from "../../MDo";

const currentNode = slice.actions;

const runMDo = () => async (dispatch, getState) => {
  const state = getState();

  if (loading.isLoading(state)) {
    console.log("App is loading. runMDo() call ignored.");
    return;
  }

  dispatch(loading.start());

  const text = getContents(state).join("\n");

  try {
    const updatedText = await MDo.run(text);
    if (text !== updatedText) {
      const contents = await MDo.parse(updatedText);
      dispatch(currentNode.update({ contents, hasPendingChanges: true }));
    }
  } catch (err) {
    dispatch(
      errors.push({ error: err, description: "running MDo on the file" })
    );
  } finally {
    dispatch(loading.stop());
  }
};

export default runMDo;
