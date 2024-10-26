class Deck {
    constructor(scene, x, y) {
        this.scene = scene;
        this.deckX = x;
        this.deckY = y;
        this.cards = [];

        // Create all 52 cards
        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];

        suits.forEach(suit => {
            values.forEach(value => {
                const card = new Card(scene, x, y, suit, value);
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
    }

    dealCard() {
        if (this.cards.length > 0) {
            return this.cards.pop();
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

    // Deal four cards to a specific position
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

    // Reset all cards back to deck
    resetDeck() {
        this.cards.forEach(card => {
            card.setPosition(this.deckX, this.deckY);
            card.setHomePosition(this.deckX, this.deckY);
            if (card.isFaceUp) {
                card.flip();
            }
        });
        this.shuffle();
    }

    // Change card backs for all cards in deck
    setCardBacks(backStyle) {
        this.cards.forEach(card => {
            card.setCardBack(backStyle);
        });
    }
}