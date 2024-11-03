import Phaser from "phaser";
import Deck from "../deck.js";
import Clock from "../clock.js";
import Card from "../card.js";

export class Game extends Phaser.Scene {
    constructor() {
        super({key: 'Game'});
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
