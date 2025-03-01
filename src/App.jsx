import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AlbumDetails from "./AlbumDetails";
import EnhancedSearch from "./components/EnhancedSearch";
import AlbumCard from "./components/AlbumCard";
import ArtistCard from "./components/ArtistCard";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import Pagination from "./components/Pagination";
import spotifyApi from "./services/spotifyApi";
import styled from "styled-components";
import Header from './components/Header';
import CardSkeleton from './components/CardSkeleton';

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

const AppContainer = styled.div`
  min-height: 100vh;
  padding: var(--space-md) 0;
`;

const ResultsContainer = styled.div`
  margin-top: var(--space-lg);
`;

const ResultsGrid = styled(Row)`
  margin: var(--space-lg) -12px;
`;

const NoResults = styled.div`
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--space-xl) 0;
`;

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchType, setSearchType] = useState('artist');
  const [currentQuery, setCurrentQuery] = useState('');

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

        const result = await fetch("/api/token", authParams);
        const data = await result.json();
        
        if (!result.ok) {
          throw new Error(data.error_description || "Failed to fetch access token");
        }
        
        console.log("Token received successfully");
        setAccessToken(data.access_token);
        spotifyApi.setAccessToken(data.access_token);
        localStorage.setItem("accessToken", data.access_token);
      } catch (err) {
        console.error("Token fetch error:", err);
        setError(err.message);
      }
    };

    getAccessToken();
  }, []);

  const handleSearch = async (query, type, page = 1) => {
    if (!query?.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearchType(type);
    setCurrentQuery(query);
    
    try {
      const results = await spotifyApi.searchByType(query, type, page);
      console.log('Search results:', results);
      
      setSearchResults(results.items || []);
      setTotalPages(Math.ceil((results.total || 0) / 20));
      setCurrentPage(page);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleArtistSelect = async (artistId) => {
    setLoading(true);
    try {
      const albumsData = await spotifyApi.getArtistAlbums(artistId);
      setSearchResults(albumsData.items);
      setSearchType('album');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <AppContainer>
              <Container>
                <EnhancedSearch 
                  onSearch={handleSearch}
                  loading={loading}
                />
                <ResultsContainer>
                  {loading ? (
                    <ResultsGrid xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                      {[...Array(8)].map((_, index) => (
                        <Col key={index}>
                          <CardSkeleton type={searchType} />
                        </Col>
                      ))}
                    </ResultsGrid>
                  ) : error ? (
                    <ErrorMessage message={error} />
                  ) : searchResults.length === 0 ? (
                    <NoResults>No results found. Try searching for something else.</NoResults>
                  ) : (
                    <>
                      <ResultsGrid xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                        {searchResults.map((item) => (
                          <Col key={item.id}>
                            {searchType === 'album' ? (
                              <AlbumCard album={item} />
                            ) : (
                              <ArtistCard artist={item} onSelect={() => handleArtistSelect(item.id)} />
                            )}
                          </Col>
                        ))}
                      </ResultsGrid>
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={(page) => handleSearch(currentQuery, searchType, page)}
                          isLoading={loading}
                        />
                      )}
                    </>
                  )}
                </ResultsContainer>
              </Container>
            </AppContainer>
          }
        />
        <Route path="/album/:id" element={<AlbumDetails />} />
        <Route 
          path="/favorites" 
          element={
            <AppContainer>
              <Container>
                <h2 className="mb-4">My Favorites</h2>
                <p className="text-muted">Coming soon...</p>
              </Container>
            </AppContainer>
          } 
        />
        <Route 
          path="/history" 
          element={
            <AppContainer>
              <Container>
                <h2 className="mb-4">Search History</h2>
                <p className="text-muted">Coming soon...</p>
              </Container>
            </AppContainer>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;