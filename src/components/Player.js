import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static BASE_SPEED = 200;
  static GRAVITY = 350;
  static JUMP_VELOCITY = 480;
  static HEIGHT = 64;

  damageTime = 0;
  damaging = false;

  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.createAnimations();
    this.createProperties();

    const aspectRatio = this.displayWidth / this.displayHeight;
    this.setDisplaySize(aspectRatio * Player.HEIGHT, Player.HEIGHT);

    this.play('player-idle');
  }

  createProperties() {
    this.setCollideWorldBounds(true);
    this.setScale(1.2);
    this.body.setBounce(0.2);
    this.body.setGravityY(Player.GRAVITY);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    if (this.damaging) {
      this.damageTime += dt;

      if (this.damageTime >= 250) {
        this.setTint(0xffffff);
        this.damageTime = 0;
        this.damaging = false;
      }
    }
  }

  handleDamage() {
    // Don't damage the player if they are mid dash
    if (this.damaging) {
      return;
    }

    this.damaging = true;

    const dir = this.body.velocity
      .normalize()
      .negate()
      .scale(500);

    this.setVelocity(dir.x, dir.y);
    this.setTint(0xff0000);
    this.damageTime = 0;
  }

  createAnimations() {
    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNames(
        'player',
        {
          prefix: 'player-',
          suffix: ".png",
          zeroPad: 2,
          frames: [5]
        }
      ),
      frameRate: 20
    });

    this.anims.create({
      key: 'player-left',
      frames: this.anims.generateFrameNames(
        'player',
        {
          prefix: 'player-',
          suffix: ".png",
          zeroPad: 2,
          start: 1,
          end: 4
        }
      ),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'player-right',
      frames: this.anims.generateFrameNames(
        'player',
        {
          prefix: 'player-',
          suffix: ".png",
          zeroPad: 2,
          start: 6,
          end: 9
        }
      ),
      frameRate: 8,
      repeat: -1
    });
  }

  /**
   * Updates the player.
   * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors 
   */
  update(cursors) {
    if (this.damaging) {
      return;
    }

    if (cursors.left.isDown) {
      this.setVelocityX(-Player.BASE_SPEED);
      this.anims.play('player-left', true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(Player.BASE_SPEED);
      this.anims.play('player-right', true);
    } else {
      this.setVelocityX(0);
      this.anims.play('player-idle', true);
    }

    if (cursors.up.isDown && this.body.onFloor()) {
      this.setVelocityY(-Player.JUMP_VELOCITY);
    }
  }
}