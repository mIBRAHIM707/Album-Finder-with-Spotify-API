import React, { useState, useEffect } from 'react';
import { FormControl, InputGroup, Dropdown, Form } from 'react-bootstrap';
import StyledButton from './StyledButton';
import spotifyApi from '../services/spotifyApi';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: sticky;
  top: 80px; // Adjust this value based on your header height
  z-index: 999;
  padding: 20px 0;
  background: linear-gradient(180deg, var(--color-background) 0%, rgba(18, 18, 18, 0.8) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 80px; // Add margin to account for fixed header
`;

const StyledInputGroup = styled(InputGroup)`
  max-width: 700px;
  margin: 0 auto;
  background: var(--color-surface);
  border-radius: var(--radius-pill);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition-default);

  &:focus-within {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
`;

const StyledFormSelect = styled(Form.Select)`
  max-width: 120px !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
  cursor: pointer;
  
  &:focus {
    border-color: var(--color-primary) !important;
  }
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 0.5rem;
  border: none;
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-md);
`;

const EnhancedSearch = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchType, setSearchType] = useState('artist');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const getSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const results = await spotifyApi.getSearchSuggestions(query, searchType);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const timeoutId = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query, searchType]);

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(query, searchType);
    setShowSuggestions(false);
  };

  return (
    <SearchContainer>
      <StyledInputGroup className="mb-3">
        <StyledFormSelect 
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="artist">Artist</option>
          <option value="album">Album</option>
        </StyledFormSelect>
        <FormControl
          placeholder={`Search by ${searchType}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <StyledButton 
          onClick={handleSearch} 
          disabled={loading || !query.trim()}
          style={{ 
            borderTopLeftRadius: 0, 
            borderBottomLeftRadius: 0,
            minWidth: '100px'
          }}
        >
          {loading ? "Searching..." : "Search"}
        </StyledButton>
      </StyledInputGroup>

      {showSuggestions && suggestions.length > 0 && (
        <StyledDropdownMenu show>
          {suggestions.map((item) => (
            <Dropdown.Item
              key={item.id}
              onClick={() => {
                setQuery(item.name);
                onSearch(item.name, searchType);
                setShowSuggestions(false);
              }}
              className="py-2"
            >
              <div className="d-flex align-items-center">
                {item.images && item.images[2] && (
                  <img
                    src={item.images[2].url}
                    alt={item.name}
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      marginRight: '10px', 
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div>
                  <div className="fw-semibold">{item.name}</div>
                  {searchType === 'artist' && item.genres && (
                    <small className="text-muted">{item.genres[0]}</small>
                  )}
                  {searchType === 'album' && item.artists && (
                    <small className="text-muted">{item.artists[0].name}</small>
                  )}
                </div>
              </div>
            </Dropdown.Item>
          ))}
        </StyledDropdownMenu>
      )}
    </SearchContainer>
  );
};

export default EnhancedSearch;
