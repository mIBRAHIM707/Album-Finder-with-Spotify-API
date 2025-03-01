import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BsPlayFill } from 'react-icons/bs';

const StyledCard = styled(Card)`
  background: var(--color-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition-default);
  height: 100%;

  &:hover {
    background: var(--color-card-hover);
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    
    .card-img-overlay {
      opacity: 1;
    }
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition-default);

  .play-icon {
    color: var(--color-primary);
    font-size: 3rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
`;

const AlbumImage = styled(Card.Img)`
  aspect-ratio: 1;
  object-fit: cover;
  transition: var(--transition-default);
`;

const AlbumTitle = styled(Card.Title)`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text);
`;

const ArtistName = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0.25rem 0;
`;

const ReleaseYear = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const AlbumCard = ({ album }) => {
  const releaseYear = new Date(album.release_date).getFullYear();
  
  return (
    <Link to={`/album/${album.id}`} style={{ textDecoration: 'none' }}>
      <StyledCard>
        <div style={{ position: 'relative' }}>
          <AlbumImage variant="top" src={album.images[0]?.url} alt={album.name} />
          <ImageOverlay className="card-img-overlay">
            <BsPlayFill className="play-icon" />
          </ImageOverlay>
        </div>
        <Card.Body>
          <AlbumTitle>{album.name}</AlbumTitle>
          <ArtistName>
            {album.artists?.map(artist => artist.name).join(', ')}
          </ArtistName>
          <ReleaseYear>{releaseYear}</ReleaseYear>
        </Card.Body>
      </StyledCard>
    </Link>
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
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    release_date: PropTypes.string.isRequired,
  }).isRequired,
};

export default AlbumCard;
