class GameScene extends Phaser.Scene{
    constructor(){
        super('Game')
    }
    preload(){
        // 1. загрузить бекраунд
        this.load.image('bg', 'assets/sprites/bg.jpg')
        this.load.image('card', 'assets/sprites/kover.png')
        this.load.image('card1', 'assets/sprites/card1.jpg')
        this.load.image('card2', 'assets/sprites/images.jpg')
        this.load.image('card3', 'assets/sprites/pipebot.jpg')
        this.load.image('card4', 'assets/sprites/pipeup.jpg')
        this.load.image('card5', 'assets/sprites/tnJ8wIW60Rk.jpg')

        this.load.audio('piano', 'assets/sounds/piano.mp3')
        this.load.audio('23', 'assets/sounds/23.mp3')
        this.load.audio('testsnd', 'assets/sounds/testsnd.mp3')
        this.load.audio('tv-tool', 'assets/sounds/tv-tool.mp3')
        this.load.audio('windows-98', 'assets/sounds/windows-98.mp3')
    }
    createText(){
        this.timeoutText = this.add.text(5, 330, '', {
            font: '36px font',
            fill: '#ffffff'
        })
    }
    onTimerTick(){
        this.timeoutText.setText('time: '+this.timeout)
        if(this.timeout<=0){
            this.timer.paused= true
            this.sounds.timeout.play({
                volume: 0.2
            })
            this.restart()
        }else{
            --this.timeout;
        }
    }
    createTimer(){
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        })
    }
    createSounds(){
        this.sounds ={
            success: this.sound.add('23'),
            card: this.sound.add('tv-tool'),
            complite: this.sound.add('piano'),
            theme: this.sound.add('windows-98'),
            timeout: this.sound.add('testsnd'),
        };
        this.sounds.theme.play({
            volume: 0.08
        })
    }
    create() {
        this.timeout= config.timeout;
        this.createSounds();
        this.createTimer();
        this.createBackground();
        this.createText()
        this.createCards();
        this.start();
    }
    restart(){
        let count =0
        let onCardMoveComplete = () =>{
            ++count;
            if(count >= this.cards.length){
                this.start()
            }
        }
        this.cards.forEach(card=>{
            card.move({
                x: this.sys.game.config.width+card.width,
                y: this.sys.game.config.height+card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete
            })
        })
    }
    start() {
        this.initCardsPositions()
        this.timeout = config.timeout;
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.timer.paused=false
        this.initCards();
        this.showCards();
    }
    initCards() {
        let positions = Phaser.Utils.Array.Shuffle(this.positions);
        console.log(this.openedCardsCount);
        this.cards.forEach(card => {
            card.init(positions.pop())
            
        });
    }
    showCards(){
        this.cards.forEach(card=>{
            card.depth = card.position.delay
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay
            })
        })
    }
    createBackground() {
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    }
    createCards() {
        this.cards = [];

        for (let value of config.cards) {
            for (let i = 0; i < 2; i++) {
                this.cards.push(new Card(this, value));
            }
        }

        this.input.on("gameobjectdown", this.onCardClicked, this);
    }
    onCardClicked(pointer, card) {
        
        if (card.opened) {
            return false;
        }
        this.sounds.card.play({
            volume: 0.2
        })

        if (this.openedCard) {
            // уже есть открытая карта
            if (this.openedCard.value === card.value) {
                // картинки равны - запомнить
                this.sounds.complite.play({
                    volume: 0.1
                })
                this.openedCard = null;
                ++this.openedCardsCount;
            } else {
                
                // картинки разные - скрыть прошлую
                this.openedCard.close();
                this.openedCard = card;
            }
        } else {
            // еще нет открытой карта
            this.openedCard = card;
        }

        card.open(()=>{
            if (this.openedCardsCount === this.cards.length / 2) {
                this.restart();
                this.sounds.success.play({
                volume: 0.3
                })
            }
        });

        
    }
    initCardsPositions() {
        let positions = [];
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + 4;
        let cardHeight = cardTexture.height + 4;
        let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2+10;
        let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2-30;
        
        let id=0;
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                positions.push({
                    delay: ++id*100,
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                });
            }
        }

        this.positions=positions;
    }
}