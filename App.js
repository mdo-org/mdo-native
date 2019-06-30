import React from "react";
import { Dropbox } from "dropbox";
import { View } from "react-native";
import { SplashScreen } from "expo";
import {
  Provider as PaperProvider,
  Text,
  ActivityIndicator
} from "react-native-paper";
import * as Storage from "./src/Storage";
import { isReadableFile, isDirectory, getPath } from "./src/File";
import DropboxLogin from "./src/components/DropboxLogin";
import FileNavigator from "./src/components/FileNavigator";
import File from "./src/components/File";

function getParentDir(path) {
  return path
    .split("/")
    .slice(0, -1)
    .join("/");
}

let splashScreenVisible = true;
function hideSplashScreen() {
  if (!splashScreenVisible) return;
  SplashScreen.hide();
  splashScreenVisible = false;
}

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

  setPaths({ dirpath, filepath }) {
    Storage.setPaths({ dirpath, filepath });
    this.setState({ dirpath, filepath });
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
    const { dirpath, filepath } = await Storage.getPaths();
    this.setState({ loading: false, dirpath, filepath });

    if (dropboxToken) {
      this.newDropbox(dropboxToken);
    }
  }

  logout() {
    Storage.deleteDropboxToken();
    this.setState({ dropbox: null });
  }

  selectFile(file) {
    const path = getPath(file);
    if (isReadableFile(file)) {
      this.setPaths({ dirpath: getParentDir(path), filepath: path });
      return;
    }
    if (isDirectory(file)) {
      this.setPaths({ dirpath: path, filepath: "" });
    }
  }

  goBack() {
    const { dirpath, filepath } = this.state;
    if (filepath) {
      this.setPaths({ dirpath, filepath: "" });
      return;
    }
    this.setPaths({ dirpath: getParentDir(dirpath), filepath: "" });
  }

  renderLoading() {
    const { loading } = this.state;
    if (!loading) return null;
    return <ActivityIndicator animating style={{ marginTop: 50 }} />;
  }

  renderError() {
    const { error } = this.state;
    if (!error) return null;
    return <Text>{error.message}</Text>;
  }

  renderContent() {
    hideSplashScreen();
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
