import { useState } from "react";

export const useSpotifySearch = (accessToken) => {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const albumsPerPage = 20; // You can adjust this value

  const search = async (searchInput, page = 1) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    try {
      if (!searchInput) {
        setAlbums([]);
        setError("Please enter an artist to search for.");
        setLoading(false);
        return;
      }

      let artistParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      // Get Artist
      const artistID = await fetch(
        "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
        artistParams
      )
        .then((result) => result.json())
        .then((data) => {
          if (!data.artists || data.artists.items.length === 0) {
            throw new Error("No artist found matching your search.");
          }
          return data.artists.items[0].id;
        });

      // Get Artist Albums
      const albumsResult = await fetch(
        `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=${albumsPerPage}&offset=${
          (page - 1) * albumsPerPage
        }`,
        artistParams
      );

      const albumsData = await albumsResult.json();

      if (!albumsResult.ok) {
        throw new Error(
          "Failed to fetch albums for this artist. Please try again."
        );
      }

      setAlbums(albumsData.items);
      // Assuming Spotify returns a total property in the response, if not, you might need to adjust this
      setTotalPages(Math.ceil(albumsData.total / albumsPerPage));
    } catch (err) {
      setError(err.message);
      setAlbums([]);
      console.error("Error during search:", err);
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
