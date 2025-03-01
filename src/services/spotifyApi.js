// Change BASE_URL to use the proxy
const BASE_URL = '/api';

class SpotifyService {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
  }

  setAccessToken(token) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  getHeaders() {
    const token = this.accessToken || localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token available');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async handleResponse(response, errorMessage) {
    const data = await response.json();
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error
      });
      throw new Error(data.error?.message || errorMessage);
    }
    return data;
  }

  async searchArtist(searchInput) {
    const response = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(searchInput)}&type=artist`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response, 'Failed to search artist');
  }

  async getArtistAlbums(artistId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const response = await fetch(
      `${BASE_URL}/artists/${artistId}/albums?include_groups=album&market=US&limit=${limit}&offset=${offset}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response, 'Failed to fetch albums');
  }

  async getAlbumDetails(albumId) {
    const response = await fetch(
      `${BASE_URL}/albums/${albumId}?market=US`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response, 'Failed to fetch album details');
  }

  async getAlbumTracks(albumId) {
    const response = await fetch(
      `${BASE_URL}/albums/${albumId}/tracks`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse(response, 'Failed to fetch album tracks');
  }

  async getSearchSuggestions(query, type = 'artist') {
    if (!query.trim()) return [];
    
    const response = await fetch(
      `${BASE_URL}/search?q=${query}&type=${type}&limit=5`,
      { headers: this.getHeaders() }
    );
    const data = await this.handleResponse(response, 'Failed to fetch suggestions');
    
    return type === 'artist' ? data.artists.items : data.albums.items;
  }

  async searchByType(query, type = 'artist', page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const response = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}&offset=${offset}`,
      { headers: this.getHeaders() }
    );
    const data = await this.handleResponse(response, 'Failed to search');
    return type === 'artist' ? data.artists : data.albums;
  }
}

export default new SpotifyService();
