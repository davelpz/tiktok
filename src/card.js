export default class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, suit, value) {
        super(scene, x, y);

        this.suit = suit;
        this.value = value;
        this.isFaceUp = false;
        this.isInDeck = true;
        this.currentPosition = undefined;

        // Create the card front and back sprites
        this.front = scene.add.image(0, 0, `card_${suit}_${value}`);
        this.back = scene.add.image(0, 0, 'cardback_blue');

        // Add sprites to container
        this.add([this.back, this.front]);

        // Set front invisible initially (card starts face down)
        this.front.setVisible(false);

        // Add to scene's display list
        scene.add.existing(this);

        // Set up input handling
        this.setSize(this.front.width, this.front.height);
        console.log('Setting up interactive area:', this.front.width, this.front.height);
        this.setInteractive({useHandCursor: true});  // Make it obvious card is clickable

        // Debug bounds
        this.debugBounds = scene.add.rectangle(0, 0, this.front.width, this.front.height, 0xff0000, 0.2);
        this.debugBounds.setVisible(false);  // Set to true to see clickable areas
        this.add(this.debugBounds);

        // Track original position for drag cancellation
        this.originalX = x;
        this.originalY = y;

        //console.log(`Created card: ${suit} ${value}`);  // Debug log
    }

    enableDragging() {
        // Make this card draggable without re-adding the scene-level listener
        this.setInteractive({draggable: true});
        this.scene.input.setDraggable(this);
        //console.log('Simple drag enabled for:', this.suit, this.value);
    }

    disableDragging() {
        this.removeInteractive();  // Remove all interactive state
        this.setInteractive({useHandCursor: true});  // Restore clickability without drag
        if (this.input) {
            this.input.draggable = false;  // Directly override draggable attribute
        }
        //console.log(`Dragging disabled for card: ${this.suit} ${this.value}`);
        //console.log('input.draggable after removeInteractive:', this.input ? this.input.draggable : 'no input');
    }


    setupDragEvents() {
        this.on('dragstart', () => {
            this.scene.children.bringToTop(this);
            console.log('DRAG START:', this.suit, this.value);
        });

        this.on('drag', (pointer, dragX, dragY) => {
            console.log('DRAGGING to:', dragX, dragY);
            this.x = dragX;
            this.y = dragY;
        });

        this.on('dragend', () => {
            console.log('DRAG END');
            //this.returnToOriginalPosition();
        });

        // Debug log to confirm events were set up
        console.log('Drag events initialized for:', this.suit, this.value);
    }

    flip() {
        if (this.scene.tweens.isTweening(this)) return;

        // Store current scale
        const currentScaleX = this.scaleX;
        const currentScaleY = this.scaleY;

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
                    scaleX: currentScaleX,
                    duration: 150,
                    ease: 'Linear'
                });
            }
        });
        console.log(`Flipped card: ${this.value} of ${this.suit}`);  // Debug log
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
        switch (this.value) {
            case 'ace':
                return 1;
            case 'jack':
                return 11;
            case 'queen':
                return 12;
            case 'king':
                return 13;
            default:
                return parseInt(this.value);
        }
    }

    setHomePosition(x, y) {
        this.originalX = x;
        this.originalY = y;
        this.x = x;
        this.y = y;
    }

    setInDeck(isInDeck) {
        this.isInDeck = isInDeck;
        //console.log(`Card ${this.suit} ${this.value} set in deck: ${isInDeck}`);  // Debug log
    }
}