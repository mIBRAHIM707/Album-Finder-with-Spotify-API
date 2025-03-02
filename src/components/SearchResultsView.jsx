import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  padding-top: calc(80px + var(--space-xl)); /* Increased top padding to account for fixed header */
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

  const handleSearch = useCallback(async (searchQuery, searchType, page = 1) => {
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
  }, [setSearchParams]);

  useEffect(() => {
    if (query) {
      handleSearch(query, type, currentPage);
    }
  }, [query, type, currentPage, handleSearch]);

  const handlePageChange = useCallback((page) => {
    handleSearch(query, type, page);
    window.scrollTo(0, 0);
  }, [query, type, handleSearch]);

  const renderedResults = useMemo(() => {
    if (loading) {
      return (
        <ResultsGrid xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
          {[...Array(8)].map((_, index) => (
            <Col key={index}>
              <CardSkeleton type={type} />
            </Col>
          ))}
        </ResultsGrid>
      );
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (searchResults.length === 0 && query) {
      return <NoResults>No results found. Try searching for something else.</NoResults>;
    }

    if (searchResults.length > 0) {
      return (
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
      );
    }

    return null;
  }, [searchResults, query, type, loading, error, totalPages, currentPage, handlePageChange]);

  return (
    <ResultsContainer>
      <EnhancedSearch 
        initialQuery={query}
        initialType={type}
        onSearch={handleSearch}
      />
      {renderedResults}
    </ResultsContainer>
  );
};

export default React.memo(SearchResultsView);