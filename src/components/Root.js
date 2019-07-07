import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Portal } from "react-native-paper";

import Errors from "../redux/containers/Errors";
import Loading from "../redux/containers/Loading";
import SelectFileSystem from "../redux/containers/SelectFileSystem";
import File from "../redux/containers/File";
import Directory from "../redux/containers/Directory";

export default class Root extends React.Component {
  renderContent() {
    const { isFileSystemSelected, isCurrentNodeAFile } = this.props;
    if (!isFileSystemSelected) {
      return <SelectFileSystem />;
    }
    return isCurrentNodeAFile ? <File /> : <Directory />;
  }

  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <Portal>
          <Errors />
          <Loading />
        </Portal>
        {this.renderContent()}
      </View>
    );
  }
}

Root.propTypes = {
  isFileSystemSelected: PropTypes.bool.isRequired,
  isCurrentNodeAFile: PropTypes.bool.isRequired
};
