import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import spotifyApi from '../services/spotifyApi';

const RelatedAlbums = ({ artistId, currentAlbumId }) => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchRelatedAlbums = async () => {
      try {
        const data = await spotifyApi.getArtistAlbums(artistId);
        setAlbums(data.items.filter(album => album.id !== currentAlbumId).slice(0, 4));
      } catch (error) {
        console.error('Error fetching related albums:', error);
      }
    };

    if (artistId) fetchRelatedAlbums();
  }, [artistId, currentAlbumId]);

  if (!albums.length) return null;

  return (
    <div className="mt-4">
      <h4>More from this Artist</h4>
      <Row xs={2} md={4} className="g-4">
        {albums.map(album => (
          <Col key={album.id}>
            <Link to={`/album/${album.id}`} style={{ textDecoration: 'none' }}>
              <Card>
                <Card.Img variant="top" src={album.images[0].url} />
                <Card.Body>
                  <Card.Title className="text-truncate">{album.name}</Card.Title>
                  <small className="text-muted">{album.release_date.split('-')[0]}</small>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RelatedAlbums;
