import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Card = styled.div`
  background: var(--color-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  height: 100%;
  box-shadow: var(--shadow-md);
`;

const ShimmerEffect = styled.div`
  background: linear-gradient(
    90deg,
    var(--color-card) 0%,
    var(--color-surface) 50%,
    var(--color-card) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const ImageSkeleton = styled(ShimmerEffect)`
  width: 100%;
  padding-bottom: 100%;
`;

const ContentContainer = styled.div`
  padding: var(--space-md);
`;

const TitleSkeleton = styled(ShimmerEffect)`
  height: 24px;
  width: 80%;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-sm);
`;

const SubtitleSkeleton = styled(ShimmerEffect)`
  height: 16px;
  width: 60%;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-sm);
`;

const TagContainer = styled.div`
  display: flex;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
`;

const TagSkeleton = styled(ShimmerEffect)`
  height: 20px;
  width: ${props => props.width};
  border-radius: var(--radius-pill);
`;

const CardSkeleton = ({ type = 'album' }) => {
  return (
    <Card>
      <ImageSkeleton />
      <ContentContainer>
        <TitleSkeleton />
        <SubtitleSkeleton />
        {type === 'artist' && (
          <TagContainer>
            <TagSkeleton width="30%" />
            <TagSkeleton width="40%" />
            <TagSkeleton width="25%" />
          </TagContainer>
        )}
      </ContentContainer>
    </Card>
  );
};

CardSkeleton.propTypes = {
  type: PropTypes.oneOf(['album', 'artist'])
};

export default CardSkeleton;