import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ErrorMessage from './ErrorMessage';

const ErrorBoundaryContainer = styled.div`
  padding: var(--space-xl) var(--space-md);
  margin-top: 80px;
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

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryContainer>
          <ErrorMessage 
            message="Something went wrong. Please try refreshing the page."
            onDismiss={() => this.setState({ hasError: false, error: null })}
          />
        </ErrorBoundaryContainer>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
