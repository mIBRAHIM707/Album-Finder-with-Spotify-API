import React, { useState, useEffect } from 'react';
import { FormControl, InputGroup, Dropdown, Form } from 'react-bootstrap';
import StyledButton from './StyledButton';
import spotifyApi from '../services/spotifyApi';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 20px 0;
  background: linear-gradient(180deg, #121212 0%, rgba(18, 18, 18, 0.8) 100%);
  backdrop-filter: blur(10px);
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
      <InputGroup className="mb-3">
        <Form.Select 
          style={{ maxWidth: '120px' }}
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="artist">Artist</option>
          <option value="album">Album</option>
        </Form.Select>
        <FormControl
          placeholder={`Search by ${searchType}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <StyledButton onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </StyledButton>
      </InputGroup>

      {showSuggestions && suggestions.length > 0 && (
        <Dropdown.Menu show style={{ width: '100%', maxHeight: '300px', overflowY: 'auto' }}>
          {suggestions.map((item) => (
            <Dropdown.Item
              key={item.id}
              onClick={() => {
                setQuery(item.name);
                onSearch(item.name, searchType);
                setShowSuggestions(false);
              }}
            >
              <div className="d-flex align-items-center">
                {item.images && item.images[2] && (
                  <img
                    src={item.images[2].url}
                    alt={item.name}
                    style={{ width: '40px', height: '40px', marginRight: '10px', borderRadius: '4px' }}
                  />
                )}
                <div>
                  <div>{item.name}</div>
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
        </Dropdown.Menu>
      )}
    </SearchContainer>
  );
};

export default EnhancedSearch;
