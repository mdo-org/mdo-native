import React from "react";
import PropTypes from "prop-types";
import { Appbar, IconButton, Menu, withTheme } from "react-native-paper";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false
    };
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

  renderMenu() {
    const { theme, onLogout, onSave } = this.props;
    const { menuVisible } = this.state;

    if (!onLogout && !onSave) return null;

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
        {onSave && (
          <Menu.Item
            onPress={() => this.runAndCloseMenu(onSave)}
            title="Save"
          />
        )}
        {onLogout && (
          <Menu.Item
            onPress={() => this.runAndCloseMenu(onLogout)}
            title="Log Out"
          />
        )}
      </Menu>
    );
  }

  render() {
    const { subtitle, onGoBack } = this.props;
    return (
      <Appbar.Header>
        {onGoBack && <Appbar.BackAction onPress={onGoBack} />}
        <Appbar.Content title="MDo-Native" subtitle={subtitle} />
        {this.renderMenu()}
      </Appbar.Header>
    );
  }
}

Header.defaultProps = {
  subtitle: "",
  onGoBack: null,
  onLogout: null,
  onSave: null
};

Header.propTypes = {
  subtitle: PropTypes.string,
  onGoBack: PropTypes.func,
  onLogout: PropTypes.func,
  onSave: PropTypes.func,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default withTheme(Header);
