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
    building: {
        left: 0,
        top: 50,
        width: 160,
        height: 30
    },
    placeList: [
        {
            code: 'tw',
            name: taipei,
            price: '5만원',
            displayFees: '2천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '25만원',
                    displayFees: '25만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '15만원',
                    displayFees: '9만원'
                },
                {
                    name: '별장',
                    displayPrice: '5만원',
                    displayFees: '3만원'
                }
            ]
        },
        {
            code: 'cn',
            name: beijing,
            price: '8만원',
            displayFees: '4천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '25만원',
                    displayFees: '45만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '15만원',
                    displayFees: '18만원'
                },
                {
                    name: '별장',
                    displayPrice: '5만원',
                    displayFees: '6만원'
                }
            ]
        }
    ]
};