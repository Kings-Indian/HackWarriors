import type { GameLocation } from '../../../types/game';
import fishermansWharf from './fishermans-wharf.jpg';
import pier39 from './pier-39.jpg';
import chinatown from './chinatown.jpg';
import goldenGatePark from './golden-gate-park.jpg';
import haightAshbury from './haight-ashbury.jpg';

type LocationKey = 'fishermans-wharf' | 'pier-39' | 'chinatown' | 'golden-gate-park' | 'haight-ashbury';

// Debug logging for image paths
console.log('Image paths:', {
  'fishermans-wharf': fishermansWharf,
  'pier-39': pier39,
  'chinatown': chinatown,
  'golden-gate-park': goldenGatePark,
  'haight-ashbury': haightAshbury
});

const locationImages: Record<LocationKey, string> = {
  'fishermans-wharf': fishermansWharf,
  'pier-39': pier39,
  'chinatown': chinatown,
  'golden-gate-park': goldenGatePark,
  'haight-ashbury': haightAshbury
};

console.log('Location Image URLs:', locationImages);
export { locationImages }; 