let game
let red
let button
let ball

function onLoad() {
    console.log('Hello World!')
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: onPreload, create: onCreate, update: onUpdate })
}

function onPreload() {
    red = game.load.image('Red', 'img/Red.png')
    game.load.image('Ball', 'img/ball.jpg')
    console.log(red)
}

function onCreate() {
    button = game.add.button(-500, -200, 'Red', onClick)
    console.log(button)
    ball = game.add.image(-500, -200, 'Ball')
}

function onUpdate() {
    console.log('Update')
}

function onClick() {
    // red.visible = false
    button.visible = false
}


