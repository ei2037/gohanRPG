// classes
import { Point } from 'classes/Actor';
import { GridControls } from 'classes/GridControls';
import { GridPhysics } from 'classes/GridPhysics';
import { Player } from 'classes/Player';
import { Cameras, Scene, Tilemaps } from 'phaser';
import { DialogBox } from 'classes/DialogBox';
import { DialogBoxConfig } from 'classes/DialogBox';
import { W } from 'functions/DOM/windowInfo';

// assets
import mapImg from '@/assets/maps/map001.png';
import player from '@/assets/characters/dynamic/player.png';
import sample002 from '@/assets/characters/dynamic/sample002.png';
import { Direction } from 'classes/Direction';

// values
export const tileSize: number = 40;
export const characterSize: number = 32;
export const assetKeys = {
  mapImg: 'mapImg',
  player: 'player',
};

export const playerAnims: { key: string; frameStart: number; frameEnd: number }[] = [
  { key: 'walkBack', frameStart: 9, frameEnd: 11 },
  { key: 'walkLeft', frameStart: 3, frameEnd: 5 },
  { key: 'walkRight', frameStart: 6, frameEnd: 8 },
  { key: 'walkFront', frameStart: 0, frameEnd: 2 },
];

export class MapTpl extends Scene {
  public tileset?: Tilemaps.Tileset;
  public tileMap?: Tilemaps.Tilemap;
  public tileMapLayer?: Tilemaps.TilemapLayer;
  private controls?: Cameras.Controls.FixedKeyControl;
  public player?: Player;
  private gridControls?: GridControls;
  private gridPhysics?: GridPhysics;
  private dialogBox?: DialogBox;
  private eventPoints?: Phaser.Types.Tilemaps.TiledObject[];
  constructor(private json: string, public name: string) {
    super({ key: name });
  }

  public preload() {
    this.load.image(assetKeys.mapImg, mapImg);
    this.load.tilemapTiledJSON(this.name, this.json);
    this.load.image('mapTiles', mapImg);
    this.load.image('sample002', sample002);

    this.load.spritesheet('player', player, {
      frameWidth: characterSize,
      frameHeight: characterSize,
    });
  }

  public create() {
    // マップを作成
    this.tileMap = this.make.tilemap({ key: this.name });
    this.tileset = this.tileMap.addTilesetImage('map001', assetKeys.mapImg);

    // 各レイヤーを紐付ける(地面とか建物とか木とか...)
    this.tileMapLayer = this.tileMap.createLayer('ground', this.tileset, 0, 0);
    this.tileMapLayer = this.tileMap.createLayer('worldLayer', this.tileset, 0, 0);
    const objects = this.tileMap.createFromObjects('npc', {});

    // 衝突判定を有効にする
    // this.tileMapLayer.setCollisionByProperty({ collides: true });

    // プレイヤーの初期位置を取得
    const spawnPoint = this.tileMap.findObject('objects', (obj) => {
      return obj.name === 'spawnPoint';
    });

    // イベントの位置を取得
    this.eventPoints = this.tileMap.filterObjects('objects', (obj) => {
      return obj.name === 'event';
    });

    // プレイヤーを作成する
    const playerSprite = this.add.sprite(0, 0, 'player');

    // プレイヤーの設定
    if (!!this.player) {
      // this.physics.add.collider(this.player.sprite, this.tileMapLayer);
    }

    // カメラの設定
    this.cameras.main.startFollow(playerSprite);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setBounds(
      0,
      0,
      this.tileMap.widthInPixels,
      this.tileMap.heightInPixels,
    );
    this.tileMap.width;

    // プレイヤーを作成する
    const { x, y } = spawnPoint;
    if (x === undefined || y === undefined) return;
    // タイルの位置を取得
    const tileX = Math.floor(x / tileSize);
    const tileY = Math.floor(y / tileSize);
    this.player = new Player(playerSprite, new Phaser.Math.Vector2(tileX, tileY));

    // グリッドの設定
    this.gridPhysics = new GridPhysics(this.player, this.tileMap);
    this.gridControls = new GridControls(this.input, this.gridPhysics);

    this.createAnim();

    // Debug graphics
    this.enableDebugMode();

    //Dialog==================================================================

    // 設定
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily:
        '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
      fontSize: '24px',
    };
    const dialogBoxConfig: DialogBoxConfig = {
      x: 600,
      y: 700,
      width: W(),
      height: 200,
      padding: 0,
      margin: 0,
      textStyle: textStyle,
      backGroundColor: 0xde000000,
      frameColor: 0xffffff,
    };
    this.dialogBox = new DialogBox(this, dialogBoxConfig);

    this.dialogBox.setText('クリックでエンディングへ ▼');
    this.dialogBox.setActorNameText('NAME');
    //Dialog==================================================================
  }

  public update(_time: number, delta: number) {
    if (!!this.eventPoints) {
      this.eventPoints.forEach((event) => {
        const { x, y } = event;
        if (!x || !y) {
          /*
           * xかyが...
           */
          return;
        }
        if (!this.dialogBox) return;
        if (
          this.player?.getTilePos().x === x / tileSize &&
          this.player?.getTilePos().y === y / tileSize
        ) {
          this.add.existing(this.dialogBox);
        }
      });
    }

    this.gridControls?.update();
    this.gridPhysics?.update(delta);
  }

  public createPlayerAnimation(name: string, startFrame: number, endFrame: number) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers('player', {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true,
    });
  }

  public createAnim() {
    // プレイヤーのアニメーション
    this.createPlayerAnimation(
      Direction.UP,
      playerAnims[0].frameStart,
      playerAnims[0].frameEnd,
    );
    this.createPlayerAnimation(
      Direction.LEFT,
      playerAnims[1].frameStart,
      playerAnims[1].frameEnd,
    );
    this.createPlayerAnimation(
      Direction.RIGHT,
      playerAnims[2].frameStart,
      playerAnims[2].frameEnd,
    );
    this.createPlayerAnimation(
      Direction.DOWN,
      playerAnims[3].frameStart,
      playerAnims[3].frameEnd,
    );
  }

  public enableDebugMode() {
    this.input.keyboard.once('keydown-D', () => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
      this.tileMapLayer?.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
      });
    });
  }
}
