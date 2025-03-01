import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ArtistCard = ({ artist, onSelect }) => {
  return (
    <Card 
      className="h-100 artist-card" 
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      <Card.Img
        variant="top"
        src={artist.images[0]?.url || '/placeholder.jpg'}
        alt={artist.name}
        style={{
          height: '200px',
          objectFit: 'cover',
          borderTopLeftRadius: 'var(--radius-md)',
          borderTopRightRadius: 'var(--radius-md)',
        }}
      />
      <Card.Body>
        <Card.Title className="text-truncate mb-2">{artist.name}</Card.Title>
        {artist.genres?.length > 0 && (
          <div className="d-flex flex-wrap gap-1">
            {artist.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="badge bg-secondary"
                style={{ fontSize: '0.7rem' }}
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        <div className="mt-2">
          <small className="text-muted">
            {artist.followers?.total?.toLocaleString()} followers
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

ArtistCard.propTypes = {
  artist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ),
    genres: PropTypes.arrayOf(PropTypes.string),
    followers: PropTypes.shape({
      total: PropTypes.number,
    }),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ArtistCard;