var blockList = [
    {
        index: 0,
        title: '아지트',
        styleObject: {
            left: '1800px',
            top: '700px',
        },
        start: true,
        burglar: true
    },
    {
        index: 1,
        subTitle: '도둑은 보석이 있는 건물 한곳을 알 수 있다.',
        styleObject: {
            left: '1800px',
            top: '650px',
        },
        burglar: true
    },
    {
        index: 2,
        styleObject: {
            left: '1800px',
            top: '600px',
        },
        trick: true
    },
    {
        index: 3,
        styleObject: {
            left: '1800px',
            top: '550px',
        }
    },
    {
        index: 4,
        styleObject: {
            left: '1700px',
            top: '600px',
        }
    },
    {
        index: 5,
        styleObject: {
            left: '1600px',
            top: '600px',
        }
    },
    {
        index: 6,
        subTitle: '4칸 앞으로 가서 지시에 따른다.',
        styleObject: {
            left: '1500px',
            top: '600px',
        }
    },
    {
        index: 7,
        styleObject: {
            left: '1500px',
            top: '650px',
        }
    },
    {
        index: 8,
        styleObject: {
            left: '1500px',
            top: '700px',
        }
    },
    {
        index: 9,
        styleObject: {
            left: '1500px',
            top: '750px',
        }
    },
    {
        index: 10,
        subTitle: '도둑은 위치 이동을 한다.',
        titleStyleObject: {
            fontSize: '13px'
        },
        styleObject: {
            left: '1800px',
            top: '500px',
        },
        move: true,
        target: 'burglar',
        trick: true,
        burglar: true
    },
    {
        index: 11,
        styleObject: {
            left: '1800px',
            top: '450px',
        }
    },
    {
        index: 12,
        styleObject: {
            left: '1800px',
            top: '400px',
        },
        trick: true
    },
    {
        index: 13,
        subTitle: '주사위 수가 남아도 반드시 멈춘다',
        styleObject: {
            left: '1700px',
            top: '400px',
        }
    },
    {
        index: 14,
        styleObject: {
            left: '1600px',
            top: '400px',
        }
    },
    {
        index: 15,
        styleObject: {
            left: '1500px',
            top: '400px',
        },
        trick: true
    },
    {
        index: 16,
        styleObject: {
            left: '1700px',
            top: '500px',
        }
    },
    {
        index: 17,
        subTitle: '도둑이 보석을 가지고 있으면 경찰에게 주고 경찰은 다시 숨긴다.',
        styleObject: {
            left: '1600px',
            top: '500px',
        }
    },
    {
        index: 18,
        styleObject: {
            left: '1500px',
            top: '500px',
        }
    },
    {
        index: 19,
        subTitle: '경찰은 도둑의 1칸 앞으로 간다.',
        styleObject: {
            left: '1400px',
            top: '400px',
        }
    },
    {
        index: 20,
        styleObject: {
            left: '1300px',
            top: '400px',
        },
        trick: true
    },
    {
        index: 21,
        subTitle: '도둑은 아지트로 경찰은 감옥으로',
        styleObject: {
            left: '1200px',
            top: '400px',
        },
        comeBackHome: true
    },
    {
        index: 22,
        styleObject: {
            left: '1100px',
            top: '400px',
        },
        trick: true
    },
    {
        index: 23,
        styleObject: {
            left: '1100px',
            top: '350px',
        }
    },
    {
        index: 24,
        styleObject: {
            left: '1300px',
            top: '350px',
        },
        onlyBurglar: true
    },
    {
        index: 25,
        styleObject: {
            left: '1400px',
            top: '750px',
        },
        goHome: true
    },
    {
        index: 26,
        styleObject: {
            left: '1300px',
            top: '750px',
        },
        trick: true
    },
    {
        index: 27,
        styleObject: {
            left: '1300px',
            top: '700px',
        },
    },
    {
        index: 28,
        subTitle: '경찰은 주사위를 던져서 2가 나오면 도둑 한명 체포',
        styleObject: {
            left: '1300px',
            top: '650px',
        },
        police: true
    },
    {
        index: 29,
        styleObject: {
            left: '1300px',
            top: '600px',
        },
        trick: true
    },
    {
        index: 30,
        styleObject: {
            left: '1200px',
            top: '600px',
        },
        onlyBurglar: true
    },
    {
        index: 39,
        subTitle: '주사위 수가 남아도 반드시 멈춘다',
        styleObject: {
            left: '1300px',
            top: '550px',
        }
    },
    {
        index: 40,
        styleObject: {
            left: '1300px',
            top: '500px',
        },
        trick: true
    },
    {
        index: 41,
        styleObject: {
            left: '1400px',
            top: '500px',
        }
    },
    {
        index: 42,
        subTitle: '경찰은 도둑의 4칸 앞으로 간다.',
        styleObject: {
            left: '1200px',
            top: '500px',
        },
    },
    {
        index: 43,
        styleObject: {
            left: '1100px',
            top: '500px',
        },
    },
    {
        index: 44,
        styleObject: {
            left: '1000px',
            top: '500px',
        },
    },
    {
        index: 45,
        subTitle: '51로 이동',
        styleObject: {
            left: '900px',
            top: '500px',
        },
        changePosition: true
    },
    {
        index: 46,
        styleObject: {
            left: '800px',
            top: '500px',
        },
    },
    {
        index: 47,
        styleObject: {
            left: '700px',
            top: '500px',
        },
    },
    {
        index: 48,
        styleObject: {
            left: '700px',
            top: '450px',
        },
    },
    {
        index: 49,
        styleObject: {
            left: '700px',
            top: '400px',
        },
        trick: true
    },
    {
        index: 50,
        styleObject: {
            left: '1000px',
            top: '400px',
        }
    },
    {
        index: 51,
        subTitle: '45로 이동',
        styleObject: {
            left: '900px',
            top: '400px',
        },
        changePosition: true
    },
    {
        index: 52,
        subTitle: '주사위 수가 남아도 반드시 멈춘다',
        styleObject: {
            left: '800px',
            top: '400px',
        }
    },
    {
        index: 53,
        styleObject: {
            left: '700px',
            top: '350px',
        }
    },
    {
        index: 54,
        styleObject: {
            left: '700px',
            top: '300px',
        },
        onlyBurglar: true
    },
    {
        index: 55,
        subTitle: '경찰은 위치 이동을 한다.',
        styleObject: {
            left: '1100px',
            top: '300px',
        },
        movePolice: true,
    },
    {
        index: 57,
        subTitle: '도둑은 보석이 있는 건물 한곳을 알 수 있다.',
        styleObject: {
            left: '1100px',
            top: '250px',
        },
        burglar: true
    },
    {
        index: 58,
        styleObject: {
            left: '1100px',
            top: '200px',
        }
    },
    {
        index: 59,
        styleObject: {
            left: '1200px',
            top: '200px',
        }
    },
    {
        index: 60,
        styleObject: {
            left: '1300px',
            top: '200px',
        },
        trick: true
    },
    {
        index: 61,
        styleObject: {
            left: '1300px',
            top: '150px',
        }
    },
    {
        index: 62,
        styleObject: {
            left: '1300px',
            top: '100px',
        },
        onlyBurglar: true
    },
    {
        index: 63,
        styleObject: {
            left: '1500px',
            top: '350px',
        }
    },
    {
        index: 64,
        subTitle: '경찰은 71로 이동',
        styleObject: {
            left: '1500px',
            top: '300px',
        }
    },
    {
        index: 65,
        subTitle: '도둑은 72로 이동',
        styleObject: {
            left: '1500px',
            top: '250px',
        }
    },
    {
        index: 66,
        subTitle: '비타민을 먹었다. 5칸 전진',
        styleObject: {
            left: '1500px',
            top: '200px',
        },
        trick: true
    },
    {
        index: 67,
        styleObject: {
            left: '1500px',
            top: '150px',
        }
    },
    {
        index: 68,
        styleObject: {
            left: '1500px',
            top: '100px',
        }
    },
    {
        index: 69,
        styleObject: {
            left: '1500px',
            top: '50px',
        }
    },
    {
        index: 70,
        styleObject: {
            left: '1500px',
            top: '0px',
        },
        trick: true
    },
    {
        index: 71,
        subTitle: '경찰은 64으로 이동',
        styleObject: {
            left: '1800px',
            top: '350px',
        }
    },
    {
        index: 72,
        subTitle: '도둑은 65로 이동',
        styleObject: {
            left: '1800px',
            top: '300px',
        },
        moveBurglar: true
    },
    {
        index: 73,
        subTitle: '경찰은 주사위를 던져서 3이 나오면 도둑 한명 체포',
        styleObject: {
            left: '1400px',
            top: '200px',
        }
    },
    {
        index: 74,
        styleObject: {
            left: '1600px',
            top: '0px',
        },
    },
    {
        index: 75,
        styleObject: {
            left: '1700px',
            top: '0px',
        },
    },
    {
        index: 76,
        styleObject: {
            left: '1800px',
            top: '0px',
        },
        trick: true
    },
    {
        index: 77,
        title: '터널',
        subTitle: '138로 이동',
        styleObject: {
            left: '1800px',
            top: '250px',
        },
        trick: true
    },
    {
        index: 78,
        styleObject: {
            left: '1800px',
            top: '200px',
        }
    },
    {
        index: 79,
        subTitle: '경찰은 위치 이동을 한다.',
        styleObject: {
            left: '1800px',
            top: '150px',
        },
        movePolice:true,
    },
    {
        index: 80,
        styleObject: {
            left: '1800px',
            top: '100px',
        }
    },
    {
        index: 81,
        styleObject: {
            left: '1800px',
            top: '50px',
        }
    },
    {
        index: 82,
        subTitle: '도둑은 위치 이동을 한다.',
        styleObject: {
            left: '1400px',
            top: '0px',
            width: '100px',
        }
    },
    {
        index: 83,
        styleObject: {
            left: '1300px',
            top: '0px',
        }
    },
    {
        index: 84,
        subTitle: '주사위 수가 남아도 반드시 멈춘다.',
        styleObject: {
            left: '1200px',
            top: '0px',
        },
        stop: true
    },
    {
        index: 84,
        styleObject: {
            left: '1100px',
            top: '0px',
        }
    },
    {
        index: 85,
        styleObject: {
            left: '1000px',
            top: '0px',
        }
    },
    {
        index: 86,
        subTitle: '103으로 이동',
        styleObject: {
            left: '900px',
            top: '0px',
        },
        changePosition: true
    },
    {
        index: 87,
        styleObject: {
            left: '800px',
            top: '0px',
        }
    },
    {
        index: 88,
        subTitle: '밑에 있는 건물을 뒤져라',
        styleObject: {
            left: '700px',
            top: '0px',
        }
    },
    {
        index: 89,
        styleObject: {
            left: '600px',
            top: '0px',
        }
    },
    {
        index: 90,
        subTitle: '도둑은 위치 이동을 한다.',
        styleObject: {
            left: '500px',
            top: '0px',
        },
        move: true,
        moveTarget: 'burglar'
    },
    {
        index: 91,
        styleObject: {
            left: '500px',
            top: '50px',
        },
        trick: true
    },
    {
        index: 92,
        subTitle: '도둑은 위치 이동을 한다.',
        styleObject: {
            left: '500px',
            top: '100px',
        }
    },
    {
        index: 93,
        styleObject: {
            left: '500px',
            top: '150px',
        },
        trick: true
    },
    {
        index: 94,
        subTitle: '뒤로 2칸 이동해서 지시에 따른다.',
        styleObject: {
            left: '500px',
            top: '200px',
        },
        back: 2
    },
    {
        index: 95,
        styleObject: {
            left: '500px',
            top: '250px',
        }
    },
    {
        index: 96,
        styleObject: {
            left: '500px',
            top: '300px',
        }
    },
    {
        index: 97,
        subTitle: '경찰은 주사위를 던져서 6이 나오면 도둑 한명 체포',
        styleObject: {
            left: '500px',
            top: '350px',
        },
        police: true
    },
    {
        index: 98,
        subTitle: '경찰은 120으로 이동',
        styleObject: {
            left: '500px',
            top: '400px',
        },
        police: true,
        trick: true,
        move: 120,
        moveTarget: 'police'
    },
    {
        index: 99,
        subTitle: '도둑은 121으로 이동',
        styleObject: {
            left: '600px',
            top: '400px',
        },
        burglar: true,
        move: 121,
        moveTarget: 'buglar'
    },
    {
        index: 100,
        styleObject: {
            left: '1200px',
            top: '750px',
        }
    },
    {
        index: 101,
        subTitle: '경찰은 위치 이동을 한다.',
        styleObject: {
            left: '1100px',
            top: '750px',
        },
        movePolice:true,
    },
    {
        index: 102,
        styleObject: {
            left: '1000px',
            top: '750px',
        }
    },
    {
        index: 103,
        subTitle: '86으로 이동',
        styleObject: {
            left: '900px',
            top: '750px',
        },
        move: 86,
        changePosition: true
    },
    {
        index: 104,
        styleObject: {
            left: '800px',
            top: '750px',
        }
    },
    {
        index: 105,
        subTitle: '도둑은 99로 이동',
        styleObject: {
            left: '700px',
            top: '750px',
        },
        burglar: true,
        move: 99,
        burglarMove: true
    },
    {
        index: 106,
        subTitle: '경찰은 98로 이동',
        styleObject: {
            left: '600px',
            top: '750px',
        },
        police: true,
        move: 98,
        movePolice: true

    },
    {
        index: 107,
        styleObject: {
            left: '500px',
            top: '750px',
        }
    },
    {
        index: 108,
        styleObject: {
            left: '400px',
            top: '750px',
        }
    },
    {
        index: 109,
        styleObject: {
            left: '400px',
            top: '700px',
        }
    },
    {
        index: 110,
        subTitle: '도둑은 보석을 동료에게 넘겨준다',
        styleObject: {
            left: '400px',
            top: '650px',
        },
        trick: true,
        burglar: true
    },
    {
        index: 111,
        styleObject: {
            left: '500px',
            top: '650px',
        }
    },
    {
        index: 112,
        styleObject: {
            left: '600px',
            top: '650px',
        },
        onlyBurglar: true
    },
    {
        index: 113,
        styleObject: {
            left: '400px',
            top: '600px',
        }
    },
    {
        index: 114,
        styleObject: {
            left: '400px',
            top: '550px',
        }
    },
    {
        index: 115,
        styleObject: {
            left: '300px',
            top: '550px',
        }
    },
    {
        index: 116,
        styleObject: {
            left: '200px',
            top: '550px',
        },
        trick: true
    },
    {
        index: 117,
        subTitle: '도둑은 위치 이동을 한다.',
        styleObject: {
            left: '100px',
            top: '550px',
        }
    },
    {
        index: 118,
        subTitle: '밥을 먹고 힘이 났다. 3칸 앞으로',
        styleObject: {
            left: '0px',
            top: '550px',
        }
    },
    {
        index: 119,
        styleObject: {
            left: '0px',
            top: '600px',
        },
        trick: true
    },
    {
        index: 120,
        styleObject: {
            left: '0px',
            top: '650px',
        }
    },
    {
        index: 121,
        subTitle: '도둑은 보석이 있는 건물 한곳을 알 수 있다.',
        styleObject: {
            left: '0px',
            top: '700px',
        }
    },
    {
        index: 122,
        styleObject: {
            left: '0px',
            top: '750px',
        },
        goHome: true
    },
    {
        index: 123,
        subTitle: '도둑은 위치 이동을 한다.',
        styleObject: {
            left: '100px',
            top: '750px',
        }
    },
    {
        index: 124,
        styleObject: {
            left: '200px',
            top: '750px',
        },
        trick: true
    },
    {
        index: 125,
        styleObject: {
            left: '300px',
            top: '750px',
        }
    },
    {
        index: 126,
        styleObject: {
            left: '200px',
            top: '600px',
        },
        onlyBurglar: true
    },
    {
        index: 127,
        styleObject: {
            left: '0px',
            top: '500px',
        },
        trick: true
    },
    {
        index: 128,
        styleObject: {
            left: '0px',
            top: '450px',
        }
    },
    {
        index: 129,
        subTitle: '경찰은 도둑의 1칸 앞으로',
        styleObject: {
            left: '0px',
            top: '400px',
        }
    },
    {
        index: 130,
        styleObject: {
            left: '100px',
            top: '400px',
        },
        trick: true
    },
    {
        index: 131,
        styleObject: {
            left: '200px',
            top: '400px',
        }
    },
    {
        index: 132,
        subTitle: '이 칸에 멈추면 1회 휴식',
        styleObject: {
            left: '300px',
            top: '400px',
        },
        rest: true
    },
    {
        index: 133,
        subTitle: '도둑은 위치 이동을 한다.',
        styleObject: {
            left: '400px',
            top: '400px',
        },
        moveBurglar: true
    },
    {
        index: 134,
        styleObject: {
            left: '100px',
            top: '350px',
        }
    },
    {
        index: 135,
        subTitle: '도둑은 아지트로 경찰은 감옥으로',
        styleObject: {
            left: '100px',
            top: '300px',
        }
    },
    {
        index: 136,
        subTitle: '도둑은 위치 이동을 한다.',
        styleObject: {
            left: '100px',
            top: '250px',
        },
        moveBurglar: true
    },
    {
        index: 137,
        styleObject: {
            left: '100px',
            top: '200px',
        }
    },
    {
        index: 138,
        title: '터널',
        subTitle: '77로 이동',
        styleObject: {
            left: '0px',
            top: '200px',
        }
    },
    {
        index: 139,
        styleObject: {
            left: '400px',
            top: '150px',
        },
        onlyBurglar: true
    },
    {
        index: 140,
        subTitle: '도둑은 보석이 있는 건물 한곳을 알 수 있다.',
        styleObject: {
            left: '400px',
            top: '50px',
        }
    },
    {
        index: 141,
        subTitle: '경찰은 위치 이동을 한다.',
        styleObject: {
            left: '300px',
            top: '50px',
        },
        movePolice:true,
    },
    {
        index: 142,
        styleObject: {
            left: '200px',
            top: '50px',
        }
    },
    {
        index: 143,
        styleObject: {
            left: '100px',
            top: '50px',
        }
    },
    {
        index: 144,
        title: '경찰서',
        styleObject: {
            left: '0px',
            top: '0px',
        },
        start: true,
        police: true
    }
];

