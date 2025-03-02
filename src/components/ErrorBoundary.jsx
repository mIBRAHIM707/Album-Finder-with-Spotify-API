import React from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { BsExclamationTriangle } from 'react-icons/bs';

const ErrorContainer = styled(Container)`
  margin-top: 100px;
  text-align: center;
  padding: var(--space-xl);
`;

const ErrorIcon = styled(BsExclamationTriangle)`
  font-size: 3rem;
  color: var(--color-error);
  margin-bottom: var(--space-lg);
`;

const ErrorTitle = styled.h2`
  color: var(--color-text);
  margin-bottom: var(--space-md);
`;

const ErrorDescription = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: var(--space-lg);
`;

const ReloadButton = styled.button`
  background: var(--color-primary);
  color: black;
  border: none;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-pill);
  font-weight: 600;
  transition: var(--transition-default);

  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon />
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorDescription>
            We're sorry, but something unexpected happened. Please try reloading the page.
          </ErrorDescription>
          <ReloadButton onClick={this.handleReload}>
            Reload Page
          </ReloadButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
