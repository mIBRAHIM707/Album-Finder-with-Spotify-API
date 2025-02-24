import React, { useState, useEffect } from 'react';
import { Card, Image } from 'react-bootstrap';
import spotifyApi from '../services/spotifyApi';

const ArtistInfo = ({ artistId }) => {
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}`,
          { headers: spotifyApi.getHeaders() }
        );
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error('Error fetching artist:', error);
      }
    };

    if (artistId) fetchArtistInfo();
  }, [artistId]);

  if (!artist) return null;

  return (
    <Card className="mb-4">
      <Card.Body className="d-flex align-items-center">
        <Image 
          src={artist.images[0]?.url} 
          roundedCircle 
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          className="me-3"
        />
        <div>
          <h5>{artist.name}</h5>
          <div>
            <small className="text-muted">
              {artist.followers.total.toLocaleString()} followers
            </small>
          </div>
          <div className="mt-2">
            {artist.genres.map(genre => (
              <span key={genre} className="badge bg-secondary me-1">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArtistInfo;
