import React from 'react';
import { Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import LazyImage from './LazyImage';

const AlbumCard = ({ album }) => {
  return (
    <Card className="album-card h-100">
      <Link 
        to={`/album/${album.id}`}
        className="position-relative d-block"
        style={{ textDecoration: 'none' }}
      >
        <img
          src={album.images[0].url}
          alt={album.name}
          className="card-img-top"
          style={{
            width: '100%',
            aspectRatio: '1/1',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(35, 45, 63, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '0',
            transition: 'opacity 0.3s',
            pointerEvents: 'none' // This stops it from interfering with click events
          }}
        >
          <i className="fas fa-play-circle" style={{ color: 'var(--color-primary)', fontSize: '3rem' }}></i>
        </div>
      </Link>
      <Card.Body className="p-3 d-flex flex-column">
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${album.id}`}>{album.name}</Tooltip>}
        >
          <Card.Title className="album-title text-white mb-2 text-truncate">
            {album.name}
          </Card.Title>
        </OverlayTrigger>
        <Card.Text className="text-muted small mb-3">
          {new Date(album.release_date).getFullYear()}
        </Card.Text>
        <Button
          href={album.external_urls.spotify}
          className="mt-auto spotify-button"
          variant="dark"
          size="sm"
        >
          Open in Spotify
        </Button>
      </Card.Body>
    </Card>
  );
};

AlbumCard.propTypes = {
  album: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
    release_date: PropTypes.string.isRequired,
    external_urls: PropTypes.shape({
      spotify: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AlbumCard;
