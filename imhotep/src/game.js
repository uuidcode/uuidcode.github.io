const game = {
    turn: 0,
    stoneIndex: 0,
    activePlayer: null,
    landList: [
        {
            name: '장터',
            itemList: []
        },
        {
            name: '피라미드',
            currentStoneRow: 0,
            currentStoneColumn: 0
        },
        {
            name: '묘실',
            currentStoneRow: 0,
            currentStoneColumn: 0
        },
        {
            name: '성벽',
            currentStoneIndex: 0,
            stoneList: [
                {
                    playerIndex: -1,
                    color: 'white'
                },
                {
                    playerIndex: -1,
                    color: 'white'
                },
                {
                    playerIndex: -1,
                    color: 'white'
                },
                {
                    playerIndex: -1,
                    color: 'white'
                }
            ]
        },
        {
            name: '오빌리스크'
        }
    ],
    boatList: [
        {
            index: 0,
            maxStone: 3,
            minStone: 2,
            stoneList: []
        },
        {
            index: 1,
            maxStone: 4,
            minStone: 3,
            stoneList: []
        }
    ],
    playerList: [
        {
            index: 0,
            active: true,
            name: '테드',
            color: 'sandybrown',
            stoneList: [],
            obeliskStoneCount: 0,
            wallStoneCount: 0,
            tombStoneCount: 0
        },
        {
            index: 1,
            name: '다은',
            color: 'darkgray',
            stoneList: [],
            obeliskStoneCount: 0,
            wallStoneCount: 0,
            tombStoneCount: 0
        }
    ]
}

game.landList.forEach((land, i) => {
    land.index = i;
    land.landed = false;

    if (i === 2) {
        land.stoneList = [];
        for (let j = 0; j < 3; j++) {
            const stoneList = [];

            for (let k = 0; k < 8; k++) {
                stoneList.push({
                    playerIndex: -1,
                    color: 'white'
                })
            }

            land.stoneList.push(stoneList);
        }
    } else if (i === 1) {
        land.stoneList = [];
        for (let j = 0; j < 3; j++) {
            const stoneList = [];

            let column = 6;

            if (j === 1) {
                column = 5;
            } else if (j === 2) {
                column = 3;
            }

            for (let k = 0; k < column; k++) {
                stoneList.push({
                    playerIndex: -1,
                    color: 'white'
                })
            }

            land.stoneList.push(stoneList);
        }
    }
});

game.itemList = [];

for (let i = 0; i < 10; i++) {
    game.itemList.push({
        name: 'stone'
    });
}

export default game;