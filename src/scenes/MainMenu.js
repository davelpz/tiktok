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
        this.background = this.add.image(0, 0, 'background').setOrigin(0.5);
        this.logo = this.add.image(0, 0, 'logo').setOrigin(0.5).setScale(0.20);

        this.scale.on('resize', this.resizeBackground, this);
        this.resizeBackground();

        // this.add.text(width/2, height/2 + 300, 'Start', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }

    resizeBackground ()
    {
        let width = this.scale.width;
        let height = this.scale.height;
//console.log(width, height);
        this.background.setPosition(width / 2, height / 2);
        this.background.setDisplaySize(width, height);

        this.logo.setPosition(width / 2, height / 2);
    }
}