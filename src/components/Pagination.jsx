import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin: var(--space-xl) 0;
`;

const PageButton = styled.button`
  background: var(--color-surface);
  border: 1px solid var(--color-secondary);
  color: var(--color-text);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: var(--transition-default);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: black;
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.1em;
  }
`;

const PageInfo = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  min-width: 100px;
  text-align: center;
`;

const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <BsChevronLeft /> Previous
      </PageButton>
      <PageInfo>
        Page {currentPage} of {totalPages}
      </PageInfo>
      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        Next <BsChevronRight />
      </PageButton>
    </PaginationContainer>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default Pagination;