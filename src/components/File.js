import React from "react";
import PropTypes from "prop-types";
import { Alert, View, FlatList, RefreshControl } from "react-native";
import Header from "../redux/containers/Header";
import Block from "./Block";

export default class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null,
      activeIsEditing: false
    };
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    this.load();
  }

  load() {
    const { isLoading, contents, onRefresh } = this.props;
    if (!contents && !isLoading) onRefresh();
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
    const { onMoveBlockUp } = this.props;
    const { activeIndex } = this.state;
    if (index === 0) return;
    onMoveBlockUp(index);
    this.setState({
      activeIndex: activeIndex === index ? index - 1 : activeIndex
    });
  }

  moveBlockDown(index) {
    const { onMoveBlockDown, contents } = this.props;
    const { activeIndex } = this.state;
    if (index >= contents.length - 1) return;
    onMoveBlockDown(index);
    this.setState({
      activeIndex: activeIndex === index ? index + 1 : activeIndex
    });
  }

  runMDo() {
    const { onRunMDo } = this.props;
    onRunMDo();
    this.setState({ activeIndex: null, activeIsEditing: false });
  }

  save() {
    const { onSave } = this.props;
    onSave();
    this.setState({ activeIndex: null, activeIsEditing: false });
  }

  discardChanges() {
    const { onRefresh } = this.props;
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard all changes done to the file?",
      [
        { text: "Cancel", onPress: () => false, style: "cancel" },
        {
          text: "Discard Changes",
          onPress: onRefresh
        }
      ],
      { cancelable: true }
    );
    this.setState({ activeIndex: null, activeIsEditing: false });
  }

  async saveAndRefresh() {
    const { onRefresh } = this.props;
    await this.save();
    onRefresh();
  }

  renderHeader() {
    const { path, hasPendingChanges } = this.props;
    const menuItems = [{ title: "Run MDo", onPress: () => this.runMDo() }];
    if (hasPendingChanges) {
      menuItems.push({ title: "Save", onPress: () => this.save() });
      menuItems.push({
        title: "Discard Changes",
        onPress: () => this.discardChanges()
      });
    }
    return <Header subtitle={path} menuItems={menuItems} />;
  }

  renderContent() {
    const { contents, onUpdateBlockText } = this.props;
    const { activeIndex, activeIsEditing } = this.state;
    return (
      <FlatList
        data={contents}
        extraData={{ activeIndex, activeIsEditing }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const active = activeIndex === index;
          const editMode = active && activeIsEditing;
          return (
            <Block
              text={item}
              onChangeText={newText => onUpdateBlockText(index, newText)}
              onToggle={() => this.toggleBlock(index)}
              onEditToggle={() => this.toggleEditBlock(index)}
              onMoveUp={() => this.moveBlockUp(index)}
              onMoveDown={() => this.moveBlockDown(index)}
              active={active}
              editMode={editMode}
            />
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => this.saveAndRefresh()}
          />
        }
      />
    );
  }

  render() {
    return (
      <View>
        {this.renderHeader()}
        {this.renderContent()}
      </View>
    );
  }
}

File.defaultProps = {
  isLoading: false,
  contents: null
};

File.propTypes = {
  isLoading: PropTypes.bool,
  path: PropTypes.string.isRequired,
  contents: PropTypes.arrayOf(PropTypes.string),
  hasPendingChanges: PropTypes.bool.isRequired,

  onRunMDo: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onUpdateBlockText: PropTypes.func.isRequired,
  onMoveBlockUp: PropTypes.func.isRequired,
  onMoveBlockDown: PropTypes.func.isRequired
};
