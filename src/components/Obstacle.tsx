import React from 'react';
import { Position } from '../types/game';

interface ObstacleProps {
  position: Position;
  type: 'obstacle' | 'enemy';
  sprite?: string;
}

const Obstacle: React.FC<ObstacleProps> = ({ position, type, sprite }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: '30px',
        height: '30px',
        backgroundColor: type === 'obstacle' ? '#ff0000' : 'transparent',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        zIndex: 1
      }}
    >
      {sprite}
    </div>
  );
};

export default Obstacle; 