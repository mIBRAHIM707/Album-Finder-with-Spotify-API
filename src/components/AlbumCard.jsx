import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import LazyImage from './LazyImage';

const AlbumCard = ({ album }) => {
  return (
    <Card
      style={{
        backgroundColor: "white",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "200px",
      }}
    >
      <Link to={`/album/${album.id}`}>
        <LazyImage
          src={album.images[0].url}
          alt={album.name}
          style={{
            borderRadius: "4%",
            width: "100%",
            objectFit: "cover",
          }}
        />
      </Link>
      <Card.Body style={{ textAlign: "center" }}>
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
          }}
        >
          {album.name}
        </Card.Title>
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
