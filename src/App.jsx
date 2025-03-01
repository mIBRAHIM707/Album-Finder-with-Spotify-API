import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AlbumDetails from "./AlbumDetails";
import EnhancedSearch from "./components/EnhancedSearch";
import AlbumCard from "./components/AlbumCard";
import ArtistCard from "./components/ArtistCard";
import spotifyApi from "./services/spotifyApi";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

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

  const renderResults = () => {
    if (loading) {
      return <div className="text-center">Loading...</div>;
    }

    if (error) {
      return <div className="text-center text-danger">Error: {error}</div>;
    }

    if (!searchResults.length) {
      return <div className="text-center">No results found.</div>;
    }

    return (
      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        {searchResults.map((item) => (
          <Col key={item.id}>
            {searchType === 'album' ? (
              <AlbumCard album={item} />
            ) : (
              <ArtistCard artist={item} onSelect={() => handleArtistSelect(item.id)} />
            )}
          </Col>
        ))}
      </Row>
    );
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
      <Routes>
        <Route
          path="/"
          element={
            <Container>
              <EnhancedSearch 
                onSearch={handleSearch}
                loading={loading}
              />
              {renderResults()}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button
                    className="btn btn-primary"
                    disabled={currentPage === 1 || loading}
                    onClick={() => handleSearch(currentQuery, searchType, currentPage - 1)}
                  >
                    Previous
                  </button>
                  <span className="align-self-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-primary"
                    disabled={currentPage === totalPages || loading}
                    onClick={() => handleSearch(currentQuery, searchType, currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </Container>
          }
        />
        <Route path="/album/:id" element={<AlbumDetails />} />
      </Routes>
    </Router>
  );
}

export default App;