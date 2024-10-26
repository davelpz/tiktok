class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, suit, value) {
        super(scene, x, y);

        this.suit = suit;
        this.value = value;
        this.isFaceUp = false;

        // Create the card front and back sprites
        this.front = scene.add.image(0, 0, `card_${suit}_${value}`);
        this.back = scene.add.image(0, 0, 'cardback_blue'); // Default back

        // Add sprites to container
        this.add([this.back, this.front]);

        // Set front invisible initially (card starts face down)
        this.front.setVisible(false);

        // Add to scene's display list
        scene.add.existing(this);

        // Enable input handling
        this.setSize(this.front.width, this.front.height);
        this.setInteractive({ draggable: true });

        // Setup drag events
        this.setupDragEvents();

        // Track original position for drag cancellation
        this.originalX = x;
        this.originalY = y;
    }

    setupDragEvents() {
        this.on('dragstart', () => {
            this.scene.children.bringToTop(this);
        });

        this.on('drag', (pointer, dragX, dragY) => {
            this.x = dragX;
            this.y = dragY;
        });

        this.on('dragend', () => {
            // To be implemented: Check if card is over valid drop zone
            // If not, return to original position
            this.returnToOriginalPosition();
        });
    }

    flip() {
        // Flip animation
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            duration: 150,
            ease: 'Linear',
            onComplete: () => {
                this.isFaceUp = !this.isFaceUp;
                this.front.setVisible(this.isFaceUp);
                this.back.setVisible(!this.isFaceUp);

                this.scene.tweens.add({
                    targets: this,
                    scaleX: 1,
                    duration: 150,
                    ease: 'Linear'
                });
            }
        });
    }

    returnToOriginalPosition() {
        this.scene.tweens.add({
            targets: this,
            x: this.originalX,
            y: this.originalY,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    setCardBack(backStyle) {
        this.back.setTexture(`cardback_${backStyle}`);
    }

    // Getters for card properties
    getValue() {
        return this.value;
    }

    getSuit() {
        return this.suit;
    }

    getNumericValue() {
        switch(this.value) {
            case 'ace': return 1;
            case 'jack': return 11;
            case 'queen': return 12;
            case 'king': return 13;
            default: return parseInt(this.value);
        }
    }

    // Method to update card's "home" position
    setHomePosition(x, y) {
        this.originalX = x;
        this.originalY = y;
    }
}