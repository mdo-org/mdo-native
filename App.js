import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropbox } from "dropbox";
import DropboxLogin from "./src/components/DropboxLogin";
import FileNavigator from "./src/components/FileNavigator";
import File from "./src/components/File";

const DIRPATH = "/todo/";
const FILEPATH = "/todo/home.md";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropbox: null,
      dirpath: DIRPATH,
      filepath: "",
      loading: false,
      error: null
    };
  }

  newDropbox(accessToken) {
    this.setState({
      dropbox: new Dropbox({
        fetch: global.fetch,
        accessToken
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

  renderContent() {
    const { dropbox, loading, error, filepath } = this.state;
    if (loading || error) return null;
    if (!dropbox) {
      return this.renderDropboxLogin();
    }
    return filepath ? this.renderFile() : this.renderFileNavigator();
  }

  renderDropboxLogin() {
    return <DropboxLogin onLogin={token => this.newDropbox(token)} />;
  }

  renderFile() {
    const { dropbox, filepath } = this.state;
    return <File dropbox={dropbox} path={filepath} />;
  }

  renderFileNavigator() {
    const { dropbox, dirpath } = this.state;
    return <FileNavigator dropbox={dropbox} path={dirpath} />;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderLoading()}
        {this.renderError()}
        {this.renderContent()}
      </View>
    );
  }
}
