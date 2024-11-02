import Phaser from "phaser";
import Deck from "../deck.js";
import Clock from "../clock.js";

export default class ClockSolitaire extends Phaser.Scene {
    constructor() {
        super({key: 'ClockSolitaire'});
    }

    preload() {
        // Create loading bar
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        // Loading text
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px monospace',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        // Loading progress tracking
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0x9932cc, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Load all card fronts
        // Number cards (2-10)
        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
        const faceCards = ['ace', 'jack', 'queen', 'king'];

        // Load numbered cards
        suits.forEach(suit => {
            values.forEach(value => {
                this.load.image(
                    `card_${suit}_${value}`,
                    `assets/images/cards/fronts/${suit}_${value}.png`
                );
            });
        });

        // Load face cards
        suits.forEach(suit => {
            faceCards.forEach(face => {
                this.load.image(
                    `card_${suit}_${face}`,
                    `assets/images/cards/fronts/${suit}_${face}.png`
                );
            });
        });

        // Load jokers
        this.load.image('card_joker_red', 'assets/images/cards/fronts/joker_red.png');
        this.load.image('card_joker_black', 'assets/images/cards/fronts/joker_black.png');

        // Load card backs
        const backs = [
            'abstract', 'abstract_clouds', 'abstract_scene',
            'astronaut', 'blue', 'blue2', 'castle', 'cars',
            'fish', 'frog', 'red', 'red2'
        ];

        backs.forEach(back => {
            this.load.image(
                `cardback_${back}`,
                `assets/images/cards/backs/${back}.png`
            );
        });
    }

    create() {
        // Create deck slightly off-center
        this.deck = new Deck(
            this,
            this.cameras.main.centerX - 200,  // offset left from center
            this.cameras.main.centerY
        );

        // Create and visualize clock layout
        this.clock = new Clock(this, this.cameras.main.centerX, this.cameras.main.centerY);
        this.clock.debugDrawPositions();
        //this.clock.testCheckWinCondition();
        this.clock.dealInitialCards();

        // Add some test controls with keyboard
        this.input.keyboard.on('keydown-SPACE', () => {
            // Deal a single card and flip it
            const card = this.deck.dealCard();
            if (card) {
                const targetX = this.cameras.main.centerX + 200;
                const targetY = this.cameras.main.centerY;

                this.tweens.add({
                    targets: card,
                    x: targetX,
                    y: targetY,
                    duration: 200,
                    ease: 'Power1',
                    onComplete: () => {
                        card.flip();
                        card.setHomePosition(targetX, targetY);
                    }
                });
            }
        });

        // R key to reset deck
        this.input.keyboard.on('keydown-R', () => {
            this.deck.resetDeck();
        });

        // D key to deal 4 cards to a test position
        this.input.keyboard.on('keydown-D', () => {
            // Use the same position as single card dealing
            this.deck.dealToPosition(
                this.cameras.main.centerX + 200,
                this.cameras.main.centerY
            );
        });

        // Add text instructions
        //this.add.text(10, 120, 'Controls:\nSPACE - Deal one card\nR - Reset deck\nD - Deal four cards', {
        //    font: '16px Arial',
        //    fill: '#ffffff'
        //});

        // Add remaining cards counter
        //this.cardsText = this.add.text(10, 80, '', {
        //    font: '16px Arial',
        //    fill: '#ffffff'
        //});

        // Update counter every frame
        //this.events.on('update', () => {
        //    this.cardsText.setText(`Cards remaining: ${this.deck.getCardsRemaining()}`);
        //});
    }
}
