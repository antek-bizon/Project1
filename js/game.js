let game
let red
let button
let ball
let platforms
let walking
let heading

const Direction = {
    LEFT: 1,
    RIGHT: 2
}

const state = {
    direction: Direction.RIGHT
}

/**
 * 
 * @param {Phaser.Scene} scene 
 * @param {number} count 
 * @param {string} texture 
 * @param {number} scrollFactor 
 */

const createAligned = (scene, count, texture, scrollFactor) => {
    let x = 0
    for (let i = 0; i < count; ++i)
    {
        const m = scene.add.image(x, scene.game.config.height, texture)
            .setOrigin(0, 2)
            .setScrollFactor(scrollFactor)
        
        x += m.width
    }
}


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            //debug: false
        }
    },
    scene: {
        preload: onPreload,
        create: onCreate,
        update: onUpdate
    }
}


function onLoad() {
    console.log('Hello World!')
    game = new Phaser.Game(config)
}

function onPreload() {
    //red = this.load.image('Red', 'img/Red.png')
    ball = this.load.spritesheet('Ball', 'img/Guy3.png', { frameWidth: 13.3, frameHeight: 22 })

    this.load.image('Ground', 'img/ground.png')
    this.load.image('Walking', 'img/ground-walking.png')
    this.load.image('Level00', 'img/level00.png')

    this.load.image('Sky', 'img/parallax/parallax_mountain_pack/layers/sky.png')
    this.load.image('C_trees', 'img/parallax/parallax_mountain_pack/layers/c_trees.png')
    this.load.image('Forest', 'img/parallax/parallax_mountain_pack/layers/forest.png')
    this.load.image('C_mountains', 'img/parallax/parallax_mountain_pack/layers/c-mountains.png')
    this.load.image('Mountain', 'img/parallax/parallax_mountain_pack/layers/mountain.png')
}

function onCreate() {
    
    //Parallax
    
    const width = game.config.width
    const height = game.config.height

    this.add.image(width * 0.5, height * 0.5, 'Sky')
        .setScale(1)
        .setScrollFactor(0)

    createAligned(this, 3, 'Mountain', 0.25)
    createAligned(this, 3, 'C_mountains', 0.5)
    createAligned(this, 3, 'Forest', 0.7)
    createAligned(this, 3, 'C_trees', 1)

    /*
    const m = this.add.image(0, height * 0.5, 'Mountain')
        .setOrigin(0, 0)
        .setScrollFactor(0.25)
    this.add.image(m.width, height * 0.5, 'Mountain')
        .setOrigin(0, 0)
        .setScrollFactor(0.25)


    this.add.image(0, height * 0.5, 'C_mountains')
        .setOrigin(0, 0)
        .setScrollFactor(0.5)
    this.add.image(0, height * 0.5, 'Forest')
        .setOrigin(0, 0)
        .setScrollFactor(0.75)
    this.add.image(0, height * 0.5, 'C_trees')
        .setOrigin(0, 0)
        .setScrollFactor(1)
    */

    this.cameras.main.setBounds(0, 0, width * 3, height)
    
    
    //End of parallax

    //Platforms 
    
    platforms = this.physics.add.staticGroup()
    platforms.create(0, 450, 'Level00').setOrigin(0, 0).refreshBody()
    
    platforms.create(-10, 300, 'Ground').setOrigin(0, 0).setScale(0.5).refreshBody()
    platforms.create(500, 200, 'Ground').setOrigin(0, 0).setScale(0.5).refreshBody()
    platforms.create(0, 550, 'Ground').setOrigin(0, 0).setScale(0.8).refreshBody()
    platforms.create(200, 550, 'Ground').setOrigin(0, 0).setScale(0.8).refreshBody()
    platforms.create(500, 550, 'Ground').setOrigin(0, 0).setScale(0.8).refreshBody()
    
    //End of platforms


    //button = this.add.image(0, 0, 'Red')
    //console.log(button)

    //Sprites physics
    
    ball = this.physics.add.sprite(0, 0, 'Ball').setOrigin(0, 0).setScale(2)
    //ball.setBounce(0.2)
    //ball.setCollideWorldBounds(true);
    
    this.physics.add.collider(ball, platforms)
    
    //End of sprites physics

    //Animations
    
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('Ball', { start: 4, end: 5 }),
        frameRate: 5,
        repeat: -1
    })
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'Ball', frame: heading } ],
        frameRate: 20
    })
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('Ball', { start: 1, end: 2 }),
        frameRate: 5,
        repeat: -1
    })
    
    this.anims.create({
        key: 'stop_left',
        frames: [ { key: 'Ball', frame: 3 } ],
        frameRate: 20
    })

    this.anims.create({
        key: 'stop_right',
        frames: [ { key: 'Ball', frame: 0 } ],
        frameRate: 20
    })
    //End of animations
}

function onUpdate() {
    cursors = this.input.keyboard.createCursorKeys()

    //const cam = this.cameras.main
    //const speed = 3

    if (cursors.left.isDown)
    {
        ball.setVelocityX(-160)
        //cam.scrollX -= speed

        //Animations
        ball.anims.play('left', true)
        state.direction = Direction.LEFT
        //End of animations
    }
    else if (cursors.right.isDown)
    {
        ball.setVelocityX(160)
        //cam.scrollX += speed


        //Animations
        ball.anims.play('right', true)
        state.direction = Direction.RIGHT
        //End of animations
    }
    else
    {
        ball.setVelocityX(0)


        //Animations
        if (state.direction === Direction.LEFT) {
            ball.anims.play('stop_left')
        } else {
            ball.anims.play('stop_right')
        }
        //End of animations
    }

    if (cursors.up.isDown && ball.body.touching.down)
    {
        ball.setVelocityY(-330)
    }

    this.cameras.main.startFollow(ball)

}


/*
function onClick() {
    // red.visible = false
    button.visible = false
}
*/

