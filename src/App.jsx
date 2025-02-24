import React, { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { FormControl, InputGroup, Container, Row, Col } from "react-bootstrap";
import { useDebounce } from "./hooks/useDebounce";
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

  const debouncedSearchInput = useDebounce(searchInput, 500);

  // Memoize the filtered albums
  const memoizedAlbums = useMemo(() => albums, [albums]);

  // Memoize the search handler
  const handleSearch = useCallback((page = 1) => {
    setSearchInitiated(true);
    search(debouncedSearchInput, page);
  }, [debouncedSearchInput, search]);

  // Effect to trigger search when debounced input changes
  useEffect(() => {
    if (debouncedSearchInput && searchInitiated) {
      handleSearch(1);
    }
  }, [debouncedSearchInput, handleSearch, searchInitiated]);

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
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Container>
                    <InputGroup>
                      <FormControl
                        placeholder="Search For Artist"
                        type="input"
                        aria-label="Search for an Artist"
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleSearch();
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
                      <StyledButton onClick={() => handleSearch()} disabled={loading}>
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
                      xs={1} // 1 column on extra small screens
                      sm={2} // 2 columns on small screens
                      md={3} // 3 columns on medium screens
                      lg={4} // 4 columns on large screens
                      xl={5} // 5 columns on extra large screens
                      style={{
                        justifyContent: "center", // Center items horizontally
                      }}
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
                      <Row
                        style={{
                          justifyContent: "center",
                          marginTop: "20px",
                          marginBottom: "20px",
                        }}
                      >
                        <StyledButton
                          onClick={() => handleSearch(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          style={{
                            marginRight: "10px",
                            fontSize: "14px",
                            width: "80px",
                          }} // Reduced font size and width
                        >
                          Previous
                        </StyledButton>
                        <span>
                          Page {currentPage} of {totalPages}
                        </span>
                        <StyledButton
                          onClick={() => handleSearch(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                          style={{
                            marginLeft: "10px",
                            fontSize: "14px",
                            width: "80px",
                          }} // Reduced font size and width
                        >
                          Next
                        </StyledButton>
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
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;