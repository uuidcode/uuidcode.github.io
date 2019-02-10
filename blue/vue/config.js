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
        }
    ]
};