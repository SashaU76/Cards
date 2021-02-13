class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, value){
        super(scene, 0, 0, 'card')
        this.scene=scene
        //this.setOrigin(0,0)
        this.value=value
        //this.setDisplaySize(200,250)
        this.scene.add.existing(this)
        this.setInteractive();
        //this.on('pointerdown', this.open, this)
        this.opened=false
        //this.scaleX=0.5
        //
        
    }
    flip(callback){
        
        this.scene.tweens.add({
            targets: this,
            scaleX:0,
            ease: 'Linear',
            duration: 150,
            onComplete: ()=>{
            this.show(callback)
            }
        })
        
    }
    move(params){
        this.scene.tweens.add({
            targets: this,
            x: params.x,
            y: params.y,
            delay: params.delay,
            ease: 'Linear',
            duration: 250,
            onComplete: ()=>{
                if(params.callback){
                    params.callback()
                }
            }
                })
        //this.setPosition(params.x, params.y)
    }
    init(position){
        this.position = position;
            this.close();
            this.setPosition(-this.width, -this.height)
    }
    show(callback){
        let texture =this.opened ? 'card'+ this.value:'card'
        this.setTexture(texture)
        this.scene.tweens.add({
            targets: this,
            scaleX:1,
            ease: 'Linear',
            duration: 150,
            onComplete: ()=>{
                    if(callback)callback()
                }
            })
    }
    open(callback){
        this.opened=true
        this.flip(callback)
        //this.setTexture('card'+this.value)
    }
    close(){
        if(this.opened){
            this.opened=false
            this.flip()
        }
    }
    //this.add.sprite(position.x,position.y,'card').setOrigin(0,0).setDisplaySize(200,250);
}