const BASE_URL = 'https://api.spotify.com/v1';

class SpotifyService {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
  }

  setAccessToken(token) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async searchArtist(searchInput) {
    const response = await fetch(
      `${BASE_URL}/search?q=${searchInput}&type=artist`,
      { headers: this.getHeaders() }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to search artist');
    return data;
  }

  async getArtistAlbums(artistId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const response = await fetch(
      `${BASE_URL}/artists/${artistId}/albums?include_groups=album&market=US&limit=${limit}&offset=${offset}`,
      { headers: this.getHeaders() }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch albums');
    return data;
  }

  async getAlbumDetails(albumId) {
    const response = await fetch(
      `${BASE_URL}/albums/${albumId}?market=US`,
      { headers: this.getHeaders() }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch album details');
    return data;
  }

  async getAlbumTracks(albumId) {
    const response = await fetch(
      `${BASE_URL}/albums/${albumId}/tracks`,
      { headers: this.getHeaders() }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch album tracks');
    return data;
  }

  async getSearchSuggestions(query, type = 'artist') {
    if (!query.trim()) return [];
    
    const response = await fetch(
      `${BASE_URL}/search?q=${query}&type=${type}&limit=5`,
      { headers: this.getHeaders() }
    );
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch suggestions');
    
    return type === 'artist' ? data.artists.items : data.albums.items;
  }

  async searchByType(query, type = 'artist', page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const response = await fetch(
      `${BASE_URL}/search?q=${query}&type=${type}&limit=${limit}&offset=${offset}`,
      { headers: this.getHeaders() }
    );
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error?.message || 'Failed to search');
    
    return type === 'artist' ? data.artists : data.albums;
  }
}

export default new SpotifyService();
