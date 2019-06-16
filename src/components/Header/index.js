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

  render() {
    const { menuVisible } = this.state;
    const { isRoot, subtitle, onGoBack, onLogout, theme } = this.props;
    return (
      <Appbar.Header>
        {isRoot ? null : <Appbar.BackAction onPress={onGoBack} />}
        <Appbar.Content title="MDo-Native" subtitle={subtitle} />
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
          <Menu.Item onPress={onLogout} title="Log Out" />
        </Menu>
      </Appbar.Header>
    );
  }
}

Header.defaultProps = {
  isRoot: true,
  subtitle: "",
  onGoBack: () => {},
  onLogout: () => {}
};

Header.propTypes = {
  isRoot: PropTypes.bool,
  subtitle: PropTypes.string,
  onGoBack: PropTypes.func,
  onLogout: PropTypes.func,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default withTheme(Header);
