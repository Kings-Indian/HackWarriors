import { ENEMY_IMAGES } from '../assets/images/Enemies';
import { locationImages } from '../assets/images/locations/locations';

export interface Position {
  x: number;
  y: number;
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

export interface GameLocation {
  name: string;
  background: string;
  enemies: Enemy[];
}

export interface GameState {
  currentLocation: number;
  isInCombat: boolean;
  isGameOver: boolean;
  enemies: Enemy[];
  playerA: Player;
  playerB: Player;
  activePlayer: 'A' | 'B' | null;
  message: string;
}

export const SAN_FRANCISCO_LOCATIONS: GameLocation[] = [
  {
    name: "Chinatown",
    background: locationImages.chinatown,
    enemies: [
      {
        name: "Matt",
        health: 60,
        attack: 6,
        defense: 3,
        speed: 2,
        sprite: ENEMY_IMAGES.Matt,
        position: { x: 0, y: 0 }
      }
    ]
  },
  {
    name: "Fisherman's Wharf",
    background: locationImages['fishermans-wharf'],
    enemies: [
      {
        name: "Bathtub",
        health: 50,
        attack: 5,
        defense: 2,
        speed: 3,
        sprite: ENEMY_IMAGES.Bathtub,
        position: { x: 0, y: 0 }
      },
      {
        name: "Toothbrush",
        health: 30,
        attack: 3,
        defense: 1,
        speed: 2,
        sprite: ENEMY_IMAGES.Toothbrush,
        position: { x: 0, y: 0 }
      },
      {
        name: "Deo",
        health: 40,
        attack: 4,
        defense: 1,
        speed: 4,
        sprite: ENEMY_IMAGES.Deo,
        position: { x: 0, y: 0 }
      }
    ]
  },
  {
    name: "Golden Gate Park",
    background: locationImages['golden-gate-park'],
    enemies: [
      {
        name: "Bathtub",
        health: 50,
        attack: 5,
        defense: 2,
        speed: 3,
        sprite: ENEMY_IMAGES.Bathtub,
        position: { x: 0, y: 0 }
      },
      {
        name: "Toothbrush",
        health: 30,
        attack: 3,
        defense: 1,
        speed: 2,
        sprite: ENEMY_IMAGES.Toothbrush,
        position: { x: 0, y: 0 }
      },
      {
        name: "Deo",
        health: 40,
        attack: 4,
        defense: 1,
        speed: 4,
        sprite: ENEMY_IMAGES.Deo,
        position: { x: 0, y: 0 }
      }
    ]
  },
  {
    name: "Haight Ashbury",
    background: locationImages['haight-ashbury'],
    enemies: [
      {
        name: "Bathtub",
        health: 50,
        attack: 5,
        defense: 2,
        speed: 3,
        sprite: ENEMY_IMAGES.Bathtub,
        position: { x: 0, y: 0 }
      },
      {
        name: "Toothbrush",
        health: 30,
        attack: 3,
        defense: 1,
        speed: 2,
        sprite: ENEMY_IMAGES.Toothbrush,
        position: { x: 0, y: 0 }
      },
      {
        name: "Deo",
        health: 40,
        attack: 4,
        defense: 1,
        speed: 4,
        sprite: ENEMY_IMAGES.Deo,
        position: { x: 0, y: 0 }
      }
    ]
  },
  {
    name: "Pier 39",
    background: locationImages['pier-39'],
    enemies: [
      {
        name: "Bathtub",
        health: 50,
        attack: 5,
        defense: 2,
        speed: 3,
        sprite: ENEMY_IMAGES.Bathtub,
        position: { x: 0, y: 0 }
      },
      {
        name: "Toothbrush",
        health: 30,
        attack: 3,
        defense: 1,
        speed: 2,
        sprite: ENEMY_IMAGES.Toothbrush,
        position: { x: 0, y: 0 }
      },
      {
        name: "Deo",
        health: 40,
        attack: 4,
        defense: 1,
        speed: 4,
        sprite: ENEMY_IMAGES.Deo,
        position: { x: 0, y: 0 }
      }
    ]
  }
];