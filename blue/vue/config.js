var selectedColor = 'rgba(0, 123, 255, 0.5)';
var fundAmount = 150000;
var start = '출발';
var fundingName =  '사회복지기금';
var seoul =  '서울';
var busan =  '부산';
var jeju =  '제주';
var beijing =  '베이징';
var taipei =  '타이베이';
var fundingPlace =  '사회복지기금접수처';
var spaceTravel =  '우주여행';
var queenElizabeth =  '퀸 엘리자베스호';
var worldTour =  '세계일주 초대권';
var sellHalfPrice =  '반액대매출';
var ticket =  '우대권';
var columbia =  '컬럼비아호';
var concorde =  '콩코드여객기';
var island =  '무인도';
var goldenKey =  'goldenKey';

var config = {
    selectedColor: selectedColor,
    fundAmount: fundAmount,
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
    die: {
        width: 700,
        height: 650,
        margin: 10
    },
    placeList: [
        {
            type: 'special',
            code: 'start',
            name: start
        },
        {
            type: 'place',
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
            type: 'place',
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
            type: 'place',
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
            type: 'landmark',
            code: 'kr',
            name: jeju,
            price: '20만원',
            fee: '30만원'
        },
        {
            type: 'place',
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
            type: 'place',
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
            type: 'place',
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
            type: 'place',
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
            type: 'place',
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
            type: 'place',
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
            type: 'landmark',
            code: 'cc',
            name: concorde,
            price: '20만원',
            fee: '30만원'
        },
        {
            type: 'place',
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
            type: 'place',
            code: 'de',
            name: '베를린',
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
            type: 'place',
            code: 'ca',
            name: '오타와',
            price: '20만원',
            fee: '1만 6천원',
            hotelPrice: '50만원',
            hotelFee: '100만원',
            hotelCount: 0,
            buildingPrice: '30만원',
            buildingFee: '60만원',
            buildingCount: 0,
            villaPrice: '10만원',
            villaFee: '22만원',
            villaCount: 0
        },
        {
            type: 'landmark',
            code: 'we',
            name: fundingPlace,
            price: '0원'
        },
        {
            type: 'place',
            code: 'ar',
            name: '부에노스아이레스',
            price: '22만원',
            fee: '1만 8천원',
            hotelPrice: '50만원',
            hotelFee: '105만원',
            hotelCount: 0,
            buildingPrice: '45만원',
            buildingFee: '70만원',
            buildingCount: 0,
            villaPrice: '15만원',
            villaFee: '25만원',
            villaCount: 0
        },
        {
            type: goldenKey
        },
        {
            type: 'place',
            code: 'br',
            name: '상파울루',
            price: '24만원',
            fee: '2만',
            hotelPrice: '75만원',
            hotelFee: '110만원',
            hotelCount: 0,
            buildingPrice: '45만원',
            buildingFee: '75만원',
            buildingCount: 0,
            villaPrice: '15만원',
            villaFee: '30만원',
            villaCount: 0
        },
        {
            type: 'place',
            code: 'au',
            name: '시드니',
            price: '24만원',
            fee: '2만',
            hotelPrice: '75만원',
            hotelFee: '110만원',
            hotelCount: 0,
            buildingPrice: '45만원',
            buildingFee: '75만원',
            buildingCount: 0,
            villaPrice: '15만원',
            villaFee: '30만원',
            villaCount: 0
        },
        {
            type: 'landmark',
            code: 'kr',
            name: busan,
            price: '50만원',
            fee: '60만원'
        },
        {
            type: 'place',
            code: 'us',
            name: '하와이',
            price: '26만원',
            fee: '2만 2천원',
            hotelPrice: '75만원',
            hotelFee: '115만원',
            hotelCount: 0,
            buildingPrice: '45만원',
            buildingFee: '80만원',
            buildingCount: 0,
            villaPrice: '15만원',
            villaFee: '33만원',
            villaCount: 0
        },
        {
            type: 'place',
            code: 'pt',
            name: '리스본',
            price: '26만원',
            fee: '2만 2천원',
            hotelPrice: '75만원',
            hotelFee: '115만원',
            hotelCount: 0,
            buildingPrice: '45만원',
            buildingFee: '80만원',
            buildingCount: 0,
            villaPrice: '15만원',
            villaFee: '33만원',
            villaCount: 0
        },
        {
            type: 'landmark',
            code: 'qu',
            name: queenElizabeth,
            price: '30만원',
            fee: '25만원'
        },
        {
            type: 'place',
            code: 'es',
            name: '마드리드',
            price: '28만원',
            fee: '2만 4천원',
            hotelPrice: '75만원',
            hotelFee: '120만원',
            hotelCount: 0,
            buildingPrice: '45만원',
            buildingFee: '85만원',
            buildingCount: 0,
            villaPrice: '15만원',
            villaFee: '36만원',
            villaCount: 0
        },
        {
            type: 'special',
            code: 'st',
            name: spaceTravel,
            fee: '20만원'
        },
        {
            type: 'place',
            code: 'jp',
            name: '도쿄',
            price: '30만원',
            fee: '2만 4천원',
            hotelPrice: '100만원',
            hotelFee: '127만원',
            hotelCount: 0,
            buildingPrice: '60만원',
            buildingFee: '90만원',
            buildingCount: 0,
            villaPrice: '20만원',
            villaFee: '39만원',
            villaCount: 0
        },
        {
            type: 'special',
            code: 'co',
            name: columbia,
            price: '45만원',
            fee: '40만원'
        },
        {
            type: 'place',
            code: 'fr',
            name: '파리',
            price: '32만원',
            fee: '2만 8천원',
            hotelPrice: '100만원',
            hotelFee: '140만원',
            hotelCount: 0,
            buildingPrice: '60만원',
            buildingFee: '100만원',
            buildingCount: 0,
            villaPrice: '20만원',
            villaFee: '45만원',
            villaCount: 0
        },
        {
            type: 'place',
            code: 'it',
            name: '로마',
            price: '32만원',
            fee: '2만 8천원',
            hotelPrice: '100만원',
            hotelFee: '140만원',
            hotelCount: 0,
            buildingPrice: '60만원',
            buildingFee: '100만원',
            buildingCount: 0,
            villaPrice: '20만원',
            villaFee: '45만원',
            villaCount: 0
        },
        {
            type: goldenKey
        },
        {
            type: 'place',
            code: 'gb',
            name: '런던',
            price: '35만원',
            fee: '3만 5천원',
            hotelPrice: '100만원',
            hotelFee: '150만원',
            hotelCount: 0,
            buildingPrice: '60만원',
            buildingFee: '110만원',
            buildingCount: 0,
            villaPrice: '20만원',
            villaFee: '50만원',
            villaCount: 0
        },
        {
            type: 'place',
            code: 'us',
            name: '뉴욕',
            fee: '3만 5천원',
            hotelPrice: '100만원',
            hotelFee: '150만원',
            hotelCount: 0,
            buildingPrice: '60만원',
            buildingFee: '110만원',
            buildingCount: 0,
            villaPrice: '20만원',
            villaFee: '50만원',
            villaCount: 0
        },
        {
            type: 'special',
            code: 'we',
            name: fundingName
        },
        {
            type: 'landmark',
            code: 'kr',
            name: seoul,
            price: '100만원',
            fee: '200만원'
        }
    ]
};

var coreMixin = {
    methods: {
        isLandmark() {
            return this.place.type === 'landmark';
        },
        isPlace() {
            return this.place.type === 'place';
        },
        isGoldenKey() {
            return this.place.type === 'goldenKey';
        },
        isSpecial() {
            return this.place.type === 'special';
        },
        isPlaceOrLandmark() {
            return this.isPlace() || this.isLandmark();
        },
        getCode() {
            return this.place.code;
        },
        getPlaceLeft() {
            var left = 0;

            if (this.index >= 0 && this.index <= 10) {
                return this.index * config.place.width;
            } else if (this.index > 10 && this.index <= 20) {
                return 10 * config.place.width;
            } else if (this.index > 20 && this.index <= 30) {
                return (30 - this.index) * config.place.width;
            }

            return left;
        },
        getPlaceTop() {
            var top = 0;

            if (this.index > 10 && this.index <= 20) {
                return (this.index - 10) * config.place.height;
            } else if (this.index > 20 && this.index <= 30) {
                return 10 * config.place.height;
            } else if (this.index > 30) {
                return (40 - this.index) * config.place.height;
            }

            return top;
        }
    }
};