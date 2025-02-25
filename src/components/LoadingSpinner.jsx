import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
      <div className="loading-animation">
        <Spinner
          animation="border"
          role="status"
          style={{
            width: '3rem',
            height: '3rem',
            color: 'var(--color-primary)',
            opacity: 0.8
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
      <p className="text-muted mt-3 loading-text">{message}</p>
    </Container>
  );
};

export default LoadingSpinner;
