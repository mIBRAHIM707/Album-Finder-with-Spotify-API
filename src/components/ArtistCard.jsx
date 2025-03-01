import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { BsPeople, BsSpotify, BsCollection } from 'react-icons/bs';

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
  padding-bottom: 100%;
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
  padding: var(--space-md);
  position: relative;
`;

const ArtistName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 var(--space-xs);
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const GenreContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: var(--space-sm);
`;

const Genre = styled.span`
  background: var(--color-surface);
  color: var(--color-text-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  transition: var(--transition-default);

  &:hover {
    background: var(--color-primary);
    color: black;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  opacity: 0;
  transform: translateY(10px);
  transition: var(--transition-default);
  class-name: meta-info;

  svg {
    font-size: 0.9rem;
  }
`;

const SpotifyButton = styled.a`
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: var(--color-primary);
  color: black;
  border: none;
  width: 32px;
  height: 32px;
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

const Popularity = styled.div`
  position: absolute;
  top: var(--space-md);
  left: var(--space-md);
  background: rgba(0, 0, 0, 0.7);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
  opacity: 0;
  transform: translateX(-10px);
  transition: var(--transition-default);

  ${StyledCard}:hover & {
    opacity: 1;
    transform: translateX(0);
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
              {artist.popularity && (
                <span><BsCollection /> {artist.popularity}% popularity</span>
              )}
            </MetaInfo>
          )}
        </Overlay>
      </ImageContainer>
      <CardContent>
        <ArtistName title={artist.name}>{artist.name}</ArtistName>
        <GenreContainer>
          {artist.genres?.slice(0, 3).map((genre) => (
            <Genre key={genre}>{genre}</Genre>
          ))}
        </GenreContainer>
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
        {artist.popularity && (
          <Popularity>
            {artist.popularity}% Popular
          </Popularity>
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
    genres: PropTypes.arrayOf(PropTypes.string),
    followers: PropTypes.shape({
      total: PropTypes.number,
    }),
    popularity: PropTypes.number,
    external_urls: PropTypes.shape({
      spotify: PropTypes.string,
    }),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ArtistCard;