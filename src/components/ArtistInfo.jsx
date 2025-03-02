import React from 'react';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';
import { BsPeopleFill, BsSpotify } from 'react-icons/bs';
import PropTypes from 'prop-types';

const InfoCard = styled(Card)`
  background: var(--color-card);
  border: none;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition-default);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const ArtistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
`;

const ArtistImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: var(--radius-md);
  object-fit: cover;
  box-shadow: var(--shadow-md);
`;

const ArtistDetails = styled.div`
  flex: 1;
`;

const ArtistName = styled.h3`
  margin: 0 0 var(--space-xs);
  color: var(--color-text);
  font-weight: 700;
`;

const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
`;

const Genre = styled.span`
  background: var(--color-surface);
  color: var(--color-text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  color: var(--color-text-secondary);
  font-size: 0.9rem;

  svg {
    margin-right: var(--space-xs);
  }
`;

const SpotifyButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: black;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: var(--transition-default);
  margin-top: var(--space-md);

  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
    color: black;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const ArtistInfo = ({ artist }) => {
  if (!artist) return null;

  return (
    <InfoCard>
      <Card.Body>
        <ArtistHeader>
          <ArtistImage src={artist.images[0]?.url} alt={artist.name} />
          <ArtistDetails>
            <ArtistName>{artist.name}</ArtistName>
            <GenresList>
              {artist.genres?.slice(0, 5).map((genre) => (
                <Genre key={genre}>{genre}</Genre>
              ))}
            </GenresList>
            <Stats>
              <span>
                <BsPeopleFill /> {artist.followers?.total?.toLocaleString()} followers
              </span>
            </Stats>
            <SpotifyButton 
              href={artist.external_urls?.spotify} 
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsSpotify /> Open in Spotify
            </SpotifyButton>
          </ArtistDetails>
        </ArtistHeader>
      </Card.Body>
    </InfoCard>
  );
};

ArtistInfo.propTypes = {
  artist: PropTypes.shape({
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
    external_urls: PropTypes.shape({
      spotify: PropTypes.string,
    }),
  }).isRequired,
};

export default ArtistInfo;
