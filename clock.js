class Clock {
    constructor(scene, x, y) {
        this.scene = scene;
        this.centerX = x;
        this.centerY = y;

        // Calculate radius based on canvas size
        const canvasSize = Math.min(
            this.scene.scale.width,
            this.scene.scale.height
        );
        this.radius = canvasSize * 0.40;  // 40% of canvas size/**/

        // Create event emitter
        this.events = new Phaser.Events.EventEmitter();

        // Initialize storage for positions and card stacks
        this.positions = new Map(); // Will store position data for each clock position
        this.cardStacks = new Map(); // Will store cards at each position

        this.setupClockPositions();
        this.setupDropZones();
    }

    get cardScale() {
        const spaceBetweenPositions = this.radius * Math.tan(Math.PI / 6);
        const desiredCardWidth = spaceBetweenPositions * 0.55;
        return desiredCardWidth / 234;
    }

    setupClockPositions() {
        // start at the 1 o'clock position
        const startAngle =  -60;
        const angleIncrement = 360 / 12;

        // Setup positions 1-12 around the clock (1=Ace through 12=Queen)
        for (let i = 1; i <= 12; i++) {
            // Convert to radians and calculate position
            const angle = (startAngle + (i - 1) * angleIncrement) * (Math.PI / 180);
            const x = this.centerX + this.radius * Math.cos(angle);
            const y = this.centerY + this.radius * Math.sin(angle);

            this.positions.set(i, {x, y});

            // Initialize empty card stack for this position
            this.cardStacks.set(i, []);
        }

        // Setup position 13 (King) in the center
        this.positions.set(13, {x: this.centerX, y: this.centerY});
        this.cardStacks.set(13, []);
    }

    debugDrawPositions() {
        // Draw circles for each position
        for (let i = 1; i <= 13; i++) {
            const pos = this.positions.get(i);

            // Draw circle
            const circle = this.scene.add.circle(pos.x, pos.y, 30, 0x00ff00, 0.3);

            // Add position number
            const text = this.scene.add.text(pos.x - 5, pos.y - 5, i.toString(), {
                font: '16px Arial',
                fill: '#ffffff'
            });
        }
    }

    setupDropZones() {
        console.log('Setting up drop zones');
        this.dropZones = new Map();

        // Create a drop zone for each position (1-13)
        for (let i = 1; i <= 13; i++) {
            const pos = this.positions.get(i);

            // Calculate scaled dimensions
            const scaledWidth = 234 * this.cardScale * 1.1;
            const scaledHeight = 333 * this.cardScale * 1.1;

            // Create drop zone rectangle with correct card dimensions
            const zone = this.scene.add.rectangle(pos.x, pos.y, scaledWidth, scaledHeight, 0x00FF00, 1);

            console.log('Drop zone set interactive for position:', i);

            this.dropZones.set(i, zone);
        }
    }

    handleCardDrop(card, positionIndex) {
        // Convert card value to numeric (position) value
        const cardValue = card.getNumericValue();

        // Validate card placement
        if (cardValue === positionIndex) {
            // Get position coordinates
            const pos = this.positions.get(positionIndex);

            // Get current stack at this position
            const stack = this.cardStacks.get(positionIndex);

            // Add card to stack
            stack.push(card);

            // Position card in stack (slight offset for each card)
            card.setPosition(pos.x, pos.y + stack.length * 0.5);
            card.setHomePosition(pos.x, pos.y + stack.length * 0.5);

            // Emit card placed event
            this.events.emit('cardPlaced', {card, position: positionIndex, stackSize: stack.length});

            // Check win condition
            this.checkWinCondition();
        } else {
            // Invalid placement - return card to original position
            card.returnToOriginalPosition();

            // Emit invalid placement event
            this.events.emit('invalidPlacement', {card, attemptedPosition: positionIndex});
        }
    }

    dealInitialCards() {
        // Need to get the deck from the scene
        const deck = this.scene.deck;

        // Deal 4 cards to each position (1-13)
        for (let position = 1; position <= 13; position++) {
            const cards = deck.dealCards(4);
            const pos = this.positions.get(position);

            // Place cards at position with slight offset
            cards.forEach((card, index) => {
                card.setScale(this.cardScale, this.cardScale);  // Apply calculated scale
                card.setPosition(pos.x, pos.y + index * 0.5);
                card.setHomePosition(pos.x, pos.y + index * 0.5);
                card.disableDragging();  // Disable dragging by default

                // Make the top card of position 13 (king) draggable
                if (position === 13 && index === cards.length - 1) {
                    card.enableDragging(); // Enable dragging for the top card
                    card.flip();  // Flip it face up so we can see what it is
                    console.log('Made card draggable:', card.suit, card.value);
                    console.log('Card interactive state:', card.input.draggable);  // Add this line
                }
            });

            // Store cards in our stacks
            this.cardStacks.set(position, cards);
        }
    }

    checkWinCondition() {
        // Check if king position is complete (all cards revealed)
        const kingStack = this.cardStacks.get(13);
        if (this.isKingPositionComplete()) {
            // King stack is complete, now check if all other positions are complete
            const allPositionsComplete = this.areAllPositionsComplete();

            if (allPositionsComplete) {
                this.events.emit('gameWon');
            } else {
                this.events.emit('gameLost');
            }

            return true; // Game is over (either won or lost)
        }

        return false; // Game continues
    }

    isKingPositionComplete() {
        const kingStack = this.cardStacks.get(13);
        return kingStack.every(card =>
            card.isFaceUp && card.getNumericValue() === 13
        );
    }

    areAllPositionsComplete() {
        // Check positions 1 through 12 (Ace through Queen)
        return Array.from({length: 12}, (_, i) => i + 1).every(position => {
            const stack = this.cardStacks.get(position);
            return stack.every(card =>
                card.isFaceUp && card.getNumericValue() === position
            );
        });
    }

    testCheckWinCondition() {
        // Create mock card class for testing
        class MockCard {
            constructor(value, isFaceUp) {
                this.value = value;
                this.isFaceUp = isFaceUp;
            }

            getNumericValue() {
                return this.value;
            }
        }

        // Test 1: Game not over - King position not complete
        // Set up king stack with face down kings
        this.cardStacks.set(13, [
            new MockCard(13, false),
            new MockCard(13, false),
            new MockCard(13, false),
            new MockCard(13, false)
        ]);

        const continueResult = this.checkWinCondition();
        console.log("Test 1 - King stack:", this.cardStacks.get(13));
        console.assert(
            continueResult === false,
            "Game should continue when king position is not complete"
        );

        // Test 2: Game lost - King position complete but other positions not complete
        // Set up king stack with all face-up kings
        this.cardStacks.set(13, [
            new MockCard(13, true),
            new MockCard(13, true),
            new MockCard(13, true),
            new MockCard(13, true)
        ]);
        // Set up incomplete position 1 (some face down aces)
        this.cardStacks.set(1, [
            new MockCard(1, false),
            new MockCard(1, false),
            new MockCard(1, true),
            new MockCard(1, true)
        ]);

        const lostResult = this.checkWinCondition();
        console.log("Test 2 - King stack:", this.cardStacks.get(13));
        console.log("Test 2 - Position 1:", this.cardStacks.get(1));
        console.assert(
            lostResult === true,
            "Game should be over (lost) when king position is complete but others aren't"
        );

        // Test 3: Game won - King position and all positions complete
        // Set up all positions (1-12) with face-up cards of correct value
        for (let pos = 1; pos <= 12; pos++) {
            this.cardStacks.set(pos, [
                new MockCard(pos, true),
                new MockCard(pos, true),
                new MockCard(pos, true),
                new MockCard(pos, true)
            ]);
        }
        // King position still complete

        const wonResult = this.checkWinCondition();
        console.log("Test 3 - All positions complete");
        console.assert(
            wonResult === true,
            "Game should be over (won) when all positions complete"
        );

        // Test 4: Mixed state - King position complete, some positions complete but not all
        this.cardStacks.set(13, [
            new MockCard(13, true),
            new MockCard(13, true)
        ]);
        this.cardStacks.set(1, [  // Complete
            new MockCard(1, true),
            new MockCard(1, true)
        ]);
        this.cardStacks.set(2, [  // Complete
            new MockCard(2, true),
            new MockCard(2, true)
        ]);
        this.cardStacks.set(3, [  // Incomplete
            new MockCard(3, false),
            new MockCard(3, true)
        ]);

        const mixedResult = this.checkWinCondition();
        console.log("Test 4 - Mixed completion state");
        console.assert(
            mixedResult === true,
            "Game should be over (lost) when king complete but only some positions complete"
        );

        // Test 5: Wrong cards in position
        this.cardStacks.set(13, [
            new MockCard(13, true),
            new MockCard(13, true)
        ]);
        this.cardStacks.set(1, [
            new MockCard(2, true),  // Wrong card in position 1
            new MockCard(1, true)
        ]);

        const wrongCardResult = this.checkWinCondition();
        console.log("Test 5 - Wrong cards in position");
        console.assert(
            wrongCardResult === true,
            "Game should be over (lost) when king complete and positions have wrong cards"
        );

        // Test 6: Empty stacks
        this.cardStacks.set(13, [
            new MockCard(13, true),
            new MockCard(13, true)
        ]);
        this.cardStacks.set(1, []);  // Empty stack
        this.cardStacks.set(2, [
            new MockCard(2, true)
        ]);

        const emptyStackResult = this.checkWinCondition();
        console.log("Test 6 - Empty stack");
        console.assert(
            emptyStackResult === true,
            "Game should be over (lost) when king complete and some positions empty"
        );

        let eventReceived = '';

        // Set up event listeners
        this.events.on('gameWon', () => {
            eventReceived = 'won';
        });

        this.events.on('gameLost', () => {
            eventReceived = 'lost';
        });

        // Test win condition
        for (let pos = 1; pos <= 12; pos++) {
            this.cardStacks.set(pos, [
                new MockCard(pos, true),
                new MockCard(pos, true)
            ]);
        }
        this.cardStacks.set(13, [
            new MockCard(13, true),
            new MockCard(13, true)
        ]);

        this.checkWinCondition();
        console.assert(
            eventReceived === 'won',
            `Expected 'won' event but got '${eventReceived}'`
        );

        // Reset event and test loss condition
        eventReceived = '';
        this.cardStacks.set(1, [
            new MockCard(1, false),  // incomplete position
            new MockCard(1, true)
        ]);

        this.checkWinCondition();
        console.assert(
            eventReceived === 'lost',
            `Expected 'lost' event but got '${eventReceived}'`
        );

    }
}

