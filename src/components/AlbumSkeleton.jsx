import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';

const AlbumSkeleton = () => {
  return (
    <Card style={{ width: '100%', minWidth: '200px', height: '350px' }}>
      <Placeholder animation="glow">
        <Placeholder xs={12} style={{ height: '200px', borderRadius: '4%' }} />
      </Placeholder>
      <Card.Body>
        <Placeholder animation="glow">
          <Placeholder xs={8} size="lg" className="mb-3" />
          <Placeholder xs={6} className="mb-3" />
          <Placeholder.Button variant="dark" xs={6} />
        </Placeholder>
      </Card.Body>
    </Card>
  );
};

export default AlbumSkeleton;
