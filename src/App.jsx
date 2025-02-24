import React, { useState, useEffect, Suspense, useMemo } from "react";
import { FormControl, InputGroup, Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StyledButton from "./components/StyledButton";
import ErrorBoundary from "./components/ErrorBoundary";
import spotifyApi from './services/spotifyApi';
import { useSpotifySearch } from "./hooks/useSpotifySearch";

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

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Container className="d-flex flex-column align-items-center">
                  <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
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
                        width: "300px",
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
                </Container>
                {error && (
                  <div style={{ color: "red", textAlign: "center" }}>
                    Error: {error}
                  </div>
                )}
                <Container>
                  <Row
                    xs={1}
                    sm={2}
                    md={3}
                    lg={4}
                    xl={5}
                    className="g-4 justify-content-center"
                  >
                    {loading && searchInitiated ? (
                      <div style={{ textAlign: "center", color: "black" }}>
                        Loading...
                      </div>
                    ) : memoizedAlbums.length === 0 && !error && searchInitiated ? (
                      <div style={{ textAlign: "center", color: "black" }}>
                        No albums found.
                      </div>
                    ) : (
                      memoizedAlbums.map((album) => (
                        <Col key={album.id} style={{ marginBottom: "20px" }}>
                          <AlbumCard album={album} />
                        </Col>
                      ))
                    )}
                  </Row>
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
              </>
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
      </ErrorBoundary>
    </Router>
  );
}

export default App;