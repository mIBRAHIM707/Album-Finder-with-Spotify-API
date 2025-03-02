import React, { useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { BsPlayFill, BsPauseFill, BsExplicitFill } from 'react-icons/bs';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TrackItem = styled(ListGroup.Item)`
  background: transparent !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  transition: var(--transition-default);
  padding: 0.75rem var(--space-md) !important;
  text-align: left !important;

  &:hover {
    background: var(--color-surface) !important;
  }
`;

const PlayButton = styled(Button)`
  color: var(--color-text) !important;
  padding: 0 !important;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-default);

  &:hover {
    color: var(--color-primary) !important;
    transform: scale(1.1);
  }

  &:focus {
    box-shadow: none !important;
  }
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-align: left !important;
`;

const TrackName = styled.div`
  color: var(--color-text);
  font-weight: 500;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left !important;
`;

const TrackMeta = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ExplicitBadge = styled.span`
  display: inline-flex;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 1.2rem;
`;

const TrackList = ({ tracks }) => {
  const [playingTrack, setPlayingTrack] = useState(null);
  const [audio, setAudio] = useState(null);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = (track) => {
    if (!track.preview_url) return;

    if (playingTrack === track.id) {
      audio.pause();
      setPlayingTrack(null);
      setAudio(null);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(track.preview_url);
      newAudio.play();
      setPlayingTrack(track.id);
      setAudio(newAudio);
      
      newAudio.onended = () => {
        setPlayingTrack(null);
        setAudio(null);
      };
    }
  };

  return (
    <ListGroup variant="flush">
      {tracks.map((track, index) => (
        <TrackItem 
          key={track.id}
          className="d-flex align-items-center gap-3"
        >
          <div style={{ width: '40px', textAlign: 'center' }}>
            {track.preview_url ? (
              <PlayButton
                variant="link"
                onClick={() => handlePlay(track)}
              >
                {playingTrack === track.id ? <BsPauseFill /> : <BsPlayFill />}
              </PlayButton>
            ) : (
              <span className="text-muted" style={{ fontSize: '1.5rem' }}>♪</span>
            )}
          </div>
          <TrackInfo className="flex-grow-1">
            <TrackName>{track.name}</TrackName>
            <TrackMeta>
              <span>{formatDuration(track.duration_ms)}</span>
              {track.explicit && (
                <ExplicitBadge title="Explicit">
                  <BsExplicitFill />
                </ExplicitBadge>
              )}
            </TrackMeta>
          </TrackInfo>
        </TrackItem>
      ))}
    </ListGroup>
  );
};

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      duration_ms: PropTypes.number.isRequired,
      track_number: PropTypes.number.isRequired,
      preview_url: PropTypes.string,
      external_urls: PropTypes.shape({
        spotify: PropTypes.string,
      }),
      artists: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};

export default TrackList;
