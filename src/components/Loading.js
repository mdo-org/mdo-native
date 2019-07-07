import React from "react";
import PropTypes from "prop-types";
import { ActivityIndicator } from "react-native-paper";

export default function Loading({ isLoading }) {
  if (!isLoading) return null;
  return <ActivityIndicator animating style={{ marginTop: 110 }} />;
}

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired
};
