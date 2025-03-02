const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

class SpotifyApi {
  constructor() {
    this.baseUrl = SPOTIFY_API_BASE;
  }

  getAccessToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found. Please authenticate.');
    }
    return token;
  }

  async handleApiError(response) {
    const error = await response.json();
    
    if (response.status === 401) {
      // Token expired, clear it
      localStorage.removeItem('accessToken');
      throw new Error('Session expired. Please refresh the page.');
    }
    
    throw new Error(error.error?.message || 'An unexpected error occurred');
  }

  async makeApiRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        await this.handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async search(query, type, page = 1) {
    const offset = (page - 1) * 20;
    const searchType = type === 'artist' ? 'artist' : 'album';
    
    const data = await this.makeApiRequest(
      `/search?q=${encodeURIComponent(query)}&type=${searchType}&offset=${offset}&limit=20`
    );

    return {
      items: data[`${searchType}s`]?.items || [],
      total: data[`${searchType}s`]?.total || 0,
      offset,
      limit: 20
    };
  }

  async getAlbum(albumId) {
    return await this.makeApiRequest(`/albums/${albumId}`);
  }

  async getArtist(artistId) {
    return await this.makeApiRequest(`/artists/${artistId}`);
  }

  async getArtistAlbums(artistId) {
    return await this.makeApiRequest(
      `/artists/${artistId}/albums?include_groups=album,single&market=US&limit=50`
    );
  }

  async getAlbumTracks(albumId) {
    return await this.makeApiRequest(`/albums/${albumId}/tracks?limit=50`);
  }

  async getTrackPreview(trackId) {
    return await this.makeApiRequest(`/tracks/${trackId}`);
  }
}

// Create and export a singleton instance
const spotifyApi = new SpotifyApi();
export default spotifyApi;
