import React from "react";
import PropTypes from "prop-types";
import { TextInput, Card, Paragraph, Button } from "react-native-paper";

export default class Block extends React.Component {
  renderViewMode() {
    const {
      text,
      onToggle,
      onCheckboxToggle,
      onEditToggle,
      onMoveUp,
      onMoveDown,
      onNewBlockBelow,
      active
    } = this.props;
    const [firstLine, ...rest] = text.split("\n");

    let body = null;
    let actions = null;
    if (active) {
      body = rest.length ? <Paragraph>{rest.join("\n")}</Paragraph> : null;
      actions = (
        <Card.Actions>
          <Button icon="check-box" onPress={onCheckboxToggle} />
          <Button icon="create" onPress={onEditToggle} />
          <Button icon="arrow-upward" onPress={onMoveUp} />
          <Button icon="arrow-downward" onPress={onMoveDown} />
          <Button icon="keyboard-return" onPress={onNewBlockBelow} />
        </Card.Actions>
      );
    }

    return (
      <Card onPress={onToggle}>
        <Card.Content>
          <Paragraph>{firstLine}</Paragraph>
          {body}
        </Card.Content>
        {actions}
      </Card>
    );
  }

  renderEditMode() {
    const {
      text,
      onEditToggle,
      onChangeText,
      onMoveUp,
      onMoveDown,
      onNewBlockBelow
    } = this.props;
    return (
      <Card>
        <Card.Content>
          <TextInput
            value={text}
            multiline
            editable
            onChangeText={onChangeText}
          />
        </Card.Content>
        <Card.Actions>
          <Button icon="create" onPress={onEditToggle} />
          <Button icon="arrow-upward" onPress={onMoveUp} />
          <Button icon="arrow-downward" onPress={onMoveDown} />
          <Button icon="keyboard-return" onPress={onNewBlockBelow} />
        </Card.Actions>
      </Card>
    );
  }

  render() {
    const { editMode } = this.props;
    if (editMode) return this.renderEditMode();
    return this.renderViewMode();
  }
}

Block.defaultProps = {
  active: false,
  editMode: false
};

Block.propTypes = {
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
  editMode: PropTypes.bool,
  onToggle: PropTypes.func.isRequired, // toggle card between open/closed
  onCheckboxToggle: PropTypes.func.isRequired, // toggle to-do between checked/unchecked
  onEditToggle: PropTypes.func.isRequired, // toggle card between editable/not-editable
  onChangeText: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  onNewBlockBelow: PropTypes.func.isRequired
};
