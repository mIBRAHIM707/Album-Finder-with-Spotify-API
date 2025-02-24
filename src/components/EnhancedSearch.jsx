import React, { useState, useEffect } from 'react';
import { FormControl, InputGroup, Dropdown, Form } from 'react-bootstrap';
import StyledButton from './StyledButton';
import spotifyApi from '../services/spotifyApi';

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
    <div className="position-relative">
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
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </div>
  );
};

export default EnhancedSearch;
