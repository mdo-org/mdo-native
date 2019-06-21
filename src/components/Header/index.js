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

  renderMenu() {
    const { theme, onLogout, onRunMDo } = this.props;
    const { menuVisible } = this.state;

    if (!onLogout && !onRunMDo) return null;

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
        {onRunMDo && <Menu.Item onPress={onRunMDo} title="Run MDo" />}
        {onLogout && <Menu.Item onPress={onLogout} title="Log Out" />}
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
  onRunMDo: null
};

Header.propTypes = {
  subtitle: PropTypes.string,
  onGoBack: PropTypes.func,
  onLogout: PropTypes.func,
  onRunMDo: PropTypes.func,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default withTheme(Header);
