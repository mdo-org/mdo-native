import React from "react";
import PropTypes from "prop-types";
import { List } from "react-native-paper";

const isFile = node => node.type === "file";
const isDir = node => node.type === "directory";

const getIcon = node => {
  if (isFile(node)) return "insert-drive-file";
  if (isDir(node)) return "folder";
  return "report-problem";
};

const getName = node => {
  return isDir(node) ? `${node.name}/` : node.name;
};

export default function DirectoryNode({ node, onPress }) {
  return (
    <List.Item
      title={getName(node)}
      onPress={onPress}
      left={() => <List.Icon icon={getIcon(node)} />}
    />
  );
}

DirectoryNode.propTypes = {
  node: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  }).isRequired,
  onPress: PropTypes.func.isRequired
};
