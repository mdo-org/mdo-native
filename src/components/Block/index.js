import React from "react";
import PropTypes from "prop-types";
import { Text, TextInput, TouchableRipple } from "react-native-paper";

const blockTypeStringMap = new Map([
  ["COMPLETE_TASK", "- [X]"],
  ["INCOMPLETE_TASK", "- [ ]"],
  ["COMMENT", "#"],
  ["PADDING", ""]
]);

const replaceType = block => {
  const { text, type } = block;
  return {
    ...block,
    text: text.replace("{{type}}", blockTypeStringMap.get(type) || "")
  };
};

export default class Block extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false
    };
  }

  renderCollapsed() {
    const { block } = this.props;
    const lines = replaceType(block).text.split("\n");
    const text = `${lines[0]} ${lines.length > 1 ? "..." : ""}`;
    return (
      <TouchableRipple onPress={() => this.setState({ isExpanded: true })}>
        <Text>{text}</Text>
      </TouchableRipple>
    );
  }

  renderExpanded() {
    const { block, onChangeText } = this.props;
    const { text } = replaceType(block);
    return (
      <TextInput value={text} multiline editable onChangeText={onChangeText} />
    );
  }

  render() {
    const { isExpanded } = this.state;
    return isExpanded ? this.renderExpanded() : this.renderCollapsed();
  }
}

Block.propTypes = {
  block: PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  onChangeText: PropTypes.func.isRequired
};
