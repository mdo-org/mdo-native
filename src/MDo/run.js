import MDoFlow from "@mdo-org/mdo-flow-live-in-the-moment/lib/strings";
import { DateTime } from "luxon";

const run = text => {
  const now = DateTime.local();
  const options = { time: now.toString(), timezone: now.zoneName };
  return MDoFlow(text, options);
};

export default run;
