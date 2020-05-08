import backgroundUrl from './backyard.png';

import appleUrl from './actions/apple.png';
import candyUrl from './actions/candy.png';
import duckUrl from './actions/rubber_duck.png';
import rotateUrl from './actions/rotate.png';

import petSpritesheet from './pet.png';

function preload(){
    const logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5);
    const preloadBar = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY+128, 'bar');
    preloadBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(preloadBar);

    this.load.image('backyard', backgroundUrl);
    this.load.image('apple', appleUrl);
    this.load.image('candy', candyUrl);
    this.load.image('rotate', rotateUrl);
    this.load.image('toy', duckUrl);
    this.load.spritesheet('pet', petSpritesheet, 97, 83, 5, 1, 1);

}

function create(){
    this.state.start('home');
}

export default {preload, create};
