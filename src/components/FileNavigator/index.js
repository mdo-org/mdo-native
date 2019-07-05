// FileNavigator lists all Dropbox files for a given path.
// The following info is presented for each file:
// - filename
// - last modified date

import React from "react";
import PropTypes from "prop-types";
import {
  Portal,
  Dialog,
  Paragraph,
  Button,
  ActivityIndicator
} from "react-native-paper";
import { View, ScrollView, RefreshControl } from "react-native";
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
    this.load();
  }

  componentDidUpdate(prevProps) {
    const { path } = this.props;
    if (prevProps.path !== path) {
      this.load();
    }
  }

  load() {
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

  resetError() {
    this.setState({ error: null });
  }

  renderError() {
    const { error } = this.state;
    const visible = !!(error && error.message && error.message.length);
    const text = visible ? error.message : "";
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={() => this.resetError()}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{text}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => this.resetError()}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  renderLoading() {
    const { loading } = this.state;
    if (!loading) return null;
    return <ActivityIndicator animating style={{ marginTop: 20 }} />;
  }

  renderContent() {
    const { loading, error, files } = this.state;
    const { onFilePick } = this.props;
    if (loading || error) return null;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => this.load()} />
        }
      >
        {files.map(file => (
          <FileRow key={file.name} file={file} onFilePick={onFilePick} />
        ))}
      </ScrollView>
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
        {this.renderError()}
        {this.renderLoading()}
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
