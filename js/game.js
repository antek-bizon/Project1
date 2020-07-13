let game
let red
let button
let ball
let platforms
let walking
let heading
let score = 0
let scoreText


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
    let a = 0
    for (let i = 0; i < count; ++i)
    {
        const m = scene.add.image(a, scene.game.config.height, texture)
            .setOrigin(0, 2)
            .setScrollFactor(scrollFactor)
        
        a += m.width
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

function onLeftKeyUp(context) {
    console.log('Left Key is UP')
}

function onRightKeyUp(context) {
    console.log('Right Key is UP')
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
    this.load.image('Wall', 'img/wall.png')
    this.load.image('Tool', 'img/tool1.png')
    this.load.image('Bomb', 'img/bomb.png')
    this.load.image('Trap', 'img/trap.png')
    this.load.image('Interaction', 'img/interact.png')

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
    walls = this.physics.add.staticGroup()
    trap = this.physics.add.staticGroup()
    interaction = this.physics.add.staticGroup()

    platforms.create(0, 450, 'Level00')
        .setOrigin(0, 0)
        .refreshBody()
    walls.create(-10, 0, 'Wall')
        .setOrigin(0, 0)
        .refreshBody()
    trap.create(900, 300, 'Trap')
        .setOrigin(0, 0)
        .refreshBody()
    interaction.create(200, 200, 'Interaction')
        .setOrigin(0, 0)
        .refreshBody()
    
    platforms.create(-10, 300, 'Ground')
        .setOrigin(0, 0)
        .setScale(0.5)
        .refreshBody()
    platforms.create(500, 200, 'Ground')
        .setOrigin(0, 0)
        .setScale(0.5)
        .refreshBody()

    
    //platforms.create(0, 550, 'Ground').setOrigin(0, 0).setScale(0.8).refreshBody()
    //platforms.create(200, 550, 'Ground').setOrigin(0, 0).setScale(0.8).refreshBody()
    //platforms.create(500, 550, 'Ground').setOrigin(0, 0).setScale(0.8).refreshBody()
    
    //End of platforms


    //button = this.add.image(0, 0, 'Red')
    //console.log(button)

    //Sprites physics
    
    ball = this.physics.add.sprite(0, 0, 'Ball')
        .setOrigin(0, 0)
        .setScale(2)
    //ball.setBounce(0.2)
    //ball.setCollideWorldBounds(true);
    


    bombs = this.physics.add.group()

    stars = this.physics.add.group({
        key: 'Tool',
        repeat: 11,
        setXY: { x: 100, y: 0, stepX: 150 }
    })


    stars.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    })

    this.physics.add.collider(ball, platforms)
    this.physics.add.collider(ball, walls, climbing, null, this)
    this.physics.add.collider(stars, platforms)
    this.physics.add.collider(bombs, platforms)
    this.physics.add.collider(bombs, walls)
    this.physics.add.collider(ball, bombs, death, null, this)
    this.physics.add.collider(ball, trap, death, null, this)

    this.physics.add.overlap(ball, stars, collectStar, null, this)
    this.physics.add.overlap(ball, interaction, trigger)

    function trigger ()
    {
        if (cursors.down.isDown)
        {
            console.log("Interaction")
        }
    }

    function collectStar (ball, star)
    {
        star.disableBody(true, true)

        score += 10
        scoreText.setText('Score' + score)

        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            })

            let x = (ball.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            let bomb = bombs.create(x, 16, 'Bomb')
            bomb.setBounce(1).setScale(0.5)
            //bomb.setCollideWorldBounds(true)
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
        }
    }

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })
        .setScrollFactor(0)



    function death (ball, bomb)
    {
        this.physics.pause()

        ball.setTint(0xff0000)
        
        //player.anims.play('turn')
        
        gameOver = true
        this.add.text(width * 0.4, height * 0.4, 'Game over', { fontSize: '32px', fill: '#001'})
        .setScrollFactor(0)
    }

    function climbing (ball, walls)
    {
        ball.setVelocityY(clim_speed)
        //ball.setVelocityX(wall_jump)
    }
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


    this.input.keyboard.on('keydown-A', onLeftKeyUp, state);
    this.input.keyboard.on('keyup-A', onRightKeyUp, state);
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

    if (cursors.up.isDown)
    {
        clim_speed = -300
    }
    else if (cursors.up.isUp && cursors.down.isUp)
    {
        clim_speed = -5
    }
    if (cursors.down.isDown)
    {
        clim_speed = 250
    }
    /*
    if (cursors.left.isDown)
    {
        wall_jump = -250
    }
    else if (cursors.right.isDown)
    {
        wall_jump = 250
    }
    */
    this.cameras.main.startFollow(ball)

}


/*
function onClick() {
    // red.visible = false
    button.visible = false
}
*/
