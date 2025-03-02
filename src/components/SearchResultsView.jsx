import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import EnhancedSearch from './EnhancedSearch';
import AlbumCard from './AlbumCard';
import ArtistCard from './ArtistCard';
import CardSkeleton from './CardSkeleton';
import ErrorMessage from './ErrorMessage';
import Pagination from './Pagination';
import spotifyApi from '../services/spotifyApi';

const ResultsContainer = styled(Container)`
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
  min-height: calc(100vh - 80px);
`;

const ResultsGrid = styled(Row)`
  margin-top: var(--space-lg);
`;

const NoResults = styled.div`
  text-align: center;
  padding: var(--space-xl) 0;
  color: var(--color-text-secondary);
`;

const ResultsCount = styled.p`
  color: var(--color-text-secondary);
  margin: var(--space-md) 0;
  font-size: 0.9rem;
`;

const SearchResultsView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'artist';

  const handleSearch = async (searchQuery, searchType, page = 1) => {
    if (!searchQuery.trim()) return;
    
    setSearchParams({ q: searchQuery, type: searchType });
    setLoading(true);
    setError(null);
    
    try {
      const response = await spotifyApi.search(searchQuery, searchType, page);
      setSearchResults(response.items);
      setTotalPages(Math.ceil(response.total / 20));
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearch(query, type, currentPage);
    }
  }, [query, type]);

  const handlePageChange = (page) => {
    handleSearch(query, type, page);
    window.scrollTo(0, 0);
  };

  const handleArtistSelect = (artistId) => {
    // Future implementation for artist view
    console.log('Selected artist:', artistId);
  };

  return (
    <ResultsContainer>
      <EnhancedSearch 
        initialQuery={query}
        initialType={type}
        onSearch={handleSearch}
      />
      
      {loading ? (
        <ResultsGrid xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
          {[...Array(8)].map((_, index) => (
            <Col key={index}>
              <CardSkeleton type={type} />
            </Col>
          ))}
        </ResultsGrid>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : searchResults.length === 0 && query ? (
        <NoResults>No results found. Try searching for something else.</NoResults>
      ) : searchResults.length > 0 ? (
        <>
          <ResultsCount>
            Showing {searchResults.length} results for "{query}"
          </ResultsCount>
          <ResultsGrid xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
            {searchResults.map((item) => (
              <Col key={item.id}>
                {type === 'album' ? (
                  <AlbumCard album={item} />
                ) : (
                  <ArtistCard artist={item} />
                )}
              </Col>
            ))}
          </ResultsGrid>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          )}
        </>
      ) : null}
    </ResultsContainer>
  );
};

export default SearchResultsView;