import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EnhancedSearch from './EnhancedSearch';

const HomePage = ({ onSearch, loading }) => {
  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <Container className="text-center">
          <div className="mb-4">
            <i className="fas fa-music" style={{ fontSize: '4rem', color: 'var(--color-primary)' }}></i>
          </div>
          <h1 className="display-4 fw-bold mb-3">Album Finder</h1>
          <p className="lead text-muted mb-5">Discover albums from your favorite artists using the Spotify API</p>
          
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <EnhancedSearch onSearch={onSearch} loading={loading} />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-dark text-center">
        <Container className="text-center">
          <h2 className="text-center mb-5">Features</h2>
          <Row className="g-4 justify-content-center">
            <Col md={4} className="d-flex">
              <Card className="h-100 feature-card w-100 text-center">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-search"></i>
                  </div>
                  <Card.Title>Search by Artist or Album</Card.Title>
                  <Card.Text>
                    Find albums by artist name or search directly for specific album titles.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="d-flex">
              <Card className="h-100 feature-card w-100 text-center">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-chart-bar"></i>
                  </div>
                  <Card.Title>Visualize Popularity</Card.Title>
                  <Card.Text>
                    See how albums compare with interactive charts and statistics.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="d-flex">
              <Card className="h-100 feature-card w-100 text-center">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-headphones-alt"></i>
                  </div>
                  <Card.Title>Preview Tracks</Card.Title>
                  <Card.Text>
                    Listen to track previews and discover new music from your favorite artists.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Getting Started Section */}
      <section className="getting-started-section py-5 text-center">
        <Container className="text-center">
          <h2 className="mb-4">Ready to start exploring?</h2>
          <p className="mb-4">Type an artist or album name in the search bar and discover amazing music!</p>
          <div className="search-prompt">
            <p className="mb-3">Try searching for:</p>
            <div className="d-flex justify-content-center flex-wrap gap-2">
              {["Taylor Swift", "The Beatles", "Kendrick Lamar", "Daft Punk", "Adele"].map((artist) => (
                <Button 
                  key={artist} 
                  variant="outline-primary" 
                  className="mb-2"
                  onClick={() => onSearch(artist, 'artist')}
                >
                  {artist}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 text-muted">
        <small>Powered by Spotify API • Created with React</small>
      </footer>
    </div>
  );
};

export default HomePage;
