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

export interface Enemy extends GameObject {
  type: 'enemy';
  name: string;
  health: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Obstacle extends GameObject {
  type: 'obstacle';
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
}

export interface Location {
  name: string;
  background: string;
  enemies: Enemy[];
  obstacles: Obstacle[];
  requiredEnemiesDefeated: number;
}

export interface GameState {
  currentLocation: number;
  isInCombat: boolean;
  isGameOver: boolean;
  enemies: Enemy[];
  obstacles: Obstacle[];
  player: Player;
}

export const SAN_FRANCISCO_LOCATIONS: Location[] = [
  {
    name: 'Fisherman\'s Wharf',
    background: locationImages['fishermans-wharf'],
    obstacles: [
      { type: 'obstacle', position: { x: 200, y: 200 }, sprite: '🚧' },
      { type: 'obstacle', position: { x: 400, y: 300 }, sprite: '🚧' },
      { type: 'obstacle', position: { x: 600, y: 400 }, sprite: '🚧' }
    ],
    enemies: [
      { type: 'enemy', name: 'Soap Monster', position: { x: 0, y: 0 }, health: 50, attack: 5, defense: 2, speed: 3, sprite: '🧴' },
      { type: 'enemy', name: 'Shower Demon', position: { x: 0, y: 0 }, health: 60, attack: 6, defense: 3, speed: 4, sprite: '🚿' }
    ],
    requiredEnemiesDefeated: 0
  },
  {
    name: 'Pier 39',
    background: locationImages['pier-39'],
    obstacles: [
      { type: 'obstacle', position: { x: 300, y: 200 }, sprite: '🚧' },
      { type: 'obstacle', position: { x: 500, y: 300 }, sprite: '🚧' },
      { type: 'obstacle', position: { x: 700, y: 400 }, sprite: '🚧' }
    ],
    enemies: [
      { type: 'enemy', name: 'Bubble Beast', position: { x: 0, y: 0 }, health: 70, attack: 7, defense: 4, speed: 4, sprite: '🧼' },
      { type: 'enemy', name: 'Toothbrush Titan', position: { x: 0, y: 0 }, health: 80, attack: 8, defense: 5, speed: 5, sprite: '🪥' }
    ],
    requiredEnemiesDefeated: 2
  },
  {
    name: 'Chinatown',
    background: locationImages.chinatown,
    obstacles: [
      { type: 'obstacle', position: { x: 250, y: 250 }, sprite: '🚧' },
      { type: 'obstacle', position: { x: 450, y: 350 }, sprite: '🚧' },
      { type: 'obstacle', position: { x: 650, y: 450 }, sprite: '🚧' }
    ],
    enemies: [
      { type: 'enemy', name: 'Lotion Lord', position: { x: 0, y: 0 }, health: 90, attack: 9, defense: 6, speed: 5, sprite: '🧴' },
      { type: 'enemy', name: 'Shampoo Shogun', position: { x: 0, y: 0 }, health: 100, attack: 10, defense: 7, speed: 6, sprite: '🚿' }
    ],
    requiredEnemiesDefeated: 4
  },
  {
    name: 'Golden Gate Park',
    background: locationImages['golden-gate-park'],
    obstacles: [
      { type: 'obstacle', position: { x: 350, y: 250 }, sprite: '🚧' },
      { type: 'obstacle', position: { x: 550, y: 350 }, sprite: '🚧' },
      { type: 'obstacle', position: { x: 750, y: 450 }, sprite: '🚧' }
    ],
    enemies: [
      { type: 'enemy', name: 'Deodorant Dragon', position: { x: 0, y: 0 }, health: 110, attack: 11, defense: 8, speed: 6, sprite: '🧼' },
      { type: 'enemy', name: 'Floss Fiend', position: { x: 0, y: 0 }, health: 120, attack: 12, defense: 9, speed: 7, sprite: '🪥' }
    ],
    requiredEnemiesDefeated: 6
  },
  {
    name: 'Haight-Ashbury',
    background: locationImages['haight-ashbury'],
    obstacles: [
      { type: 'obstacle', position: { x: 400, y: 250 }, sprite: '🚧' },
      { type: 'obstacle', position: { x: 600, y: 350 }, sprite: '🚧' },
      { type: 'obstacle', position: { x: 800, y: 450 }, sprite: '🚧' }
    ],
    enemies: [
      { type: 'enemy', name: 'Conditioner Colossus', position: { x: 0, y: 0 }, health: 130, attack: 13, defense: 10, speed: 7, sprite: '🧴' },
      { type: 'enemy', name: 'Razor Reaper', position: { x: 0, y: 0 }, health: 140, attack: 14, defense: 11, speed: 8, sprite: '🚿' }
    ],
    requiredEnemiesDefeated: 8
  }
]; 