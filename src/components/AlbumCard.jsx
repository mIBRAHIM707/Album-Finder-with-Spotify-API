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
        className="album-image-container"
      >
        <LazyImage
          src={album.images[0].url}
          alt={album.name}
          className="album-image"
        />
        <div className="album-overlay">
          <i className="fas fa-play-circle"></i>
        </div>
      </Link>
      <Card.Body style={{ textAlign: "center", width: '100%' }}>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${album.id}`}>{album.name}</Tooltip>}
        >
          <Card.Title
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: "bold",
              fontSize: "18px",
              marginTop: "10px",
              color: "black",
              maxWidth: "180px",
              cursor: 'pointer',
            }}
          >
            {album.name}
          </Card.Title>
        </OverlayTrigger>
        <Card.Text style={{ color: "black" }}>
          Release Date: <br /> {album.release_date}
        </Card.Text>
        <Button
          href={album.external_urls.spotify}
          style={{
            backgroundColor: "black",
            color: "white",
            fontWeight: "bold",
            fontSize: "15px",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          Album Link
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
