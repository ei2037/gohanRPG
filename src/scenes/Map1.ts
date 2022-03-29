import { json, system } from 'index';
import { Map } from './Map.tpl';
import { sceneKeys } from './sceneKeys';
import Ate from '@/assets/characters/static/boss/ate.png';
import {
  warp0,
  warpA,
  backA,
  dummy,
  noComment,
  beforeAteBattle,
  afterAteBattle,
  goAte,
} from 'classes/timelineWords';

export class Map1 extends Map {
  constructor() {
    super(json[1], sceneKeys.map1);
  }
  preload() {
    super.preload();
    this.loadBossimage('Ate', Ate);
  }

  create() {
    super.create();
    this.setBoss(13, 3, 'Ate');
    super.setEvent('goHome', warp0);
    super.setEvent('woop', warpA);
    super.setEvent('goAte', goAte);
    super.setEvent('woopboss', backA);
    super.setEvent('battleA', beforeAteBattle);
    super.setEvent('endA', afterAteBattle);
    super.setHint('explanation1', noComment);
    super.setHint('stone1', noComment);
    super.setHint('stone2', noComment);
    super.setHint('stone3', noComment);
    super.setHint('stone4', noComment);
    super.setHint('battleA', noComment);
    // enterキーでシーンを切り替える
    const enter = this.input.keyboard.addKey('ENTER');
    enter.on('down', () => {
      // this.switchMap(sceneKeys.map1);
      system.map = sceneKeys.map1;

      system.switchMap(this, sceneKeys.map1);
    });
  }
}
