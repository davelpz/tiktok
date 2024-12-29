import Phaser from "phaser";
import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

// Calculate the game size based on viewport
function getGameSize() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    return {
        width: size,
        height: size
    };
}

const gameSize = getGameSize();

const width = gameSize.width;
const height = width * (16/9);
//console.log(width, height);
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: width,
    height: height,
    backgroundColor: '#000000', // Green felt color
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        GameOver
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {y: 0} // No gravity needed for cards
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// Handle responsive resizing
window.addEventListener('resize', () => {
    if (window.innerWidth < window.innerHeight) {
        let gameSize = getGameSize();
        let width = gameSize.width;
        let height = width * (16/9);
        //console.log(width, height);
        game.scale.resize(width, height);
        game.scale.refresh();
    } else {
        let gameSize = getGameSize();
        let height = gameSize.height;
        let width = height * (16/9);
        //console.log(width, height);
        game.scale.resize(width, height);
        game.scale.refresh();
    }

});