import { useState } from "react";
import spotifyApi from '../services/spotifyApi';

export const useSpotifySearch = (accessToken) => {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const search = async (searchInput, page = 1) => {
    if (!searchInput?.trim()) {
      setAlbums([]);
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentPage(page);
    
    try {
      if (!accessToken) {
        throw new Error('No access token available');
      }

      spotifyApi.setAccessToken(accessToken);
      
      const result = await spotifyApi.searchByType(searchInput, 'artist', page);
      console.log('Search result:', result);
      
      setAlbums(result.items || []);
      setTotalPages(Math.ceil((result.total || 0) / 20));
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    albums,
    error,
    search,
    loading,
    currentPage,
    totalPages,
    setCurrentPage,
  };
};
