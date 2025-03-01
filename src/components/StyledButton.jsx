import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledButtonBase = styled(Button)`
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:not(:disabled) {
    background-color: var(--color-primary);
    border: none;
    color: black;
  }

  &:not(:disabled):hover {
    background-color: var(--color-primary-hover);
    transform: scale(1.02);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.btn-secondary {
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-secondary);
  }

  &.btn-secondary:hover {
    background-color: var(--color-card-hover);
    border-color: var(--color-primary);
  }

  &.btn-outline {
    background-color: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }

  &.btn-outline:hover {
    background-color: var(--color-primary);
    color: black;
  }
`;

const StyledButton = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <StyledButtonBase
      {...props}
      className={`${className} ${variant === 'outline' ? 'btn-outline' : `btn-${variant}`}`}
    >
      {children}
    </StyledButtonBase>
  );
};

StyledButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  className: PropTypes.string,
};

export default StyledButton;
