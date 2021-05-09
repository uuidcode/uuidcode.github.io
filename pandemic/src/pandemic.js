import {writable} from "svelte/store";

const gameObject = {
    cityList: [
        {
            index: 0,
            name: '샌프란시스코',
            x: 58,
            y: 270,
            count: 3,
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
            y: 232,
            count: 3,
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
            y: 232,
            count: 3,
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
            y: 242,
            count: 3,
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
            count: 3,
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
            count: 3,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [2, 3, 4, 12]
        },
        {
            index: 6,
            name: '런던',
            x: 539,
            y: 188,
            count: 3,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [3, 8, 9, 7]
        },
        {
            index: 7,
            name: '마그리드',
            x: 528,
            y: 282,
            count: 3,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [3, 6, 8, 24]
        },
        {
            index: 8,
            name: '파리',
            x: 610,
            y: 240,
            count: 3,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [6, 7, 9, 10, 24]
        },
        {
            index: 9,
            name: '에센',
            x: 635,
            y: 170,
            count: 3,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [6, 8, 10, 11]
        },
        {
            index: 10,
            name: '밀라노',
            x: 675,
            y: 215,
            count: 3,
            blue: true,
            red: false,
            yellow: false,
            black: false,
            linkedCityListIndex: [8, 9, 28]
        },
        {
            index: 11,
            name: '상트페테르부르크',
            x: 740,
            y: 155,
            count: 3,
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
            count: 3,
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
            count: 3,
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
            count: 3,
            type: 'yellow'
        },
        {
            index: 15,
            name: '보고타',
            x: 275,
            y: 485,
            count: 3,
            type: 'yellow'
        },
        {
            index: 16,
            name: '리마',
            x: 240,
            y: 590,
            count: 3,
            type: 'yellow'
        },
        {
            index: 17,
            name: '산티아고',
            x: 255,
            y: 695,
            count: 2,
            type: 'yellow'
        },
        {
            index: 18,
            name: '부에노스아이레스',
            x: 355,
            y: 680,
            count: 1,
            type: 'yellow'
        },
        {
            index: 19,
            name: '상파울루',
            x: 415,
            y: 600,
            count: 1,
            type: 'yellow'
        },
        {
            index: 20,
            name: '라고스',
            x: 600,
            y: 465,
            count: 1,
            type: 'yellow'
        },
        {
            index: 21,
            name: '카스툼',
            x: 725,
            y: 450,
            count: 1,
            type: 'yellow'
        },
        {
            index: 22,
            name: '킨샤샤',
            x: 660,
            y: 530,
            count: 1,
            type: 'yellow'
        },
        {
            index: 23,
            name: '요하네스버그',
            x: 715,
            y: 630,
            count: 1,
            type: 'yellow'
        },
        {
            index: 24,
            name: '알제',
            x: 630,
            y: 340,
            count: 1,
            type: 'black'
        },
        {
            index: 25,
            name: '카이로',
            x: 705,
            y: 355,
            count: 1,
            type: 'black'
        },
        {
            index: 26,
            name: '리야드',
            x: 795,
            y: 410,
            count: 1,
            type: 'black'
        },
        {
            index: 27,
            name: '바그다드',
            x: 785,
            y: 325,
            count: 1,
            type: 'black'
        },
        {
            index: 28,
            name: '이스탄불',
            x: 715,
            y: 275,
            count: 1,
            type: 'black'
        },
        {
            index: 29,
            name: '뭄바이',
            x: 885,
            y: 425,
            count: 1,
            type: 'black'
        },
        {
            index: 30,
            name: '카라치',
            x: 875,
            y: 355,
            count: 1,
            type: 'black'
        },
        {
            index: 31,
            name: '모스크바',
            x: 795,
            y: 220,
            count: 1,
            type: 'black'
        },
        {
            index: 32,
            name: '테헤란',
            x: 855,
            y: 265,
            count: 1,
            type: 'black'
        },
        {
            index: 33,
            name: '델리',
            x: 945,
            y: 330,
            count: 1,
            type: 'black'
        },
        {
            index: 34,
            name: '콜카타',
            x: 1015,
            y: 350,
            count: 1,
            type: 'black'
        },
        {
            index: 35,
            name: '첸나이',
            x: 960,
            y: 480,
            count: 1,
            type: 'black'
        },
        {
            index: 36,
            name: '베이징',
            x: 1070,
            y: 240,
            count: 1,
            type: 'red'
        },
        {
            index: 37,
            name: '상하이',
            x: 1072,
            y: 310,
            count: 1,
            type: 'red'
        },
        {
            index: 38,
            name: '서울',
            x: 1152,
            y: 240,
            count: 1,
            type: 'red'
        },
        {
            index: 39,
            name: '도쿄',
            x: 1220,
            y: 275,
            count: 1,
            type: 'red'
        },
        {
            index: 40,
            name: '방콕',
            x: 1025,
            y: 430,
            count: 1,
            type: 'red'
        },
        {
            index: 41,
            name: '자카르타',
            x: 1025,
            y: 560,
            count: 1,
            type: 'red'
        },
        {
            index: 42,
            name: '호치민 시티',
            x: 1085,
            y: 500,
            count: 1,
            type: 'red'
        },
        {
            index: 43,
            name: '홍콩',
            x: 1082,
            y: 390,
            count: 1,
            type: 'red'
        },
        {
            index: 44,
            name: '오사카',
            x: 1225,
            y: 348,
            count: 1,
            type: 'red'
        },
        {
            index: 45,
            name: '타이베이',
            x: 1155,
            y: 378,
            count: 1,
            type: 'red'
        },
        {
            index: 46,
            name: '마닐라',
            x: 1175,
            y: 495,
            count: 1,
            type: 'red'
        },
        {
            index: 47,
            name: '시드니',
            x: 1230,
            y: 685,
            count: 1,
            type: 'red'
        }
    ]
};

const { subscribe, set, update } = writable(gameObject);

const gameStore = {
    subscribe,
    set,
    update
};

export default gameStore;