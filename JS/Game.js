class Game {
    constructor() {
        //this.resetTitle = createElement("h2");
        this.resetButton = createButton("");
        this.playerMoving = false;
        this.leftKeyActive = false;
        this.blast = false;

        this.leaderboardTitle = createElement("h2");

        this.leader1 = createElement("h2");
        this.leader2 = createElement("h2");
    }
    update(gRef) {
        database.ref("/").update({
            gameState: gRef
        });


    }

    start() {
        player = new Players()
        player.getCount()
        form = new Form()
        form.handlePlayerElements()
        boy = createSprite(width / 2 - 50, height - 200)
        boy.addImage("boy1", boyImg);
        boy.addImage("spaceExp", explosion);
        boy.scale = 0.3
        girl = createSprite(width / 2 + 100, height - 210)
        girl.addImage("girl1", girlImg);
        girl.addImage("spaceExp", explosion);
        girl.scale = 0.2
        humans = [boy, girl]
        spaceGroup = new Group()
        obstacles = new Group()
        coinGroup = new Group()
        oxygenGroup = new Group()
        this.addSprites(spaceGroup, 10, spaceGoo, 0.09)
        this.addSprites(obstacles, 10, UFO, 0.09)
        this.addSprites(coinGroup, 12, coin, 0.09)
        this.addSprites(oxygenGroup, 10, oxygen, 0.15)
    }

    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {

        for (var i = 0; i < numberOfSprites; i++) {
            var x, y;

            console.log(positions);
            if (positions.length > 0) {
                x = positions[i].x
                y = positions[i].y
                spriteImage = positions[i].image
            } else {
                //change positions of obstacles
                x = random(width / 2 + 450, width / 2 - 450);
                y = random(-height * 6.5, height - 400);
            }


            var sprite = createSprite(x, y);
            sprite.addImage("sprite", spriteImage);

            sprite.scale = scale;
            spriteGroup.add(sprite);
        }
    }

    getState() {
        var gsRef = database.ref("gameState");
        gsRef.on("value", function (data) {
            gameState = data.val()

        })
    }

    play() {
        this.handleElements()
        this.handleResetButton()
        Players.getPlayersInfo()
        if (allPlayers !== undefined) {
            image(spacePortal, 650, -height * 7, 150, 300)
            this.showLife();
            this.showOxygenBar();
            this.showScoreboard();
            var index = 0
            for (var plr in allPlayers) {
                index += 1
                var x = allPlayers[plr].positionX;
                var y = height - allPlayers[plr].positionY;
                var currentLife = allPlayers[plr].life;
                if (currentLife <= 0) {
                    humans[index - 1].changeImage("spaceExp")
                    humans[index - 1].scale = 0.7
                }

                humans[index - 1].position.x = x;
                humans[index - 1].position.y = y;

                if (index === player.index) {
                    stroke(10);
                    fill("#4fe0a6");
                    ellipse(x, y, 60, 60);
                    this.handleCoins(index);
                    this.handleOxygen(index);
                    this.handleCollision(index);
                    this.handleGoo(index);

                    // if (player.life <= 0) {
                    //     this.blast = true;
                    //     this.playerMoving = false;
                    // }

                    // Changing camera position in y direction
                    camera.position.y = humans[index - 1].position.y;
                }
                if (player.life <= 0) {
                    this.playerMoving = false;
                }
            }

            if (this.playerMoving) {
                player.positionY += 5;
                player.update();
            }

            this.handlePlayerControls()
            if (player.positionY > 5000) {
                gameState = 2;
                this.showMessage();
            }
            drawSprites()
        }
    }

    handleElements() {
        form.hide();
        form.titleImg.position(40, 50);
        form.titleImg.class("gameTitleAfterEffect")


        // this.resetTitle.html("Reset Game");
        // this.resetTitle.class("resetText");
        // this.resetTitle.position(width/2, 225);

        this.resetButton.class("resetButton");
        this.resetButton.position(width / 2 + 400, 50);

        this.leaderboardTitle.html("Scoreboard")
        this.leaderboardTitle.position(width/2 - 550, 120)

        this.leaderboardTitle.class("resetText")
        this.leader1.class("leaderboard")
        this.leader1.position(width/2 - 550, 170)

        this.leader2.class("leaderboard")
        this.leader2.position(width/2 - 550, 200)
    }

    handleResetButton() {
        this.resetButton.mousePressed(() => {
            database.ref("/").set({
                gameState: 0,
                playerCount: 0,
                players: {}
            })
            window.location.reload()
        })
    }

    handlePlayerControls() {
        if (!this.blast) {
            if (keyIsDown(UP_ARROW)) {
                this.playerMoving = true;
                player.positionY += 10;
                player.update();
            }

            if (keyIsDown(RIGHT_ARROW) && player.positionX < width/2 + 300) {
                this.leftKeyActive = false;
                player.positionX += 5;
                player.update();
            }

            if (keyIsDown(LEFT_ARROW) && player.positionX > width/3 - 50) {
                this.leftKeyActive = true;
                player.positionX -= 5;
                player.update();
            }
        }

    }

    handleOxygen(index) {
        humans[index - 1].overlap(oxygenGroup, function (collector, collected) {
            player.powerUp = 185;
            //collected is the sprite in the group collectibles that triggered
            //the event
            collected.remove();
        });
        if (player.powerUp > 0 && this.playerMoving) {
            player.powerUp -= 0.3;
        }

        if (player.powerUp <= 0) {
            gameState = 2;
            this.gameOver();
        }
    }

    handleCoins(index) {
        humans[index - 1].overlap(coinGroup, function (collector, collected) {
            player.score += 21;
            //collected is the sprite in the group collectibles that triggered
            //the event
            player.update()
            collected.remove();
        });
    }

    handleGoo(index) {
        humans[index - 1].overlap(spaceGroup, function (collector, collected) {
            player.score -= 21;
            //collected is the sprite in the group collectibles that triggered
            //the event
            player.update()
            collected.remove();
        });
    }

    showMessage() {
        swal({
            title: `Congratulations! ${"\n" + player.name} You have reached the portal`,
            text: "Welcome back to Earth",
            imageUrl: "https://raw.githubusercontent.com/SaanviKaggere/Portal-to-Space-C46/main/assets/coin.png",
            confirmButtonText: "ok"
        })
    }

    showLife() {
        push();
        image(life, width / 2 - 130, height - player.positionY - 285, 20, 20);
        fill("white");
        rect(width / 2 - 100, height - player.positionY - 285, 185, 20);
        fill("#f50057");
        rect(width / 2 - 100, height - player.positionY - 285, player.life, 20);
        noStroke();
        pop();
    }

    showOxygenBar() {
        push();
        image(oxygen, width / 2 - 170, height - player.positionY - 258, 70, 40);
        fill("white");
        rect(width / 2 - 100, height - player.positionY - 250, 185, 20);
        fill("pink");
        rect(width / 2 - 100, height - player.positionY - 250, player.powerUp, 20);
        noStroke();
        pop();
    }

    gameOver() {
        swal({
            title: `Game Over`,
            text: "Oops you lost",
            imageUrl:
                "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
            imageSize: "100x100",
            confirmButtonText: "Thanks For Playing"
        });
    }

    handleCollision(index) {
        if (humans[index - 1].collide(obstacles)) {
            if (this.leftKeyActive) {
                player.positionX += 100
            }
            else {
                player.positionX -= 100
            }
            if (player.life > 0) {
                player.life -= 185 / 4;
            }
            if (player.life <= 0) {
                this.blast = true;
                this.playerMoving = false;
                gameState = 2;
                this.gameOver();
            }
            player.update();
        }
    }

    showScoreboard() {
      var  l1,l2
      var players = Object.values(allPlayers)
      l1 = "&emsp;" + players[0].name + "&emsp;" + players[0].score
      l2 = "&emsp;" + players[1].name + "&emsp;" + players[1].score
      this.leader1.html(l1);
      this.leader2.html(l2);
    }
}
