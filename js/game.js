let game
let red
let button
let ball
let platforms

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
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
    ball = this.load.image('Ball', 'img/ball.png')

    this.load.image('Background', 'img/background.png')
    this.load.image('Ground', 'img/ground.png')
    
}

function onCreate() {
    this.add.image(0, 0, 'Background').setScale(0.665).setOrigin(0, 0)

    platforms = this.physics.add.staticGroup()
    platforms.create(-10, 300, 'Ground').setOrigin(0, 0).setScale(0.5).refreshBody()
    platforms.create(500, 200, 'Ground').setOrigin(0, 0).setScale(0.5).refreshBody()
    platforms.create(0, 550, 'Ground').setOrigin(0, 0).setScale(0.8).refreshBody()
    platforms.create(200, 550, 'Ground').setOrigin(0, 0).setScale(0.8).refreshBody()
    platforms.create(500, 550, 'Ground').setOrigin(0, 0).setScale(0.8).refreshBody()
    

    //button = this.add.image(0, 0, 'Red')
    //console.log(button)
    ball = this.physics.add.sprite(0, 0, 'Ball').setOrigin(0, 0).setScale(0.3)
    ball.setBounce(0.2)
    ball.setCollideWorldBounds(true);

    this.physics.add.collider(ball, platforms)

    
}

function onUpdate() {
    cursors = this.input.keyboard.createCursorKeys()
    if (cursors.left.isDown)
    {
    ball.setVelocityX(-160);

    //ball.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
    ball.setVelocityX(160);

    //ball.anims.play('right', true);
    }
    else
    {
    ball.setVelocityX(0);

    //ball.anims.play('turn');
    }

    if (cursors.up.isDown && ball.body.touching.down)
    {
    ball.setVelocityY(-330);
    }
}

function onClick() {
    // red.visible = false
    button.visible = false
}


