import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { BsPeople, BsSpotify } from 'react-icons/bs';

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
  cursor: pointer;
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--shadow-lg);

    .artist-image {
      transform: scale(1.1);
    }

    .overlay {
      opacity: 1;
    }

    .meta-info {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  padding-bottom: 100%; // Changed back to 100% for full square image
  overflow: hidden;
`;

const ArtistImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease-out;
  class-name: artist-image;
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
  class-name: overlay;
`;

const CardContent = styled(Card.Body)`
  padding: var(--space-xs) var(--space-md); // Reduced padding
  position: relative;
  min-height: 50px; // Reduced minimum height
`;

const ArtistName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  color: var(--color-text-secondary);
  font-size: 0.75rem; // Reduced font size
  opacity: 0;
  transform: translateY(10px);
  transition: var(--transition-default);
  class-name: meta-info;

  svg {
    font-size: 0.8rem;
  }
`;

const SpotifyButton = styled.a`
  position: absolute;
  top: var(--space-sm); // Reduced spacing
  right: var(--space-sm); // Reduced spacing
  background: var(--color-primary);
  color: black;
  border: none;
  width: 28px; // Reduced size
  height: 28px; // Reduced size
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-default);
  opacity: 0;
  transform: translateY(-10px);
  z-index: 2;

  ${StyledCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    background: var(--color-primary-hover);
    transform: scale(1.1);
    color: black;
  }
`;

const ArtistCard = ({ artist, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <StyledCard 
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImageContainer>
        <ArtistImage
          src={artist.images[0]?.url || '/placeholder.jpg'}
          alt={artist.name}
        />
        <Overlay>
          {isHovered && (
            <MetaInfo>
              <span><BsPeople /> {artist.followers?.total?.toLocaleString()} followers</span>
            </MetaInfo>
          )}
        </Overlay>
      </ImageContainer>
      <CardContent>
        <ArtistName title={artist.name}>{artist.name}</ArtistName>
        {artist.external_urls?.spotify && (
          <SpotifyButton 
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open in Spotify"
          >
            <BsSpotify />
          </SpotifyButton>
        )}
      </CardContent>
    </StyledCard>
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
    followers: PropTypes.shape({
      total: PropTypes.number,
    }),
    external_urls: PropTypes.shape({
      spotify: PropTypes.string,
    }),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ArtistCard;