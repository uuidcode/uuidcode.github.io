Vue.component('die', {
    mixins: [coreMixin],
    template: `
        <div v-bind:style="getDieStyle()" 
            id="die" 
            class="shadow"
            v-on:click="roll"></div>
    `,
    data: function () {
        return {
            dieBox: null
        }
    },
    mounted() {
        var dieCanvas = $t.id('die');
        $t.dice.use_true_random = false;

        this.dieBox = new $t.dice.dice_box(dieCanvas, {
            w: config.die.width,
            h: config.die.height
        });

        this.dieBox.rolling = false;
    },
    methods: {
        roll() {
            var self = this;

            this.dieBox.start_throw(function () {
                    return $t.dice.parse_notation("1d6")
                },
                function (vectors, notation, callback) {
                    callback();
                },
                function (notation, count) {
                    self.sendMessage({
                        type: 'go',
                        count: count[0]
                    })
                });
        },
        getDieStyle() {
            return {
                position: 'absolute',
                border: '1px solid black',
                left: config.place.width + 'px',
                top: config.place.height + 'px',
                width: config.die.width + 'px',
                height: config.die.height + 'px',
                margin: config.die.margin + 'px'
            }
        }
    }
});