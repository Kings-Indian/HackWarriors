import { Location } from '../types/game';

export const getBackgroundImage = (location: Location): string => {
  return location.background;
}; 