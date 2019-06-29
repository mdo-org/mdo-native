// File renders a single MDo file

import { Buffer } from "buffer";
import React from "react";
import PropTypes from "prop-types";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import MDoFlow from "@mdo-org/mdo-flow-live-in-the-moment/lib/strings";
import { parse, stringify } from "@mdo-org/mdo-core/lib/strings";
import { DateTime } from "luxon";
import Header from "../Header";
import Block from "../Block";

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
    // converting to Buffer to get around dropbox issue
    // https://github.com/dropbox/dropbox-sdk-js/issues/179
    contents: Buffer.from(str),
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

const runMDoFlow = text => {
  const now = DateTime.local();
  const options = { time: now.toString(), timezone: now.zoneName };
  return MDoFlow(text, options);
};

export default class File extends React.Component {
  constructor(props) {
    super(props);
    const { path } = props;
    this.state = {
      loading: false,
      error: null,
      blocks: [], // MDo blocks parsed from the file's content
      path, // path might change if there is a conflict, so I'm copying to state
      rev: null // provided by dropbox to identify current version of the file
    };
  }

  componentDidMount() {
    this.loadFile();
  }

  async onRunMDo() {
    const { dropbox } = this.props;
    const { loading, blocks, rev, path } = this.state;

    if (loading) return null;
    this.setState({ loading: true, error: null });

    try {
      const text = await stringify(blocks);
      const updatedText = await runMDoFlow(text);
      const metaData = await writeDropboxFile(dropbox, path, updatedText, rev);
      const newRev = metaData.rev || rev;
      const newPath = metaData.path_lower || path;
      const newBlocks = await parse(updatedText);
      return this.setState({
        loading: false,
        blocks: newBlocks,
        rev: newRev,
        path: newPath
      });
    } catch (err) {
      return this.setState({
        loading: false,
        error: formatDropboxError(err, "updating file")
      });
    }
  }

  async loadFile() {
    const { loading, path } = this.state;
    const { dropbox } = this.props;

    if (loading) return;
    this.setState({ loading: true, error: null });

    try {
      const { text, rev } = await readDropboxFile(dropbox, path);
      const blocks = await parse(text);
      this.setState({ loading: false, error: null, blocks, rev });
    } catch (err) {
      this.setState({
        loading: false,
        error: formatDropboxError(err, "loading file")
      });
    }
  }

  updateBlockText(blockToUpdate, newText) {
    const { blocks } = this.state;
    this.setState({
      blocks: blocks.map(block => {
        if (block !== blockToUpdate) return block;
        return { ...blockToUpdate, text: newText };
      })
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
    const { path, blocks } = this.state;
    const runMDoCB = blocks && blocks.length ? () => this.onRunMDo() : null;
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
    const { blocks } = this.state;
    return (
      <ScrollView>
        {blocks
          .filter(({ type }) => type !== "PADDING")
          .map(block => (
            <Block
              block={block}
              onChangeText={newText => {
                this.updateBlockText(block, newText);
              }}
            />
          ))}
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
