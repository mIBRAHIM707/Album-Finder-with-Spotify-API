import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import spotifyApi from './services/spotifyApi';

// Lazy load components
const TrackList = React.lazy(() => import('./components/TrackList'));
const RelatedAlbums = React.lazy(() => import('./components/RelatedAlbums'));

const AlbumContainer = styled(Container)`
  margin-top: 80px;
  padding: var(--space-xl) var(--space-md);
`;

const AlbumHeader = styled.div`
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AlbumCover = styled.img`
  width: 350px;
  height: 350px;
  object-fit: cover;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);

  @media (max-width: 768px) {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }
`;

const AlbumInfo = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 300px;

  @media (max-width: 768px) {
    height: auto;
    text-align: center;
    align-items: center;
  }
`;

const AlbumTitle = styled.h1`
  color: var(--color-text);
  margin-bottom: var(--space-xs);
  font-size: 2.5rem;
  font-weight: 700;
`;

const AlbumMeta = styled.div`
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
`;

const SpotifyButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: black;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-pill);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-default);
  align-self: center; /* Changed from flex-start to center */

  @media (max-width: 768px) {
    align-self: center;
  }

  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
    color: black;
  }
`;

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlbumDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await spotifyApi.getAlbum(id);
      setAlbum(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        await fetchAlbumDetails();
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [fetchAlbumDetails]);

  if (loading) {
    return <LoadingSpinner message="Loading album details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!album) {
    return <ErrorMessage message="Album not found" />;
  }

  const releaseYear = new Date(album.release_date).getFullYear();
  const artistNames = album.artists.map(artist => artist.name).join(', ');

  return (
    <AlbumContainer>
      <AlbumHeader>
        <AlbumCover src={album.images[0]?.url} alt={album.name} />
        <AlbumInfo>
          <AlbumTitle>{album.name}</AlbumTitle>
          <AlbumMeta>
            By {artistNames} • {releaseYear} • {album.total_tracks} tracks
          </AlbumMeta>
          <SpotifyButton
            href={album.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            Listen on Spotify
          </SpotifyButton>
        </AlbumInfo>
      </AlbumHeader>

      <Suspense fallback={<LoadingSpinner message="Loading tracks..." />}>
        <TrackList tracks={album.tracks.items} />
      </Suspense>

      {album.artists[0] && (
        <Suspense fallback={<LoadingSpinner message="Loading related albums..." />}>
          <RelatedAlbums 
            artistId={album.artists[0].id} 
            currentAlbumId={album.id}
          />
        </Suspense>
      )}
    </AlbumContainer>
  );
};

export default AlbumDetails;
