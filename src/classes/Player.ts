import { characterSize } from './../index';
import { GameObjects, Scene, Tilemaps, Types } from 'phaser';
import { Actor } from './Actor';

export type Direction = 'front' | 'back' | 'left' | 'right';

export class Player extends Actor {
  private isMoving: boolean = false;
  private direction: Direction = 'front';
  private cursors?: Types.Input.Keyboard.CursorKeys;
  constructor(spData: GameObjects.Sprite, ActorData: Actor) {
    super(spData, name, hp, mp, level, atk, def, characterSize);
    var { name, hp, mp, level, atk, def } = ActorData.getActor();
  }

  public create = (scene: Scene, mapGround: Tilemaps.TilemapLayer) => {
    super.create(scene, mapGround);
  };

  public update = (scene: Scene): void => {
    if (this.isMoving) {
      // 動いているときはキー入力を受け付けない
      return;
    }

    // 十字キー入力
    const arrow: Types.Input.Keyboard.CursorKeys | undefined = this.cursors;

    // w a s d キー入力
    const s: boolean = scene.input.keyboard.addKey('S').isDown;
    const w: boolean = scene.input.keyboard.addKey('W').isDown;
    const a: boolean = scene.input.keyboard.addKey('A').isDown;
    const d: boolean = scene.input.keyboard.addKey('D').isDown;
  };
}
