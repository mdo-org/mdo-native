import React from "react";
import PropTypes from "prop-types";
import { Text } from "react-native";

const blockTypeStringMap = new Map([
  ["COMPLETE_TASK", "- [X]"],
  ["INCOMPLETE_TASK", "- [ ]"],
  ["COMMENT", "#"],
  ["PADDING", ""]
]);

const Block = ({ block }) => {
  const typeAsString = blockTypeStringMap.get(block.type) || "";
  return (
    <Text>
      {typeAsString} {block.text}
    </Text>
  );
};

Block.propTypes = {
  block: PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired
};

export default Block;
