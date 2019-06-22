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
        const { rev, fileBlob } = response;
        const reader = new global.FileReader();
        reader.addEventListener("loadend", () => {
          resolve({ rev, text: reader.result });
        });
        reader.readAsText(fileBlob, "UTF-8");
      })
      .catch(err => reject(err));
  });

const writeDropboxFile = (dropbox, path, str, rev) =>
  dropbox.filesUpload({
    path,
    // converting to ISO-8859-1 to get around dropbox issue
    // https://github.com/dropbox/dropbox-sdk-js/issues/179
    contents: encoding.convert(`${str}`, "ISO-8859-1"),
    mode: { ".tag": "update", update: rev },
    autorename: true // on conflict, Dropbox will autorename the file
  });

const formatDropboxError = (err, action) => {
  if (err.message) return err;
  if (typeof err.error === "string") return new Error(err.error);
  if (typeof err.error_summary === "string")
    return new Error(err.error_summary);
  return new Error(`Unkown error while ${action}`);
};

const runMDo = text => {
  const now = DateTime.local();
  const options = { time: now.toString(), timezone: now.zoneName };
  return MDo(text, options);
};

export default class File extends React.Component {
  constructor(props) {
    super(props);
    const { path } = props;
    this.state = {
      loading: false,
      error: null,
      text: "",
      path, // path might change if there is a conflict, so I'm copying to state
      rev: null // provided by dropbox to identify current version of the file
    };
  }

  componentDidMount() {
    this.loadFile();
  }

  onRunMDo() {
    const { dropbox } = this.props;
    const { loading, text, rev, path } = this.state;

    if (loading) return null;
    this.setState({ loading: true, error: null });

    return runMDo(text)
      .then(updatedText => {
        return writeDropboxFile(dropbox, path, updatedText, rev).then(
          metaData => {
            const newRev = metaData.rev || rev;
            const newPath = metaData.path_lower || path;
            this.setState({
              loading: false,
              text: updatedText,
              rev: newRev,
              path: newPath
            });
          }
        );
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: formatDropboxError(err, "updating file")
        });
      });
  }

  loadFile() {
    const { loading, path } = this.state;
    const { dropbox } = this.props;

    if (loading) return;
    this.setState({ loading: true, error: null });

    readDropboxFile(dropbox, path)
      .then(({ text, rev }) =>
        this.setState({ loading: false, error: null, text, rev })
      )
      .catch(err => {
        this.setState({
          loading: false,
          error: formatDropboxError(err, "loading file")
        });
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
    const { onGoBack, onLogout } = this.props;
    const { path, text } = this.state;
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
