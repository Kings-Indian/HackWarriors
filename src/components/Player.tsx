import React from 'react';
import { Position } from '../types/game';

interface PlayerProps {
  position: Position;
}

const Player: React.FC<PlayerProps> = ({ position }) => {
  return (
    <div
      className="player"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      😷
    </div>
  );
};

export default Player; 