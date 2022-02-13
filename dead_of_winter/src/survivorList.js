const survivorList = [
    {
        index: 0,
        name: '브라이언 리',
        job: '시장',
        power: 68,
        attack: 3,
        search: 4,
        ability: {
            name: '라운드마다 한 번, 미사용 행동 주사위 1개의 결과값을 1 높일 수 있습니다.',
            type: 'plusPower'
        },
        placeName: '피난기지'
    },
    {
        index: 1,
        name: '토머스 하트',
        job: '군인',
        power: 64,
        attack: 1,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 현재 장소에서 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
            type: 'killZombie'
        },
        placeName: '마트'
    },
    {
        index: 2,
        name: '스파키',
        job: '스턴트견',
        power: 10,
        attack: 2,
        search: 2,
        ability: {
            name: '라운드마다 한 번, 이동하지만 위험 노출 주사위를 굴리지 않습니다.',
            type: 'move'
        }
    },
    {
        index: 3,
        name: '올리비아 브라운',
        job: '의사',
        power: 56,
        attack: 4,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 올리바아와 같은 장소의 생존자(올리비아 포함) 중 한 명에게서 부상 토근 1개 제거합니다.',
            type: 'care',
        }
    },
    {
        index: 4,
        name: '그레이 비어드',
        job: '해적',
        power: 16,
        attack: 1,
        search: 4,
        ability: {
            name: '라운드마다 한 번, 현재 장소의 아이템 카드 1장 가져갑니다.',
            type: 'get'
        }
    },
    {
        index: 5,
        name: '로레타 클레이',
        job: '요리사',
        power: 20,
        attack: 2,
        search: 4,
        ability: {
            name: '라운드마다 한 번, 식량 창고에 식량 토큰 2개 추가합니다.',
            type: 'food'
        }
    },
    {
        index: 6,
        name: '앤드류 에반스',
        job: '농부',
        power: 12,
        attack: 3,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 마트에 있을때, 아이템 카드 1장 가져갑니다.',
            type: 'get',
            place: '마트'
        }
    },
    {
        index: 7,
        name: '탈리아 존스',
        job: '점술가',
        power: 28,
        attack: 3,
        search: 1,
        ability: {
            name: '라운드마다 한 번, 현재 장소의 아이템 카드 1장 가져깁니다.',
            type: 'get'
        }
    },
    {
        index: 8,
        name: '포레스트 플럼',
        job: '쇼핑몰 직원',
        power: 14,
        attack: 2,
        search: 5,
        ability: {
            name: '포레스트를 게임에서 제거함으로 사기 1 상승 합니다.',
            type: 'plusMoral'
        }
    },
    {
        index: 9,
        name: '데이비드 가르시아',
        job: '회계사',
        power: 50,
        attack: 4,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 현재 장소에서 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
            type: 'killZombie',
            place: '도서관'
        }
    },
    {
        index: 10,
        name: '존 프라이스',
        job: '학생',
        power: 18,
        attack: 3,
        search: 5,
        ability: {
            name: '라운드마다 한 번, 현재 장소의 아이템 카드 1장을 가져갑니다.',
            type: 'get'
        }
    },
    {
        index: 11,
        name: '에드워드 화이트',
        job: '화학자',
        power: 44,
        attack: 4,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 주유소에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
            type: 'killZombie',
            place: '주유소'
        }
    },
    {
        index: 12,
        name: '알렉시스 그레이',
        job: '사서',
        power: 46,
        attack: 5,
        search: 4,
        ability: {
            name: '라운드마다 한 번, 도서관에 있을때 아이템 카드 1장을 가져갑니다.',
            type: 'get',
            place: '도서관'
        }
    },
    {
        index: 13,
        name: '마리아 로페즈',
        job: '교사',
        power: 48,
        attack: 4,
        search: 2,
        ability: {
            name: '라운드마다 한 번, 학교에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
            type: 'killZombie',
            place: '학교'
        }
    },
    {
        index: 14,
        name: '소피 로빈슨',
        job: '항공기 조종사',
        power: 58,
        attack: 4,
        search: 1,
        ability: {
            name: '라운드마다 한 번, 경창서에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
            type: 'killZombie',
            place: '경찰서'
        }
    },
    {
        index: 15,
        name: '가브리엘 디아즈',
        job: '소방관',
        power: 60,
        attack: 2,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 현재 장소의 아이템 카드 맨위 4장의 카드를 확인하고 외부인 카드가 있으면 외부인 카드 1장 가져갑니다.',
            type: 'rescue'
        }
    },
    {
        index: 16,
        name: '제니 클라크',
        job: '웨이트리스',
        power: 24,
        attack: 4,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 현재 장소의 아이템 카드를 1장을 가져갑니다.',
            type: 'get'
        }
    },
    {
        index: 17,
        name: '브랜든 케인',
        job: '건물 관리인',
        power: 26,
        attack: 2,
        search: 4,
        ability: {
            name: '라운드마다 한 번, 쓰레기 카드 5장 처분합니다.',
            type: 'clean'
        }
    },
    {
        index: 18,
        name: '배브 러셀',
        job: '어머니',
        power: 34,
        attack: 2,
        search: 4,
        ability: {
            name: '라운드마다 한 번, 피난기지에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위 굴리지 않습니다.',
            type: 'killZombie',
            place: '피난기지'
        }
    },
    {
        index: 19,
        name: '버디 데이비스',
        job: '헬스 트레이너',
        power: 36,
        attack: 2,
        search: 4,
        ability: {
            name: '라운드마다 한 번, 마트에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
            type: 'killZombie',
            place: '마트'
        }
    },
    {
        index: 20,
        name: '애널리 첸',
        job: '변호사',
        power: 38,
        attack: 2,
        search: 2,
        ability: {
            name: '라운드마다 한 번, 현재 장소의 아이템 카드를 1장을 가져갑니다.',
            type: 'get'
        }
    },
    {
        index: 21,
        name: '로드 밀러',
        job: '트럭 운전기사',
        power: 40,
        attack: 3,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 주유소에 있을때 아이템 카드를 1장을 가져갑니다.',
            type: 'get',
            place: '주유소'
        }
    },
    {
        index: 22,
        name: '자넷 타일러',
        job: '간호사',
        power: 42,
        attack: 3,
        search: 4,
        ability: {
            name: '라운드마다 한 번, 병원에 있을때 아이템 카드 1장 가져갑니다.',
            type: 'get',
            place: '병원'
        }
    },
    {
        index: 23,
        name: '어서 서스턴',
        job: '교장',
        power: 62,
        attack: 4,
        search: 2,
        ability: {
            name: '라운드마다 한 번, 학교에 있을때 아이템 카드 1장 가져갑니다.',
            type: 'get',
            place: '학교'
        }
    },
    {
        index: 24,
        name: '마이크 조',
        job: '닌자',
        power: 30,
        attack: 2,
        search: 4,
        ability: {
            name: '라운드마다 한 번, 현재 장소에서 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
            type: 'killZombie'
        }
    },
    {
        index: 25,
        name: '하먼 브록스',
        job: '공원 관리인',
        power: 32,
        attack: 3,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 현재 장소에 바리케이트 2개 설치합니다.',
            type: 'barricade'
        }
    },
    {
        index: 26,
        name: '제임스 마이어스',
        job: '정신과 의사',
        power: 54,
        attack: 6,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 병원에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
            type: 'killZombie',
            place: '병원'
        }
    },
    {
        index: 27,
        name: '카를라 톰슨',
        job: '경찰 지령요원',
        power: 22,
        attack: 4,
        search: 3,
        ability: {
            name: '라운드마다 한 번, 경찰서에 있을때 아이템 카드 1장 가져갑니다.',
            type: 'get',
            place: '경찰서'
        }
    },
    {
        index: 28,
        name: '에슐리 로스',
        job: '건설 노동자',
        power: 52,
        attack: 2,
        search: 5,
        ability: {
            name: '라운드마다 한 번, 현재 장소에 바리케이트 2개 설치합니다.',
            type: 'barricade'
        }
    },
    {
        index: 29,
        name: '다니엘 스미스',
        job: '보안관',
        power: 66,
        attack: 2,
        search: 5,
        ability: {
            name: '라운드마다 한 번, 현재 장소에서 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
            type: 'killZombie'
        }
    }
];

survivorList.forEach(survivor => {
    survivor.wound = 0;
    survivor.playerIndex = 0;
    survivor.active = false;
    survivor.place = null
});

export default survivorList;