var game = null;

class Player {
	constructor(game) {
		this.sprite = null;
		this.speedMove = 8;
		this.game = game;
		this.bullets = null;
		this.playerScale = 1;
		this.bScale = 1;
		this.shootSound = null;
	}

	create() {
		this.sprite = this.game.add.sprite(game.width/2, game.height*0.65, 'player');
		this.playerScale = game.width/(5.25*this.sprite.width);
		this.sprite.anchor.setTo(0.5, 0.5);
		this.sprite.scale.setTo(this.playerScale);
		this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.body.collideWorldBounds = true;

		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.checkWorldBounds = true;
		this.bullets.outOfBoundsKill = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(500, 'player_bullet');
		var mB = this.bullets.getFirstExists(false);
		this.bScale = game.width/(12*mB.width);
		this.game.world.bringToTop(this.bullets);

		// create sound:
		this.shootSound = game.add.audio('shoot_sound');
		this.shootSound.volume = 0.6;
	}

	appear() {
		this.sprite.body.velocity.y = 500;
	}

	update() {

	}

	shoot() {
		game.time.events.repeat(350, 1000, function() {
			var b = this.bullets.getFirstExists(false);
			b.anchor.setTo(0.5);
			b.reset(this.sprite.x, this.sprite.y - this.sprite.height/2);
			b.scale.setTo(this.bScale);
			b.body.velocity.y = -600;
			b.checkWorldBounds = true;
			b.outOfBoundsKill = true;
			game.add.tween(b).to({angle: 360}, 300, 'Linear', true, 0, -1);
			this.shootSound.play();
		}, this);
	}

	move(dir) {
		if(dir === 'left') {
			this.sprite.x -= this.speedMove;
		} else if(dir === 'right') {
			this.sprite.x += this.speedMove;
		}
		
	}

	die() {

	}
}

class SoundCtr {
	constructor(game) {
		this.game = game;
		this.hittedSound = this.game.add.audio('die_sound');
	}

	playHittedSound() {
		this.hittedSound.play();
	}
}

class Enemy {
	constructor(game) {
		this.game = game;
		this.sprite = null;
		this.velocity = 250;
		this.eScale = 1;
		this.enemies = this.game.add.group();
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
		this.listEnemies = [];
	}

	create() {
		var sprites = ['enemy1', 'enemy2', 'enemy3', 'enemy4', "enemy5", 'enemy6'];

		for (var x = 1; x < 6; x++) {
			for(var y = 1; y < 7; y++) {
				var px = y*game.width/7;
				var py = x*game.width/10 + 40;
				var e = this.game.add.sprite(px, py, sprites[x - 1]);
				e.hp = 100;
				this.eScale = game.width/(12*e.width);
				e.scale.setTo(this.eScale);
				e.anchor.setTo(0.5);
				this.game.physics.enable(e, Phaser.Physics.ARCADE);
				this.enemies.add(e);
				e.body.setCircle(e.width/2, e.width/4, e.height/4);

				this.listEnemies.push(e);
				this.game.world.bringToTop(this.enemies);
			}
		}

		// this.game.time.events.repeat(300, 80, function() {
		// 	var e = this.enemies.getFirstExists();
		// 	// e.checkWorldBounds = true;
		// 	// e.outOfBoundsKill = true;
		// 	if(e)			 {
		// 		e.body.velocity.y = 100;
		// 	}
		// }, this);

		this.game.time.events.add(15000, function() {
			gameControl.gameState = 'END_GAME';
		});
	}

	die(game, x, y) {
		
	}
}

class Booting {
	constructor() {

	}

	preload() {
		loadSprite(this);
	}

	create() {
		this.state.start('play');
	}

	update() {

	}
}

class GamePlay {

	constructor() {
		this.bgSound = null;
		this.firstTime = true;
		this.cursors = null;
		this.player = null;
		this.ground = null;
		this.enemies = null;
	}

	init() {

	}

