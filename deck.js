class Deck {
    constructor(scene, x, y) {
        this.scene = scene;
        this.deckX = x;
        this.deckY = y;
        this.cards = [];
        this.dealtCards = [];

        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];

        suits.forEach(suit => {
            values.forEach(value => {
                const card = new Card(scene, x, y, suit, value);
                card.setInDeck(true);

                // Add click handler for top card
                card.on('pointerdown', () => {
                    if (card.isInDeck && this.isTopCard(card)) {
                        this.handleCardClick();
                    }
                });

                this.cards.push(card);
            });
        });

        this.shuffle();
    }

    shuffle() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];

            // Update card positions to maintain stack appearance
            this.cards[i].setPosition(this.deckX, this.deckY);
            this.cards[j].setPosition(this.deckX, this.deckY);
        }

        // After shuffling, update all cards' positions
        this.cards.forEach((card, index) => {
            card.setPosition(this.deckX, this.deckY);
            card.setHomePosition(this.deckX, this.deckY);
        });
    }

    isTopCard(card) {
        return this.cards.length > 0 && this.cards[this.cards.length - 1] === card;
    }

    handleCardClick() {
        const card = this.dealCard();
        if (card) {
            card.setPosition(
                this.deckX + 150,  // Deal to the right of the deck
                this.deckY
            );
            card.setHomePosition(this.deckX + 150, this.deckY);
            card.flip();
        }
    }

    dealCard() {
        if (this.cards.length > 0) {
            const card = this.cards.pop();
            card.setInDeck(false);
            this.dealtCards.push(card);
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
                // Slightly offset each card in the stack
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
        });
    }

    setCardBacks(backStyle) {
        [...this.cards, ...this.dealtCards].forEach(card => {
            card.setCardBack(backStyle);
        });
    }
}