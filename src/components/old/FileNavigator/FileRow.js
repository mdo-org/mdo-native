import React from "react";
import PropTypes from "prop-types";
import { List } from "react-native-paper";
import { isDirectory } from "../../File";

export default function FileRow({ file, onFilePick }) {
  const isDir = isDirectory(file);
  const name = isDir ? `${file.name}/` : file.name;
  const icon = isDir ? "folder" : "insert-drive-file";
  return (
    <List.Item
      title={name}
      onPress={() => onFilePick(file)}
      left={() => <List.Icon icon={icon} />}
    />
  );
}

FileRow.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  onFilePick: PropTypes.func.isRequired
};
