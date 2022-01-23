class Form {
    constructor() {
        this.input = createInput("").attribute("placeholder", "Enter Your Name")
        this.playButton = createButton("Start")
        this.greeting = createElement("h2");
        this.titleImg = createImg("/assets/title.png", "game title")
    }
    setElementsPosition() {
        this.titleImg.position(120, 50);
        this.input.position(width / 2 - 110, height / 2 - 80);
        this.playButton.position(width / 2 - 90, height / 2 + 10);
        this.greeting.position(width / 2 - 300, height / 2 - 100);
    }

    handlePlayerElements() {
        this.setElementsPosition(),
        this.handleMousePressed();
        this.setElementStyle();

    }

    hide() {
        this.greeting.hide();
        this.playButton.hide();
        this.input.hide();
      }

    handleMousePressed() {
        this.playButton.mousePressed(() => {
            this.input.hide();
            this.playButton.hide();
            var msg = `Welcome! ${this.input.value()} Please Wait`
            this.greeting.html(msg)
            console.log(msg)
            playerCount += 1;
            player.name = this.input.value()
            player.index = playerCount;
            player.addPlayer();
            player.updateCount(playerCount);
        })
    }

    setElementStyle() {
        this.playButton.class("startButton")
        this.greeting.class("Welcome")
        this.titleImg.class("gameTitle")
        this.input.class("customInput");
        console.log("test")
    }
}