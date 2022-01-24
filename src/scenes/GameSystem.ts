import { Types } from 'phaser';

export type Mode = 'map' | 'battle' | 'menu';

class GameSystem {
  private state: Mode = 'map';
}
