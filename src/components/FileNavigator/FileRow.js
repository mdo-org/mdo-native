import React from "react";
import PropTypes from "prop-types";
import { Text, View } from "react-native";

export default function FileRow({ file }) {
  return (
    <View>
      <Text>{file.name}.</Text>
    </View>
  );
}

FileRow.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};
