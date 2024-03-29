var game = null;

class Player {
	constructor(game) {
		this.sprite 	= null;
		this.speedMove	= 8;
		this.game 		= game;
		this.bullets 	= null;
		this.playerScale = 1;
		this.bScale 	= 1;
		this.shootSound = null;
		this.canDie 	= true;
		this.twnBody 	= null;
	}

	create() {
		this.sprite = this.game.add.sprite(game.width/2, game.height*0.65, 'player');
		this.playerScale = game.width/(6*this.sprite.width);
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
		this.bScale = game.width/(15*mB.width);
		this.game.world.bringToTop(this.bullets);

		this.oe = game.add.image(this.sprite.x + this.sprite.width/2, 
			this.sprite.y - this.sprite.height/2, 'oe');
		this.oe.anchor.setTo(0.5);
		this.oe.scale.setTo(this.playerScale*0.5);
		this.oe.visible = false;
		this.oe.alpha = 1;
		this.oeTwn = game.add.tween(this.oe.scale)
		.to({x: this.playerScale*1.45, y: this.playerScale*1.45}, 1800, 'Linear', false);
		this.oeTwn2 = game.add.tween(this.oe)
		.to({alpha: 0}, 200, 'Linear', false, 1800);
		// create sound:
		this.shootSound = game.add.audio('shoot_sound');
		this.shootSound.volume = 0.6;
	}

	resetOe() {
		this.oe.reset(this.sprite.x + this.sprite.width/2, 
			this.sprite.y - this.sprite.height/2);
		this.oe.alpha = 1;
		this.oe.scale.setTo(this.playerScale*0.5);
		this.oe.visible = true;
		this.oeTwn.start();
		this.oeTwn2.start();
	}

	appear() {
		this.sprite.body.velocity.y = 500;
	}

	update() {

	}

	shoot() {
		game.time.events.repeat(350, 1000, function() {
			if(gameControl.shooting) {
				var b = this.bullets.getFirstExists(false);
				b.anchor.setTo(0.5);
				b.reset(this.sprite.x, this.sprite.y - this.sprite.height/2);
				b.scale.setTo(this.bScale);
				b.body.velocity.y = -650;
				b.checkWorldBounds = true;
				b.outOfBoundsKill = true;
				game.add.tween(b).to({angle: 360}, 300, 'Linear', true, 0, -1);
				this.shootSound.play();
			}
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
		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(300, 'eBullet');
		this.listEnemies = [];
		this.isLeft = true;
		this.readyMove = false;
		this.wave = 0;
	}

	create() {
		this.wave = 1;
		var sprites = ['enemy1', 'enemy2', 'enemy3', 'enemy4', "enemy5", 'enemy6'];
		var pos = 1;
		for (var x = 1; x < 5; x++) {
			for(var y = 2; y < 6; y++) {
				pos = 1;
				if(x === 1 || x === 4 || y === 2 || y === 5) {
					pos = 3;
				}
				var px = y*game.width/7;
				var py = x*game.width/10 + 40;
				var e = this.game.add.sprite(px, py, sprites[pos]);
				e.hp = 40;
				this.eScale = game.width/(12*e.width);
				e.scale.setTo(this.eScale);
				e.anchor.setTo(0.5);
				this.game.physics.enable(e, Phaser.Physics.ARCADE);
				this.enemies.add(e);
				e.body.setCircle(e.width*2/3, e.width/4, e.height/4);

				this.listEnemies.push(e);
				this.game.world.bringToTop(this.enemies);
			}
		}

		this.game.time.events.add(15000, function() {
			gameControl.gameState = 'END_GAME';
		});
	}

	create2() {
		var sprites = ['enemy1', 'enemy2', 'enemy3', 'enemy4', "enemy5", 'enemy6'];
		this.wave = 2;
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
				e.body.setCircle(e.width*2/3, e.width/4, e.height/4);

				this.listEnemies.push(e);
				this.game.world.bringToTop(this.enemies);
			}
		}

		this.game.time.events.add(15000, function() {
			gameControl.gameState = 'END_GAME';
		});
	}

	shoot() {
		game.time.events.repeat(1600, 300, function() {
			if(this.listEnemies.length > 0) {
				var pos = game.rnd.integerInRange(0, this.listEnemies.length-1);
				var e = this.listEnemies[pos];
				var bul = this.bullets.getFirstExists(false);
				bul.reset(e.x, e.y);
				bul.anchor.setTo(0.5);
				bul.body.velocity.y = 200;
				bul.checkWorldBounds = true;
				bul.outOfBoundsKill = true;
				bul.scale.setTo(this.eScale*0.6);
				bul.alpha = 1;
				game.add.tween(bul).to({alpha: 0}, 60, 'Linear', true, 0, -1, true);
			}
		}, this);
	}

