var taipei =  '타이베이';
var beijing =  '베이징';

var config = {
    place : {
        width: 160,
        height: 80
    },
    flag: {
        left: 0,
        top: 0,
        width: 60,
        height: 30
    },
    price: {
        left: 60,
        top: 0,
        width: 70,
        height: 30
    },
    owner: {
        left: 130,
        top: 0,
        width: 30,
        height: 30
    },
    name: {
        left: 0,
        top: 30,
        width: 160,
        height: 20
    },
    estate: {
        left: 0,
        top: 50,
        width: 160,
        height: 30
    },
    goldenKey: {
        top: 5,
        width: 60,
        height: 60
    },
    placeList: [
        {
            type: 'normal',
            code: 'tw',
            name: taipei,
            price: '5만원',
            fee: '2천원',
            hotelPrice: '25만원',
            hotelFee: '25만원',
            hotelCount: 0,
            buildingPrice: '15만원',
            buildingFee: '9만원',
            buildingCount: 0,
            villaPrice: '5만원',
            villaFee: '3만원',
            villaCount: 0
        },
        {
            type: 'goldenKey'
        },
        {
            type: 'normal',
            code: 'cn',
            name: beijing,
            price: '8만원',
            fee: '4천원',
            hotelPrice: '25만원',
            hotelFee: '45만원',
            hotelCount: 0,
            buildingPrice: '15만원',
            buildingFee: '18만원',
            buildingCount: 0,
            villaPrice: '5만원',
            villaFee: '6만원',
            villaCount: 0
        },
        {
            type: 'normal',
            code: 'ph',
            name: '마닐라',
            price: '8만원',
            fee: '4천원',
            hotelPrice: '25만원',
            hotelFee: '45만원',
            hotelCount: 0,
            buildingPrice: '15만원',
            buildingFee: '18만원',
            buildingCount: 0,
            villaPrice: '5만원',
            villaFee: '6만원',
            villaCount: 0,
        },
        {
            type: 'special',
            code: 'kr',
            name: config.jeju,
            price: '20만원',
            fee: '30만원'
        },
        {
            code: 'sg',
            name: '싱가포르',
            price: '10만원',
            fee: '6천원',
            hotelPrice: '25만원',
            hotelFee: '55만원',
            hotelCount: 0,
            buildingPrice: '15만원',
            buildingFee: '27만원',
            buildingCount: 0,
            villaPrice: '5만원',
            villaFee: '9만원',
            villaCount: 0
        },
        {
            type: 'goldenKey'
        },
        {
            code: 'eg',
            name: '카이로',
            price: '10만원',
            fee: '6천원',
            hotelPrice: '25만원',
            hotelFee: '55만원',
            hotelCount: 0,
            buildingPrice: '15만원',
            buildingFee: '27만원',
            buildingCount: 0,
            villaPrice: '5만원',
            villaFee: '9만원',
            villaCount: 0
        },
        {
            code: 'tr',
            name: '이스탄불',
            price: '12만원',
            fee: '8천원',
            hotelPrice: '25만원',
            hotelFee: '60만원',
            hotelCount: 0,
            buildingPrice: '15만원',
            buildingFee: '30만원',
            buildingCount: 0,
            villaPrice: '5만원',
            villaFee: '10만원',
            villaCount: 0
        },
        {
            type: 'special',
            code: 'is',
            name: '무인도'
        },
        {
            code: 'gr',
            name: '아테네',
            price: '14만원',
            fee: '1만원',
            hotelPrice: '50만원',
            hotelFee: '75만원',
            hotelCount: 0,
            buildingPrice: '30만원',
            buildingFee: '45만원',
            buildingCount: 0,
            villaPrice: '10만원',
            villaFee: '15만원',
            villaCount: 0
        },
        {
            type: 'goldenKey'
        },
        {
            code: 'dk',
            name: '코펜하겐',
            price: '16만원',
            fee: '1만 2천원',
            hotelPrice: '50만원',
            hotelFee: '90만원',
            hotelCount: 0,
            buildingPrice: '30만원',
            buildingFee: '50만원',
            buildingCount: 0,
            villaPrice: '10만원',
            villaFee: '18만원',
            villaCount: 0
        },
        {
            code: 'se',
            name: '스톡홀름',
            price: '16만원',
            fee: '1만 2천원',
            hotelPrice: '50만원',
            hotelFee: '90만원',
            hotelCount: 0,
            buildingPrice: '30만원',
            buildingFee: '50만원',
            buildingCount: 0,
            villaPrice: '10만원',
            villaFee: '18만원',
            villaCount: 0
        },
        {
            code: 'cc',
            name: config.concorde,
            price: '20만원',
            fee: '30만원'
        },
        {
            code: 'ch',
            name: '베른',
            price: '18만원',
            fee: '1만 4천원',
            hotelPrice: '50만원',
            hotelFee: '95만원',
            hotelCount: 0,
            buildingPrice: '30만원',
            buildingFee: '55만원',
            buildingCount: 0,
            villaPrice: '10만원',
            villaFee: '20만원',
            villaCount: 0
        },
        {
            type: config.goldenKey
        },
        {
            code: 'de',
            name: '베를린',
            price: '18만원',
            fee: '1만 4천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '50만원',
                    fee: '95만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '30만원',
                    fee: '55만원'
                },
                {
                    name: '별장',
                    displayPrice: '10만원',
                    fee: '20만원'
                }
            ]
        },
        {
            code: 'ca',
            name: '오타와',
            price: '20만원',
            fee: '1만 6천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '50만원',
                    fee: '100만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '30만원',
                    fee: '60만원'
                },
                {
                    name: '별장',
                    displayPrice: '10만원',
                    fee: '22만원'
                }
            ]
        },
        {
            code: 'we',
            name: config.fundingPlace,
            price: '0원'
        },
        {
            code: 'ar',
            name: '부에노스아이레스',
            price: '22만원',
            fee: '1만 8천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '50만원',
                    fee: '105만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    fee: '70만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    fee: '25만원'
                }
            ]
        },
        {
            type: config.goldenKey
        },
        {
            code: 'br',
            name: '상파울루',
            price: '24만원',
            fee: '2만원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '75만원',
                    fee: '110만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    fee: '75만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    fee: '30만원'
                }
            ]
        },
        {
            code: 'au',
            name: '시드니',
            price: '24만원',
            fee: '2만원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '75만원',
                    fee: '110만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    fee: '75만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    fee: '30만원'
                }
            ]
        },
        {
            code: 'kr',
            name: config.busan,
            price: '50만원',
            fee: '60만원'
        },
        {
            code: 'us',
            name: '하와이',
            price: '26만원',
            fee: '2만 2천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '75만원',
                    fee: '115만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    fee: '80만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    fee: '33만원'
                }
            ]
        },
        {
            code: 'pt',
            name: '리스본',
            price: '26만원',
            fee: '2만 2천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '75만원',
                    fee: '115만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    fee: '80만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    fee: '33만원'
                }
            ]
        },
        {
            code: 'qu',
            name: config.queenElizabeth,
            price: '30만원',
            fee: '25만원'
        },
        {
            code: 'es',
            name: '마드리드',
            price: '28만원',
            fee: '2만 4천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '75만원',
                    fee: '120만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    fee: '85만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    fee: '36만원'
                }
            ]
        },
        {
            code: 'st',
            type: 'special',
            name: config.spaceTravel,
            displayTravelFees: '20만원'
        },
        {
            code: 'jp',
            name: '도쿄',
            price: '30만원',
            fee: '2만 4천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '100만원',
                    fee: '127만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '60만원',
                    fee: '90만원'
                },
                {
                    name: '별장',
                    displayPrice: '20만원',
                    fee: '39만원'
                }
            ]
        },
        {
            code: 'co',
            name: config.columbia,
            price: '45만원',
            fee: '40만원'
        },
        {
            code: 'fr',
            name: '파리',
            price: '32만원',
            fee: '2만 8천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '100만원',
                    fee: '140만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '60만원',
                    fee: '100만원'
                },
                {
                    name: '별장',
                    displayPrice: '20만원',
                    fee: '45만원'
                }
            ]
        },
        {
            code: 'it',
            name: '로마',
            price: '32만원',
            fee: '2만 8천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '100만원',
                    fee: '140만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '60만원',
                    fee: '100만원'
                },
                {
                    name: '별장',
                    displayPrice: '20만원',
                    fee: '45만원'
                }
            ]
        },
        {
            type: config.goldenKey
        },
        {
            code: 'gb',
            name: '런던',
            price: '35만원',
            fee: '3만 5천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '100만원',
                    fee: '150만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '60만원',
                    fee: '110만원'
                },
                {
                    name: '별장',
                    displayPrice: '20만원',
                    fee: '50만원'
                }
            ]
        },
        {
            code: 'us',
            name: '뉴욕',
            price: '35만원',
            fee: '3만 5천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '100만원',
                    fee: '150만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '60만원',
                    fee: '110만원'
                },
                {
                    name: '별장',
                    displayPrice: '20만원',
                    fee: '50만원'
                }
            ]
        },
        {
            type: 'special',
            code: 'we',
            name: config.fundingName
        },
        {
            code: 'kr',
            name: config.seoul,
            price: '100만원',
            fee: '200만원'
        }
    ]
};