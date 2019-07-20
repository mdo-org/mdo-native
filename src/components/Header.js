import React from "react";
import PropTypes from "prop-types";
import { Alert, Linking } from "react-native";
import { Appbar, IconButton, Menu, withTheme } from "react-native-paper";

const PRIVACY_POLICY = {
  title: "Privacy Policy",
  onPress: () =>
    Linking.openURL(
      "https://github.com/mdo-org/mdo-native/blob/master/legal/privacy_policy.md"
    )
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false
    };
  }

  onGoBack() {
    const { hasPendingChanges, onGoBack } = this.props;
    if (hasPendingChanges) {
      Alert.alert(
        "Pending Changes",
        "Are you sure you want to discard all changes done to the file?",
        [
          { text: "Cancel", onPress: () => false, style: "cancel" },
          {
            text: "Discard Changes",
            onPress: onGoBack
          }
        ],
        { cancelable: true }
      );
      return;
    }
    onGoBack();
  }

  openMenu() {
    this.setState({ menuVisible: true });
  }

  closeMenu() {
    this.setState({ menuVisible: false });
  }

  runAndCloseMenu(func) {
    this.setState({ menuVisible: false });
    func();
  }

  logout() {
    const { onLogout } = this.props;
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Log Out", onPress: onLogout },
        { text: "Cancel", onPress: () => false, style: "cancel" }
      ],
      { cancelable: true }
    );
  }

  renderMenu() {
    const { theme, menuItems, includeLogoutButton, onLogout } = this.props;
    const { menuVisible } = this.state;

    const allItems = [...menuItems, PRIVACY_POLICY];
    if (includeLogoutButton && onLogout) {
      allItems.push({ title: "Log Out", onPress: () => this.logout() });
    }

    if (!allItems.length) return null;

    return (
      <Menu
        visible={menuVisible}
        onDismiss={() => this.closeMenu()}
        anchor={
          <IconButton
            icon="dehaze"
            color={theme.colors.surface}
            onPress={() => this.openMenu()}
          />
        }
      >
        {allItems.map(({ onPress, title }) => (
          <Menu.Item
            key={title}
            title={title}
            onPress={() => this.runAndCloseMenu(onPress)}
          />
        ))}
      </Menu>
    );
  }

  renderBackButton() {
    const { includeBackButton, onGoBack } = this.props;
    return includeBackButton && onGoBack ? (
      <Appbar.BackAction onPress={() => this.onGoBack()} />
    ) : null;
  }

  render() {
    const { subtitle } = this.props;
    return (
      <Appbar.Header>
        {this.renderBackButton()}
        <Appbar.Content title="MDo" subtitle={subtitle} />
        {this.renderMenu()}
      </Appbar.Header>
    );
  }
}

Header.defaultProps = {
  subtitle: "",
  includeBackButton: false,
  onGoBack: null,
  includeLogoutButton: false,
  onLogout: null,
  menuItems: [],
  hasPendingChanges: false
};

Header.propTypes = {
  // ownProps
  subtitle: PropTypes.string,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired
    })
  ),

  // redux props
  includeBackButton: PropTypes.bool,
  onGoBack: PropTypes.func,
  includeLogoutButton: PropTypes.bool,
  onLogout: PropTypes.func,
  hasPendingChanges: PropTypes.bool,

  // other
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      surface: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default withTheme(Header);
