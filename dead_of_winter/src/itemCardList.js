const itemCardList = [
    {
        name: '약',
        description: "부상 토큰을 하나 제거합니다.",
        category: '약',
        type: 'execute'
    },
    {
        name: '주사기',
        description: "부상 토큰을 두개를 제거합니다.",
        category: '약',
        type: 'execute'
    },
    {
        name: '야구방망이',
        description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴립니다.",
        category: '잡동사니',
        type: 'execute'
    },
    {
        name: '식량1',
        description: "식량창고에 식량토큰을 하나를 추가합니다.",
        category: '식량',
        type: 'execute',
        feature: 'food1'
    },
    {
        name: '식량2',
        description: "식량창고에 식량토큰을 두개를 추가합니다.",
        category: '식량',
        type: 'execute'
    },
    {
        name: '바리게이트',
        description: "바리게이트를 설치합니다.",
        category: '교육',
        type: 'execute',
        feature: 'barricade'
    },
    {
        name: '리더십',
        category: '교육',
        description: "미사용 행동 주사위의 결과값을 1 증가시킵니다.",
        type: 'execute',
        feature: 'power'
    },
    {
        name: '격투기',
        description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
        category: '교육',
        type: 'execute',
        feature: 'softAttack1'
    },
    {
        name: '가위',
        category: '도구',
        description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
        type: 'execute',
        feature: 'softAttack1'
    },
    {
        name: '확성기',
        description: "좀비를 3구를 유인합니다.",
        category: '도구',
        type: 'execute',
        feature: 'invite'
    },
    {
        name: '외부인1',
        description: "외부인 1명을 피난기지로 보냅니다.",
        category: '외부인',
        type: 'event'
    },
    {
        name: '외부인2',
        description: "외부인 2명을 피난기지로 보냅니다.",
        category: '외부인',
        type: 'event'
    },
    {
        name: '외부인3',
        description: "외부인 3명을 피난기지로 보냅니다.",
        category: '외부인',
        type: 'event'
    },
    {
        name: '학교 청사진',
        description: "학교의 아이템 카드를 획득합니다.",
        category: '교육',
        type: 'execute',
        feature: 'search',
        place: '학교'
    },
    {
        name: '경찰서 청사진',
        description: "경찰서의 아이템 카드를 획득합니다.",
        category: '교육',
        type: 'execute',
        feature: 'search',
        place: '경찰서'
    },
    {
        name: '주유소 청사진',
        description: "주유소의 아이템 카드를 획득합니다.",
        category: '교육',
        type: 'execute',
        feature: 'search',
        place: '주유소'
    },
    {
        name: '마트 청사진',
        description: "마트의 아이템 카드를 획득합니다.",
        category: '교육',
        type: 'execute',
        feature: 'search',
        place: '마트'
    },
    {
        name: '병원 청사진',
        description: "병원의 아이템 카드를 획득합니다.",
        category: '교육',
        type: 'execute',
        feature: 'search',
        place: '병원'
    },
    {
        name: '도서관 청사진',
        description: "도서관의 아이템 카드를 획득합니다.",
        category: '교육',
        type: 'execute',
        feature: 'search',
        place: '도서관'
    },
    {
        name: '생존 요리법',
        description: "피난기지에 음식 토큰 1개를 추가합니다.",
        category: '교육',
        type: 'execute',
        feature: 'food',
        place: '피난기지'
    },
    {
        name: '잡동사니',
        description: "미사용 행동 주사위 하나를 다시 굴립니다.",
        category: '도구',
        type: 'execute',
        feature: 'act'
    },
    {
        name: '백과사전',
        description: "미사용 행동 주사위 하나를 다시 굴립니다.",
        category: '교육',
        type: 'execute',
        feature: 'act'
    },
    {
        name: '연료',
        description: "생존자를 이동합니다. 위험 노출 주사위를 굴리지 않습니다.",
        category: '연료',
        type: 'execute',
        feature: 'safeMove'
    },
    {
        name: '독서등',
        description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴립니다.",
        category: '도구',
        type: 'execute',
        feature: 'hardAttack1'
    },
    {
        name: '무전기',
        description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
        category: '도구',
        type: 'execute',
        feature: 'softAttack1'
    },
    {
        name: '산탄총',
        description: "좀비를 2구를 제거합니다. 위험 노출 주사를 한번 굴립니다.",
        category: '무기',
        type: 'execute',
        feature: 'hardAttack2'
    },
    {
        name: '소총',
        description: "좀비를 2구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
        category: '무기',
        type: 'execute',
        feature: 'softAttack2'
    },
    {
        name: '권총',
        description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
        category: '무기',
        type: 'execute',
        feature: 'softAttack1'
    },
    {
        name: '주머니칼',
        description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
        category: '무기',
        type: 'execute',
        feature: 'softAttack1'
    },
    {
        name: '라이터',
        description: "연료카드도 같이 사용해서 좀비를 4구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
        category: '무기',
        type: 'execute',
        feature: 'attackWithFuel'
    },
    {
        name: '야시경',
        description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
        category: '도구',
        type: 'execute',
        feature: 'sofAttack1'
    },
    {
        name: '자물쇠',
        description: "바리게이트를 설치합니다.",
        category: '도구',
        type: 'execute',
        feature: 'barricade'
    },
    {
        name: '망치',
        description: "바리게이트를 설치합니다.",
        category: '도구',
        type: 'execute',
        feature: 'barricade'
    },
    {
        name: '대걸레',
        description: "쓰레기 5개를 치웁니다.",
        category: '도구',
        type: 'execute',
        feature: 'clean5'
    },
    {
        name: '손전등',
        description: "아무 장소의 아이템 카드 3장을 획득합니다.",
        category: '도구',
        type: 'execute',
        feature: 'search3'
    }
];

export default itemCardList;