	preload() {

	}

	createGround() {
		this.ground = this.add.sprite(0, game.height, 'ground');
		this.ground.anchor.setTo(0.0, 0.5);
		this.ground.scale.setTo(0.5);
		this.physics.enable(this.ground, Phaser.Physics.ARCADE);
		this.ground.body.collideWorldBounds = true;
		this.ground.body.bounce.setTo(0.5, 0.175);
		this.soundCtr = null;
	}

	create() {
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.refresh();

		this.physics.startSystem(Phaser.Physics.ARCADE);
		var backgroundImage = this.add.image(0, 0, 'bg_image');
		this.createGround();

		this.sound.boot();
		this.bgSound = game.add.audio('bg_sound');

		// var SPACEBAR = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.player = new Player(this);
		this.player.create();

		this.cursors = this.input.keyboard.createCursorKeys();

		// SPACEBAR.onDown.add(function(){
		//     this.player.shoot();
		// }, this);
		this.time.events.add(500, function() {
			this.bgSound.play();
			this.bgSound.volume = 1;
			this.bgSound.loop = true;
		}, this);

		this.enemies = new Enemy(this);
		waiting(this);
		this.soundCtr = new SoundCtr(this);
		// display score text: 
		this.txtScore = game.add.text(game.width/2, 20, "", 
			{font: 'Consolas', fill: "#ffffff", align: 'center' });
		this.txtScore.fontSize = game.width/(800)*36;
		this.txtScore.anchor.setTo(0.5);

		// game.time.events.add(36000, function() {
		// 	if(gameControl.gameState !== 'END_GAME' || gameControl.gameState !== 'WAITING') {
		// 		this.state.start('endgame');
		// 	}
		// }, this);

		// console.log(game.device);
	}

	enableSomething() {
		this.player.sprite.inputEnabled = true;
		this.player.sprite.input.enableDrag(true);
		this.player.sprite.events.onDragStart.addOnce(function() {
			this.player.shoot();
			gameControl.pointerTwn.stop();
			gameControl.pointer.destroy();
		}, this);
	}

	update() {
		this.physics.arcade.collide(this.player.sprite, this.ground);
		this.physics.arcade.overlap(this.player.bullets, this.enemies.enemies, 
			this.enemyHitBulet, null, this);
		if (this.cursors.left.isDown)
		{
			this.player.move('left');
		}
		else if (this.cursors.right.isDown)
		{
			this.player.move('right');
		} 

		this.txtScore.text = gameControl.scoreTxt + gameControl.score;
	}

	pauseOrResum() {
		if(this.bgSound && !this.bgSound.isPlaying) {
			this.bgSound.resume();
		} else {
			this.bgSound.pause();
		}
	}

	enemyHitBulet(bullet, enemy) {
		enemy.hp -= 50;
		if(enemy.hp <= 0) {
			enemy.kill();
			gameControl.score += 10;
			this.soundCtr.playHittedSound();
			var explode = game.add.sprite(enemy.body.x, enemy.body.y, 'explosion');
			explode.scale.setTo(0.75);
			explode.animations.add('explo');
			explode.animations.play('explo', 30, false, true);
			this.enemies.listEnemies.splice(this.enemies.listEnemies.indexOf(enemy), 1);
			if(this.enemies.listEnemies.length <= 0 && gameControl.gameState === 'END_GAME') {
				this.state.start('endgame');
			}
		}
		bullet.kill();
	}

	render() {
		// for(var i = 0; i < this.enemies.enemies.length; i++){
		// 	game.debug.body(this.enemies.listEnemies[i]);
		// }
	}
}

function waiting(game) {
	var button = game.add.button(config.width/2, config.height*0.775, 'btnplay');
	var btnScale = config.width/(3*button.width);
	button.anchor.setTo(0.5);
	button.scale.setTo(btnScale);

	var logo = game.add.image(config.width/2, config.height*0.3, 'logo');
	logo.anchor.setTo(0.5);
	logo.scale.setTo(config.width/(2.75*logo.width));
	
	button.events.onInputDown.add(function() {
		game.enemies.create();
		game.player.appear();
		game.enableSomething();
		button.kill();
		logo.kill();
		createTutorial(game);
		//... do something here
	}, this);
}

