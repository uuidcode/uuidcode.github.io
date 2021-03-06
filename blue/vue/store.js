var store = {
    state: {
        placeList: [
            {
                type: 'special',
                code: 'start',
                name: start
            },
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
                name: jeju,
                price: '20만원',
                fee: '30만원'
            },
            {
                type: 'normal',
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
                type: 'normal',
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
                type: 'normal',
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
                type: 'normal',
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
                type: 'normal',
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
                type: 'normal',
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
                name: concorde,
                price: '20만원',
                fee: '30만원'
            },
            {
                type: 'normal',
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
                type: goldenKey
            },
            {
                type: 'normal',
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
                type: 'normal',
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
                name: fundingPlace,
                price: '0원'
            },
            {
                type: 'normal',
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
                type: goldenKey
            },
            {
                type: 'normal',
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
                type: 'normal',
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
                name: busan,
                price: '50만원',
                fee: '60만원'
            },
            {
                type: 'normal',
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
                type: 'normal',
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
                name: queenElizabeth,
                price: '30만원',
                fee: '25만원'
            },
            {
                type: 'normal',
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
                name: spaceTravel,
                displayTravelFees: '20만원'
            },
            {
                type: 'normal',
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
                name: columbia,
                price: '45만원',
                fee: '40만원'
            },
            {
                type: 'normal',
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
                type: 'normal',
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
                type: goldenKey
            },
            {
                type: 'normal',
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
                type: 'normal',
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
                name: fundingName
            },
            {
                code: 'kr',
                name: seoul,
                price: '100만원',
                fee: '200만원'
            }
        ]
    }
};