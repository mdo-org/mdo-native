import React from "react";
import PropTypes from "prop-types";
import { TextInput, Card, Paragraph, Button } from "react-native-paper";
import { BlockHelper } from "@mdo-org/mdo-core";

function blockToString(block) {
  // if the block has no tags, just render as is.
  if (block.text.includes("{{type}}")) {
    return BlockHelper.toString(block);
  }
  return block.text;
}

export default class Block extends React.Component {
  renderViewMode() {
    const {
      block,
      onToggle,
      onEditToggle,
      onMoveUp,
      onMoveDown,
      active
    } = this.props;
    const [firstLine, ...rest] = blockToString(block).split("\n");

    let body = null;
    let actions = null;
    if (active) {
      body = rest.length ? <Paragraph>{rest.join("\n")}</Paragraph> : null;
      actions = (
        <Card.Actions>
          <Button icon="create" onPress={onEditToggle} />
          <Button icon="arrow-upward" onPress={onMoveUp} />
          <Button icon="arrow-downward" onPress={onMoveDown} />
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
    const { block, onEditToggle, onChangeText } = this.props;
    const text = blockToString(block);
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
          <Button onPress={onEditToggle} icon="arrow-back" />
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
  block: PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  active: PropTypes.bool,
  editMode: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onEditToggle: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired
};
