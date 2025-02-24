import React, { useState, useEffect, Suspense, useMemo } from "react";
import { FormControl, InputGroup, Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StyledButton from "./components/StyledButton";
import ErrorBoundary from "./components/ErrorBoundary";
import spotifyApi from './services/spotifyApi';
import { useSpotifySearch } from "./hooks/useSpotifySearch";
import AlbumSkeleton from "./components/AlbumSkeleton";
import ErrorMessage from "./components/ErrorMessage";

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

  // Memoize the filtered albums
  const memoizedAlbums = useMemo(() => albums, [albums]);

  // Remove the debounced search input since we want immediate search on button click
  const handleSearch = (page = 1) => {
    if (!searchInput.trim()) return;
    setSearchInitiated(true);
    search(searchInput, page);
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
        <Container fluid className="d-flex flex-column align-items-center py-5">
          <Routes>
            <Route
              path="/"
              element={
                <Container className="p-0" style={{ maxWidth: '1400px' }}>
                  {/* Search Bar Section */}
                  <Row className="justify-content-center mb-4">
                    <Col xs={12} sm={8} md={6} lg={5} xl={4}>
                      <InputGroup>
                        <FormControl
                          placeholder="Search For Artist"
                          type="input"
                          aria-label="Search for an Artist"
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              handleSearch(1);
                            }
                          }}
                          onChange={(event) => setSearchInput(event.target.value)}
                          style={{
                            height: "35px",
                            borderWidth: "0px",
                            borderStyle: "solid",
                            borderRadius: "5px",
                            marginRight: "10px",
                            paddingLeft: "10px",
                          }}
                        />
                        <StyledButton 
                          onClick={() => handleSearch(1)} 
                          disabled={loading || !searchInput.trim()}
                        >
                          {loading ? "Searching..." : "Search"}
                        </StyledButton>
                      </InputGroup>
                    </Col>
                  </Row>

                  {/* Error Message */}
                  {error && <ErrorMessage message={error} />}

                  {/* Albums Grid */}
                  <Row 
                    xs={1} 
                    sm={2} 
                    md={3} 
                    lg={4} 
                    xl={5} 
                    className="g-4 justify-content-center"
                  >
                    {loading && searchInitiated ? (
                      skeletons.map((_, index) => (
                        <Col key={index}>
                          <AlbumSkeleton />
                        </Col>
                      ))
                    ) : memoizedAlbums.length === 0 && !error && searchInitiated ? (
                      <Col xs={12} className="text-center py-5">
                        <div className="w-100">
                          <h4 className="mb-3">No albums found</h4>
                          <p className="text-muted">Try searching for a different artist</p>
                        </div>
                      </Col>
                    ) : (
                      memoizedAlbums.map((album) => (
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
                </Container>
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
      </ErrorBoundary>
    </Router>
  );
}

export default App;