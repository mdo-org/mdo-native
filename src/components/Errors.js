import React from "react";
import PropTypes from "prop-types";
import { Button, Dialog, Portal, Paragraph } from "react-native-paper";

export default function Errors({ errors, onErrorsDismiss }) {
  const visible = errors && errors.length;
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onErrorsDismiss}>
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.Content>
          {errors.map(err => (
            <Paragraph>{err}</Paragraph>
          ))}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onErrorsDismiss}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

Errors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onErrorsDismiss: PropTypes.func.isRequired
};
