const game = {
    round: 6,
    moral: 6,
    cardList: [
        {
            index: 0,
            type: '약'
        },
        {
            index: 1,
            type: '식량'
        }
    ],
    siteList: [
        {
            index: 0,
            name: '병원'
        },
        {
            index: 1,
            name: '경찰서'
        }
    ],
    survivorList: [
        {
            name: '톰',
        },
        {
            name: '피터'
        },
        {
            name: '제니퍼'
        },
        {
            name: '마이클'
        }
    ],
    playerList: [
        {
            name: '테드',
            survivorIndexList: [0, 3],
            cardIndexList:[0]
        },
        {
            name: '다은',
            survivorIndexList: [1, 2],
            cardIndexList:[1]
        }
    ]
}

game.survivorList.forEach(survivor => {
    return survivor.woundedCount = 0;
});

export default game;