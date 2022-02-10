const riskCardList = [
    {
        name: '낭비',
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
        name: '죽음의 군단',
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
        name: '탈진',
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
        name: '그들이 지켜본다',
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
        name: '우박 폭풍',
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
        name: '연료 부족',
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
        name: '식량 고갈',
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
        name: '식량 부패',
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
        name: '밀려드는 좀비',
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
        name: '질병',
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
        name: '공포에 휩싸인 밤',
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
        name: '살인 본능',
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
        name: '죽은자의 괴력',
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
        name: '눈보라',
        condition: {
            itemCardList: ['연료'],
            fail: {
                actionList: [
                    {
                        name: 'barricade',
                        targetCount: 1
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
        name: '죽음의 파도',
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
        name: '절망',
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
        name: '인구 포화',
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
        name: '떼강도',
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
        name: '매수공작',
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
        name: '망자들의 행진',
        condition: {
            itemCardList: ['도구', '연료'],
            fail: {
                actionList: [
                    {
                        name: 'zombie',
                        placeList: ['학교', '경찰서'],
                        targetCount: 8
                    }
                ]
            }
        }
    }
];

console.log('>>> riskList', riskCardList.length);

export default riskCardList;