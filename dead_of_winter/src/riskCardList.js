const riskCardList = [
    {
        name: '식량 2개를 모아라. 실패시 사기 1 하락',
        condition: {
            itemCardList: ['식량'],
            fail: {
                actionList: [
                    {
                        name: 'minusMoral'
                    }
                ]
            }
        }
    },
    {
        name: '연료 2개를 모아라. 실패시 피난기지에 좀비 12구 출현',
        condition: {
            itemCardList: ['연료'],
            fail: {
                actionList: [
                    {
                        name: 'zombie',
                        targetCount: 12,
                        placeList: ['피난기지']
                    }
                ]
            }
        }
    },
    {
        name: '약 2개를 모아라. 실패시 5번의 부상',
        condition: {
            itemCardList: ['약'],
            fail: {
                actionList: [
                    {
                        name: 'wound',
                        targetCount: 5
                    }
                ]
            }
        }
    },
    {
        name: '약/도구 2개를 모아라. 실패시 도서관과 마트에 좀비 3구 출현',
        condition: {
            itemCardList: ['약', '도구'],
            fail: {
                actionList: [
                    {
                        name: 'zombie',
                        placeList: ['도서관', '마트'],
                        targetCount: 3
                    }
                ]
            }
        }
    },
    {
        name: '약/도구 2개를 모아라. 실패시 바리케이드 모두 제거, 1번의 부상',
        condition: {
            itemCardList: ['약', '도구'],
            fail: {
                actionList: [
                    {
                        name: 'barricade',
                        targetCount: 100
                    },
                    {
                        name: 'wound',
                        targetCount: 1
                    }
                ]
            }
        }
    },
    {
        name: '연료 2개를 모아라. 실패시 사기 2 저하, 1번의 부상',
        condition: {
            itemCardList: ['연료'],
            fail: {
                actionList: [
                    {
                        name: 'minusMoral',
                        targetCount: 2
                    },
                    {
                        name: 'wound',
                        targetCount: 1
                    }
                ]
            }
        }
    },
    {
        name: '식량 2개를 모아라. 실패시 굶주림 토큰 1개, 사기 1 저하',
        condition: {
            itemCardList: ['식량'],
            fail: {
                actionList: [
                    {
                        name: 'starving',
                        targetCount: 1
                    },
                    {
                        name: 'minusMoral',
                        targetCount: 1
                    }
                ]
            }
        }
    },
    {
        name: '식량 2개를 모아라. 실패시 굶주림 토큰 1개, 사기 1 저하',
        condition: {
            itemCardList: ['식량'],
            fail: {
                actionList: [
                    {
                        name: 'starving',
                        targetCount: 1
                    },
                    {
                        name: 'minusMoral',
                        targetCount: 1
                    }
                ]
            }
        }
    },
    {
        name: '도구 2개를 모아라. 실패시 피난기지에 좀비 6구 촐몰, 다른 모든 장소에는 좀비 1구 출몰',
        condition: {
            itemCardList: ['도구'],
            fail: {
                actionList: [
                    {
                        name: 'zombie',
                        placeList: ['피난기지'],
                        targetCount: 6
                    },
                    {
                        name: 'zombie',
                        placeList: ['병원', '마트', '경찰서', '주유소', '도서관', '학교'],
                        targetCount: 1
                    }
                ]
            }
        }
    },
    {
        name: '약 2개를 모아라. 실패시 모든 생존자 1번의 부상, 사기 1 저하',
        condition: {
            itemCardList: ['약'],
            fail: {
                actionList: [
                    {
                        name: 'wound',
                        targetCount: 100
                    },
                    {
                        name: 'minusMoral',
                        targetCount: 1
                    }
                ]
            }
        }
    },
    {
        name: '식량 2개를 모아라. 실패시 사기 2 저하',
        condition: {
            itemCardList: ['식량'],
            fail: {
                actionList: [
                    {
                        name: 'minusMoral',
                        targetCount: 2
                    }
                ]
            }
        }
    },
    {
        name: '식량/약 2개를 모아라. 실패시 병원, 주유소에 좀비 3구 출몰',
        condition: {
            itemCardList: ['식량', '약'],
            fail: {
                actionList: [
                    {
                        name: 'zombie',
                        placeList: ['병원', '주유소'],
                        targetCount: 3
                    }
                ]
            }
        }
    },
    {
        name: '연료 2개를 모아라. 실패시 모든 바리케이트 제거',
        condition: {
            itemCardList: ['연료'],
            fail: {
                actionList: [
                    {
                        name: 'barricade',
                        targetCount: 100
                    },
                ]
            }
        }
    },
    {
        name: '연료 2개를 모아라. 실패시 바리케이트 제거, 1번의 부상, 사기 1 저하',
        condition: {
            itemCardList: ['연료'],
            fail: {
                actionList: [
                    {
                        name: 'barricade'
                    },
                    {
                        name: 'wound',
                        targetCount: 1
                    },
                    {
                        name: 'minusMoral',
                        targetCount: 1
                    }
                ]
            }
        }
    },
    {
        name: '도구 2개를 모아라. 실패시 피난기지에 좀비 8구 출몰, 사기 1 저하',
        condition: {
            itemCardList: ['도구'],
            fail: {
                actionList: [
                    {
                        name: 'zombie',
                        placeList: ['피난기지'],
                        targetCount: 8
                    },
                    {
                        name: 'minusMoral',
                        targetCount: 1
                    }
                ]
            }
        }
    },
    {
        name: '약 2개를 모아라. 실패시 사기 2 저하',
        condition: {
            itemCardList: ['약'],
            fail: {
                actionList: [
                    {
                        name: 'minusMoral',
                        targetCount: 2
                    }
                ]
            }
        }
    },
    {
        name: '식량 2개를 모아라. 실패시 생존자 2명 죽음, 사기는 저하되지 않습니다.',
        condition: {
            itemCardList: ['식량'],
            fail: {
                actionList: [
                    {
                        name: 'dead',
                        targetCount: 2
                    }
                ]
            }
        }
    },
    {
        name: '식량 2개를 모아라. 실패시 생존자 1명 죽음, 사기 1 저하',
        condition: {
            itemCardList: ['식량'],
            fail: {
                actionList: [
                    {
                        name: 'dead',
                        targetCount: 1
                    },
                    {
                        name: 'minusMoral',
                        targetCount: 1
                    }
                ]
            }
        }
    },
    {
        name: '도구 2개를 모아라. 실패시 피난기지의 식량 3개 제거, 사기 1 저하',
        condition: {
            itemCardList: ['도구'],
            fail: {
                actionList: [
                    {
                        name: '식량제거',
                        targetCount: 3
                    },
                    {
                        name: 'minusMoral',
                        targetCount: 1
                    }
                ]
            }
        }
    },
    {
        name: '도구/연료 2개를 모아라. 실패시 학교, 경찰서에 각각 좀비 1구 출몰',
        condition: {
            itemCardList: ['도구', '연료'],
            fail: {
                actionList: [
                    {
                        name: 'zombie',
                        placeList: ['학교', '경찰서'],
                        targetCount: 1
                    }
                ]
            }
        }
    }
];

export default riskCardList;