import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BsXCircle } from 'react-icons/bs';

const ErrorContainer = styled.div`
  background: rgba(241, 94, 108, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-lg);
  margin: var(--space-md) auto;
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  position: relative;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ErrorIcon = styled(BsXCircle)`
  color: var(--color-error);
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ErrorContent = styled.div`
  flex-grow: 1;
`;

const ErrorTitle = styled.h6`
  color: var(--color-error);
  margin: 0 0 0.25rem;
  font-weight: 600;
`;

const ErrorText = styled.p`
  color: var(--color-text);
  margin: 0;
  font-size: 0.9rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
  position: absolute;
  right: var(--space-sm);
  top: var(--space-sm);
  transition: var(--transition-fast);

  &:hover {
    color: var(--color-text);
  }
`;

const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <ErrorContainer role="alert">
      <ErrorIcon />
      <ErrorContent>
        <ErrorTitle>Error</ErrorTitle>
        <ErrorText>{message}</ErrorText>
      </ErrorContent>
      {onDismiss && (
        <CloseButton 
          onClick={onDismiss}
          aria-label="Dismiss error message"
        >
          ×
        </CloseButton>
      )}
    </ErrorContainer>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
};

export default ErrorMessage;
