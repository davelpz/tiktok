import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(width/2, height/2, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(width/2, height/2, width/2, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(width/2-width/4 + 4, height/2, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + ((width/2 - 8) * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        //this.load.setPath('assets');

        this.load.image('logo', 'assets/images/logo.png');

        // Load all card fronts
        // Number cards (2-10)
        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
        const faceCards = ['ace', 'jack', 'queen', 'king'];

        // Load numbered cards
        suits.forEach(suit => {
            values.forEach(value => {
                this.load.image(
                    `card_${suit}_${value}`,
                    `assets/images/cards/fronts/${suit}_${value}.png`
                );
            });
        });

        // Load face cards
        suits.forEach(suit => {
            faceCards.forEach(face => {
                this.load.image(
                    `card_${suit}_${face}`,
                    `assets/images/cards/fronts/${suit}_${face}.png`
                );
            });
        });

        // Load jokers
        this.load.image('card_joker_red', 'assets/images/cards/fronts/joker_red.png');
        this.load.image('card_joker_black', 'assets/images/cards/fronts/joker_black.png');

        // Load card backs
        const backs = [
            'abstract', 'abstract_clouds', 'abstract_scene',
            'astronaut', 'blue', 'blue2', 'castle', 'cars',
            'fish', 'frog', 'red', 'red2'
        ];

        backs.forEach(back => {
            this.load.image(
                `cardback_${back}`,
                `assets/images/cards/backs/${back}.png`
            );
        });

    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
       this.scene.start('MainMenu');
    }
}