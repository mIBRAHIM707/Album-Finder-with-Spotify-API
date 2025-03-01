import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import AlbumCard from './AlbumCard';
import styled from 'styled-components';

const RelatedSection = styled.section`
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h4`
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

const NoRelatedAlbums = styled.p`
  color: var(--color-text-secondary);
  text-align: center;
  padding: var(--space-lg) 0;
`;

const RelatedAlbums = ({ artistId, currentAlbumId }) => {
  const [relatedAlbums, setRelatedAlbums] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchRelatedAlbums = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=US&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        
        // Filter out the current album and duplicates
        const filteredAlbums = data.items
          .filter(album => album.id !== currentAlbumId)
          .reduce((unique, album) => {
            // Remove duplicate albums with same name (different versions)
            const exists = unique.find(a => a.name.toLowerCase() === album.name.toLowerCase());
            if (!exists) {
              unique.push(album);
            }
            return unique;
          }, [])
          .slice(0, 5); // Limit to 5 albums

        setRelatedAlbums(filteredAlbums);
      } catch (error) {
        console.error('Error fetching related albums:', error);
      }
    };

    if (artistId && accessToken) {
      fetchRelatedAlbums();
    }
  }, [artistId, currentAlbumId, accessToken]);

  if (!relatedAlbums.length) {
    return null;
  }

  return (
    <RelatedSection>
      <SectionTitle>More from this Artist</SectionTitle>
      <AlbumsGrid>
        {relatedAlbums.map((album) => (
          <Col key={album.id} xs={12} sm={6} md={4} lg={3}>
            <AlbumCard album={album} />
          </Col>
        ))}
      </AlbumsGrid>
    </RelatedSection>
  );
};

export default RelatedAlbums;
