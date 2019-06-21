// FileNavigator lists all Dropbox files for a given path.
// The following info is presented for each file:
// - filename
// - last modified date

import React from "react";
import PropTypes from "prop-types";
import { Text } from "react-native-paper";
import { View } from "react-native";
import FileRow from "./FileRow";
import Header from "../Header";

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

  componentDidUpdate(prevProps) {
    const { path } = this.props;
    if (prevProps.path !== path) {
      this.loadDir();
    }
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
    const { onFilePick } = this.props;
    if (loading || error) return null;
    return (
      <View>
        {files.map(file => (
          <FileRow key={file.name} file={file} onFilePick={onFilePick} />
        ))}
      </View>
    );
  }

  renderHeader() {
    const { path, onGoBack, onLogout } = this.props;
    const isRoot = path === "" || path === "/";
    return (
      <Header
        subtitle={isRoot ? "" : path}
        onGoBack={isRoot ? null : onGoBack}
        onLogout={onLogout}
      />
    );
  }

  render() {
    return (
      <View>
        {this.renderHeader()}
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
  onFilePick: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};
