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
  padding-bottom: ${props => props.type === 'artist' ? '80%' : '100%'};
`;

const ContentContainer = styled.div`
  padding: var(--space-xs) var(--space-md);
  min-height: ${props => props.type === 'artist' ? '50px' : '120px'};
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

const CardSkeleton = ({ type = 'album' }) => {
  return (
    <Card>
      <ImageSkeleton type={type} />
      <ContentContainer type={type}>
        <TitleSkeleton />
        <SubtitleSkeleton />
      </ContentContainer>
    </Card>
  );
};

CardSkeleton.propTypes = {
  type: PropTypes.oneOf(['album', 'artist'])
};

export default CardSkeleton;