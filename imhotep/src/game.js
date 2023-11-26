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
            tombStoneCount: 0,
            hammerCount: 1,
            chiselCount: 1,
            leverCount: 0,
            sailCount: 0,
            stoneStatueCount: 0
        },
        {
            index: 1,
            name: '다은',
            color: 'darkgray',
            stoneList: [],
            obeliskStoneCount: 0,
            wallStoneCount: 0,
            tombStoneCount: 0,
            hammerCount: 0,
            chiselCount: 0,
            leverCount: 0,
            sailCount: 0,
            stoneStatueCount: 0
        }
    ]
}

game.playerList.forEach(player => {
    player.useTool = false;
    player.useToolName = null;
    player.loadCount = 0;
});

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
        name: '석상',
        description: '게임이 끝난 뒤 모은 석상 수에 따른 점수'
    });
}

for (let i = 0; i < 5; i++) {
    game.itemList.push({
        name: '지렛대',
        description: '배 한척을 빈 항구로 옮깁니다. 석재 내리는 순서를 마음대로 바꿉니다.'
    });

    game.itemList.push({
        name: '끌',
        description: '배 1척에 석재 2개를 싣습니다. 배 2척에 각각 석재 1개를 싣습니다.'
    });

    game.itemList.push({
        name: '돛',
        description: '배 1척에 석재 1개를 싣고 그 배를 항구로 보냅니다.'
    });

    game.itemList.push({
        name: '망치',
        description: '석재 3개를 받고 석재 1개를 배 1척에 싣습니다.'
    });
}

game.itemList = game.itemList.sort(i => Math.random() - 0.5);

export default game;