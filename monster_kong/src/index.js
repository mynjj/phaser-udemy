import Phaser from 'phaser';

import groundImg from './mapElements/ground.png';
import platformImg from './mapElements/platform.png';
import goalImg from './gorilla.png';
import arrowBtnImg from './buttons/arrowButton.png';
import actionBtnImg from './buttons/actionButton.png';
import barrelImg from './mapElements/barrel.png';
import playerImg from './player_spritesheet.png';
import fireImg from './mapElements/fire_spritesheet.png';

import levelData from './levels/1.json'

let cursors;
function init(){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;

    this.game.world.setBounds(0, 0, 360, 700);
     
    cursors = this.game.input.keyboard.createCursorKeys();
}

function preload(){
    this.load.image('ground', groundImg);
    this.load.image('platform', platformImg);
    this.load.image('goal', goalImg);
    this.load.image('arrowBtn', arrowBtnImg);
    this.load.image('actionBtn', actionBtnImg);
    this.load.image('barrel', barrelImg);

    this.load.spritesheet('player', playerImg, 28, 30, 5, 1, 1);
    this.load.spritesheet('fire', fireImg, 20, 21, 2, 1, 1);
}

let player, ground, platforms, fires, goal, barrels;
function create(){
    ground = this.game.add.sprite(0, 638, 'ground');
    this.game.physics.arcade.enable(ground);
    ground.body.allowGravity = false;
    ground.body.immovable = true;

    platforms = this.game.add.group();
    platforms.enableBody = true;
    const pData = levelData.platformData;

    for(const {x, y} of pData){
        platforms.create(x, y, 'platform');
    }

    platforms.setAll('body.allowGravity', false);
    platforms.setAll('body.immovable', true);

    fires = this.game.add.group();
    fires.enableBody = true;
    for(const {x, y} of levelData.fireData){
        const f = fires.create(x, y, 'fire');
        f.animations.add('fire', [0, 1], 4, true);
        f.play('fire');
    }
    fires.setAll('body.allowGravity', false);

    player = this.game.add.sprite(levelData.playerStart.x, levelData.playerStart.y, 'player', 3);
    player.anchor.setTo(0.5);
    player.animations.add('walking', [0,1,2,1], 6, true);
    player.customParams = {};
    this.game.physics.arcade.enable(player);
    this.game.camera.follow(player);

    goal = this.game.add.sprite(levelData.goal.x, levelData.goal.y, 'goal');
    this.game.physics.arcade.enable(goal);
    goal.body.allowGravity = false;

    const leftArrow = this.game.add.button(20, 535, 'arrowBtn');
    const rightArrow = this.game.add.button(110, 535, 'arrowBtn');
    const action = this.game.add.button(280, 535, 'actionBtn');
    leftArrow.fixedToCamera = true;
    rightArrow.fixedToCamera = true;
    action.fixedToCamera = true;
    leftArrow.alpha = 0.5;
    rightArrow.alpha = 0.5;
    action.alpha = 0.5;

    action.events.onInputOver.add(()=>{
        player.customParams.mustJump = true;
    });
    action.events.onInputOut.add(()=>{
        player.customParams.mustJump = false;
    });

    leftArrow.events.onInputOver.add(()=>{
        player.customParams.movingLeft = true;
    });
    leftArrow.events.onInputOut.add(()=>{
        player.customParams.movingLeft = false;
    });

    rightArrow.events.onInputOver.add(()=>{
        player.customParams.movingRight = true;
    });
    rightArrow.events.onInputOut.add(()=>{
        player.customParams.movingRight = false;
    });

    barrels = this.game.add.group();
    barrels.enableBody = true;

    const createBarrel = ()=>{
        let b = barrels.getFirstExists(false);
        if(!b){
            b = barrels.create(0, 0, 'barrel');
        }
        b.body.collideWorldBounds = true;
        b.body.bounce.set(1, 0);
        b.reset(levelData.goal.x, levelData.goal.y);
        b.body.velocity.x = levelData.barrelSpeed;
    };

    player.body.collideWorldBounds = true;

    this.game.time.events.loop(Phaser.Timer.SECOND*levelData.barrelFrequency, createBarrel);
    createBarrel();
}

function update(){
    const killPlayer = (player, fire)=>{
        game.state.start('game');
    };
    const win = ()=>{
        alert('bum');
        game.state.start('game');
    }
    this.game.physics.arcade.collide(player, ground);
    this.game.physics.arcade.collide(player, platforms);

    this.game.physics.arcade.overlap(player, fires, killPlayer);
    this.game.physics.arcade.overlap(player, barrels, killPlayer);
    this.game.physics.arcade.overlap(player, goal, win);

    this.game.physics.arcade.collide(barrels, platforms);
    this.game.physics.arcade.collide(barrels, ground);

    player.body.velocity.x = 0;
    if(cursors.left.isDown||player.customParams.movingLeft){
        player.body.velocity.x = -180;
        player.play('walking');
        player.scale.setTo(1, 1);
    }
    else if(cursors.right.isDown||player.customParams.movingRight){
        player.body.velocity.x = 180;
        player.scale.setTo(-1, 1);
        player.play('walking');
    }
    else {
        player.animations.stop();
        player.frame = 3;
    }
    if((cursors.up.isDown||player.customParams.mustJump) && player.body.touching.down){
        player.body.velocity.y = -650;
        player.customParams.mustJump = false;
    }
    barrels.forEach(b=>{
        if(b.x<10 && b.y>600){
            b.kill();
        }
    });

}

const gameState = {init, preload, create, update};

const game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('game', gameState);
game.state.start('game');
