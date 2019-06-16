import React from "react";
import { Dropbox } from "dropbox";
import { Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import * as Storage from "./src/Storage";
import { isReadableFile, isDirectory, getPath } from "./src/File";
import DropboxLogin from "./src/components/DropboxLogin";
import FileNavigator from "./src/components/FileNavigator";
import File from "./src/components/File";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropbox: null,
      dirpath: "",
      filepath: "",
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.loadFromStorage();
  }

  newDropbox(accessToken) {
    Storage.setDropboxToken(accessToken);
    this.setState({
      dropbox: new Dropbox({
        fetch: global.fetch,
        accessToken
      })
    });
  }

  async loadFromStorage() {
    const { loading } = this.state;
    if (loading) return;

    this.setState({ loading: true, error: null });
    const dropboxToken = await Storage.getDropboxToken();
    this.setState({ loading: false });

    if (dropboxToken) {
      this.newDropbox(dropboxToken);
    }
  }

  logout() {
    Storage.deleteDropboxToken();
    this.setState({ dropbox: null });
  }

  selectFile(file) {
    if (isReadableFile(file)) {
      this.setState({ filepath: getPath(file) });
      return;
    }
    if (isDirectory(file)) {
      this.setState({ filepath: "", dirpath: getPath(file) });
    }
  }

  goBack() {
    const { filepath, dirpath } = this.state;
    if (filepath) {
      this.setState({ filepath: "" });
      return;
    }
    this.setState({
      dirpath: dirpath
        .split("/")
        .slice(0, -1)
        .join("/")
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
    return (
      <File
        dropbox={dropbox}
        path={filepath}
        onLogout={() => this.logout()}
        onGoBack={() => this.goBack()}
      />
    );
  }

  renderFileNavigator() {
    const { dropbox, dirpath } = this.state;
    return (
      <FileNavigator
        dropbox={dropbox}
        path={dirpath}
        onLogout={() => this.logout()}
        onFilePick={path => this.selectFile(path)}
        onGoBack={() => this.goBack()}
      />
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

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}
