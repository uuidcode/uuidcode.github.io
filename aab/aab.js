var blockList = [
    {
        index: 0,
        title: '아지트',
        styleObject: {
            left: '1800px',
            top: '700px',
        },
        start: true
    },
    {
        index: 1,
        styleObject: {
            left: '1800px',
            top: '650px',
        },
        threat: true
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
        styleObject: {
            left: '1500px',
            top: '600px',
        },
        mission: true,
        forward: true,
        move: 4
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
        styleObject: {
            left: '1800px',
            top: '500px',
        },
        trick: true,
        changeBurglar: true
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
        styleObject: {
            left: '1700px',
            top: '400px',
        },
        stop: true
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
        subTitle: '보석을 가지고 있으면 경찰에게 주고 경찰은 다시 숨긴다.',
        styleObject: {
            left: '1600px',
            top: '500px',
        },
        burglar: true
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
        styleObject: {
            left: '1400px',
            top: '400px',
        },
        run: true,
        forward: true,
        move: 1
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
        styleObject: {
            left: '1200px',
            top: '400px',
        },
        goHome: true
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
        styleObject: {
            left: '1300px',
            top: '650px',
        },
        arrest: true,
        dice: 2
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
        styleObject: {
            left: '1300px',
            top: '550px',
        },
        stop: true
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
        styleObject: {
            left: '1200px',
            top: '500px',
        },
        movePolice: true,
        move: 4,
        forward: true
    },
    {
        index: 43,
        styleObject: {
            left: '1100px',
            top: '500px',
        }
    },
    {
        index: 44,
        styleObject: {
            left: '1000px',
            top: '500px',
        }
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
        }
    },
    {
        index: 47,
        styleObject: {
            left: '700px',
            top: '500px',
        }
    },
    {
        index: 48,
        styleObject: {
            left: '700px',
            top: '450px',
        }
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
        styleObject: {
            left: '800px',
            top: '400px',
        },
        stop: true
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
        styleObject: {
            left: '1100px',
            top: '300px',
        },
        police: true
    },
    {
        index: 56,
        styleObject: {
            left: '1100px',
            top: '250px',
        },
        threat: true
    },
    {
        index: 57,
        styleObject: {
            left: '1100px',
            top: '200px',
        }
    },
    {
        index: 58,
        styleObject: {
            left: '1200px',
            top: '200px',
        }
    },
    {
        index: 59,
        styleObject: {
            left: '1300px',
            top: '200px',
        },
        trick: true
    },
    {
        index: 60,
        styleObject: {
            left: '1300px',
            top: '150px',
        }
    },
    {
        index: 61,
        styleObject: {
            left: '1300px',
            top: '100px',
        },
        onlyBurglar: true
    },
    {
        index: 62,
        styleObject: {
            left: '1500px',
            top: '350px',
        }
    },
    {
        index: 63,
        styleObject: {
            left: '1500px',
            top: '300px',
        },
        movePolice: true,
        move: 71
    },
    {
        index: 64,
        styleObject: {
            left: '1500px',
            top: '250px',
        },
        moveBurglar: true,
        move: 72
    },
    {
        index: 65,
        styleObject: {
            left: '1500px',
            top: '200px',
        },
        trick: true,
        mission: true,
        move: 3,
        forward: true
    },
    {
        index: 66,
        styleObject: {
            left: '1500px',
            top: '150px',
        }
    },
    {
        index: 67,
        styleObject: {
            left: '1500px',
            top: '100px',
        }
    },
    {
        index: 68,
        styleObject: {
            left: '1500px',
            top: '50px',
        }
    },
    {
        index: 69,
        styleObject: {
            left: '1500px',
            top: '0px',
        },
        trick: true
    },
    {
        index: 70,
        styleObject: {
            left: '1800px',
            top: '350px',
        },
        movePolice: true,
        move: 64
    },
    {
        index: 71,
        styleObject: {
            left: '1800px',
            top: '300px',
        },
        moveBurglar: true,
        move: 65
    },
    {
        index: 72,
        styleObject: {
            left: '1400px',
            top: '200px',
        },
        arrest: true,
        dice: 3
    },
    {
        index: 73,
        styleObject: {
            left: '1600px',
            top: '0px',
        },
    },
    {
        index: 74,
        styleObject: {
            left: '1700px',
            top: '0px',
        },
    },
    {
        index: 75,
        styleObject: {
            left: '1800px',
            top: '0px',
        },
        trick: true
    },
    {
        index: 76,
        subTitle: '138로 이동',
        styleObject: {
            left: '1800px',
            top: '250px',
        },
        tunnel: true,
        trick: true
    },
    {
        index: 77,
        styleObject: {
            left: '1800px',
            top: '200px',
        }
    },
    {
        index: 78,
        styleObject: {
            left: '1800px',
            top: '150px',
        },
        changePolice: true
    },
    {
        index: 79,
        styleObject: {
            left: '1800px',
            top: '100px',
        }
    },
    {
        index: 80,
        styleObject: {
            left: '1800px',
            top: '50px',
        }
    },
    {
        index: 81,
        styleObject: {
            left: '1400px',
            top: '0px',
        },
        changeBurglar: true
    },
    {
        index: 82,
        styleObject: {
            left: '1300px',
            top: '0px',
        }
    },
    {
        index: 83,
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
        changePosition: true,
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
        styleObject: {
            left: '700px',
            top: '0px',
        },
        search: true
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
        styleObject: {
            left: '500px',
            top: '0px',
        },
        changeBurglar: true
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
        styleObject: {
            left: '500px',
            top: '100px',
        },
        changeBurglar: true
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
        styleObject: {
            left: '500px',
            top: '200px',
        },
        mission: true,
        backward: true,
        move: 2
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
        styleObject: {
            left: '500px',
            top: '350px',
        },
        arrest: true,
        dice: 6
    },
    {
        index: 98,
        styleObject: {
            left: '500px',
            top: '400px',
        },
        move: 106,
        trick: true,
        movePolice: true
    },
    {
        index: 99,
        styleObject: {
            left: '600px',
            top: '400px',
        },
        moveBurglar: true,
        move: 105
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
        styleObject: {
            left: '1100px',
            top: '750px',
        },
        changePolice: true
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
        changePosition: true,
        move: 86
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
        styleObject: {
            left: '700px',
            top: '750px',
        },
        moveBurglar: true,
        move: 99,
    },
    {
        index: 106,
        styleObject: {
            left: '600px',
            top: '750px',
        },
        movePolice: true,
        move: 98

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
        styleObject: {
            left: '400px',
            top: '650px',
        },
        burglar: true,
        trick: true,
        send: true
    },
    {
        index: 112,
        styleObject: {
            left: '500px',
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
        styleObject: {
            left: '100px',
            top: '550px',
        },
        changeBurglar: true
    },
    {
        index: 118,
        styleObject: {
            left: '0px',
            top: '550px',
        },
        mission: true,
        move: 3,
        forward: true
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
        styleObject: {
            left: '0px',
            top: '700px',
        },
        threat: true
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
        styleObject: {
            left: '100px',
            top: '750px',
        },
        changeBurglar: true
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
        styleObject: {
            left: '0px',
            top: '400px',
        },
        run: true,
        move: 1,
        forward: true
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
        styleObject: {
            left: '300px',
            top: '400px',
        },
        rest: true
    },
    {
        index: 133,
        styleObject: {
            left: '400px',
            top: '400px',
        },
        changeBurglar: true
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
        styleObject: {
            left: '100px',
            top: '300px',
        },
        goHome: true
    },
    {
        index: 136,
        styleObject: {
            left: '100px',
            top: '250px',
        },
        changeBurglar: true
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
        subTitle: '75로 이동',
        styleObject: {
            left: '0px',
            top: '200px',
        },
        tunnel: true,
        move: 75
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
        styleObject: {
            left: '400px',
            top: '50px',
        },
        threat: true
    },
    {
        index: 141,
        styleObject: {
            left: '300px',
            top: '50px',
        },
        changePolice: true,
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

let data = {
    jewelryList: [
        {
            index: 0,
            styleObject: {
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '50px',
                height: '40px',
                backgroundImage: 'url(image/j1.png)',
                backgroundSize: 'cover'
            },
            classObject: {
                jewelry: true,
                hideJewelry: true
            }
        },
        {
            index: 1,
            styleObject: {
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '50px',
                height: '40px',
                backgroundImage: 'url(image/j2.png)',
                backgroundSize: 'cover'
            },
            classObject: {
                jewelry: true,
                hideJewelry: true
            }
        }
    ]
    ,
    buildingList:[
        {
            index: 0,
            styleObject: {
                position: 'absolute',
                left: '1300px',
                top: '250px',
                width: '100px',
                height: '100px',
                backgroundImage: 'url(image/1.png)'
            },
            classObject: {}
        },
        {
            index: 1,
            styleObject: {
                position: 'absolute',
                left: '1100px',
                top: '580px',
                width: '100px',
                height: '100px',
                backgroundImage: 'url(image/2.png)'
            },
            classObject: {}
        },
        {
            index: 2,
            styleObject: {
                position: 'absolute',
                left: '700px',
                top: '200px',
                width: '100px',
                height: '100px',
                backgroundImage: 'url(image/3.png)'
            },
            classObject: {}
        },
        {
            index: 3,
            styleObject: {
                position: 'absolute',
                left: '1200px',
                top: '50px',
                width: '100px',
                height: '100px',
                backgroundImage: 'url(image/4.png)'
            },
            classObject: {}
        },
        {
            index: 4,
            styleObject: {
                position: 'absolute',
                left: '500px',
                top: '550px',
                width: '100px',
                height: '100px',
                backgroundImage: 'url(image/5.png)'
            },
            classObject: {}
        },
        {
            index: 5,
            styleObject: {
                position: 'absolute',
                left: '200px',
                top: '650px',
                width: '100px',
                height: '100px',
                backgroundImage: 'url(image/6.png)'
            },
            classObject: {}
        },
        {
            index: 6,
            styleObject: {
                position: 'absolute',
                left: '300px',
                top: '100px',
                width: '100px',
                height: '100px',
                backgroundImage: 'url(image/7.png)'
            },
            classObject: {}
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
    blockList: blockList,
    status: {
        hideJewelryMode: false,
        hideJewelryCount: 0
    }
};

let app = new Vue({
    el: '#app',
    data: data,
    methods: {
        hideJewelryAtBuilding: function (event) {
            let index = $(event.target).attr('data-index');
            let building = this.buildingList[index];
            building.classObject.blink = false;
            Vue.set(this.buildingList, index, building);

            let $jewelry = $('.jewelry').eq(this.status.hideJewelryCount);
            $jewelry.show();

            $jewelry.animate({
                left: $(event.target).offset().left + 50,
                top: $(event.target).offset().top + 25,
            }, 1000, function () {
                app.status.hideJewelryCount++;
                $jewelry.hide();
            });
        },
        getDirection: function(block) {
            if (block.backward) {
                return '뒤';
            }

            return "앞";
        },
        getSubTitle: function (block) {
            const direction = this.getDirection(block);

            if (block.mission) {
                return `${block.move}칸 ${direction}으로 가서 지시에 따른다.`;
            } else if (block.arrest) {
                return `경찰은 주사위를 던져서 ${block.dice}이 나오면 도둑 한명 체포`;
            } else if (block.search) {
                return `밑에 있는 건물을 뒤져라`;
            } else if (block.rest) {
                return `이 칸에 멈추면 1회 휴식`;
            } else if (block.stop) {
                return `주사위 수가 남아도 반드시 멈춘다`;
            } else if (block.changeBurglar) {
                return `도둑은 위치 이동을 한다`;
            } else if (block.moveBurglar) {
                return `도둑은 ${block.move}으로 이동`;
            } else if (block.changePolice) {
                return `경찰은 위치 이동을 한다`;
            } else if (block.run) {
                return `경찰은 도둑의 ${block.move}칸으로 ${direction}으로 이동`;
            } else if (block.movePolice) {
                return `경찰은 ${this.move}으로 이동`;
            } else if (block.onlyBurglar) {
                return `경찰은 들어 갈 수 없다`;
            } else if (block.threat) {
                return `도둑은 보석이 있는 건물 한곳을 알 수 있다`;
            } else if (block.goHome) {
                return `도둑은 아지트로 경찰은 경찰서로`;
            } else if (block.send) {
                return `도둑은 보석을 동료에게 넘겨준다`;
            }

            return block.subTitle;
        }
    },
    created: function () {
        this.blockList = this.blockList.map((block) => {
            return {
                ...block,
                subTitle: this.getSubTitle(block),
                classObject: {
                    burglar: block.burglar ||
                        block.moveBurglar ||
                        block.changeBurglar ||
                        block.search ||
                        block.onlyBurglar ||
                        block.threat ||
                        block.send,
                    police: block.police ||
                        block.movePolice ||
                        block.changePolice ||
                        block.arrest ||
                        block.run,
                    changePosition: block.changePosition,
                    tunnel: block.tunnel,
                    mission: block.mission,
                    rest: block.rest,
                    stop: block.stop,
                    goHome: block.goHome
                }
            }
        })
    }
    
});

$(document.body).curvedArrow({
    p0x: 550,
    p0y: 460,
    p1x: 550,
    p1y: 460,
    p2x: 650,
    p2y: 740,
    strokeStyle: 'rgba(135, 206, 235, 1)'
});

$(document.body).curvedArrow({
    p0x: 650,
    p0y: 740,
    p1x: 650,
    p1y: 740,
    p2x: 550,
    p2y: 460,
    strokeStyle: 'rgba(135, 206, 235, 1)'
});

$(document.body).curvedArrow({
    p0x: 650,
    p0y: 460,
    p1x: 650,
    p1y: 460,
    p2x: 750,
    p2y: 740,
    strokeStyle: 'rgba(255, 192, 203, 1)'
});

$(document.body).curvedArrow({
    p0x: 750,
    p0y: 740,
    p1x: 750,
    p1y: 740,
    p2x: 650,
    p2y: 460,
    strokeStyle: 'rgba(255, 192, 203, 1)'
});

$(document.body).curvedArrow({
    p0x: 1610,
    p0y: 325,
    p1x: 1610,
    p1y: 325,
    p2x: 1790,
    p2y: 375,
    strokeStyle: 'rgba(135, 206, 235, 1)'
});

$(document.body).curvedArrow({
    p0x: 1790,
    p0y: 375,
    p1x: 1790,
    p1y: 375,
    p2x: 1610,
    p2y: 325,
    strokeStyle: 'rgba(135, 206, 235, 1)'
});

$(document.body).curvedArrow({
    p0x: 1610,
    p0y: 275,
    p1x: 1610,
    p1y: 275,
    p2x: 1790,
    p2y: 325,
    strokeStyle: 'rgba(255, 192, 203, 1)'
});

$(document.body).curvedArrow({
    p0x: 1790,
    p0y: 325,
    p1x: 1790,
    p1y: 325,
    p2x: 1610,
    p2y: 275,
    strokeStyle: 'rgba(255, 192, 203, 1)'
});

$('.modal-content').css({
    width: 400,
    height: 400
});

$('.modal-body').css({
    width: 400,
    height: 400
});

$('.modal-dialog').css({
    width: 400,
    height: 400
});

var die = new Die();
$('#die').append(die.$element);

let $jewelryModal = $('#jewelryModal').modal();

$('.hide-jewelry-button').on('click', () => {
    $jewelryModal.modal('hide');
    data.status.hideJewelryMode = true;

    for (let i = 0; i < app.buildingList.length; i++) {
        let building = app.buildingList[i];
        building.classObject.blink = true;
        Vue.set(app.buildingList, i, building);
    }

    let jewelry = app.jewelryList[app.status.hideJewelryCount];
    Vue.set(app.jewelryList, app.status.hideJewelryCount, jewelry);
});