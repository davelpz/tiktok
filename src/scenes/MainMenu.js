import { Scene } from 'phaser';

// MainMenu Scene - This is the main menu for the game
export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.add.image(width/2, height/2, 'background');

        let logo = this.add.image(width/2, height/2, 'logo');
        // Shrink the image by 1/4
        logo.setScale(0.25);

        // this.add.text(width/2, height/2 + 300, 'Start', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}