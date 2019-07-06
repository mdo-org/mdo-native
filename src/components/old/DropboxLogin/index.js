// DropboxLogin takes care of the whole OAuth2 authentication flow for Dropbox

import React from "react";
import { AuthSession } from "expo";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import Header from "../Header";

const APP_KEY = "8hq4uhvyl0xlgmj";

const dropboxAuth = () => {
  const redirectUrl = AuthSession.getRedirectUrl();
  const authUrl = [
    "https://www.dropbox.com/1/oauth2/authorize",
    "?response_type=token",
    `&client_id=${APP_KEY}`,
    `&redirect_uri=${redirectUrl}`
  ].join("");
  return AuthSession.startAsync({ authUrl });
};

export default class DropboxLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null
    };
  }

  async login() {
    const { loading } = this.state;
    const { onLogin } = this.props;

    if (loading) return;
    try {
      this.setState({ loading: true, error: false });
      const response = await dropboxAuth();

      if (response.type !== "success") {
        throw new Error("Unexpected login response.type", response.type);
      }

      if (!response.params || !response.params.access_token) {
        throw new Error("No access_token was returned");
      }

      this.setState({ loading: false, error: false });
      onLogin(response.params.access_token);
    } catch (err) {
      this.setState({ loading: false, error: err });
    }
  }

  renderLoading() {
    const { loading } = this.state;
    if (!loading) return null;
    return <ActivityIndicator animating style={{ marginTop: 20 }} />;
  }

  renderError() {
    const { error } = this.state;
    if (!error) return null;
    return <Text>{error.message}</Text>;
  }

  renderContent() {
    const { loading, error } = this.state;
    if (loading || error) return null;
    return <Button onPress={() => this.login()}>Login with Dropbox</Button>;
  }

  render() {
    return (
      <View>
        <Header />
        {this.renderLoading()}
        {this.renderError()}
        {this.renderContent()}
      </View>
    );
  }
}

DropboxLogin.propTypes = {
  onLogin: PropTypes.func.isRequired
};
