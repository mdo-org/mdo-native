import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Text } from "react-native-paper";
import Header from "../redux/containers/Header";

export default class File extends React.Component {
  renderHeader() {
    const { path } = this.props;
    return <Header subtitle={path} />;
  }

  render() {
    return (
      <View>
        {this.renderHeader()}
        <Text>File</Text>
      </View>
    );
  }
}

File.propTypes = {
  path: PropTypes.string.isRequired
};
