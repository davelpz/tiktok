import pyray as rl
import cairosvg
import os

# declare constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 800


def svg_to_png(svg_file, width, height):
    # get path from svg_file without the file extension and add .png
    path = svg_file.split(".")[0]
    path = path + ".png"

    cairosvg.svg2png(url=svg_file, write_to=path, output_width=width, output_height=height)


def processDir(dir, width, height):
    # walk through the directory
    for root, dirs, files in os.walk(dir):
        for file in files:
            if file.endswith(".svg"):
                print("Converting: ", file)
                svg_to_png(os.path.join(root, file), width, height)

# if run as a script do the following
if __name__ == "__main__":
    print("Starting...")
    processDir("images/clock", 800, 800)
    processDir("images/svg_playing_cards", 100 * 1.30, 80 * 1.30)
    # hello()
