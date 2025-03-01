import React from 'react';
import { Container } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const SpinnerContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: var(--space-xl) 0;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  margin-bottom: var(--space-md);
`;

const SpinnerCircle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;

  &::before, &::after {
    content: '';
    position: absolute;
    border: 3px solid transparent;
    border-radius: 50%;
  }

  &::before {
    top: 5px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    border-top-color: var(--color-primary-hover);
    animation: ${rotate} 2s linear infinite reverse;
  }

  &::after {
    top: 15px;
    right: 15px;
    bottom: 15px;
    left: 15px;
    border-top-color: var(--color-secondary);
    animation: ${rotate} 1.5s linear infinite;
  }
`;

const Message = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin: 0;
  animation: ${bounce} 1.5s ease infinite;
  text-align: center;
`;

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <SpinnerContainer>
      <SpinnerWrapper>
        <SpinnerCircle />
      </SpinnerWrapper>
      <Message>{message}</Message>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
