import Phaser from 'phaser';

let pet, controlsBlocked;

function create(){
    const background = this.game.add.sprite(0, 0, 'backyard');
    background.inputEnabled = true;

    this.game.add.text(10, 40, 'Health:');
    this.game.add.text(220, 40, 'Fun:');
    const healthText = this.game.add.text(120, 40, '');
    const funText = this.game.add.text(300, 40, '');
        
    pet = this.game.add.sprite(100, 400, 'pet');
    pet.anchor.setTo(0.5);
    pet.inputEnabled = true;
    pet.input.enableDrag();
    pet.customParams = {health: 100, fun: 100};
    pet.animations.add('eat', [0,1,2,3,2,1,0], 30, false);


    const apple = this.game.add.sprite(72, 570, 'apple');
    apple.anchor.setTo(0.5);
    apple.inputEnabled = true;
    apple.customParams = {health: 20};

    const candy = this.game.add.sprite(144, 570, 'candy');
    candy.anchor.setTo(0.5);
    candy.inputEnabled = true;
    candy.customParams = {fun: 10, health: -10};

    const toy = this.game.add.sprite(216, 570, 'toy');
    toy.anchor.setTo(0.5);
    toy.inputEnabled = true;
    toy.customParams = {fun: 20};

    const rotate = this.game.add.sprite(288, 570, 'rotate');
    rotate.anchor.setTo(0.5);
    rotate.inputEnabled = true;
    rotate.customParams = {fun: 10};


    const actions = [apple, candy, toy, rotate];
    let selected = null;
    controlsBlocked = false;

    const updateText = () => {
        healthText.setText(pet.customParams.health);
        funText.setText(pet.customParams.fun);
    };
    const clearSelection = ()=>{
        for(const action of actions){
            action.alpha = 1;
        }
    };
    const pickItem = (sprite, event)=>{
        if(controlsBlocked){
            return;
        }
        clearSelection();
        if(!!selected && selected.key===sprite.key){
            selected = null;
            sprite.alpha = 1;
            return;
        }
        sprite.alpha = 0.4;
        selected = sprite;
    };
    const rotatePet = (sprite, event)=>{
        if(controlsBlocked){
            return;
        }
        clearSelection();
        selected = null;
        controlsBlocked = true;
        sprite.alpha = 0.4;
        const rotation = this.game.add.tween(pet);
        rotation.to({angle: '+720'}, 1000);
        rotation.onComplete.add(()=>{
            controlsBlocked = false;
            sprite.alpha = 1;
            pet.customParams.fun += 20;
            updateText();
        });
        rotation.start();
    };

    const insertSelection = (sprite, event)=>{
        if(!selected||controlsBlocked){
            return;
        }
        const {x, y} = event.position;
        const newElement = this.game.add.sprite(x, y, selected.key);
        newElement.anchor.setTo(0.5);
        newElement.customParams = selected.customParams;
        const fetching = this.game.add.tween(pet);
        controlsBlocked = true;
        fetching.to({x,y}, 700);
        fetching.start();
        fetching.onComplete.add(()=>{
            controlsBlocked = false;
            pet.animations.play('eat');
            for(const attr in newElement.customParams){
                pet.customParams[attr] += newElement.customParams[attr];
            }
            newElement.destroy();
            updateText();
        });
    };

    const decreaseStats = ()=>{
        pet.customParams.health-=10;
        pet.customParams.fun-=15;
        updateText();
    };

    this.game.time.events.loop(Phaser.Timer.SECOND*5, decreaseStats);

    apple.events.onInputDown.add(pickItem);
    candy.events.onInputDown.add(pickItem);
    toy.events.onInputDown.add(pickItem);
    rotate.events.onInputDown.add(rotatePet);
    background.events.onInputDown.add(insertSelection);
    updateText();

}

function update(){
    if(pet.customParams.health<=0||pet.customParams.fun<=0){
        pet.frame = 4;
        controlsBlocked = true;
        this.game.time.events.add(Phaser.Timer.SECOND*5, ()=>{
            this.state.start('home', true, false, 'GAME OVER');
        });
    }
}

export default {create, update};

