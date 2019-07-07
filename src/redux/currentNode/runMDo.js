import MDoFlow from "@mdo-org/mdo-flow-live-in-the-moment/lib/strings";
import { DateTime } from "luxon";
import slice from "./slice";
import loading from "../loading";
import errors from "../errors";
import parseTextToBlocks from "./parseTextToBlocks";
import { getContents } from "./selectors";

const currentNode = slice.actions;

const runMDoFlow = text => {
  const now = DateTime.local();
  const options = { time: now.toString(), timezone: now.zoneName };
  return MDoFlow(text, options);
};

const runMDo = () => async (dispatch, getState) => {
  const state = getState();

  if (loading.isLoading(state)) {
    console.log("App is loading. runMDo() call ignored.");
    return;
  }

  dispatch(loading.start());

  const text = getContents(state).join("\n");

  try {
    const updatedText = await runMDoFlow(text);
    const contents = await parseTextToBlocks(updatedText);
    dispatch(currentNode.update({ contents }));
  } catch (err) {
    dispatch(
      errors.push({ error: err, description: "running MDo on the file" })
    );
  } finally {
    dispatch(loading.stop());
  }
};

export default runMDo;
