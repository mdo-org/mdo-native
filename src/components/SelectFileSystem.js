import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Button } from "react-native-paper";
import Header from "./Header";

export default function SelectFileSystem({ onDropboxLogin }) {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Button onPress={onDropboxLogin} style={{ marginTop: 20 }}>
        Login with Dropbox
      </Button>
    </View>
  );
}

SelectFileSystem.propTypes = {
  onDropboxLogin: PropTypes.func.isRequired
};
