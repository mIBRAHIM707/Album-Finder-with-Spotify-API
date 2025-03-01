import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BsSearch } from 'react-icons/bs';
import StyledButton from './StyledButton';

const SearchForm = styled(Form)`
  margin-bottom: var(--space-md);
`;

const SearchInput = styled(Form.Control)`
  background: var(--color-surface) !important;
  border: 1px solid var(--color-secondary) !important;
  color: var(--color-text) !important;
  padding-left: 3rem !important;
  height: 3.5rem;
  font-size: 1.1rem;

  &:focus {
    box-shadow: 0 0 0 2px var(--color-primary);
    border-color: var(--color-primary) !important;
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const SearchIcon = styled(BsSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  z-index: 4;
`;

const SearchTypeContainer = styled.div`
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
  justify-content: center;
`;

const EnhancedSearch = ({ initialQuery = '', initialType = 'artist', onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchTerm)}&type=${searchType}`);
    if (onSearch) {
      onSearch(searchTerm, searchType);
    }
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}&type=${type}`);
      if (onSearch) {
        onSearch(searchTerm, type);
      }
    }
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <InputGroup>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search for artists or albums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search"
        />
      </InputGroup>

      <SearchTypeContainer>
        <StyledButton
          type="button"
          variant={searchType === 'artist' ? 'primary' : 'secondary'}
          onClick={() => handleTypeChange('artist')}
        >
          Artists
        </StyledButton>
        <StyledButton
          type="button"
          variant={searchType === 'album' ? 'primary' : 'secondary'}
          onClick={() => handleTypeChange('album')}
        >
          Albums
        </StyledButton>
      </SearchTypeContainer>
    </SearchForm>
  );
};

export default EnhancedSearch;
