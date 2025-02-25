import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';

const AlbumSkeleton = () => {
  return (
    <Card className="album-card skeleton-card h-100">
      <div className="skeleton-image loading-skeleton"></div>
      <Card.Body>
        <Placeholder as={Card.Title} animation="wave">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="wave">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder.Button variant="primary" className="skeleton-button loading-skeleton" />
      </Card.Body>
    </Card>
  );
};

export default AlbumSkeleton;
