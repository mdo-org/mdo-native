// File renders a single MDo file

import { Buffer } from "buffer";
import React from "react";
import PropTypes from "prop-types";
import { View, FlatList } from "react-native";
import {
  ActivityIndicator,
  Dialog,
  Portal,
  Paragraph,
  Button
} from "react-native-paper";
import MDoFlow from "@mdo-org/mdo-flow-live-in-the-moment/lib/strings";
import MDo from "@mdo-org/mdo-core/lib/strings";
import { BlockHelper } from "@mdo-org/mdo-core";
import { DateTime } from "luxon";
import Header from "../Header";
import Block from "../Block";

// I'm getting rid of PADDING blocks and converting each block to a string, to
// make manipulation easier.
// In a future implementation, I might pass the whole Block object instead, to
// implement things like tag highlighting/editing, etc.
const parse = async text => {
  const blocks = await MDo.parse(text);
  return blocks
    .filter(({ type }) => type !== "PADDING")
    .map(BlockHelper.toString);
};

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
      activeIndex: null, // MDo block that is currently active/expanded
      activeIsEditing: false, // Is the active block in edit mode?
      path, // path might change if there is a conflict, so I'm copying to state
      rev: null // provided by dropbox to identify current version of the file
    };
  }

  componentDidMount() {
    this.loadFile();
  }

  async onSave() {
    const { dropbox } = this.props;
    const { loading, blocks, rev, path } = this.state;

    if (loading) return null;
    this.setState({ loading: true, error: null, activeIndex: null });

    try {
      let updatedText = blocks.join("\n");

      // if MDo validation fails, display an error but save anyways.
      try {
        updatedText = await runMDoFlow(updatedText);
      } catch (err) {
        this.setState({ error: err });
      }

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

  loadFile() {
    const { loading, path } = this.state;
    const { dropbox } = this.props;

    if (loading) return;
    this.setState({ loading: true, error: null });

    readDropboxFile(dropbox, path)
      .then(({ text, rev }) => {
        parse(text)
          .then(blocks => {
            this.setState({ loading: false, error: null, blocks, rev });
          })
          .catch(err => {
            this.setState({ loading: false, error: err, blocks: [text], rev });
          });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: formatDropboxError(err, "loading file")
        });
      });
  }

  toggleBlock(index) {
    const { activeIndex } = this.state;
    const newActiveIndex = activeIndex === index ? null : index;
    this.setState({ activeIndex: newActiveIndex, activeIsEditing: false });
  }

  toggleEditBlock(index) {
    const { activeIndex, activeIsEditing } = this.state;
    this.setState({
      activeIndex: index,
      activeIsEditing: activeIndex !== index || !activeIsEditing
    });
  }

  moveBlockUp(index) {
    const { blocks, activeIndex } = this.state;
    if (index === 0) return;
    this.setState({
      blocks: [
        ...blocks.slice(0, index - 1),
        blocks[index],
        blocks[index - 1],
        ...blocks.slice(index + 1)
      ].filter(Boolean),
      activeIndex: activeIndex === index ? index - 1 : activeIndex
    });
  }

  moveBlockDown(index) {
    const { blocks, activeIndex } = this.state;
    if (index >= blocks.length - 1) return;
    this.setState({
      blocks: [
        ...blocks.slice(0, index),
        blocks[index + 1],
        blocks[index],
        ...blocks.slice(index + 2)
      ].filter(Boolean),
      activeIndex: activeIndex === index ? index + 1 : activeIndex
    });
  }

  updateBlockText(indexToUpdate, newText) {
    const { blocks } = this.state;
    this.setState({
      blocks: blocks.map((block, idx) => {
        if (idx === indexToUpdate) {
          return newText;
        }
        return block;
      })
    });
  }

  resetError() {
    this.setState({ error: null });
  }

  renderLoading() {
    const { loading } = this.state;
    if (!loading) return null;
    return <ActivityIndicator animating style={{ marginTop: 20 }} />;
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

  renderHeader() {
    const { onGoBack, onLogout } = this.props;
    const { path, blocks } = this.state;
    const saveCallback = blocks && blocks.length ? () => this.onSave() : null;
    return (
      <Header
        subtitle={path}
        onGoBack={onGoBack}
        onLogout={onLogout}
        onSave={saveCallback}
      />
    );
  }

  renderContent() {
    const { blocks, activeIndex, activeIsEditing } = this.state;
    return (
      <FlatList
        data={blocks}
        extraData={{ activeIndex, activeIsEditing }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const active = activeIndex === index;
          const editMode = active && activeIsEditing;
          return (
            <Block
              block={item}
              onChangeText={newText => {
                this.updateBlockText(index, newText);
              }}
              onToggle={() => this.toggleBlock(index)}
              onEditToggle={() => this.toggleEditBlock(index)}
              onMoveUp={() => this.moveBlockUp(index)}
              onMoveDown={() => this.moveBlockDown(index)}
              active={active}
              editMode={editMode}
            />
          );
        }}
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

File.propTypes = {
  dropbox: PropTypes.shape({
    filesListFolder: PropTypes.func.isRequired
  }).isRequired,
  path: PropTypes.string.isRequired,
  onGoBack: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};
