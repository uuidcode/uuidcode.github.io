const crossroadCardList = [
    {
        name: '다친 생존자를 만났는데 피난기지의 위치를 알려줄까?',
        yes: {
            action: [
                {
                    name: '생존자 추가',
                    placeList: ['피난기지']
                },
                {
                    name: '위험 노출 주사위',
                    targetCount: 2
                }
            ]
        }
    },
    {
        name: '어린 생존자를 만났는데 피난기지의 위치를 알려줄가?',
        yes: {
            action: [
                {
                    name: '노약자 토큰 추가',
                    targetCount: 3
                },
                {
                    name: '사기 상승',
                    targetCount: 1
                }
            ]
        }
    },
    {
        name: '크리스마스 파티를 열까?',
        yes: {
            action: [
                {
                    name: '식량 토큰 소비',
                    targetCount: 5
                },
                {
                    name: '사기 상승',
                    targetCount: 1
                }
            ]
        }
    },
    {
        name: '노약자를 피난기지에서 쫒아내자',
        yes: {
            action: [
                {
                    name: '모든 노약자 토큰 제거'
                },
                {
                    name: '사기 하락',
                    targetCount: 1
                }
            ]
        }
    },
    {
        name: '식량으로 약을 만들까?',
        yes: {
            action: [
                {
                    name: '식량 제거',
                    targetCount: 1
                },
                {
                    name: '약 추가',
                    targetCount: 1
                }
            ]
        }
    },
    {
        name: '위험을 무릎쓰고 바리케이트를 칠까?',
        yes: {
            action: [
                {
                    name: '바리케이드',
                    targetCount: 3
                },
                {
                    name: '위험 노출 주사위',
                    targetCount: 1
                }
            ]
        }
    },
    {
        name: '식량을 발견하다.',
        yes: {
            action: [
                {
                    name: '식량 추가',
                    targetCount: 3
                },
                {
                    name: '부상',
                    targetCount: 1
                }
            ]
        }
    },
    {
        name: '식량이 부패하다. 그래도 먹을까?\n피난기지에 아무도 없으면 ',
        yes: {
            action: [
                {
                    name: '주사위를 굴려서 짝수가 나오면 아무런 변화 없음, 홀수가 나오면 2면 부상',
                }
            ]
        },
        no: {
            action: [
                {
                    name: '식량 3개를 제거합니다.',
                    targetCount: 3
                }
            ]
        }
    },
    {
        name: '피난기지에 폭동이 일어났다. 진압을 할까?',
        yes: {
            action: [
                {
                    name: '사망',
                    targetCount: 1
                },
                {
                    name: '사기 상승',
                    targetCount: 1
                }
            ]
        },
        no: {
            action: [
                {
                    name: '부상',
                    targetCount: 2
                }
            ]
        }
    }
]