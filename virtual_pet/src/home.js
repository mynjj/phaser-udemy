let message;

function init(msg){
    message = msg;
}

function create(){
    const bg = this.game.add.sprite(0, 0, 'backyard');
    bg.inputEnabled = true;
    bg.events.onInputDown.add(()=>this.state.start('game'));

    this.game.add.text(30, this.game.world.centerY, 'TOUCH TO START')
    if(message){
        this.game.add.text(30, this.game.world.centerY - 100, message)
    }
}

export default {init, create};
