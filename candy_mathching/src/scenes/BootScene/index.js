import Phaser from 'phaser';
import barImg from './preloader-bar.png';

class BootScene extends Phaser.Scene{
    preload = () => {
        this.load.image('bar', barImg);
    };
    create = () => {
        this.scene.start('Preload');
    };
}

export default BootScene;
