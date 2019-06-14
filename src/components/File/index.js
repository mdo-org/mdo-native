// File renders a single MDo file

import React from "react";
import PropTypes from "prop-types";
import { Text, View } from "react-native";
import MDo from "@mdo-org/mdo-core/lib/strings/index";
import key from "weak-key";
import Block from "../Block";

const readDropboxFile = (dropbox, path) =>
  new Promise((resolve, reject) => {
    dropbox
      .filesDownload({ path })
      .then(response => {
        const blob = response.fileBlob;
        const reader = new global.FileReader();
        reader.addEventListener("loadend", () => {
          resolve(reader.result);
        });
        reader.readAsText(blob);
      })
      .catch(err => reject(err));
  });

export default class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      blocks: []
    };
  }

  componentDidMount() {
    this.loadFile();
  }

  loadFile() {
    const { loading } = this.state;
    const { dropbox, path } = this.props;

    if (loading) return;
    this.setState({ loading: true, error: null, blocks: [] });

    readDropboxFile(dropbox, path)
      .then(MDo.parse)
      .then(blocks => this.setState({ loading: false, error: null, blocks }))
      .catch(err => {
        this.setState({ loading: false, error: err, blocks: [] });
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
    const { blocks } = this.state;
    return (
      <View>
        {blocks.map(block => (
          <Block key={key(block)} block={block} />
        ))}
      </View>
    );
  }

  render() {
    return (
      <View>
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
  path: PropTypes.string.isRequired
};
