import React from "react";
import PropTypes from "prop-types";
import { Text } from "react-native";

const Block = ({ block }) => <Text>- [ ] {block.text}</Text>;

Block.propTypes = {
  block: PropTypes.shape({
    text: PropTypes.string
  }).isRequired
};

export default Block;
