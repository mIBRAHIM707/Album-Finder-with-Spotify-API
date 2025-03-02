import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  background: rgba(18, 18, 18, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--space-md) 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  text-decoration: none;
  color: var(--color-text);
  transition: var(--transition-default);

  &:hover {
    color: var(--color-primary);
  }
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const SiteName = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.span`
  font-size: 0.8rem;
  color: var(--color-text-secondary);
`;

const NavLink = styled(Link)`
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-pill);
  transition: var(--transition-default);
  font-weight: 500;

  &:hover {
    color: var(--color-text);
    background: var(--color-surface);
  }

  &.active {
    color: var(--color-primary);
    background: var(--color-surface);
  }
`;

const Header = () => {
  const location = useLocation();

  return (
    <StyledNavbar expand="lg">
      <Container>
        <Navbar.Brand as="div">
          <Brand to="/">
            <Logo src="/Album-Finder-with-Spotify-API/logo.jpeg" alt="Site Logo" />
            <SiteName>
              <Title>mIbrahim707's Music Explorer</Title>
              <Subtitle>Powered by Spotify</Subtitle>
            </SiteName>
          </Brand>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item>
              <NavLink 
                to="/" 
                className={location.pathname === '/' ? 'active' : ''}
              >
                Home
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink 
                to="/favorites" 
                className={location.pathname === '/favorites' ? 'active' : ''}
              >
                Favorites
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink 
                to="/history" 
                className={location.pathname === '/history' ? 'active' : ''}
              >
                History
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Header;