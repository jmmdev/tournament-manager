import React from 'react';
import {Modal} from 'react-native';
import ErrorMessage from './ErrorMessage';

export default function Error({message, showError, setShowError, refresh}) {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={showError}
      onRequestClose={() => {}}>
      <ErrorMessage
        message={message}
        setShowError={setShowError}
        refresh={refresh}
      />
    </Modal>
  );
}
