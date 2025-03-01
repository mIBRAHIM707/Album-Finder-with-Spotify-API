import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Image, Badge, ProgressBar } from "react-bootstrap";
import TrackList from "./components/TrackList";
import ArtistInfo from './components/ArtistInfo';
import RelatedAlbums from './components/RelatedAlbums';
import ArtistMetrics from './components/ArtistMetrics';
import LoadingSpinner from './components/LoadingSpinner';

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [artistAlbums, setArtistAlbums] = useState([]);
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
    return <LoadingSpinner message="Loading album details..." />;
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>Error: {error}</div>;
  }

  if (!album) {
    return <div style={{ textAlign: "center" }}>Album not found.</div>;
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={4}>
          <div className="sticky-top" style={{ top: '2rem' }}>
            <Image src={album.images[0].url} alt={album.name} fluid className="shadow-sm mb-3" />
            <div className="mb-3">
              <h6 className="text-muted mb-2 text-start">Popularity</h6>
              <ProgressBar 
                now={album.popularity} 
                label={`${album.popularity}%`}
                variant="success"
                className="mb-3"
              />
            </div>
            <div className="mb-3 text-start">
              {album.genres && album.genres.map(genre => (
                <Badge 
                  bg="secondary" 
                  className="me-2 mb-2" 
                  key={genre}
                >
                  {genre}
                </Badge>
              ))}
            </div>
            <Link to="/" className="btn btn-outline-primary d-block text-start">
              ← Back to Search
            </Link>
          </div>
        </Col>
        <Col md={8}>
          <div className="mb-4 text-start">
            <h2>{album.name}</h2>
            <p className="text-muted">
              by {album.artists.map((artist) => artist.name).join(", ")}
            </p>
            <div className="d-flex gap-4 mb-3">
              <div>
                <small className="text-muted d-block">Release Date</small>
                <strong>{formatReleaseDate(album.release_date)}</strong>
              </div>
              <div>
                <small className="text-muted d-block">Tracks</small>
                <strong>{album.total_tracks}</strong>
              </div>
              {album.label && (
                <div>
                  <small className="text-muted d-block">Label</small>
                  <strong>{album.label}</strong>
                </div>
              )}
            </div>
            {album.copyrights && (
              <small className="text-muted d-block mt-2">
                {album.copyrights[0]?.text}
              </small>
            )}
          </div>
          
          {/* Artist Information */}
          <ArtistInfo artistId={album.artists[0].id} />
          
          {/* Artist Metrics */}
          <ArtistMetrics albums={artistAlbumsWithMetrics} />
          
          {/* Track List */}
          <h4 className="mb-3 text-start">Tracks</h4>
          <TrackList tracks={tracks} />
          
          {/* Related Albums */}
          <RelatedAlbums 
            artistId={album.artists[0].id}
            currentAlbumId={album.id}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AlbumDetails;
