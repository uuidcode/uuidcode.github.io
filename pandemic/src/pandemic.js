import {writable} from "svelte/store";

const gameObject = {
    debug: false,
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
            linkedCityListIndex: [1, 14, 39, 46]
        },
        {
            index: 1,
            name: '시카고',
            x: 183,
            y: 245,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [0, 2, 4, 13, 14]
        },
        {
            index: 2,
            name: '몬트리올',
            x: 280,
            y: 245,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [1, 3, 5]
        },
        {
            index: 3,
            name: '뉴욕',
            x: 360,
            y: 250,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [2, 5, 6, 7]
        },
        {
            index: 4,
            name: '애틀란타',
            x: 220,
            y: 306,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [1, 5, 12]
        },
        {
            index: 5,
            name: '위싱턴',
            x: 324,
            y: 300,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [2, 3, 4, 12]
        },
        {
            index: 6,
            name: '런던',
            x: 530,
            y: 195,
            virusCount: 0,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [3, 8, 9, 7]
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
            linkedCityListIndex: [3, 6, 8, 24]
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
            linkedCityListIndex: [6, 7, 9, 10, 24]
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
            linkedCityListIndex: [6, 8, 10, 11]
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
            linkedCityListIndex: [8, 9, 28]
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
            linkedCityListIndex: [9, 28, 31]
        },
        {
            index: 12,
            name: '마이에미',
            x: 280,
            y: 385,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityListIndex: [4, 5, 13, 15]
        },
        {
            index: 13,
            name: '멕시코 시티',
            x: 170,
            y: 400,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityListIndex: [12, 14, 15, 16]
        },
        {
            index: 14,
            name: '로스엔젤레스',
            x: 80,
            y: 370,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityListIndex: [0, 1, 13, 47]
        },
        {
            index: 15,
            name: '보고타',
            x: 275,
            y: 485,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityListIndex: [12, 13, 16, 18, 19]
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
            linkedCityListIndex: [13, 15, 17]
        },
        {
            index: 17,
            name: '산티아고',
            x: 255,
            y: 695,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityListIndex: [16]
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
            linkedCityListIndex: [15, 19]
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
            linkedCityListIndex: [7, 15]
        },
        {
            index: 20,
            name: '라고스',
            x: 600,
            y: 475,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityListIndex: [19, 21, 22]
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
            linkedCityListIndex: [20, 22, 23, 25]
        },
        {
            index: 22,
            name: '킨샤샤',
            x: 650,
            y: 540,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: true,
            black: false,
            linkedCityListIndex: [20, 21, 23]
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
            linkedCityListIndex: [21, 22]
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
            linkedCityListIndex: [7, 8, 25, 28]
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
            linkedCityListIndex: [21, 24, 26, 27, 28]
        },
        {
            index: 26,
            name: '리야드',
            x: 795,
            y: 410,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [25, 27, 30]
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
            linkedCityListIndex: [25, 26, 28, 30, 32]
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
            linkedCityListIndex: [10, 11, 24, 25, 27, 31]
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
            linkedCityListIndex: [30, 33, 35]
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
            linkedCityListIndex: [26, 27, 29, 32, 33]
        },
        {
            index: 31,
            name: '모스크바',
            x: 790,
            y: 230,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [11, 28, 32]
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
            linkedCityListIndex: [27, 30, 31]
        },
        {
            index: 33,
            name: '델리',
            x: 945,
            y: 340,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [29, 30, 32, 34, 35]
        },
        {
            index: 34,
            name: '콜카타',
            x: 1010,
            y: 370,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [33, 35, 40, 43]
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
            linkedCityListIndex: [29, 33, 34, 40, 41]
        },
        {
            index: 36,
            name: '베이징',
            x: 1060,
            y: 260,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [37, 38]
        },
        {
            index: 37,
            name: '상하이',
            x: 1060,
            y: 320,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [36, 38, 39, 43, 45]
        },
        {
            index: 38,
            name: '서울',
            x: 1140,
            y: 260,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [36, 37, 39]
        },
        {
            index: 39,
            name: '도쿄',
            x: 1210,
            y: 290,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [37, 38, 44]
        },
        {
            index: 40,
            name: '방콕',
            x: 1015,
            y: 440,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [34, 35, 41, 42, 43]
        },
        {
            index: 41,
            name: '자카르타',
            x: 1015,
            y: 570,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [35, 40, 42, 47]
        },
        {
            index: 42,
            name: '호치민 시티',
            x: 1075,
            y: 500,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [40, 41, 43, 46]
        },
        {
            index: 43,
            name: '홍콩',
            x: 1070,
            y: 400,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [34, 37, 40, 42, 45, 46]
        },
        {
            index: 44,
            name: '오사카',
            x: 1225,
            y: 360,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [39, 45]
        },
        {
            index: 45,
            name: '타이베이',
            x: 1155,
            y: 390,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [37, 43, 44, 46]
        },
        {
            index: 46,
            name: '마닐라',
            x: 1165,
            y: 495,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [43, 43, 45, 47]
        },
        {
            index: 47,
            name: '시드니',
            x: 1220,
            y: 695,
            virusCount: 0,
            blue: false,
            red: false,
            yellow: false,
            black: true,
            linkedCityListIndex: [14, 41, 46]
        }
    ]
};

const { subscribe, set, update } = writable(gameObject);

const gameStore = {
    subscribe,
    set,
    update,
    recompute : () => update(game => {
        game.cityList.forEach(city => {
            if (city.virusCount === 0) {
                city.displayVirusCount = '';
            } else {
                city.displayVirusCount = city.virusCount;
            }
        });

        return game;
    }),

    toggleDebug: () => update(game => {
       game.debug = !game.debug;
       return game;
    })
};

gameStore.recompute();

export default gameStore;