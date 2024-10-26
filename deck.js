class Deck {
    constructor(scene, x, y) {
        this.scene = scene;
        this.deckX = x;
        this.deckY = y;
        this.cards = [];
        this.dealtCards = [];

        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];

        // Create a hit zone for the deck
        this.hitZone = scene.add.rectangle(x, y, 140, 190, 0x00ff00, 0);
        this.hitZone.setInteractive();
        this.hitZone.on('pointerdown', () => {
            this.handleCardClick();
        });

        suits.forEach(suit => {
            values.forEach(value => {
                const card = new Card(scene, x, y, suit, value);
                card.setInDeck(true);
                this.cards.push(card);
            });
        });

        this.shuffle();

        // Debug text for development
        this.debugText = scene.add.text(10, 50, '', {
            font: '16px Arial',
            fill: '#ffffff'
        });
        this.updateDebugText();
    }

    updateDebugText() {
        this.debugText.setText(`Cards in deck: ${this.cards.length}\nDealt cards: ${this.dealtCards.length}`);
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }

        // Update all cards' positions
        this.cards.forEach((card, index) => {
            card.setPosition(this.deckX, this.deckY);
            card.setHomePosition(this.deckX, this.deckY);
            // Bring later cards to top of the display list
            this.scene.children.bringToTop(card);
        });
    }

    handleCardClick() {
        console.log('Deck clicked!'); // Debug log
        const card = this.dealCard();
        if (card) {
            const targetX = this.deckX + 200;
            const targetY = this.deckY;

            // Animate the card being dealt
            this.scene.tweens.add({
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

            this.updateDebugText();
        }
    }

    dealCard() {
        if (this.cards.length > 0) {
            const card = this.cards.pop();
            card.setInDeck(false);
            this.dealtCards.push(card);
            this.scene.children.bringToTop(card);
            return card;
        }
        return null;
    }

    dealCards(numCards) {
        const dealtCards = [];
        for (let i = 0; i < numCards && this.cards.length > 0; i++) {
            dealtCards.push(this.dealCard());
        }
        return dealtCards;
    }

    dealToPosition(x, y) {
        const cards = this.dealCards(4);
        cards.forEach((card, index) => {
            if (card) {
                card.setPosition(x, y + (index * 2));
                card.setHomePosition(x, y + (index * 2));
            }
        });
        return cards;
    }

    getCardsRemaining() {
        return this.cards.length;
    }

    resetDeck() {
        while (this.dealtCards.length > 0) {
            const card = this.dealtCards.pop();
            card.setInDeck(true);
            this.scene.tweens.add({
                targets: card,
                x: this.deckX,
                y: this.deckY,
                duration: 300,
                ease: 'Back.easeOut',
                onComplete: () => {
                    if (card.isFaceUp) {
                        card.flip();
                    }
                }
            });
            this.cards.push(card);
        }

        this.scene.time.delayedCall(400, () => {
            this.shuffle();
            this.updateDebugText();
        });
    }

    setCardBacks(backStyle) {
        [...this.cards, ...this.dealtCards].forEach(card => {
            card.setCardBack(backStyle);
        });
    }
}