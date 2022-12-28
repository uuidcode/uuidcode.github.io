const game = {
    enable: true,
    animation: false,
    start: false,
    turn: 0,
    stage: 0,
    stageDone: false,
    playerIndex: 0,
    currentPlayer: null,
    stageActionDone: false,
    stoneListList: [],
    arrivedBoatList:[],
    boatListList: [],
    destinationBoatListList: [],
    waitingBoatList: [
        {
            minStoneCount: 2,
            maxStoneCount: 3
        },
        {
            minStoneCount: 1,
            maxStoneCount: 1
        },
        {
            minStoneCount: 3,
            maxStoneCount: 4
        },
        {
            minStoneCount: 1,
            maxStoneCount: 2
        }
    ],
    destinationList: [
        {
            name: '장터'
        },
        {
            name: '묘실'
        },
        {
            name: '피라미드'
        },
        {
            name: '성벽'
        },
        {
            name: '오빌리스크'
        }
    ],
    playerList: [
        {
            index: 0,
            name: '테드',
            color: 'lightblue'
        },
        {
            index: 1,
            name: '다은',
            color: 'lightcoral'
        }
    ]
}

for (let i = 0; i < 5; i++) {
    game.stoneListList.push([{}]);
}

game.playerList.map((player, playerIndex) => {
    let stoneCount = 2;

    if (playerIndex === 1) {
        stoneCount = 3;
    }

    player.stoneListList = [];

    for (let i = 0; i < 5; i++) {
        player.stoneListList[i] = [];

        if (i < stoneCount) {
            player.stoneListList[i].push({
                playerIndex: playerIndex
            });
        }
    }

    return player;
});

game.destinationList.map((destination, index) => {
    destination.index = index;
    return destination;
});

for (let i = 0; i < game.destinationList; i++) {
    game.destinationBoatListList.push([]);
}

game.waitingBoatList.forEach((boat) => {
    boat.stoneCount = 0;
    boat.stoneListList = [];

    for (let i = 0; i < boat.maxStoneCount; i++) {
        boat.stoneListList.push([]);
    }
});

export default game;