	moveRightLeft() {
		if(this.isLeft) {
			this.enemies.x += 1;
			if(this.enemies.x >= game.width/5 - 50) {
				this.isLeft = false;
			}
		} else {
			this.enemies.x -= 1;
			if(this.enemies.x <= -70) {
				this.isLeft = true;
			}
		}
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

	createControlButton() {
		this.playPauseBtn = game.add.button(game.width/2, 60*this.player.playerScale, 
			'btn_pause');
		this.playPauseBtn.anchor.setTo(0.5);
		var s1 = game.width/(15*this.playPauseBtn.width);
		var s2 = game.width/(10*this.playPauseBtn.width);
		this.playPauseBtn.scale.setTo(s1);
		this.playPauseBtn.events.onInputDown.add(function() {
			if(game.paused === true) {
				this.playPauseBtn.loadTexture('btn_pause');
				this.playPauseBtn.reset(game.width/2, 60*this.player.playerScale);
				this.playPauseBtn.scale.setTo(s1);
			} else {
				this.playPauseBtn.loadTexture('btn_play');
				this.playPauseBtn.reset(game.width/2, game.height*0.65);
				this.playPauseBtn.scale.setTo(s2);
			}
			game.paused = !game.paused;
		}, this);
	}

	create() {
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.refresh();

		this.physics.startSystem(Phaser.Physics.ARCADE);
		var backgroundImage = this.add.tileSprite(0, 0, game.width, game.height, 'bg_image');
		this.createGround();
		this.sound.boot();
		this.bgSound = game.add.audio('bg_sound');

		// var SPACEBAR = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.player = new Player(this);
		this.player.create();
		this.createControlButton();

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
		this.txtScore = game.add.text(game.width*5/6, 60*this.player.playerScale, "", 
			{font: 'Consolas', fill: "#ffffff", align: 'center' });
		this.txtScore.fontSize = game.width/(800)*36;
		this.txtScore.anchor.setTo(0.5);

		this.txtLevel = game.add.text(game.width/6, 60*this.player.playerScale, 
			gameControl.levelTxt + gameControl.level,
		 {font: 'Consolas', fill: "#ffffff", align: 'center' });
		this.txtLevel.fontSize = game.width/(800)*36;
		this.txtLevel.anchor.setTo(0.5);

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
			this.enemies.shoot();
			gameControl.pointerTwn.stop();
			gameControl.pointer.destroy();
		}, this);
	}

	update() {
		this.physics.arcade.collide(this.player.sprite, this.ground);
		this.physics.arcade.overlap(this.player.bullets, this.enemies.enemies, 
			this.enemyHitBulet, null, this);
		this.physics.arcade.overlap(this.player.sprite, this.enemies.bullets, 
			this.playerHitBullet, null, this);
		if (this.cursors.left.isDown)
		{
			this.player.move('left');
		}
		else if (this.cursors.right.isDown)
		{
			this.player.move('right');
		} 
		if(this.enemies.readyMove && this.enemies.wave === 2) {
			gameControl.level = 2;
			this.txtLevel.text = gameControl.levelTxt + gameControl.level;
			this.enemies.moveRightLeft();
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

	playerHitBullet(p, b) {
		b.kill();
		this.soundCtr.playHittedSound();
		gameControl.shooting = false;
		this.player.resetOe();
		if(this.player.canDie) {
			this.player.twnBody = game.add.tween(this.player.sprite)
			.to({alpha: 0}, 150, 'Linear', true, 0, 7, true);
		}
		this.player.canDie = false;

		this.player.twnBody.onComplete.add(function() {
			this.player.canDie  = true;
			this.player.sprite.alpha = 1;
			gameControl.shooting = true;
			this.player.oe.visible = false;
		}, this);
	}

	enemyHitBulet(bullet, enemy) {
		enemy.hp -= 50;
		if(enemy.hp <= 0) {
			enemy.kill();
			gameControl.score += 10;
			this.soundCtr.playHittedSound();
			var explode = game.add.sprite(enemy.x, enemy.y, 'explosion');
			explode.anchor.setTo(0.5);
			explode.scale.setTo(this.player.playerScale*2);
			explode.animations.add('explo');
			explode.animations.play('explo', 30, false, true);
			this.enemies.listEnemies.splice(this.enemies.listEnemies.indexOf(enemy), 1);
			if(this.enemies.listEnemies.length <= 0) {
				if(this.enemies.wave === 1) {
					game.time.events.add(1200, function() {
						this.enemies.create2();
					}, this);
				} else if(this.enemies.wave === 2) {
					game.time.events.add(1200, function() {
						this.state.start('endgame');
					}, this);
					
				}
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
		game.enemies.readyMove = true;
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
	scoreTxt: 'SCORE:',
	inGame: false,
	shooting: true,
	level: 1,
	levelTxt: 'LEVEL:'
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
		var backgroundImage = this.add.tileSprite(0, 0, game.width, game.height, 'bg_image');
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