function createTutorial(game){
	var tt = game.add.image(config.width/2, config.height*0.65, 'tutorial');
	tt.anchor.setTo(0.5, 0.5);
	var ttScale = config.width/(tt.width*3);
	tt.scale.setTo(ttScale);

	createPointer();
	game.input.enabled = true;
	game.input.onDown.addOnce(function() {
		tt.kill();
		gameControl.inGame = true;
	});

}

function createPointer() {
	var pointer = game.add.sprite(config.width/3, config.height*0.875, 'pointer');
	pointer.anchor.setTo(0.5);
	pointer.scale.setTo(config.width/(10*pointer.width));
	game.world.bringToTop(pointer);
	gameControl.pointer = pointer;
	gameControl.pointerTwn = game.add.tween(pointer)
	.to({x: config.width*2/3, y: config.height*0.875}, 1200, 'Linear', true, 200, -1, true);
}

var config = {
	width: window.innerWidth,
	height: window.innerHeight,
	renderer: Phaser.AUTO
}

var gameControl = {
	scrOrientation: '',
	score: 0,
	gameState: 'none',
	scoreTxt: 'SCORE: ',
	inGame: false
}

function detectScreenOrientation() {
	if (window.matchMedia("(orientation: portrait)").matches) {
		gameControl.scrOrientation = 'portrait';
	}

	if (window.matchMedia("(orientation: landscape)").matches) {
		gameControl.scrOrientation = 'landscape';
	}
}

window.onload = function() {
	detectScreenOrientation();
	startGame();
}

function startGame() {
	if(gameControl.scrOrientation === 'landscape') {
		config.width = window.innerWidth / 3;
		config.height = window.innerHeight;
	}
	game = new Phaser.Game(config);
	game.state.add('boot', Booting);
	game.state.add('play', GamePlay);
	game.state.add('endgame', EndGame);

	game.state.start('boot');
}

class EndGame {
	constructor() {
		this.txtScore = null;
	}

	init() {

	}

	create() {
		gameControl.inGame = false;
		var backgroundImage = this.add.image(0, 0, 'bg_image');
		var win = this.add.image(config.width/2, config.height*0.325, 'victory');
		win.anchor.setTo(0.5);
		var winScale = config.width/(2*win.width);
		win.scale.setTo(winScale*5);
		win.alpha = 0;

		var twn = game.add.tween(win).to({alpha: 1}, 300, "Linear", false);
		var twn2 = game.add.tween(win.scale).to({x: winScale, y: winScale}, 300, "Linear", false);

		var btnReplay = game.add.button(config.width/2, config.height*0.75, 'btnreplay');
		btnReplay.anchor.setTo(0.5);
		var reScale = config.width/(4*btnReplay.width);
		btnReplay.scale.setTo(reScale);


		this.txtScore = game.add.text(config.width/2, config.height*0.6, "SCORE: " + gameControl.score, 
			{font: 'Consolas', fill: "#ffffff", align: 'center' });
		this.txtScore.fontSize = 56*game.width/(800);
		this.txtScore.anchor.setTo(0.5);
		gameControl.gameState = 'WAITING';
		btnReplay.events.onInputDown.add(function() {
			this.state.start('play');
			gameControl.score = 0;
			gameControl.gameState = '';
		}, this);
		twn.chain(tw3);
		twn2.chain(tw4);
		twn.start();
		twn2.start();

		var tw3 = game.add.tween(this.txtScore).to({alpha: 1}, 300, 'Linear', true);
		var tw4 = game.add.tween(btnReplay).to({alpha: 1}, 300, 'Linear', true);
	}

	update() {

	}
}