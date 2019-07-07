import React from "react";
import PropTypes from "prop-types";
import { View, FlatList, RefreshControl } from "react-native";
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
    this.refresh();
  }

  refresh() {
    const { contents, onRefresh } = this.props;
    if (!contents) onRefresh();
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

  renderHeader() {
    const { path } = this.props;
    return <Header subtitle={path} />;
  }

  renderContent() {
    const { contents, onRefresh, onUpdateBlockText } = this.props;
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
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
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
  contents: null
};

File.propTypes = {
  path: PropTypes.string.isRequired,
  contents: PropTypes.arrayOf(PropTypes.string),
  onRefresh: PropTypes.func.isRequired,
  onUpdateBlockText: PropTypes.func.isRequired,
  onMoveBlockUp: PropTypes.func.isRequired,
  onMoveBlockDown: PropTypes.func.isRequired
};
