// FileNavigator lists all Dropbox files for a given path.
// The following info is presented for each file:
// - filename
// - last modified date

import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import FileRow from "./FileRow";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row"
  }
});

export default class FileNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      files: []
    };
  }

  componentDidMount() {
    this.loadDir();
  }

  loadDir() {
    const { loading } = this.state;
    const { dropbox, path } = this.props;

    if (loading) return;
    this.setState({ loading: true, error: null, files: [] });
    dropbox
      .filesListFolder({ path })
      .then(({ entries }) =>
        this.setState({ loading: false, error: null, files: entries })
      )
      .catch(() => {
        const errMsg = `Error trying to load dropbox dir: ${path}`;
        this.setState({ loading: false, error: new Error(errMsg), files: [] });
      });
  }

  renderLoading() {
    const { loading } = this.state;
    if (!loading) return null;
    return <Text>Loading...</Text>;
  }

  renderError() {
    const { error } = this.state;
    if (!error) return null;
    return <Text>{error.message}</Text>;
  }

  renderContent() {
    const { loading, error, files } = this.state;
    if (loading || error) return null;
    return (
      <View>
        {files.map(file => (
          <FileRow key={file.name} file={file} />
        ))}
      </View>
    );
  }

  render() {
    const { onLogout } = this.props;
    return (
      <View>
        <View style={styles.header}>
          <Text>Dropbox | </Text>
          <TouchableHighlight onPress={onLogout} underlayColor="red">
            <Text>Logout</Text>
          </TouchableHighlight>
        </View>
        {this.renderLoading()}
        {this.renderError()}
        {this.renderContent()}
      </View>
    );
  }
}

FileNavigator.propTypes = {
  dropbox: PropTypes.shape({
    filesListFolder: PropTypes.func.isRequired
  }).isRequired,
  path: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired
};
