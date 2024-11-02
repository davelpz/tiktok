import Phaser from "phaser";
import ClockSolitaire from "./scenes/game.js";

// Calculate the game size based on viewport
function getGameSize() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    return {
        width: size,
        height: size
    };
}

const gameSize = getGameSize();
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: gameSize.width,
    height: gameSize.height,
    backgroundColor: '#076324', // Green felt color
    scene: ClockSolitaire,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {y: 0} // No gravity needed for cards
        }
    }
};

const game = new Phaser.Game(config);

// Handle responsive resizing
window.addEventListener('resize', () => {
    const newSize = getGameSize();
    game.scale.resize(newSize.width, newSize.height);
});