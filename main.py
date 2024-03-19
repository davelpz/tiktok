import pyray as rl
import random
import math

# declare constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 800


# class to model the clock background
class Clock:
    width = 800
    height = 800

    def __init__(self):
        self.texture = rl.load_texture("images/clock/clock_face_arabic_template.png")

    def draw(self, x, y):
        rl.draw_texture(self.texture, x, y, rl.WHITE)

    def get_hour_position(self, hour):
        # Convert hour to angle (in radians)
        angle = (hour % 12) * math.pi / 6 - math.pi / 2  # Subtract pi/2 to rotate the angle so that 12 o'clock is at the top

        # Calculate the center of the clock
        cx, cy = self.width / 2, self.height / 2

        # Calculate the radius of the clock
        r = (self.width * 0.85) / 2

        # Calculate the x and y coordinates
        x = cx + r * math.cos(angle)
        y = cy + r * math.sin(angle)

        return int(x), int(y)


# class to model a playing card
class Card:
    width = 130
    height = 104

    def __init__(self, suit, value):
        self.suit = suit
        self.value = value
        self.texture = rl.load_texture(f"images/svg_playing_cards/fronts/{suit}_{value}.png")

    def draw(self, x, y):
        rl.draw_texture(self.texture, x, y, rl.WHITE)

    def __str__(self):
        return f"{self.value} of {self.suit}"


# class to model a deck cards
class Deck:
    suits = ["clubs", "diamonds", "hearts", "spades"]
    values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"]

    def __init__(self):
        self.cards = []
        for suit in self.suits:
            for value in self.values:
                self.cards.append(Card(suit, value))

    def draw(self, x, y):
        for card in self.cards:
            card.draw(x, y)
            x += 12

    def shuffle(self):
        random.shuffle(self.cards)

    def __str__(self):
        return f"Deck of {len(self.cards)} cards"


def hello():
    rl.init_window(SCREEN_WIDTH, SCREEN_HEIGHT, "TickTock")
    clock = Clock()
    deck = Deck()
    deck.shuffle()
    while not rl.window_should_close():
        rl.begin_drawing()
        rl.clear_background(rl.LIGHTGRAY)
        clock.draw(0, 0)
        # deck.draw(40, 200)
        card_index = 0
        for i in range(1, 13):
            x, y = clock.get_hour_position(i)
            deck.cards[card_index].draw(x - 65, y - 52)
            card_index += 1

#        rl.draw_text("Hello world", 190, 200, 20, rl.VIOLET)
        rl.end_drawing()
    rl.close_window()


# if run as a script do the following
if __name__ == "__main__":
    print("Starting...")
    hello()
