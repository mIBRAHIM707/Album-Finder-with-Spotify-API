const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

class SpotifyApi {
  constructor() {
    this.baseUrl = SPOTIFY_API_BASE;
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  async search(query, type, page = 1) {
    const offset = (page - 1) * 20; // 20 items per page
    const searchType = type === 'artist' ? 'artist' : 'album';
    
    try {
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=${searchType}&offset=${offset}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch search results');
      }

      const data = await response.json();
      const items = data[`${searchType}s`]?.items || [];
      const total = data[`${searchType}s`]?.total || 0;

      return {
        items,
        total,
        offset,
        limit: 20
      };
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search. Please try again later.');
    }
  }

  async getAlbum(albumId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/albums/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch album details');
      }

      return await response.json();
    } catch (error) {
      console.error('Get album error:', error);
      throw new Error('Failed to fetch album details. Please try again later.');
    }
  }

  async getArtist(artistId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/artists/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch artist details');
      }

      return await response.json();
    } catch (error) {
      console.error('Get artist error:', error);
      throw new Error('Failed to fetch artist details. Please try again later.');
    }
  }

  async getArtistAlbums(artistId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch artist albums');
      }

      return await response.json();
    } catch (error) {
      console.error('Get artist albums error:', error);
      throw new Error('Failed to fetch artist albums. Please try again later.');
    }
  }
}

// Create and export a singleton instance
const spotifyApi = new SpotifyApi();
export default spotifyApi;
