const game = {
    turn: 0,
    stoneIndex: 0,
    activePlayer: null,
    landList: [
        {
            name: '장터'
        },
        {
            name: '피라미드'
        },
        {
            name: '묘실'
        },
        {
            name: '성벽'
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
            obeliskStoneCount: 0
        },
        {
            index: 1,
            name: '다은',
            color: 'darkgray',
            stoneList: [],
            obeliskStoneCount: 0
        }
    ]
}

game.landList.forEach((land, i) => {
    land.index = i;
    land.landed = false;
})

export default game;