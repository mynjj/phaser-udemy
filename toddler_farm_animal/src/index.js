import Phaser from 'phaser';

// images
import backgroundUrl from './background.png';
import chickenUrl from './animals/chicken_spritesheet.png';
import horseUrl from './animals/horse_spritesheet.png';
import sheepUrl from './animals/sheep_spritesheet.png';
import pigUrl from './animals/pig_spritesheet.png';
import arrowUrl from './arrow.png';

// audio
import chickenMp3 from './animals/chicken.mp3';
import horseMp3 from './animals/horse.mp3';
import sheepMp3 from './animals/sheep.mp3';
import pigMp3 from './animals/pig.mp3';
import chickenOgg from './animals/chicken.ogg';
import horseOgg from './animals/horse.ogg';
import sheepOgg from './animals/sheep.ogg';
import pigOgg from './animals/pig.ogg';



const game = new Phaser.Game(640, 360, Phaser.AUTO);


const animateAnimal = (sprite, event)=>{
    sprite.play('animate');
    sprite.customParams.sound.play();
};

const animals = [
    {id: 'chicken', audios: [chickenMp3, chickenOgg], imageUrl: chickenUrl, name: 'CHICKEN', width: 131, height: 200},
    {id: 'horse', audios: [horseMp3, horseOgg], imageUrl: horseUrl, name: 'HORSE', width: 212, height: 200},
    {id: 'sheep', audios: [sheepMp3, sheepOgg], imageUrl: sheepUrl, name: 'SHEEP', width: 244, height: 200},
    {id: 'pig', audios: [pigMp3, pigOgg],imageUrl: pigUrl, name: 'PIG', width: 297, height: 200}
];

function preload (){
    this.load.image('background', backgroundUrl);
    for(const {id, imageUrl, width, height, audios} of animals){
        this.load.spritesheet(id, imageUrl, width, height);
        this.load.audio(id+'Sound', audios);
    }
    this.load.image('arrow', arrowUrl);
};

function create (){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.add.sprite(0, 0, 'background');

    const animalsGroup = this.game.add.group();
    let locked = false;
    let currentAnimal;
    const animalText = this.game.add.text(this.game.width/2, this.game.height*.85, '');
    animalText.anchor.setTo(0.5);

    const outLeftTo = a=>({
        x: -a.width/2,
        y: this.game.height/2,
    });
    const outRightTo = a=>({
        x: this.game.width+a.width/2,
        y: this.game.height/2,
    });
    const centerTo = {
        x: this.game.width/2,
        y: this.game.height/2,
    };
    const set = (dest,a)=>{
        a.x = dest.x;
        a.y = dest.y;
    };
    const outLeft = a=>set(outLeftTo(a),a);
    const outRight = a=>set(outRightTo(a),a);
    const center = a=>set(centerTo, a);
    const animate = (dest, a)=>{
        const t = this.game.add.tween(a);
        t.to(dest, 1000);
        t.start();
        t.onComplete.add(()=>{
            locked = false;
            showText(a);
        });
    };
    const animateOutLeft = a=>animate(outLeftTo(a), a);
    const animateOutRight = a=>animate(outRightTo(a), a);
    const animateCenter = (a, from)=>{
        set(from, a);
        animate(centerTo, a);
    };
    const showText = a => {
        animalText.setText(a.customParams.name);
        animalText.visible = true;
    };

    const switchAnimal = (sprite, event)=>{
        if(locked){
            return;
        }
        locked = true;
        animalText.visible = false;

        const direction = sprite.customParams.direction;
        if(direction === 1){
            animateOutRight(currentAnimal);
            currentAnimal = animalsGroup.next();
            animateCenter(
                currentAnimal,
                outLeftTo(currentAnimal)
            );
        }
        else{
            animateOutLeft(currentAnimal);
            currentAnimal = animalsGroup.previous();
            animateCenter(
                currentAnimal,
                outRightTo(currentAnimal)
            );
        }
    };

    for(const {id, name} of animals){
        const animal = animalsGroup.create(0,0,id);
        animal.anchor.setTo(0.5);
        outLeft(animal);
        animal.animations.add('animate', [0,1,2,1,0,1,2], 3, false);
        animal.inputEnabled = true;
        animal.input.pixelPerfectClick = true;
        animal.events.onInputDown.add(animateAnimal, this);
        animal.customParams = {name, sound: this.game.add.audio(id+'Sound')};
    }
    currentAnimal = animalsGroup.next();
    center(currentAnimal);
    showText(currentAnimal);

    const leftArrow = this.game.add.sprite(0, this.game.world.centerY, 'arrow');
    leftArrow.anchor.setTo(1, 0.5);
    leftArrow.scale.setTo(-1, 1);
    leftArrow.inputEnabled = true;
    leftArrow.input.pixelPerfectClick = true;
    leftArrow.events.onInputDown.add(switchAnimal, this);
    leftArrow.customParams = {direction: -1};

    const rightArrow = this.game.add.sprite(this.game.width, this.game.world.centerY, 'arrow');
    rightArrow.anchor.setTo(1, 0.5);
    rightArrow.inputEnabled = true;
    rightArrow.input.pixelPerfectClick = true;
    rightArrow.events.onInputDown.add(switchAnimal, this);
    rightArrow.customParams = {direction: 1};

};
function update (){
};

const state = {preload, create, update};

game.state.add('state', state);
game.state.start('state');
