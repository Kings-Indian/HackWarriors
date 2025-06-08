import type { Location } from '../types/game';
import fishermansWharf from './images/fishermans-wharf.jpg';
import pier39 from './images/pier-39.jpg';
import chinatown from './images/chinatown.jpg';
import goldenGatePark from './images/golden-gate-park.jpg';
import haightAshbury from './images/haight-ashbury.jpg';

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