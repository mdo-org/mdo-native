import React from "react";
import PropTypes from "prop-types";
import { TextInput } from "react-native-paper";

const blockTypeStringMap = new Map([
  ["COMPLETE_TASK", "- [X]"],
  ["INCOMPLETE_TASK", "- [ ]"],
  ["COMMENT", "#"],
  ["PADDING", ""]
]);

const Block = ({ block, onChangeText }) => {
  const typeAsString = blockTypeStringMap.get(block.type) || "";
  const text = block.text.replace("{{type}}", typeAsString);
  return (
    <TextInput value={text} multiline editable onChangeText={onChangeText} />
  );
};

Block.propTypes = {
  block: PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  onChangeText: PropTypes.func.isRequired
};

export default Block;
