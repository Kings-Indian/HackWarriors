import React from 'react';
import { Player, Enemy } from '../types/game';
import './Combat.css';

interface CombatProps {
  player: Player;
  enemy: Enemy;
  onAttack: () => void;
  onDefend: () => void;
  onRun: () => void;
}

const Combat: React.FC<CombatProps> = ({ player, enemy, onAttack, onDefend, onRun }) => {
  return (
    <div className="combat-screen">
      <div className="combat-stats">
        <div className="combatant">
          <div className="combatant-sprite">
            <img src="./src/assets/images/player.png" alt="Player" className="sprite-image" />
          </div>
          <div className="combatant-info">
            <div className="combatant-name">Player</div>
            <div>Health: {player.health}</div>
            <div>Attack: {player.attack}</div>
            <div>Defense: {player.defense}</div>
          </div>
        </div>
        <div className="combatant">
          <div className="combatant-sprite">
            <img src={enemy.sprite} alt={enemy.name} className="sprite-image" />
          </div>
          <div className="combatant-info">
            <div className="combatant-name">{enemy.name}</div>
            <div>Health: {enemy.health}</div>
            <div>Attack: {enemy.attack}</div>
            <div>Defense: {enemy.defense}</div>
          </div>
        </div>
      </div>
      <div className="combat-actions">
        <button className="attack" onClick={onAttack}>Attack</button>
        <button className="defend" onClick={onDefend}>Defend</button>
        <button className="run" onClick={onRun}>Run</button>
      </div>
    </div>
  );
};

export default Combat; 
 