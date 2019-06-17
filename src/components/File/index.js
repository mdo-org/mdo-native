// File renders a single MDo file

import React from "react";
import PropTypes from "prop-types";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import Header from "../Header";

const readDropboxFile = (dropbox, path) =>
  new Promise((resolve, reject) => {
    dropbox
      .filesDownload({ path })
      .then(response => {
        const reader = new global.FileReader();
        reader.addEventListener("loadend", () => {
          resolve(reader.result);
        });
        reader.readAsText(response.fileBlob, "UTF-8");
      })
      .catch(err => reject(err));
  });

export default class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      text: ""
    };
  }

  componentDidMount() {
    this.loadFile();
  }

  loadFile() {
    const { loading } = this.state;
    const { dropbox, path } = this.props;

    if (loading) return;
    this.setState({ loading: true, error: null });

    readDropboxFile(dropbox, path)
      .then(text => this.setState({ loading: false, error: null, text }))
      .catch(err => {
        this.setState({ loading: false, error: err });
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

  renderHeader() {
    const { path, onGoBack, onLogout } = this.props;
    const subtitle = path;
    return (
      <Header
        isRoot={false}
        subtitle={subtitle}
        onGoBack={onGoBack}
        onLogout={onLogout}
      />
    );
  }

  renderContent() {
    const { text } = this.state;
    return (
      <ScrollView>
        <Text>{text}</Text>
      </ScrollView>
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

File.propTypes = {
  dropbox: PropTypes.shape({
    filesListFolder: PropTypes.func.isRequired
  }).isRequired,
  path: PropTypes.string.isRequired,
  onGoBack: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};
