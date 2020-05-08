import Phaser from 'phaser';
import _ from 'lodash/fp';

const ROWS = 8;
const COLS = 8;
const VARIATIONS = 7;
const BLOCK_SIZE = 35;
const ANIMATION_TIME = 200;
const TOP = 230;
const MARGIN_H = (360-COLS*BLOCK_SIZE)/2;

class Block extends Phaser.GameObjects.Sprite{
    constructor(scene, row, col, key){
        super(scene, x, y, key);
        this.scene = scene;

        this.setDisplayOrigin(0.5);
    }
    draw = ()=>{
    }
}

const toCoords = (row, col)=>{
    return {
        x: MARGIN_H+BLOCK_SIZE/2+col*BLOCK_SIZE,
        y: TOP+BLOCK_SIZE/2+row*BLOCK_SIZE,
    };
}

const randBean = ()=>Math.ceil(Math.random()*VARIATIONS);

const getRandomRow = ()=>
      _.times(randBean, COLS);

const getRandomState = ()=>
      _.times(getRandomRow, 2*ROWS);


class BeanDispenser {
    selected = null;
    blocked = false;
    constructor(scene){
        this.scene = scene;
        this.visibleBeans = scene.add.group();
        this.dispenserState = getRandomState();
        /*
        while(removeChains()){
            gravityPull();
        }
        */
        for(let i=0; i<ROWS; i++){
            for(let j=0; j<COLS; j++){
                this.showBean(i, j, this.dispenserState[ROWS+i][j]);
            }
        }
    }
    gravityPull = ()=>{
        for(let i=0; i<COLS; i++){
            for(let j=2*ROWS-1; j>=0; j--){
                if(this.dispenserState[j][i]===0){
                    for(let k=j; k>0;k--){
                        this.dispenserState[k][i] = this.dispenserState[k-1][i];
                    }
                    this.dispenserState[0][i] = randBean();
                    j++;
                }
            }
        }
    }
    removeChains = ()=>{
        let toRemove = [];
        // row checking
        for(let i=0; i<ROWS; i++){
            let j=0;
            while(j<COLS){
                let initial = j;
                let checking = this.dispenserState[ROWS+i][j];
                while(checking===this.dispenserState[ROWS+i][j]){
                    j++;
                }
                let count = j-initial;
                if(count>=3){
                    for(let k=0; k<count; k++){
                        toRemove.push([ROWS+i, initial+k]);
                    }
                }
            }
        }
        // col checking
        for(let i=0; i<COLS; i++){
            let j=0;
            while(j<ROWS){
                let initial = j;
                let checking = this.dispenserState[ROWS+j][i];
                while(checking===this.dispenserState[ROWS+j][i]){
                    j++;
                }
                let count = j-initial;
                if(count>=3){
                    for(let k=0; k<count; k++){
                        toRemove.push([ROWS+initial+k, i]);
                    }
                }
            }
        }
        return toRemove;
        for(const [row, col] of toRemove){
            this.dispenserState[row][col] = 0;
        }
        return toRemove.length>0;
    }
    swapBeans = (b1Data, b2Data)=>{
        const {x: b1x, y: b1y} = toCoords(b1Data.row, b1Data.col);
        const {x: b2x, y: b2y} = toCoords(b2Data.row, b2Data.col);
        this.blocked = true;
        const switching = this.scene.tweens.add({
            targets: b1Data.bean,
            duration: ANIMATION_TIME/2,
            x: b2x,
            y: b2y,
            
        });
        switching.setCallback('onComplete', ()=>{
            const t = this.dispenserState[b1Data.row][b1Data.col];
            this.dispenserState[b1Data.row][b1Data.col] = this.dispenserState[b2Data.row][b2Data.col];
            this.dispenserState[b2Data.row][b2Data.col] = t;
            if(removeChains().length>0){
                
            }
        });
        this.scene.tweens.add({
            targets: b2Data.bean,
            duration: ANIMATION_TIME/2,
            x: b1x,
            y: b1y
        });
    };
    showBean = (row, col, type)=>{
        const {x, y} = toCoords(row, col);
        const bean = this.visibleBeans.get(x, y, 'block'+type);
        bean.setInteractive();
        bean.on('pointerdown', ()=>{
            if(this.blocked){
                return;
            }
            if(this.selected){
                const {row: nRow, col: nCol, bean: nBean} = this.selected;
                if(Math.abs(nRow-row)+Math.abs(nCol-col)===1){
                    this.swapBeans(this.selected, {row, col, bean});
                    /*
                    this.selected = null;
                    nBean.setScale(1);
                    bean.setScale(1);
                    */
                }
            }
            else{
                bean.setScale(1.3);
                this.selected = {row, col, bean};
            }
        });
    };
}

class GameScene extends Phaser.Scene {
    create = ()=>{
        const bg = this.add.image(0, 0, 'background');
        bg.setDisplayOrigin(0);

        this.drawGrid();
        const beans = new BeanDispenser(this);
    };
    drawGrid = ()=>{
        for(let i=0; i<ROWS; i++){
            for(let j=0; j<COLS; j++){
                const {x, y} = toCoords(i, j);
                this.add.rectangle(x, y, 33, 33, 0, 0.2);
            }
        }
    };
}

export default GameScene;
