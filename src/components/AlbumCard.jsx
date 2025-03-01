import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { BsPlayFill, BsSpotify, BsVolumeUp, BsClock } from 'react-icons/bs';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledCard = styled(Card)`
  background: var(--color-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition-default);
  height: 100%;
  position: relative;
  animation: ${fadeIn} 0.3s ease-out;

  &:hover {
    background: var(--color-card-hover);
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--shadow-lg);
    
    .card-overlay {
      opacity: 1;
    }

    .card-details {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  padding-bottom: 100%;
  overflow: hidden;
`;

const AlbumImage = styled(Card.Img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease-out;

  ${StyledCard}:hover & {
    transform: scale(1.1);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: 0;
  transition: var(--transition-default);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-md);
  class-name: card-overlay;
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-primary);
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-default);
  opacity: 0;
  
  ${StyledCard}:hover & {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }

  &:hover {
    background: var(--color-primary-hover);
    transform: translate(-50%, -50%) scale(1.2);
  }

  svg {
    color: black;
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const CardBody = styled(Card.Body)`
  position: relative;
  z-index: 1;
  padding: var(--space-md);
`;

const AlbumTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ArtistName = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
  color: var(--color-text-secondary);
  font-size: 0.75rem;

  svg {
    font-size: 0.9rem;
  }
`;

const SpotifyButton = styled.a`
  position: absolute;
  bottom: var(--space-md);
  right: var(--space-md);
  background: var(--color-primary);
  color: black;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-default);
  opacity: 0;
  transform: translateY(10px);
  text-decoration: none;

  ${StyledCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    background: var(--color-primary-hover);
    transform: scale(1.1);
    color: black;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const AlbumCard = ({ album }) => {
  const releaseYear = new Date(album.release_date).getFullYear();
  
  return (
    <Link to={`/album/${album.id}`} style={{ textDecoration: 'none' }}>
      <StyledCard>
        <ImageWrapper>
          <AlbumImage src={album.images[0]?.url} alt={album.name} />
          <Overlay>
            <PlayButton aria-label="Play album preview">
              <BsPlayFill />
            </PlayButton>
          </Overlay>
        </ImageWrapper>
        <CardBody>
          <AlbumTitle title={album.name}>{album.name}</AlbumTitle>
          <ArtistName title={album.artists?.map(artist => artist.name).join(', ')}>
            {album.artists?.map(artist => artist.name).join(', ')}
          </ArtistName>
          <MetaInfo>
            <span><BsClock /> {releaseYear}</span>
            {album.total_tracks && (
              <span><BsVolumeUp /> {album.total_tracks} tracks</span>
            )}
          </MetaInfo>
          {album.external_urls?.spotify && (
            <SpotifyButton 
              href={album.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.preventDefault()}
              title="Open in Spotify"
            >
              <BsSpotify />
            </SpotifyButton>
          )}
        </CardBody>
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
    total_tracks: PropTypes.number,
    external_urls: PropTypes.shape({
      spotify: PropTypes.string,
    }),
  }).isRequired,
};

export default AlbumCard;
