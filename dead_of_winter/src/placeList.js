const placeList = [
    {
        name: '피난기지',
        maxSurviveCount: 24,
        survivorList: [],
        survivorLocationList: [],
        foodCount: 0,
        starvingTokenCount: 0,
        weakTokenCount: 0,
        trashCount: 0,
        cardList: [],
        entranceList: [
            {
                maxZombieCount: 3,
                currentZombieCount: 0,
                barricadeCount: 0
            },
            {
                maxZombieCount: 3,
                currentZombieCount: 0,
                barricadeCount: 0
            },
            {
                maxZombieCount: 3,
                currentZombieCount: 0,
                barricadeCount: 0
            },
            {
                maxZombieCount: 3,
                currentZombieCount: 0,
                barricadeCount: 0
            },
            {
                maxZombieCount: 3,
                currentZombieCount: 0,
                barricadeCount: 0
            },
            {
                maxZombieCount: 3,
                currentZombieCount: 0,
                barricadeCount: 0
            }
        ]
    },
    {
        name: '병원',
        itemCardIndexList: [],
        entranceList: [
            {
                maxZombieCount: 4,
                currentZombieCount: 0,
                barricadeCount: 0
            }
        ],
        maxSurviveCount: 4,
        survivorList: [],
        survivorLocationList: [],
        noiseTokenCount: 0,
        cardList: [
            "잡동사니",
            "대걸레",
            "손전등",
            "약",
            "약",
            "약",
            "약",
            "주사기",
            "주사기",
            "연료",
            "연료",
            "연료",
            "연료",
            "식량2",
            "식량2",
            "식량2",
            "식량2",
            "외부인2",
            "외부인2",
            "외부인2",
        ]
    },
    {
        name: '마트',
        maxSurviveCount: 3,
        entranceList: [
            {
                maxZombieCount: 4,
                currentZombieCount: 0,
                barricadeCount: 0
            }
        ],
        survivorList: [],
        survivorLocationList: [],
        noiseTokenCount: 0,
        cardList: [
            "잡동사니",
            "라이터",
            "주머니칼",
            "망치",
            "연료",
            "약",
            "약",
            "약",
            "약",
            "약",
            "약",
            "식량1",
            "식량1",
            "식량2",
            "식량2",
            "식량3",
            "식량3",
            "외부인1",
            "외부인2",
            "외부인2",
        ]
    },
    {
        name: '학교',
        entranceList: [
            {
                maxZombieCount: 4,
                currentZombieCount: 0,
                barricadeCount: 0
            }
        ],
        maxSurviveCount: 4,
        survivorList: [],
        survivorLocationList: [],
        noiseTokenCount: 0,
        cardList: [
            "잡동사니",
            "야구방망이",
            "가위",
            "확성기",
            "약",
            "약",
            "약",
            "학교 청사진",
            "바리게이트",
            "리더십",
            "격투기",
            "식량1",
            "식량1",
            "식량1",
            "식량2",
            "식량2",
            "식량2",
            "외부인2",
            "외부인2",
            "외부인3"
        ]
    },
    {
        name: '도서관',
        entranceList: [
            {
                maxZombieCount: 3,
                currentZombieCount: 0,
                barricadeCount: 0
            }
        ],
        maxSurviveCount: 3,
        survivorList: [],
        survivorLocationList: [],
        barricadeCount: 0,
        noiseTokenCount: 0,
        cardList: [
            "독서등",
            "잡동사니",
            "백과사전",
            "생존 요리법",
            "경찰서 청사진",
            "병원 청사진",
            "마트 청사진",
            "주유소 청사진",
            "도서관 청사진",
            "연료",
            "연료",
            "연료",
            "연료",
            "식량1",
            "식량1",
            "식량1",
            "식량1",
            "외부인1",
            "외부인2",
            "외부인2",
        ]
    },
    {
        name: '경찰서',
        entranceList: [
            {
                maxZombieCount: 4,
                currentZombieCount: 0,
                barricadeCount: 0
            }
        ],
        maxSurviveCount: 3,
        survivorList: [],
        survivorLocationList: [],
        noiseTokenCount: 0,
        cardList: [
            "무전기",
            "잡동사니",
            "야시경",
            "자물쇠",
            "산탄총",
            "권총",
            "권총",
            "권총",
            "소총",
            "소총",
            "연료",
            "연료",
            "연료",
            "연료",
            "식량1",
            "식량1",
            "식량1",
            "외부인1",
            "외부인2",
            "외부인2",
        ]
    },
    {
        name: '주유소',
        entranceList: [
            {
                maxZombieCount: 3,
                currentZombieCount: 0,
                barricadeCount: 0
            }
        ],
        maxSurviveCount: 2,
        survivorList: [],
        survivorLocationList: [],
        noiseTokenCount: 0,
        cardList: [
            "산탄총",
            "주머니칼",
            "주머니칼",
            "라이터",
            "라이터",
            "약",
            "약",
            "약",
            "연료",
            "연료",
            "연료",
            "연료",
            "연료",
            "연료",
            "식량1",
            "식량1",
            "식량1",
            "외부인1",
            "외부인2",
            "외부인2",
        ]
    }
];

export default placeList;