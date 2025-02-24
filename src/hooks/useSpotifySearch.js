import { useState } from "react";
import spotifyApi from '../services/spotifyApi';

export const useSpotifySearch = (accessToken) => {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const albumsPerPage = 20; // You can adjust this value

  const search = async (searchInput, searchType = 'artist', page = 1) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    
    try {
      if (!searchInput.trim()) {
        setAlbums([]);
        setError("Please enter a search term");
        return;
      }

      if (searchType === 'album') {
        const result = await spotifyApi.searchByType(searchInput, 'album', page);
        setAlbums(result.items);
        setTotalPages(Math.ceil(result.total / 20));
      } else {
        // Existing artist search logic
        const artistID = await spotifyApi.searchByType(searchInput, 'artist')
          .then(data => {
            if (!data.items.length) throw new Error("No artist found");
            return data.items[0].id;
          });

        const albumsData = await spotifyApi.getArtistAlbums(artistID, page);
        setAlbums(albumsData.items);
        setTotalPages(Math.ceil(albumsData.total / 20));
      }
    } catch (err) {
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
