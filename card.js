class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, suit, value) {
        super(scene, x, y);

        this.suit = suit;
        this.value = value;
        this.isFaceUp = false;
        this.isInDeck = true;  // New property to track if card is in deck

        // Create the card front and back sprites
        this.front = scene.add.image(0, 0, `card_${suit}_${value}`);
        this.back = scene.add.image(0, 0, 'cardback_blue');

        // Add sprites to container
        this.add([this.back, this.front]);

        // Set front invisible initially (card starts face down)
        this.front.setVisible(false);

        // Add to scene's display list
        scene.add.existing(this);

        // Enable input handling but start with draggable false
        this.setSize(this.front.width, this.front.height);
        this.setInteractive();

        // Track original position for drag cancellation
        this.originalX = x;
        this.originalY = y;
    }

    enableDragging() {
        this.setInteractive({ draggable: true });
        this.setupDragEvents();
    }

    disableDragging() {
        this.disableInteractive();
        this.setInteractive(); // Keep it clickable but not draggable
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
            this.returnToOriginalPosition();
        });
    }

    flip() {
        if (this.scene.tweens.isTweening(this)) return;

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

    setHomePosition(x, y) {
        this.originalX = x;
        this.originalY = y;
    }

    setInDeck(isInDeck) {
        this.isInDeck = isInDeck;
        if (isInDeck) {
            this.disableDragging();
        } else {
            this.enableDragging();
        }
    }
}