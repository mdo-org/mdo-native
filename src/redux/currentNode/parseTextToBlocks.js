import MDo from "@mdo-org/mdo-core/lib/strings";
import { BlockHelper } from "@mdo-org/mdo-core";

// I'm getting rid of PADDING blocks and converting each block to a string, to
// make manipulation easier.
// In a future implementation, I might pass the whole Block object instead, to
// implement things like tag highlighting/editing, etc.
const parseTextToBlocks = async text => {
  const blocks = await MDo.parse(text);
  return blocks
    .filter(({ type }) => type !== "PADDING")
    .map(BlockHelper.toString);
};

export default parseTextToBlocks;
