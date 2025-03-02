import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ArtistInfo from './ArtistInfo';
import ArtistMetrics from './ArtistMetrics';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import AlbumCard from './AlbumCard';
import spotifyApi from '../services/spotifyApi';

const ArtistContainer = styled(Container)`
  margin-top: 80px;
  padding: var(--space-xl) var(--space-md);
`;

const AlbumsSection = styled.section`
  margin-top: var(--space-xl);
`;

const SectionTitle = styled.h2`
  color: var(--color-text);
  margin-bottom: var(--space-lg);
  font-weight: 700;
`;

const AlbumsGrid = styled(Row)`
  margin: 0 -12px;
  
  > div {
    padding: 12px;
  }
`;

const ArtistDetails = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch artist details and albums in parallel
        const [artistResponse, albumsResponse] = await Promise.all([
          spotifyApi.getArtist(id),
          spotifyApi.getArtistAlbums(id)
        ]);

        setArtist(artistResponse);
        
        // Remove duplicate albums (same name different versions)
        const uniqueAlbums = albumsResponse.items.reduce((unique, album) => {
          const exists = unique.find(a => a.name.toLowerCase() === album.name.toLowerCase());
          if (!exists) {
            unique.push(album);
          }
          return unique;
        }, []);

        setAlbums(uniqueAlbums);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtistDetails();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading artist details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!artist) {
    return <ErrorMessage message="Artist not found" />;
  }

  return (
    <ArtistContainer>
      <ArtistInfo artist={artist} />
      
      {albums.length > 0 && (
        <>
          <ArtistMetrics albums={albums} />

          <AlbumsSection>
            <SectionTitle>Albums</SectionTitle>
            <AlbumsGrid xs={1} sm={2} md={3} lg={4} xl={5}>
              {albums.map((album) => (
                <Col key={album.id}>
                  <AlbumCard album={album} />
                </Col>
              ))}
            </AlbumsGrid>
          </AlbumsSection>
        </>
      )}
    </ArtistContainer>
  );
};

export default ArtistDetails;