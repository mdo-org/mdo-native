import React from "react";
import PropTypes from "prop-types";
import { Text, TouchableHighlight } from "react-native";
import { isDirectory } from "../../File";

export default function FileRow({ file, onFilePick }) {
  const name = isDirectory(file) ? `${file.name}/` : file.name;
  return (
    <TouchableHighlight onPress={() => onFilePick(file)}>
      <Text>{name}</Text>
    </TouchableHighlight>
  );
}

FileRow.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  onFilePick: PropTypes.func.isRequired
};
