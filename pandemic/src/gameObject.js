const gameObject = {
    labCount: 5,
    ready: true,
    debug: false,
    removeCity: false,
    cardList: [],
    usedCardList: [],
    contagionMessage: '',
    contagionList: [
        {
            index: 0,
            count: 2,
            x: 843,
            y: 180,
            active: true,
            end: false
        },
        {
            index: 1,
            count: 2,
            x: 890,
            y: 180,
            active: false,
            end: false
        },
        {
            index: 2,
            count: 2,
            x: 935,
            y: 180,
            active: false,
            end: false
        },
        {
            index: 3,
            count: 3,
            x: 982,
            y: 180,
            active: false,
            end: false
        },
        {
            index: 4,
            count: 3,
            x: 1029,
            y: 180,
            active: false,
            end: false
        },
        {
            index: 5,
            count: 4,
            x: 1075,
            y: 180,
            active: false,
            end: false
        },
        {
            index: 6,
            count: 4,
            x: 1122,
            y: 180,
            active: false,
            end: true
        }
    ],
    spreadList: [
        {
            index: 0,
            x: 47,
            y: 500,
            active: true,
            end: false
        },
        {
            index: 1,
            x: 97,
            y: 545,
            active: false,
            end: false
        },
        {
            index: 2,
            x: 47,
            y: 585,
            active: false,
            end: false
        },
        {
            index: 3,
            x: 97,
            y: 625,
            active: false,
            end: false
        },
        {
            index: 4,
            x: 47,
            y: 665,
            active: false,
            end: false
        },
        {
            index: 5,
            x: 97,
            y: 705,
            active: false,
            end: false
        },
        {
            index: 6,
            x: 47,
            y: 745,
            active: false,
            end: false
        },
        {
            index: 7,
            x: 97,
            y: 780,
            active: false,
            end: true
        }
    ],
    playerList: [
        {
            index: 0,
            class: 'left',
            image: 'apeach.png',
            cityIndex: 12,
            turn: true,
            action: 4,
            cityIndexList: []
        },
        {
            index: 1,
            class: 'right',
            image: 'lion.png',
            cityIndex: 12,
            turn: false,
            action: 0,
            cityIndexList: []
        }
    ],
    virusList: [
        {
            index: 0,
            type: 'yellow',
            x: 420,
            y: 870,
            count: 0,
            active: true,
            icon: {
                x: 410,
                y: 790,
                image: 'yellow.png'
            }
        },
        {
            index: 1,
            type: 'red',
            x: 485,
            y: 870,
            count: 0,
            active: true,
            icon: {
                x: 470,
                y: 790,
                image: 'red.png'
            }
        },
        {
            index: 2,
            type: 'blue',
            x: 548,
            y: 870,
            count: 0,
            active: true,
            icon: {
                x: 530,
                y: 790,
                image: 'blue.png'
            }
        },
        {
            index: 3,
            type: 'black',
            x: 607,
            y: 870,
            count: 0,
            active: true,
            icon: {
                x: 590,
                y: 790,
                image: 'black.png'
            }
        }
    ],
    cityList: [
        {
            index: 0,
            name: '샌프란시스코',
            x: 58,
            y: 280,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [1, 14, 39, 46]
        },
        {
            index: 1,
            name: '시카고',
            x: 160,
            y: 255,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [0, 2, 4, 13, 14]
        },
        {
            index: 2,
            name: '몬트리올',
            x: 280,
            y: 255,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [1, 3, 5]
        },
        {
            index: 3,
            name: '뉴욕',
            x: 360,
            y: 255,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [2, 5, 6, 7],
            right: true
        },
        {
            index: 4,
            name: '애틀란타',
            x: 190,
            y: 316,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [1, 5, 12],
            right: true
        },
        {
            index: 5,
            name: '위싱턴',
            x: 324,
            y: 325,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [2, 3, 4, 12],
            right: true
        },
        {
            index: 6,
            name: '런던',
            x: 520,
            y: 195,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [3, 8, 9, 7]
        },
        {
            index: 7,
            name: '마그리드',
            x: 520,
            y: 290,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [3, 6, 8, 19, 24]
        },
        {
            index: 8,
            name: '파리',
            x: 600,
            y: 245,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [6, 7, 9, 10, 24]
        },
        {
            index: 9,
            name: '에센',
            x: 630,
            y: 185,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [6, 8, 10, 11],
            top: true
        },
        {
            index: 10,
            name: '밀라노',
            x: 665,
            y: 240,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [8, 9, 28]
        },
        {
            index: 11,
            name: '상트페테르부르크',
            x: 735,
            y: 165,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityIndexList: [9, 28, 31]
        },
        {
            index: 12,
            name: '마이에미',
            x: 275,
            y: 405,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [4, 5, 13, 15],
            lab: true,
            right: true
        },
        {
            index: 13,
            name: '멕시코 시티',
            x: 140,
            y: 390,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [1, 12, 14, 15, 16],
            top: true
        },
        {
            index: 14,
            name: '로스엔젤레스',
            x: 60,
            y: 370,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [0, 1, 13, 47],
            top: true
        },
        {
            index: 15,
            name: '보고타',
            x: 265,
            y: 485,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [12, 13, 16, 18, 19]
        },
        {
            index: 16,
            name: '리마',
            x: 240,
            y: 590,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [13, 15, 17],
            right: true
        },
        {
            index: 17,
            name: '산티아고',
            x: 245,
            y: 715,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [16],
            top: true
        },
        {
            index: 18,
            name: '부에노스아이레스',
            x: 355,
            y: 680,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [15, 19],
            right: true
        },
        {
            index: 19,
            name: '상파울루',
            x: 415,
            y: 610,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [7, 15, 18, 20],
            right: true
        },
        {
            index: 20,
            name: '라고스',
            x: 580,
            y: 475,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [19, 21, 22]
        },
        {
            index: 21,
            name: '카스툼',
            x: 715,
            y: 460,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [20, 22, 23, 25]
        },
        {
            index: 22,
            name: '킨샤샤',
            x: 660,
            y: 560,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [20, 21, 23],
            right: true
        },
        {
            index: 23,
            name: '요하네스버그',
            x: 715,
            y: 630,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityIndexList: [21, 22],
            right: true
        },
        {
            index: 24,
            name: '알제',
            x: 620,
            y: 340,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [7, 8, 25, 28]
        },
        {
            index: 25,
            name: '카이로',
            x: 705,
            y: 355,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [21, 24, 26, 27, 28]
        },
        {
            index: 26,
            name: '리야드',
            x: 795,
            y: 405,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [25, 27, 30]
        },
        {
            index: 27,
            name: '바그다드',
            x: 785,
            y: 335,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [25, 26, 28, 30, 32]
        },
        {
            index: 28,
            name: '이스탄불',
            x: 715,
            y: 275,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [10, 11, 24, 25, 27, 31]
        },
        {
            index: 29,
            name: '뭄바이',
            x: 885,
            y: 425,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [30, 33, 35]
        },
        {
            index: 30,
            name: '카라치',
            x: 875,
            y: 365,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [26, 27, 29, 32, 33]
        },
        {
            index: 31,
            name: '모스크바',
            x: 790,
            y: 240,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [11, 28, 32]
        },
        {
            index: 32,
            name: '테헤란',
            x: 855,
            y: 275,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [27, 30, 31],
            right: true
        },
        {
            index: 33,
            name: '델리',
            x: 945,
            y: 350,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [29, 30, 32, 34, 35]
        },
        {
            index: 34,
            name: '콜카타',
            x: 1010,
            y: 365,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [33, 35, 40, 43],
            right: true
        },
        {
            index: 35,
            name: '첸나이',
            x: 960,
            y: 490,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityIndexList: [29, 33, 34, 40, 41]
        },
        {
            index: 36,
            name: '베이징',
            x: 1060,
            y: 250,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [37, 38]
        },
        {
            index: 37,
            name: '상하이',
            x: 1050,
            y: 323,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [36, 38, 39, 43, 45],
            right: true
        },
        {
            index: 38,
            name: '서울',
            x: 1140,
            y: 255,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [36, 37, 39],
            top: true
        },
        {
            index: 39,
            name: '도쿄',
            x: 1210,
            y: 295,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [37, 38, 44]
        },
        {
            index: 40,
            name: '방콕',
            x: 1015,
            y: 445,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [34, 35, 41, 42, 43]
        },
        {
            index: 41,
            name: '자카르타',
            x: 1015,
            y: 570,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [35, 40, 42, 47],
            right: true
        },
        {
            index: 42,
            name: '호치민 시티',
            x: 1075,
            y: 500,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [40, 41, 43, 46]
        },
        {
            index: 43,
            name: '홍콩',
            x: 1070,
            y: 400,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [34, 37, 40, 42, 45, 46]
        },
        {
            index: 44,
            name: '오사카',
            x: 1225,
            y: 360,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [39, 45]
        },
        {
            index: 45,
            name: '타이베이',
            x: 1155,
            y: 390,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [37, 43, 44, 46]
        },
        {
            index: 46,
            name: '마닐라',
            x: 1165,
            y: 490,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [42, 43, 45, 47],
            top: true
        },
        {
            index: 47,
            name: '시드니',
            x: 1220,
            y: 685,
            virusCount: 0,
            blue: false,
            red: true,
            yellow: false,
            black: false,
            linkedCityIndexList: [14, 41, 46],
            top: true
        }
    ]
};

export default gameObject;