blockList.map(block => {
    if (block.onlyBurglar) {
        block.subTitle = '경찰은 들어 갈 수 없다.';
        block.burglar = true;
    }

    if (block.goHome) {
        block.subTitle = '도둑은 아지트로 경찰은 경찰서로';
        block.burglar = true;
    }
});

var app = new Vue({
    el: '#app',
    data: {
        jewelryList: [
            {
                styleObject: {
                    position: 'absolute',
                    left: '2000px',
                    top: '0px',
                    width: '200px',
                    height: '160px',
                    backgroundImage: 'url(image/j1.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '2200px',
                    top: '0px',
                    width: '200px',
                    height: '160px',
                    backgroundImage: 'url(image/j2.png)'
                }
            }
        ]
        ,
        buildingList:[
            {
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '250px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/1.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '580px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/2.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '700px',
                    top: '200px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/3.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '1200px',
                    top: '50px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/4.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '600px',
                    top: '550px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/5.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '200px',
                    top: '650px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/6.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '300px',
                    top: '100px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/7.png)'
                }
            }
        ],
        policeList:[
            {
                styleObject: {
                    position: 'absolute',
                    left: '2300px',
                    top: '380px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/d.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '2380px',
                    top: '380px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/e.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '2460px',
                    top: '380px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/f.png)'
                }
            }
        ],
        burglarList:[
            {
                styleObject: {
                    position: 'absolute',
                    left: '2300px',
                    top: '300px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/a.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '2380px',
                    top: '300px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/b.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '2460px',
                    top: '300px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/c.png)'
                }
            }
        ],
        cellList: blockList
    }
});

var $app = $('#app');
var $dic = $('<div></div>');
$dic.attr('id', 'die');
$app.append($dic);

var die = new Die();
$app.append(die.$element);