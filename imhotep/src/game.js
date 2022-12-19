const game = {
    start: false,
    turn: 0,
    stage: 0,
    stageDone: false,
    playerIndex: 0,
    currentPlayer: null,
    stageActionDone: false,
    boatList: [],
    boatGroup: [
        [
            {
                minStoneCount: 2,
                maxStoneCount: 3
            },
            {
                minStoneCount: 1,
                maxStoneCount: 1
            }
        ],
        [
            {
                minStoneCount: 1,
                maxStoneCount: 2
            },
            {
                minStoneCount: 1,
                maxStoneCount: 1
            }
        ],
    ],
    playerList: [
        {
            name: '테드',
            stoneCount: 2
        },
        {
            name: '다은',
            stoneCount: 3
        }
    ]
}

export default game;