import Phaser from 'phaser';
import gameState from './game';
import bootState from './boot';
import preloadState from './preload';
import homeState from './home';

const game = new Phaser.Game(360, 640, Phaser.AUTO);

game.state.add('preload', preloadState);
game.state.add('boot', bootState);
game.state.add('home', homeState);
game.state.add('game', gameState);

game.state.start('boot');
