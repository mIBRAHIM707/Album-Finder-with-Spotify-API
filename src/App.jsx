import React, { useState, useEffect, Suspense, useMemo } from "react";
import { FormControl, InputGroup, Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StyledButton from "./components/StyledButton";
import ErrorBoundary from "./components/ErrorBoundary";
import spotifyApi from './services/spotifyApi';
import { useSpotifySearch } from "./hooks/useSpotifySearch";
import AlbumSkeleton from "./components/AlbumSkeleton";
import ErrorMessage from "./components/ErrorMessage";
import SearchFilters from "./components/SearchFilters";
import { useSearchHistory } from "./hooks/useSearchHistory";
import EnhancedSearch from './components/EnhancedSearch';

// Lazy load components
const AlbumDetails = React.lazy(() => import("./AlbumDetails"));
const AlbumCard = React.lazy(() => import("./components/AlbumCard"));

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const {
    albums,
    error,
    search,
    loading,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useSpotifySearch(accessToken); // Use the custom hook
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [filters, setFilters] = useState({
    year: '',
    sortBy: 'recent'
  });
  const { searchHistory, addToHistory, clearHistory } = useSearchHistory();

  // Memoize the filtered albums
  const memoizedAlbums = useMemo(() => albums, [albums]);

  // Filter and sort albums
  const filteredAlbums = useMemo(() => {
    let result = [...memoizedAlbums];
    
    if (filters.year) {
      result = result.filter(album => album.release_date.startsWith(filters.year));
    }
    
    switch (filters.sortBy) {
      case 'oldest':
        result.sort((a, b) => a.release_date.localeCompare(b.release_date));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // 'recent'
        result.sort((a, b) => b.release_date.localeCompare(a.release_date));
    }
    
    return result;
  }, [memoizedAlbums, filters]);

  // Remove the debounced search input since we want immediate search on button click
  const handleSearch = (page = 1) => {
    if (!searchInput.trim()) return;
    setSearchInitiated(true);
    addToHistory(searchInput);
    search(searchInput, page);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleHistoryClick = (term) => {
    setSearchInput(term);
    setSearchInitiated(true);
    search(term, 1);
  };

  const handleEnhancedSearch = (searchTerm, searchType) => {
    setSearchInput(searchTerm);
    setSearchInitiated(true);
    addToHistory(searchTerm);
    search(searchTerm, searchType, 1);
  };

  // Remove the debounce effect as we want manual search control

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        let authParams = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        };

        const result = await fetch(
          "https://accounts.spotify.com/api/token",
          authParams
        );
        const data = await result.json();
        if (!result.ok) {
          throw new Error(data.error_description || "Failed to fetch access token");
        }
        spotifyApi.setAccessToken(data.access_token);
        setAccessToken(data.access_token);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching access token:", err);
      }
    };

    getAccessToken();
  }, []);

  const skeletons = Array(8).fill(null);

  return (
    <Router>
      <ErrorBoundary>
        <div className="min-vh-100 w-100 d-flex justify-content-center">
          <Container 
            fluid 
            className="px-3 px-md-4 px-lg-5 py-5"
            style={{ maxWidth: '1800px' }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <div className="d-flex flex-column align-items-center">
                    {/* Search Bar Section */}
                    <div className="w-100 mb-4" style={{ maxWidth: '500px' }}>
                      <EnhancedSearch 
                        onSearch={handleEnhancedSearch}
                        loading={loading}
                      />
                      
                      {/* Search History */}
                      {searchHistory.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted">Recent searches: </small>
                          {searchHistory.map((term, index) => (
                            <button
                              key={index}
                              className="btn btn-link btn-sm"
                              onClick={() => handleHistoryClick(term)}
                            >
                              {term}
                            </button>
                          ))}
                          <button
                            className="btn btn-link btn-sm text-danger"
                            onClick={clearHistory}
                          >
                            Clear
                          </button>
                        </div>
                      )}

                      {/* Filters */}
                      {searchInitiated && (
                        <SearchFilters
                          filters={filters}
                          onFilterChange={handleFilterChange}
                        />
                      )}
                    </div>

                    {/* Error Message */}
                    {error && <ErrorMessage message={error} />}

                    {/* Main Content Area */}
                    <div className="w-100" style={{ maxWidth: '1400px' }}>
                      <Row 
                        xs={1} 
                        sm={2} 
                        md={3} 
                        lg={4} 
                        xl={5} 
                        className="g-4 justify-content-center mx-0"
                      >
                        {loading && searchInitiated ? (
                          skeletons.map((_, index) => (
                            <Col key={index}>
                              <AlbumSkeleton />
                            </Col>
                          ))
                        ) : filteredAlbums.length === 0 && !error && searchInitiated ? (
                          <Col xs={12} className="text-center py-5">
                            <div className="w-100">
                              <h4 className="mb-3">No albums found</h4>
                              <p className="text-muted">Try searching for a different artist</p>
                            </div>
                          </Col>
                        ) : (
                          filteredAlbums.map((album) => (
                            <Col key={album.id}>
                              <AlbumCard album={album} />
                            </Col>
                          ))
                        )}
                      </Row>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <Row className="mt-4 mb-4">
                          <Col className="d-flex justify-content-center align-items-center gap-3">
                            <StyledButton
                              onClick={() => handleSearch(currentPage - 1)}
                              disabled={currentPage === 1 || loading}
                              style={{
                                fontSize: "14px",
                                width: "80px",
                              }}
                            >
                              Previous
                            </StyledButton>
                            <span className="mx-2">
                              Page {currentPage} of {totalPages}
                            </span>
                            <StyledButton
                              onClick={() => handleSearch(currentPage + 1)}
                              disabled={currentPage === totalPages || loading}
                              style={{
                                fontSize: "14px",
                                width: "80px",
                              }}
                            >
                              Next
                            </StyledButton>
                          </Col>
                        </Row>
                      )}
                    </div>
                  </div>
                }
              />
              <Route
                path="/album/:id"
                element={
                  <Suspense fallback={<div>Loading album details...</div>}>
                    <AlbumDetails />
                  </Suspense>
                }
              />
            </Routes>
          </Container>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;