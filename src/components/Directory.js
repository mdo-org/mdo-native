import React from "react";
import PropTypes from "prop-types";
import { View, ScrollView, RefreshControl } from "react-native";
import { Paragraph } from "react-native-paper";
import Header from "../redux/containers/Header";
import DirectoryNode from "./DirectoryNode";

export default class Directory extends React.Component {
  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    this.load();
  }

  load() {
    const { isLoading, contents, onRefresh } = this.props;
    if (!contents && !isLoading) onRefresh();
  }

  renderHeader() {
    const { path } = this.props;
    return <Header subtitle={path} />;
  }

  renderContents() {
    const { contents, onOpenNode } = this.props;
    if (!contents) return null;
    if (!contents.length) {
      return (
        <Paragraph style={{ marginLeft: 5 }}>The directory is empty.</Paragraph>
      );
    }
    return contents.map(node => (
      <DirectoryNode
        key={node.path}
        node={node}
        onPress={() => onOpenNode(node)}
      />
    ));
  }

  render() {
    const { onRefresh } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        >
          {this.renderContents()}
        </ScrollView>
      </View>
    );
  }
}

Directory.defaultProps = {
  isLoading: false,
  contents: null
};

Directory.propTypes = {
  isLoading: PropTypes.bool,
  path: PropTypes.string.isRequired,
  contents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })
  ),
  onRefresh: PropTypes.func.isRequired,
  onOpenNode: PropTypes.func.isRequired
};
