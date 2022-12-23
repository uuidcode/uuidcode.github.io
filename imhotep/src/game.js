const game = {
    start: false,
    turn: 0,
    stage: 0,
    stageDone: false,
    playerIndex: 0,
    currentPlayer: null,
    stageActionDone: false,
    arrivedBoatList:[],
    boatList: [],
    destinationBoatList: [],
    boatGroup: [
        [
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
        [
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
                maxStoneCount: 3
            }
        ],
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
        },
        {
            index: 1,
            name: '다은',
        }
    ]
}

game.playerList.map((player, playerIndex) => {
    let stoneCount = 2;

    if (playerIndex === 1) {
        stoneCount = 3;
    }

    player.stoneList = Array(stoneCount).fill(0)
        .map((item, stoneIndex) => {
            return {
                index: stoneIndex
            }
        });

    return player;
});

game.destinationList.map((destination, index) => {
    destination.index = index;
    return destination;
});

game.boatGroup.map((boatList) => {
    boatList.forEach(boat => {
        boat.stoneCount = 0;
        boat.stoneList = Array(boat.maxStoneCount)
            .fill(0)
            .map((item, index) => {
                return {
                    index: index,
                    empty: true
                }
            })
    })
});

export default game;