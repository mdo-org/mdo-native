// NavigationHeader renders the header for both <FileNavigator/> and <File/>

import React from "react";
import PropTypes from "prop-types";
import { Appbar } from "react-native-paper";

export default function NavigationHeader({ isRoot, subtitle, onGoBack }) {
  return (
    <Appbar.Header>
      {isRoot ? null : <Appbar.BackAction onPress={onGoBack} />}
      <Appbar.Content title="MDo-Native" subtitle={subtitle} />
    </Appbar.Header>
  );
}

NavigationHeader.propTypes = {
  isRoot: PropTypes.bool.isRequired,
  subtitle: PropTypes.string.isRequired,
  onGoBack: PropTypes.func.isRequired
};
