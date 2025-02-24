import React from 'react';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <Alert 
      variant="danger" 
      dismissible={!!onDismiss}
      onClose={onDismiss}
      style={{
        maxWidth: '600px',
        margin: '1rem auto',
        textAlign: 'center'
      }}
    >
      <Alert.Heading>Oops! Something went wrong</Alert.Heading>
      <p>{message}</p>
    </Alert>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
};

export default ErrorMessage;
