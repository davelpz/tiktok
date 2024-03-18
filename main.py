import pyray as rl
import cairosvg

# declare constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 800


def hello():
    rl.init_window(SCREEN_WIDTH, SCREEN_HEIGHT, "TickTock")
    clock_image = rl.load_texture("images/clock/clock_face_arabic_template.png")
    card_image = rl.load_texture("images/svg_playing_cards/fronts/clubs_2.png")
    while not rl.window_should_close():
        rl.begin_drawing()
        rl.clear_background(rl.LIGHTGRAY)
        rl.draw_texture(clock_image, 0, 0, rl.WHITE)
        rl.draw_texture(card_image, 335, 10, rl.WHITE)
        rl.draw_text("Hello world", 190, 200, 20, rl.VIOLET)
        rl.end_drawing()
    rl.close_window()


# if run as a script do the following
if __name__ == "__main__":
    print("Starting...")
    hello()
