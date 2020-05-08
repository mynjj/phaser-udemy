import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import GameScene from './scenes/GameScene';

const gameConfig = {
    backgroundColor: '#fff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 360,
        height: 640
    }
};

class Game extends Phaser.Game {
    constructor(){
        super(gameConfig);
        this.scene.add('Boot', BootScene);
        this.scene.add('Preload', PreloadScene);
        this.scene.add('Game', GameScene);
    }
}

window.game = new Game();
window.game.scene.start('Boot');
