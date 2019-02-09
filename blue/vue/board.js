var EventBus = new Vue();

var board = new Vue({
    el: '#app',
    data: {
       placeList: []
    },
    created() {
        EventBus.$on('message', this.onReceive);
        EventBus.$emit('message', 'init-board');
    },
    methods: {
        onReceive(command) {
            if (command === 'init-board') {
                console.log('>>> data.placeList.length', config.placeList.length);
                this.placeList = config.placeList;
            }
        }
    }
});