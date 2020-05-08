import Phaser from 'phaser';

import bar from './boot/bar.png';
import logo from './boot/logo.png';

function init(){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
}

function preload(){
    this.load.image('bar', bar);
    this.load.image('logo', logo);
}

function create(){
    this.game.stage.backgroundColor = '#fff';
    this.state.start('preload');
}

export default {init, preload, create};
