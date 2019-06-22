// File renders a single MDo file

import encoding from "encoding";
import React from "react";
import PropTypes from "prop-types";
import { View, ScrollView } from "react-native";
import { Text, TextInput } from "react-native-paper";
import MDo from "@mdo-org/mdo-flow-live-in-the-moment/lib/strings";
import { DateTime } from "luxon";
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

const writeDropboxFile = (dropbox, path, str) =>
  dropbox.filesUpload({
    path,
    // converting to ISO-8859-1 to get around dropbox issue
    // https://github.com/dropbox/dropbox-sdk-js/issues/179
    contents: encoding.convert(`${str}`, "ISO-8859-1"),
    mode: "overwrite"
  });

const runMDo = text => {
  const now = DateTime.local();
  const options = { time: now.toString(), timezone: now.zoneName };
  return MDo(text, options);
};

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

  onRunMDo() {
    const { dropbox, path } = this.props;
    const { loading, text } = this.state;

    if (loading) return null;
    this.setState({ loading: true, error: null });

    return runMDo(text)
      .then(updatedText => {
        return writeDropboxFile(dropbox, path, updatedText).then(() => {
          this.setState({ loading: false, text: updatedText });
        });
      })
      .catch(err => {
        const error =
          typeof err.error === "string" ? new Error(err.error) : err;
        this.setState({ loading: false, error });
      });
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
    const { text } = this.state;
    const runMDoCB = text && text.length ? () => this.onRunMDo(this) : null;
    return (
      <Header
        subtitle={path}
        onGoBack={onGoBack}
        onLogout={onLogout}
        onRunMDo={runMDoCB}
      />
    );
  }

  renderContent() {
    const { text, loading } = this.state;
    return (
      <ScrollView>
        <TextInput
          value={text}
          multiline
          editable={!loading}
          onChangeText={newText => this.setState({ text: newText })}
        />
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
