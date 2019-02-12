var EventBus = new Vue();

var board = new Vue({
    el: '#app',
    data: {
       placeList: config.placeList,
       playerList: config.playerList
    }
});