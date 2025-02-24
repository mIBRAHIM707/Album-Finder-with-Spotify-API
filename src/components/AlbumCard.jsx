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
        style={{ textDecoration: 'none' }}
      >
        <div className="position-relative">
          <img
            src={album.images[0].url}
            alt={album.name}
            className="card-img-top"
            style={{
              width: '100%',
              aspectRatio: '1/1',
              objectFit: 'cover',
            }}
          />
          <div className="album-overlay">
            <i className="fas fa-play-circle"></i>
          </div>
        </div>
      </Link>
      <Card.Body className="p-3 d-flex flex-column">
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${album.id}`}>{album.name}</Tooltip>}
        >
          <Card.Title className="album-title text-white mb-2">
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
