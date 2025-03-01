import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { BsSearch, BsSpotify, BsMusicNote } from 'react-icons/bs';
import EnhancedSearch from './EnhancedSearch';
import StyledButton from './StyledButton';

const HeroSection = styled.section`
  padding: 120px 0 60px;
  text-align: center;
  background: linear-gradient(
    180deg,
    var(--color-background) 0%,
    rgba(18, 18, 18, 0.9) 100%
  );
  position: relative;
  overflow: hidden;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: var(--space-md);
  background: linear-gradient(to right, var(--color-text) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const FeaturesSection = styled.section`
  padding: var(--space-xl) 0;
  background: var(--color-background);
`;

const FeatureCard = styled.div`
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  height: 100%;
  transition: var(--transition-default);
  text-align: center;

  &:hover {
    transform: translateY(-8px);
    background: var(--color-card-hover);
    box-shadow: var(--shadow-lg);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-md);
  color: black;
  font-size: 1.5rem;
`;

const FeatureTitle = styled.h3`
  color: var(--color-text);
  font-size: 1.25rem;
  margin-bottom: var(--space-sm);
`;

const FeatureDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0;
`;

const BackgroundAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  opacity: 0.1;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, var(--color-primary) 0%, transparent 50%);
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const HomePage = () => {
  return (
    <>
      <HeroSection>
        <BackgroundAnimation />
        <Container>
          <HeroTitle>Discover Your Next Favorite Album</HeroTitle>
          <HeroSubtitle>
            Explore millions of albums and artists from Spotify's vast music library.
            Search, discover, and dive deep into the world of music.
          </HeroSubtitle>
          <SearchContainer>
            <EnhancedSearch />
          </SearchContainer>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <Row xs={1} md={3} className="g-4">
            <Col>
              <FeatureCard>
                <FeatureIcon>
                  <BsSearch />
                </FeatureIcon>
                <FeatureTitle>Smart Search</FeatureTitle>
                <FeatureDescription>
                  Find albums and artists quickly with our intelligent search system powered by Spotify's API
                </FeatureDescription>
              </FeatureCard>
            </Col>
            <Col>
              <FeatureCard>
                <FeatureIcon>
                  <BsSpotify />
                </FeatureIcon>
                <FeatureTitle>Spotify Integration</FeatureTitle>
                <FeatureDescription>
                  Seamlessly connect with Spotify to explore detailed album information and artist metrics
                </FeatureDescription>
              </FeatureCard>
            </Col>
            <Col>
              <FeatureCard>
                <FeatureIcon>
                  <BsMusicNote />
                </FeatureIcon>
                <FeatureTitle>Track Preview</FeatureTitle>
                <FeatureDescription>
                  Listen to track previews and get a taste of the music before diving deeper
                </FeatureDescription>
              </FeatureCard>
            </Col>
          </Row>
        </Container>
      </FeaturesSection>
    </>
  );
};

export default HomePage;
