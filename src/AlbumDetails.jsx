import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Image, Badge, ProgressBar } from "react-bootstrap";
import styled from 'styled-components';
import { BsArrowLeft } from 'react-icons/bs';
import TrackList from "./components/TrackList";
import ArtistInfo from './components/ArtistInfo';
import RelatedAlbums from './components/RelatedAlbums';
import ArtistMetrics from './components/ArtistMetrics';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';

const DetailContainer = styled(Container)`
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
  margin-top: var(--space-lg);
  text-align: left;
`;

const AlbumImage = styled(Image)`
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-md);
  width: 100%;
  transition: var(--transition-default);

  &:hover {
    transform: scale(1.02);
  }
`;

const StickyContainer = styled.div`
  position: sticky;
  top: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  padding: var(--space-sm) 0;
  transition: var(--transition-default);

  &:hover {
    color: var(--color-primary-hover);
    transform: translateX(-4px);
  }
`;

const AlbumTitle = styled.h2`
  color: var(--color-text);
  margin-bottom: var(--space-xs);
  font-weight: 700;
  text-align: left;
`;

const ArtistName = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  margin-bottom: var(--space-md);
  text-align: left;
`;

const MetaContainer = styled.div`
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
  text-align: left;
`;

const MetaItem = styled.div`
  small {
    color: var(--color-text-secondary);
    display: block;
    margin-bottom: 0.25rem;
  }

  strong {
    color: var(--color-text);
  }
`;

const PopularityLabel = styled.h6`
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
`;

const StyledProgressBar = styled(ProgressBar)`
  height: 8px;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin: var(--space-md) 0;
`;

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [artistAlbumsWithMetrics, setArtistAlbumsWithMetrics] = useState([]);
  const accessToken = localStorage.getItem("accessToken"); // Retrieve access token

  const formatReleaseDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch album details
        const albumResult = await fetch(
          `https://api.spotify.com/v1/albums/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!albumResult.ok) throw new Error("Failed to fetch album details");
        const albumData = await albumResult.json();
        setAlbum(albumData);

        // Fetch all artist albums for visualization
        const artistAlbumsResult = await fetch(
          `https://api.spotify.com/v1/artists/${albumData.artists[0].id}/albums?include_groups=album&market=US&limit=50`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!artistAlbumsResult.ok) throw new Error("Failed to fetch artist albums");
        const artistAlbumsData = await artistAlbumsResult.json();

        // Fetch detailed info for each album to get popularity
        const detailedAlbums = await Promise.all(
          artistAlbumsData.items.map(async (album) => {
            const albumDetailResult = await fetch(
              `https://api.spotify.com/v1/albums/${album.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const albumDetail = await albumDetailResult.json();
            return {
              ...album,
              popularity: albumDetail.popularity
            };
          })
        );

        setArtistAlbumsWithMetrics(detailedAlbums);

        // Fetch album tracks
        const tracksResult = await fetch(
          `https://api.spotify.com/v1/albums/${id}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!tracksResult.ok) {
          throw new Error("Failed to fetch album tracks");
        }

        const tracksData = await tracksResult.json();
        setTracks(tracksData.items);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, accessToken]);

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner message="Loading album details..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="text-center text-danger">Error: {error}</div>
      </>
    );
  }

  if (!album) {
    return (
      <>
        <Header />
        <div className="text-center">Album not found.</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <DetailContainer>
        <Row>
          <Col md={4}>
            <StickyContainer>
              <AlbumImage src={album.images[0].url} alt={album.name} fluid />
              <div className="mt-4">
                <PopularityLabel>Popularity</PopularityLabel>
                <StyledProgressBar 
                  now={album.popularity} 
                  variant="success"
                  className="mb-3"
                />
              </div>
              <BadgeContainer>
                {album.genres?.map(genre => (
                  <Badge 
                    bg="secondary" 
                    key={genre}
                  >
                    {genre}
                  </Badge>
                ))}
              </BadgeContainer>
              <BackButton to="/">
                <BsArrowLeft /> Back to Search
              </BackButton>
            </StickyContainer>
          </Col>
          <Col md={8}>
            <div className="mb-4">
              <AlbumTitle>{album.name}</AlbumTitle>
              <ArtistName>
                by {album.artists.map((artist) => artist.name).join(", ")}
              </ArtistName>
              <MetaContainer>
                <MetaItem>
                  <small>Release Date</small>
                  <strong>{formatReleaseDate(album.release_date)}</strong>
                </MetaItem>
                <MetaItem>
                  <small>Tracks</small>
                  <strong>{album.total_tracks}</strong>
                </MetaItem>
                {album.label && (
                  <MetaItem>
                    <small>Label</small>
                    <strong>{album.label}</strong>
                  </MetaItem>
                )}
              </MetaContainer>
              {album.copyrights && (
                <small className="text-muted d-block mt-2">
                  {album.copyrights[0]?.text}
                </small>
              )}
            </div>
            
            <ArtistInfo artistId={album.artists[0].id} />
            <ArtistMetrics albums={artistAlbumsWithMetrics} />
            <h4 className="mb-3">Tracks</h4>
            <TrackList tracks={tracks} />
            <RelatedAlbums 
              artistId={album.artists[0].id}
              currentAlbumId={album.id}
            />
          </Col>
        </Row>
      </DetailContainer>
    </>
  );
};

export default AlbumDetails;
