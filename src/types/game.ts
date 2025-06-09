import { locationImages } from '../assets/locations';

export interface Position {
  x: number;
  y: number;
}

export interface GameObject {
  type: 'enemy' | 'obstacle';
  position: Position;
  sprite: string;
}

export interface Enemy {
  name: string;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  sprite: string;
  position: Position;
}

export interface Obstacle {
  name: string;
  sprite: string;
  position: Position;
}

export interface Player {
  position: Position;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  score: number;
  level: number;
  enemiesDefeated: number;
  experience: number;
  isDefending: boolean;
}

export interface Location {
  name: string;
  background: string;
  enemies: Enemy[];
  obstacles: Obstacle[];
}

export interface GameState {
  currentLocation: number;
  isInCombat: boolean;
  isGameOver: boolean;
  enemies: Enemy[];
  obstacles: Obstacle[];
  playerA: Player;
  playerB: Player;
  activePlayer: 'A' | 'B' | null;
  message: string;
}

export const SAN_FRANCISCO_LOCATIONS: Location[] = [
  {
    name: "Golden Gate Park",
    background: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    enemies: [
      {
        name: "Raccoon",
        health: 50,
        attack: 5,
        defense: 2,
        speed: 3,
        sprite: "🦝",
        position: { x: 0, y: 0 }
      },
      {
        name: "Squirrel",
        health: 30,
        attack: 3,
        defense: 1,
        speed: 2,
        sprite: "🐿️",
        position: { x: 0, y: 0 }
      }
    ],
    obstacles: [
      {
        name: "Tree",
        sprite: "🌳",
        position: { x: 0, y: 0 }
      },
      {
        name: "Bench",
        sprite: "🪑",
        position: { x: 0, y: 0 }
      }
    ]
  },
  {
    name: "Fisherman's Wharf",
    background: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    enemies: [
      {
        name: "Seagull",
        health: 40,
        attack: 4,
        defense: 1,
        speed: 4,
        sprite: "🦅",
        position: { x: 0, y: 0 }
      },
      {
        name: "Crab",
        health: 60,
        attack: 6,
        defense: 3,
        speed: 2,
        sprite: "🦀",
        position: { x: 0, y: 0 }
      }
    ],
    obstacles: [
      {
        name: "Fishing Net",
        sprite: "🎣",
        position: { x: 0, y: 0 }
      },
      {
        name: "Boat",
        sprite: "⛵",
        position: { x: 0, y: 0 }
      }
    ]
  }
]; 