import Phaser from 'phaser'

export default class PrallaxScene extends Phaser.Scene
{
    constructor()
    {
        super('parallax-scene')
    }


    preload()
    {
    this.load.image('Ball', img/ball.png)
    }

    create()
    {
    
    this.walking = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'Walking')

    walking = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'Walking').setOrigin(0, 0).setScrollFactor(0)
    this.walking.tilePositionX = this.cam.scrollX * .3
    
    }

    update()
    {
    this.cameras.main.startFollow(ball)

    }
}