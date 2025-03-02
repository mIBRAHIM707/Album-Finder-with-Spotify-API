import "./App.css";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import AlbumDetails from "./AlbumDetails";
import Header from './components/Header';
import HomePage from './components/HomePage';
import SearchResultsView from './components/SearchResultsView';
import ArtistDetails from './components/ArtistDetails';

function App() {
  const [accessToken, setAccessToken] = useState("");
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

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

        const result = await fetch("https://accounts.spotify.com/api/token", authParams);
        const data = await result.json();
        
        if (!result.ok) {
          throw new Error(data.error_description || "Failed to fetch access token");
        }
        
        setAccessToken(data.access_token);
        localStorage.setItem("accessToken", data.access_token);
      } catch (err) {
        console.error("Token fetch error:", err);
      }
    };

    getAccessToken();
  }, [clientId, clientSecret]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsView />} />
        <Route path="/album/:id" element={<AlbumDetails />} />
        <Route path="/artist/:id" element={<ArtistDetails />} />
        <Route 
          path="/favorites" 
          element={
            <Container className="py-5 mt-5">
              <h2>My Favorites</h2>
              <p className="text-muted">Coming soon...</p>
            </Container>
          } 
        />
        <Route 
          path="/history" 
          element={
            <Container className="py-5 mt-5">
              <h2>Search History</h2>
              <p className="text-muted">Coming soon...</p>
            </Container>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;