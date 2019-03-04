game.TitleScreen = me.ScreenObject.extend({
    init: function(){
        this._super(me.ScreenObject, 'init');
        this.font = null;
        this.ground1 = null;
        this.ground2 = null;
        this.logo = null;
    },

    onResetEvent: function() {
        localStorage.setItem('playerName', null);
        me.audio.stop("theme");
        game.data.newHiScore = false;

        me.game.world.addChild(new BackgroundLayer('bg', 1));
        me.input.bindKey(me.input.KEY.NUM1, "alice", true);
        me.input.bindKey(me.input.KEY.NUM2, "mom", true);
        me.input.bindKey(me.input.KEY.A, "alice", true);
        me.input.bindKey(me.input.KEY.M, "mom", true);
        // me.input.bindKey(me.input.KEY.SPACE, "enter", true);
        // me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);

        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "alice" || action === "mom") {
                localStorage.setItem('playerName', action);
                me.state.change(me.state.PLAY);
            }
        });

        //logo
        this.logo = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2 - 20,
            {image: 'logo'}
        );
        me.game.world.addChild(this.logo, 10);

        var that = this;
        var logoTween = me.pool.pull("me.Tween", this.logo.pos)
            .to({y: me.game.viewport.height/2 - 100}, 1000)
            .easing(me.Tween.Easing.Exponential.InOut).start();

        this.ground1 = me.pool.pull("ground", 0, me.video.renderer.getHeight() - 96);
        this.ground2 = me.pool.pull("ground", me.video.renderer.getWidth(),
                                    me.video.renderer.getHeight() - 96);
        me.game.world.addChild(this.ground1, 11);
        me.game.world.addChild(this.ground2, 11);

        me.game.world.addChild(new (me.Renderable.extend ({
            // constructor
            init: function() {
                // size does not matter, it's just to avoid having a zero size
                // renderable
                this._super(me.Renderable, 'init', [0, 0, 100, 100]);
                this.text = 'ВЫБИРИТЕ ИГРОКА ДЛЯ НАЧАЛА ИГРЫ. НАЖМИ\n\n\t\t\t\t\t\t\t\t\t\t\t\t1 - АЛИСА\n\n\t\t\t\t\t\t\t\t\t\t\t\t2 - МАМА';
                this.text2 = '\t\tНАБЕРИ 6 БАЛЛОВ И ПОЛУЧИ ПОДАРОК НА 8 МАРТА';
                this.font = new me.Font('gamefont', 16, '#000');
                this.font2 = new me.Font('gamefont', 17, 'red');
            },
            draw: function (renderer) {
                var measure = this.font.measureText(renderer, this.text);
                var xpos = me.game.viewport.width/2 - measure.width/2;
                var ypos = me.game.viewport.height/2 + 50;
                this.font.draw(renderer, this.text, xpos, ypos);
                this.font2.draw(renderer, this.text2, 20, ypos + 120);
            }
        })), 12);
    },

    onDestroyEvent: function() {
        // unregister the event
        me.event.unsubscribe(this.handler);
        me.input.unbindKey(me.input.KEY.ENTER);

        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
        this.ground1 = null;
        this.ground2 = null;
        me.game.world.removeChild(this.logo);
        this.logo = null;
    }
});
