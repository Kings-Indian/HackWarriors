import matt from './matt.png';
import deo from './deo.png';
import toothbrush from './toothbrush.png';
import bathtub from './bathtub.png';

export const ENEMY_IMAGES = {
  Matt: matt,
  Deo: deo,
  Toothbrush: toothbrush,
  Bathtub: bathtub
} as const;

export type EnemyType = keyof typeof ENEMY_IMAGES; 