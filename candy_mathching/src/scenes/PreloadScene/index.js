import Phaser from 'phaser';

import bean1Img from './bean_blue.png';
import bean2Img from './bean_green.png';
import bean3Img from './bean_orange.png';
import bean4Img from './bean_pink.png';
import bean5Img from './bean_purple.png';
import bean6Img from './bean_red.png';
import bean7Img from './bean_white.png';
import bean8Img from './bean_yellow.png';
import deadBeanImg from './bean_dead.png';
import backgroundImg from './backyard2.png';

class PreloadScene extends Phaser.Scene{
    preload = () => {
        const camera = this.cameras.main;
        const bar = this.add.sprite(
            camera.centerX,
            camera.centerY,
            'bar'
        );
        bar.setDisplayOrigin(0.5);
        bar.setScale(100, 1);

        this.load.image('block1', bean1Img);
        this.load.image('block2', bean2Img);
        this.load.image('block3', bean3Img);
        this.load.image('block4', bean4Img);
        this.load.image('block5', bean5Img);
        this.load.image('block6', bean6Img);
        this.load.image('block7', bean7Img);
        this.load.image('block8', bean8Img);
        this.load.image('deadBlock', deadBeanImg);
        this.load.image('background', backgroundImg);
    };
    create = () => {
        this.scene.start('Game');
    };
}

export default PreloadScene
