import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "react-native-paper";
import fileSystem from "../../../redux/fileSystem";

function DropboxLoginButton({ onPress }) {
  return <Button onPress={onPress}>Login with Dropbox</Button>;
}

DropboxLoginButton.propTypes = {
  onPress: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
  return {
    onPress: () => dispatch(fileSystem.actions.useDropbox())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropboxLoginButton);
