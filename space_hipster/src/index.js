import Phaser from 'phaser';

import spaceImg from './images/space.png';
import playerImg from './images/player.png';
import bulletImg from './images/bullet.png';
import enemyParticleImg from './images/enemyParticle.png';
import yellowEnemyImg from './images/yellow_enemy.png';
import redEnemyImg from './images/red_enemy.png';
import greenEnemyImg from './images/green_enemy.png';
import levelData1 from './level1.json';
import orchMp3 from './8bit-orchestra.mp3';
import orchOgg from './8bit-orchestra.ogg';

const PLAYER_SPEED = 200;
const BULLET_SPEED = -1000;

class Enemy extends Phaser.Sprite{
    constructor(game, x, y, key, health, enemyBullets){
        super(game, x, y, key);
        this.game = game;

        this.anchor.setTo(0.5);
        this.animations.add('getHit', [0,1,2,1,0], 25, false);
        this.health = health;
        this.enemyBullets = enemyBullets;

        this.timer = game.time.create(false);
        this.timer.start();

        this.scheduleShooting();
    }

    reset(x, y, health, key, scale, sX, sY){
        super.reset(x, y);
        this.timer.resume();
        this.loadTexture(key);
        this.scale.setTo(scale);
        this.body.velocity.x = sX;
        this.body.velocity.y = sY;
    }

    scheduleShooting = () =>{
        this.shoot();
        this.timer.add(Phaser.Timer.SECOND*2, this.scheduleShooting);
    };

    shoot(){
        let bullet = this.enemyBullets.getFirstExists(false);
        if(!bullet){
            bullet = new EnemyBullet(this.game, this.x, this.bottom);
            this.enemyBullets.add(bullet);
        }
        else {
            bullet.reset(this.x, this.y);
        }
        bullet.body.velocity.y = 100;
    }

    update(){
        if(this.x<0.05*this.game.world.width){
            this.x = 0.05*this.game.world.width + 2;
            this.body.velocity.x *= -1;
        }
        else if(this.x>0.95*this.game.world.width){
            this.x = 0.95*this.game.world.width - 2;
            this.body.velocity *= -1;
        }
        if(this.top > this.game.world.height){
            this.kill();
        }
    }

    damage(amount){
        super.damage(amount);
        this.play('getHit');

        if(this.health <= 0){
            this.timer.stop();
            const emitter = this.game.add.emitter(this.x, this.y, 100);
            emitter.makeParticles('enemyParticle');
            emitter.minParticleSpeed.setTo(-200, -200);
            emitter.maxParticleSpeed.setTo(200, 200);
            emitter.gravity = 0;
            emitter.start(true, 500, null, 100);
        }
    }
}

class PlayerBullet extends Phaser.Sprite{
    constructor(game, x, y){
        super(game, x, y, 'bullet');
        this.anchor.setTo(0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
    }
}

class EnemyBullet extends Phaser.Sprite{
    constructor(game, x, y){
        super(game, x, y, 'bullet');
        this.anchor.setTo(0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
    }
}

function init(){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
}

function preload(){
    this.load.image('space', spaceImg);
    this.load.image('player', playerImg);
    this.load.image('bullet', bulletImg);
    this.load.image('enemyParticle', enemyParticleImg);
    this.load.spritesheet('yellowEnemy', yellowEnemyImg, 50, 46, 3, 1, 1);
    this.load.spritesheet('redEnemy', redEnemyImg, 50, 46, 3, 1, 1);
    this.load.spritesheet('greenEnemy', greenEnemyImg, 50, 46, 3, 1, 1);
    this.load.audio('orchestra', [orchMp3, orchOgg]);
}

let orchestra, player, playerBullets, enemyBullets, enemies;

const createBullet = (game)=>{
    let bullet = playerBullets.getFirstExists(false);
    if(!bullet){
        bullet = new PlayerBullet(game, player.x, player.top);
        playerBullets.add(bullet);
    }
    else {
        bullet.reset(player.x, player.top);
    }
    bullet.body.velocity.y = BULLET_SPEED;
};

function create(){
    const background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
    player = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 50, 'player');
    player.anchor.setTo(0.5);


    playerBullets = this.game.add.group();
    playerBullets.enableBody = true;


    enemies = this.game.add.group();
    enemies.enableBody = true;

    enemyBullets = this.game.add.group();
    enemyBullets.enableBody = true;

    const createEnemy = (x, y, health, key, scale, sX, sY)=>{
        let enemy = enemies.getFirstExists(false);
        if(!enemy){
            enemy = new Enemy(this.game, x, y, key, health, enemyBullets);
            enemies.add(enemy);
        }
        enemy.reset(x, y, health, key, scale, sX, sY);
    };

    orchestra = this.game.add.audio('orchestra');

    let current = 0;
    const scheduleEnemies = ()=>{
        const next = levelData1.enemies[current];
        let nextTime;
        if(next){
            nextTime = next.time - (current===0?0:levelData1.enemies[current-1].time)
        }
        const timer = this.game.time.events.add(nextTime, ()=>{
            createEnemy(next.x * this.game.world.width, -100, next.health, next.key, next.scale, next.speedX, next.speedY);
            current++;
            scheduleEnemies();
        });
    };
    scheduleEnemies();

    this.game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    this.game.time.events.loop(Phaser.Timer.SECOND/5, ()=>createBullet(this.game));

    background.autoScroll(0, 30);
}


const damageEnemy = (bullet, enemy)=>{
    enemy.damage(1);
    bullet.kill();
};

let playing = false;
function update(){
    const killPlayer = (bullet, player)=>{
        player.kill();
        this.game.state.start('state');
    }
    this.game.physics.arcade.overlap(playerBullets, enemies, damageEnemy);
    this.game.physics.arcade.overlap(enemyBullets, player, killPlayer);
    let direction = 0;
    if(this.game.input.activePointer.isDown){
        if(!playing){
            playing = true;
            orchestra.play();
        }
        const tX = this.game.input.activePointer.position.x;
        direction = tX>=this.game.world.centerX?1:-1;
    }
    player.body.velocity.x = direction * PLAYER_SPEED;
}

const state = {init, preload, create, update};

const game = new Phaser.Game('100%', '100%', Phaser.AUTO);
game.state.add('state', state);
game.state.start('state');
