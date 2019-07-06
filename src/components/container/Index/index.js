import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Text } from "react-native-paper";
import DropboxLoginButton from "../DropboxLoginButton";

function Index({ hasFileSystem }) {
  if (hasFileSystem) {
    return <Text>Hello MDo</Text>;
  }
  return <DropboxLoginButton />;
}

Index.propTypes = {
  hasFileSystem: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    hasFileSystem: !!state.fileSystem
  };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
