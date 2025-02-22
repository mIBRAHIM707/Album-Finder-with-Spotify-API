import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Image, ListGroup } from "react-bootstrap";

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken"); // Retrieve access token

  useEffect(() => {
    const fetchAlbumDetails = async () => {
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

        if (!albumResult.ok) {
          throw new Error("Failed to fetch album details");
        }

        const albumData = await albumResult.json();
        setAlbum(albumData);

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
        console.error("Error fetching album details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [id, accessToken]);

  if (loading) {
    return <div style={{ textAlign: "center" }}>Loading album details...</div>;
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>Error: {error}</div>;
  }

  if (!album) {
    return <div style={{ textAlign: "center" }}>Album not found.</div>;
  }

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Image src={album.images[0].url} alt={album.name} fluid />
        </Col>
        <Col md={8}>
          <h2>{album.name}</h2>
          <p>
            <strong>Artist:</strong> {album.artists.map((artist) => artist.name).join(", ")}
          </p>
          <p>
            <strong>Release Date:</strong> {album.release_date}
          </p>
          <p>
            <strong>Total Tracks:</strong> {album.total_tracks}
          </p>
          <ListGroup>
            {tracks.map((track) => (
              <ListGroup.Item key={track.id}>{track.name}</ListGroup.Item>
            ))}
          </ListGroup>
          <Link to="/">Back to Search</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default AlbumDetails;
