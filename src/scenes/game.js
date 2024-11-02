import Phaser from "phaser";
import Deck from "../deck.js";
import Clock from "../clock.js";
import Card from "../card.js";

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
        //this.clock.debugDrawPositions();
        //this.clock.testCheckWinCondition();
        this.clock.dealInitialCards();

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject instanceof Card) {
                if (gameObject.input.draggable) {  // Ensure only draggable cards move
                    gameObject.x = dragX;
                    gameObject.y = dragY;
                    //console.log('Card dragged:', gameObject);
                } else {
                    console.log('Card is not draggable:', gameObject);
                }
            } else {
                console.log('Not a card:', gameObject);
            }

        });

        this.input.on('dragend', (pointer, gameObject) => {
            console.log('dragend', gameObject);
            // Get the target drop zone for this card’s value
            const positionIndex = gameObject.getNumericValue();
            const targetPosition = this.clock.positions.get(positionIndex);

            // Calculate distance to target position
            const toleranceDistance = 30;  // Adjust based on desired snap radius
            const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, targetPosition.x, targetPosition.y);

            if (distance < toleranceDistance) {
                // Place card in correct position using `handleCardDrop`
                this.clock.handleCardDrop(gameObject, positionIndex);
            } else {
                // Return to original position if drop is outside tolerance
                gameObject.returnToOriginalPosition();
            }
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
