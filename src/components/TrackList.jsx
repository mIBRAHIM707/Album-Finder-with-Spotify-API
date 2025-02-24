import React, { useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';
import PropTypes from 'prop-types';

const TrackList = ({ tracks }) => {
  const [playingTrack, setPlayingTrack] = useState(null);
  const [audio, setAudio] = useState(null);

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
      {tracks.map((track) => (
        <ListGroup.Item 
          key={track.id}
          className="d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center">
            {track.preview_url ? (
              <Button
                variant="link"
                onClick={() => handlePlay(track)}
                className="me-2 p-0"
              >
                {playingTrack === track.id ? <BsPauseFill /> : <BsPlayFill />}
              </Button>
            ) : (
              <span className="me-3 text-muted small">♪</span>
            )}
            <div>
              <div>{track.name}</div>
              <small className="text-muted">
                {Math.floor(track.duration_ms / 60000)}:
                {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
              </small>
            </div>
          </div>
          {track.explicit && (
            <span className="badge bg-secondary">Explicit</span>
          )}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      preview_url: PropTypes.string,
      duration_ms: PropTypes.number.isRequired,
      explicit: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default TrackList;
