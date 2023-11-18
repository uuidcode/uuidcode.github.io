const game = {
    currentPlayerIndex: 0,
    landList: [
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
    boatList: [
        {
            index: 0,
            max: 3,
            min: 2,
            stoneList: []
        },
        {
            index: 1,
            max: 4,
            min: 3,
            stoneList: []
        }
    ],
    playerList: [
        {
            index: 0,
            name: '테드',
            color: 'lightblue',
            stoneList: [
                {
                    playerIndex: 0,
                    index: 0,
                },
                {
                    playerIndex: 0,
                    index: 1,
                },
                {
                    playerIndex: 0,
                    index: 2,
                }
            ]
        },
        {
            index: 1,
            name: '다은',
            color: 'lightcoral',
            stoneList: [
                {
                    playerIndex: 1,
                    index: 3,
                },
                {
                    playerIndex: 1,
                    index: 4,
                }
            ]
        }
    ]
}

game.playerList.forEach(player => {
    player.stoneList.forEach((stone, index) => {
        stone.animating = false;
        stone.style = `left: ${50 * index}px`;
        stone.status = 'ready';
    })
})


export default game;