let die = null;

let blockList = [
    {
        index: 0,
        title: '아지트',
        styleObject: {
            left: '1800px',
            top: '700px',
        },
        start: true,
        burglar: true,
        linkList: [1]
    },
    {
        index: 1,
        styleObject: {
            left: '1800px',
            top: '650px',
        },
        threat: true,
        linkList: [0, 2]
    },
    {
        index: 2,
        styleObject: {
            left: '1800px',
            top: '600px',
        },
        trick: true,
        linkList: [1, 3, 4]
    },
    {
        index: 3,
        styleObject: {
            left: '1800px',
            top: '550px',
        },
        linkList: [2, 10]
    },
    {
        index: 4,
        styleObject: {
            left: '1700px',
            top: '600px',
        },
        linkList: [2, 5]
    },
    {
        index: 5,
        styleObject: {
            left: '1600px',
            top: '600px',
        },
        linkList: [4, 6]
    },
    {
        index: 6,
        styleObject: {
            left: '1500px',
            top: '600px',
        },
        mission: true,
        forward: true,
        move: 4,
        linkList: [5, 7]
    },
    {
        index: 7,
        styleObject: {
            left: '1500px',
            top: '650px',
        },
        linkList: [6, 8]
    },
    {
        index: 8,
        styleObject: {
            left: '1500px',
            top: '700px',
        },
        linkList: [7, 9]
    },
    {
        index: 9,
        styleObject: {
            left: '1500px',
            top: '750px',
        },
        linkList: [8, 25],
    },
    {
        index: 10,
        styleObject: {
            left: '1800px',
            top: '500px',
        },
        linkList: [3, 11, 16],
        trick: true,
        changeBurglar: true
    },
    {
        index: 11,
        styleObject: {
            left: '1800px',
            top: '450px',
        },
        linkList: [10, 12]
    },
    {
        index: 12,
        styleObject: {
            left: '1800px',
            top: '400px',
        },
        linkList: [11, 13, 62],
        trick: true
    },
    {
        index: 13,
        styleObject: {
            left: '1700px',
            top: '400px',
        },
        linkList: [12, 14],
        stop: true
    },
    {
        index: 14,
        styleObject: {
            left: '1600px',
            top: '400px',
        },
        linkList: [13, 15]
    },
    {
        index: 15,
        styleObject: {
            left: '1500px',
            top: '400px',
        },
        linkList: [14, 19, 54],
        trick: true
    },
    {
        index: 16,
        styleObject: {
            left: '1700px',
            top: '500px',
        },
        linkList: [10, 17]
    },
    {
        index: 17,
        subTitle: '보석을 가지고 있으면 경찰에게 주고 경찰은 다시 숨긴다.',
        styleObject: {
            left: '1600px',
            top: '500px',
        },
        linkList: [16, 18],
        burglar: true
    },
    {
        index: 18,
        styleObject: {
            left: '1500px',
            top: '500px',
        },
        linkList: [17, 33],
    },
    {
        index: 19,
        styleObject: {
            left: '1400px',
            top: '400px',
        },
        linkList: [15, 20],
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
        linkList: [19, 21, 24],
        trick: true
    },
    {
        index: 21,
        styleObject: {
            left: '1200px',
            top: '400px',
        },
        linkList: [20, 22],
        goHome: true
    },
    {
        index: 22,
        styleObject: {
            left: '1100px',
            top: '400px',
        },
        linkList: [21, 23, 42],
        trick: true
    },
    {
        index: 23,
        styleObject: {
            left: '1100px',
            top: '350px',
        },
        linkList: [22, 47],
    },
    {
        index: 24,
        styleObject: {
            left: '1300px',
            top: '350px',
        },
        linkList: [20],
        onlyBurglar: true
    },
    {
        index: 25,
        styleObject: {
            left: '1400px',
            top: '750px',
        },
        linkList: [9, 26],
        goHome: true
    },
    {
        index: 26,
        styleObject: {
            left: '1300px',
            top: '750px',
        },
        linkList: [25, 27, 92],
        trick: true
    },
    {
        index: 27,
        styleObject: {
            left: '1300px',
            top: '700px',
        },
        linkList: [26, 28]
    },
    {
        index: 28,
        styleObject: {
            left: '1300px',
            top: '650px',
        },
        linkList: [27, 29],
        arrest: true,
        dice: 2
    },
    {
        index: 29,
        styleObject: {
            left: '1300px',
            top: '600px',
        },
        linkList: [28, 30, 31],
        trick: true
    },
    {
        index: 30,
        styleObject: {
            left: '1200px',
            top: '600px',
        },
        linkList: [29],
        onlyBurglar: true
    },
    {
        index: 31,
        styleObject: {
            left: '1300px',
            top: '550px',
        },
        linkList: [29, 32],
        stop: true
    },
    {
        index: 32,
        styleObject: {
            left: '1300px',
            top: '500px',
        },
        linkList: [31, 33, 34],
        trick: true
    },
    {
        index: 33,
        styleObject: {
            left: '1400px',
            top: '500px',
        },
        linkList: [18, 32]
    },
    {
        index: 34,
        styleObject: {
            left: '1200px',
            top: '500px',
        },
        linkList: [32, 35],
        movePolice: true,
        move: 4,
        forward: true
    },
    {
        index: 35,
        styleObject: {
            left: '1100px',
            top: '500px',
        },
        linkList: [34, 36]
    },
    {
        index: 36,
        styleObject: {
            left: '1000px',
            top: '500px',
        },
        linkList: [35, 37]
    },
    {
        index: 37,
        subTitle: '51로 이동',
        styleObject: {
            left: '900px',
            top: '500px',
        },
        linkList: [36, 38],
        changePosition: true
    },
    {
        index: 38,
        styleObject: {
            left: '800px',
            top: '500px',
        },
        linkList: [37, 39]
    },
    {
        index: 39,
        styleObject: {
            left: '700px',
            top: '500px',
        },
        linkList: [38, 40]
    },
    {
        index: 40,
        styleObject: {
            left: '700px',
            top: '450px',
        },
        linkList: [39, 41]
    },
    {
        index: 41,
        styleObject: {
            left: '700px',
            top: '400px',
        },
        linkList: [44, 45, 91],
        trick: true
    },
    {
        index: 42,
        styleObject: {
            left: '1000px',
            top: '400px',
        },
        linkList: [22, 43],
    },
    {
        index: 43,
        subTitle: '45로 이동',
        styleObject: {
            left: '900px',
            top: '400px',
        },
        linkList: [42, 44],
        changePosition: true
    },
    {
        index: 44,
        styleObject: {
            left: '800px',
            top: '400px',
        },
        linkList: [41, 43],
        stop: true
    },
    {
        index: 45,
        styleObject: {
            left: '700px',
            top: '350px',
        },
        linkList: [41, 46]
    },
    {
        index: 46,
        styleObject: {
            left: '700px',
            top: '300px',
        },
        linkList: [45],
        onlyBurglar: true
    },
    {
        index: 47,
        styleObject: {
            left: '1100px',
            top: '300px',
        },
        linkList: [23, 48],
        police: true
    },
    {
        index: 48,
        styleObject: {
            left: '1100px',
            top: '250px',
        },
        linkList: [47, 49],
        threat: true
    },
    {
        index: 49,
        styleObject: {
            left: '1100px',
            top: '200px',
        },
        linkList: [48, 50]
    },
    {
        index: 50,
        styleObject: {
            left: '1200px',
            top: '200px',
        },
        linkList: [49, 51]
    },
    {
        index: 51,
        styleObject: {
            left: '1300px',
            top: '200px',
        },
        linkList: [50, 52, 64],
        trick: true
    },
    {
        index: 52,
        styleObject: {
            left: '1300px',
            top: '150px',
        },
        linkList: [51, 53],
    },
    {
        index: 53,
        styleObject: {
            left: '1300px',
            top: '100px',
        },
        linkList: [52],
        onlyBurglar: true
    },
    {
        index: 54,
        styleObject: {
            left: '1500px',
            top: '350px',
        },
        linkList: [15, 55]
    },
    {
        index: 55,
        styleObject: {
            left: '1500px',
            top: '300px',
        },
        linkList: [54, 56],
        movePolice: true,
        move: 62
    },
    {
        index: 56,
        styleObject: {
            left: '1500px',
            top: '250px',
        },
        linkList: [55, 57],
        moveBurglar: true,
        move: 63
    },
    {
        index: 57,
        styleObject: {
            left: '1500px',
            top: '200px',
        },
        linkList: [56, 58],
        trick: true,
        mission: true,
        move: 3,
        forward: true
    },
    {
        index: 58,
        styleObject: {
            left: '1500px',
            top: '150px',
        },
        linkList: [57, 59]
    },
    {
        index: 59,
        styleObject: {
            left: '1500px',
            top: '100px',
        },
        linkList: [58, 60]
    },
    {
        index: 60,
        styleObject: {
            left: '1500px',
            top: '50px',
        },
        linkList: [59, 61]
    },
    {
        index: 61,
        styleObject: {
            left: '1500px',
            top: '0px',
        },
        linkList: [60, 65, 73],
        trick: true
    },
    {
        index: 62,
        styleObject: {
            left: '1800px',
            top: '350px',
        },
        linkList: [12, 63],
        movePolice: true,
        move: 55
    },
    {
        index: 63,
        styleObject: {
            left: '1800px',
            top: '300px',
        },
        linkList: [62, 68],
        moveBurglar: true,
        move: 56
    },
    {
        index: 64,
        styleObject: {
            left: '1400px',
            top: '200px',
        },
        linkList: [51, 57],
        arrest: true,
        dice: 3
    },
    {
        index: 65,
        styleObject: {
            left: '1600px',
            top: '0px',
        },
        linkList: [61, 66]
    },
    {
        index: 66,
        styleObject: {
            left: '1700px',
            top: '0px',
        },
        linkList: [65, 67]
    },
    {
        index: 67,
        styleObject: {
            left: '1800px',
            top: '0px',
        },
        linkList: [66, 72],
        trick: true
    },
    {
        index: 68,
        subTitle: '138로 이동',
        styleObject: {
            left: '1800px',
            top: '250px',
        },
        linkList: [63, 69],
        tunnel: true,
        trick: true
    },
    {
        index: 69,
        styleObject: {
            left: '1800px',
            top: '200px',
        },
        linkList: [68, 70]
    },
    {
        index: 70,
        styleObject: {
            left: '1800px',
            top: '150px',
        },
        linkList: [69, 71],
        changePolice: true
    },
    {
        index: 71,
        styleObject: {
            left: '1800px',
            top: '100px',
        },
        linkList: [70, 72]
    },
    {
        index: 72,
        styleObject: {
            left: '1800px',
            top: '50px',
        },
        linkList: [67, 71]
    },
    {
        index: 73,
        styleObject: {
            left: '1400px',
            top: '0px',
        },
        linkList: [61, 74],
        changeBurglar: true
    },
    {
        index: 74,
        styleObject: {
            left: '1300px',
            top: '0px',
        },
        linkList: [73, 75]
    },
    {
        index: 75,
        styleObject: {
            left: '1200px',
            top: '0px',
        },
        linkList: [74, 76],
        stop: true
    },
    {
        index: 76,
        styleObject: {
            left: '1100px',
            top: '0px',
        },
        linkList: [75, 77]
    },
    {
        index: 77,
        styleObject: {
            left: '1000px',
            top: '0px',
        },
        linkList: [76, 78]
    },
    {
        index: 78,
        subTitle: '103으로 이동',
        styleObject: {
            left: '900px',
            top: '0px',
        },
        linkList: [77, 79],
        changePosition: true,
    },
    {
        index: 79,
        styleObject: {
            left: '800px',
            top: '0px',
        },
        linkList: [78, 80]
    },
    {
        index: 80,
        styleObject: {
            left: '700px',
            top: '0px',
        },
        linkList: [79, 81],
        search: true
    },
    {
        index: 81,
        styleObject: {
            left: '600px',
            top: '0px',
        },
        linkList: [80, 82]
    },
    {
        index: 82,
        styleObject: {
            left: '500px',
            top: '0px',
        },
        linkList: [81, 83],
        changeBurglar: true
    },
    {
        index: 83,
        styleObject: {
            left: '500px',
            top: '50px',
        },
        linkList: [82, 84],
        trick: true
    },
    {
        index: 84,
        styleObject: {
            left: '500px',
            top: '100px',
        },
        linkList: [83, 85],
        changeBurglar: true
    },
    {
        index: 85,
        styleObject: {
            left: '500px',
            top: '150px',
        },
        linkList: [84, 86, 130],
        trick: true
    },
    {
        index: 86,
        styleObject: {
            left: '500px',
            top: '200px',
        },
        linkList: [85, 87],
        mission: true,
        backward: true,
        move: 2
    },
    {
        index: 87,
        styleObject: {
            left: '500px',
            top: '250px',
        },
        linkList: [86, 88]
    },
    {
        index: 88,
        styleObject: {
            left: '500px',
            top: '300px',
        },
        linkList: [87, 89]
    },
    {
        index: 89,
        styleObject: {
            left: '500px',
            top: '350px',
        },
        linkList: [88, 90],
        arrest: true,
        dice: 6
    },
    {
        index: 90,
        styleObject: {
            left: '500px',
            top: '400px',
        },
        linkList: [91, 124],
        move: 106,
        trick: true,
        movePolice: true
    },
    {
        index: 91,
        styleObject: {
            left: '600px',
            top: '400px',
        },
        linkList: [41, 90],
        moveBurglar: true,
        move: 105
    },
    {
        index: 92,
        styleObject: {
            left: '1200px',
            top: '750px',
        },
        linkList: [26, 93]
    },
    {
        index: 93,
        styleObject: {
            left: '1100px',
            top: '750px',
        },
        linkList: [92, 94],
        changePolice: true
    },
    {
        index: 94,
        styleObject: {
            left: '1000px',
            top: '750px',
        },
        linkList: [93, 95]
    },
    {
        index: 95,
        subTitle: '86으로 이동',
        styleObject: {
            left: '900px',
            top: '750px',
        },
        linkList: [94, 96],
        changePosition: true,
        move: 86
    },
    {
        index: 96,
        styleObject: {
            left: '800px',
            top: '750px',
        },
        linkList: [94, 96]
    },
    {
        index: 97,
        styleObject: {
            left: '700px',
            top: '750px',
        },
        linkList: [96, 98],
        moveBurglar: true,
        move: 99,
    },
    {
        index: 98,
        styleObject: {
            left: '600px',
            top: '750px',
        },
        linkList: [97, 99],
        movePolice: true,
        move: 98

    },
    {
        index: 99,
        styleObject: {
            left: '500px',
            top: '750px',
        },
        linkList: [98, 100],
    },
    {
        index: 100,
        styleObject: {
            left: '400px',
            top: '750px',
        },
        linkList: [99, 116]
    },
    {
        index: 101,
        styleObject: {
            left: '400px',
            top: '700px',
        },
        linkList: [100, 102]
    },
    {
        index: 102,
        styleObject: {
            left: '400px',
            top: '650px',
        },
        linkList: [101, 103, 104],
        burglar: true,
        trick: true,
        send: true
    },
    {
        index: 103,
        styleObject: {
            left: '500px',
            top: '650px',
        },
        linkList: [102],
        onlyBurglar: true
    },
    {
        index: 104,
        styleObject: {
            left: '400px',
            top: '600px',
        },
        linkList: [102, 105],
    },
    {
        index: 105,
        styleObject: {
            left: '400px',
            top: '550px',
        },
        linkList: [104, 106]
    },
    {
        index: 106,
        styleObject: {
            left: '300px',
            top: '550px',
        },
        linkList: [105, 107]
    },
    {
        index: 107,
        styleObject: {
            left: '200px',
            top: '550px',
        },
        linkList: [106, 108, 117],
        trick: true
    },
    {
        index: 108,
        styleObject: {
            left: '100px',
            top: '550px',
        },
        linkList: [107, 109],
        changeBurglar: true
    },
    {
        index: 109,
        styleObject: {
            left: '0px',
            top: '550px',
        },
        linkList: [108, 110, 118],
        mission: true,
        move: 3,
        forward: true
    },
    {
        index: 110,
        styleObject: {
            left: '0px',
            top: '600px',
        },
        linkList: [109, 111],
        trick: true
    },
    {
        index: 111,
        styleObject: {
            left: '0px',
            top: '650px',
        },
        linkList: [110, 112]
    },
    {
        index: 112,
        styleObject: {
            left: '0px',
            top: '700px',
        },
        linkList: [111, 113],
        threat: true
    },
    {
        index: 113,
        styleObject: {
            left: '0px',
            top: '750px',
        },
        linkList: [112, 114],
        goHome: true
    },
    {
        index: 114,
        styleObject: {
            left: '100px',
            top: '750px',
        },
        linkList: [113, 115],
        changeBurglar: true
    },
    {
        index: 115,
        styleObject: {
            left: '200px',
            top: '750px',
        },
        linkList: [114, 116],
        trick: true
    },
    {
        index: 116,
        styleObject: {
            left: '300px',
            top: '750px',
        },
        linkList: [100, 115]
    },
    {
        index: 117,
        styleObject: {
            left: '200px',
            top: '600px',
        },
        onlyBurglar: true
    },
    {
        index: 118,
        styleObject: {
            left: '0px',
            top: '500px',
        },
        trick: true
    },
    {
        index: 119,
        styleObject: {
            left: '0px',
            top: '450px',
        }
    },
    {
        index: 120,
        styleObject: {
            left: '0px',
            top: '400px',
        },
        run: true,
        move: 1,
        forward: true
    },
    {
        index: 121,
        styleObject: {
            left: '100px',
            top: '400px',
        },
        trick: true
    },
    {
        index: 122,
        styleObject: {
            left: '200px',
            top: '400px',
        }
    },
    {
        index: 123,
        styleObject: {
            left: '300px',
            top: '400px',
        },
        rest: true
    },
    {
        index: 124,
        styleObject: {
            left: '400px',
            top: '400px',
        },
        changeBurglar: true
    },
    {
        index: 125,
        styleObject: {
            left: '100px',
            top: '350px',
        }
    },
    {
        index: 126,
        styleObject: {
            left: '100px',
            top: '300px',
        },
        goHome: true
    },
    {
        index: 127,
        styleObject: {
            left: '100px',
            top: '250px',
        },
        changeBurglar: true
    },
    {
        index: 128,
        styleObject: {
            left: '100px',
            top: '200px',
        }
    },
    {
        index: 129,
        subTitle: '75로 이동',
        styleObject: {
            left: '0px',
            top: '200px',
        },
        tunnel: true,
        move: 75
    },
    {
        index: 130,
        styleObject: {
            left: '400px',
            top: '150px',
        },
        onlyBurglar: true
    },
    {
        index: 131,
        styleObject: {
            left: '400px',
            top: '50px',
        },
        threat: true
    },
    {
        index: 132,
        styleObject: {
            left: '300px',
            top: '50px',
        },
        changePolice: true,
    },
    {
        index: 133,
        styleObject: {
            left: '200px',
            top: '50px',
        }
    },
    {
        index: 134,
        styleObject: {
            left: '100px',
            top: '50px',
        }
    },
    {
        index: 135,
        title: '경찰서',
        styleObject: {
            left: '0px',
            top: '0px'
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
                height: '50px',
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
                height: '50px',
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
                left: '0',
                top: '0',
                backgroundImage: 'url(image/police/1.png)',
            }
        },
        {
            styleObject: {
                left: '30px',
                top: '0',
                backgroundImage: 'url(image/police/2.png)'
            }
        },
        {
            styleObject: {
                left: '60px',
                top: '0',
                backgroundImage: 'url(image/police/3.png)'
            }
        }
    ],
    hiddenPolice: {
        styleObject: {
            left: '0px',
            top: '0px'
        },
        classObject: {
            hiddenPolice: true
        }
    },
    burglarList:[
        {
            styleObject: {
                left: '1800px',
                top: '700px',
                backgroundImage: 'url(image/burglar/0.png)'
            },
            position: 0
        },
        {
            styleObject: {
                left: '1830px',
                top: '700px',
                backgroundImage: 'url(image/burglar/1.png)'
            },
            position: 0
        },
        {
            styleObject: {
                left: '1860px',
                top: '700px',
                backgroundImage: 'url(image/burglar/2.png)'
            },
            position: 0
        }
    ],
    blockList: blockList,
    status: {
        hideJewelryMode: false,
        hideJewelryCount: 0,
        hidePoliceMode: false,
        policeTurn: false,
        burglarTurn: true,
        turn: 0
    },
    background: {
        classObject: {
            backgroundActive: false,
            background: true
        }
    }
};

let app = new Vue({
    el: '#app',
    data: data,
    methods: {
        resetBuilding: function () {
            app.buildingList.map((building, index) => {
                building.classObject.blink = false;
                Vue.set(app.buildingList, index, building);
            });
        },

        processPixel: function (pixel, diff) {
            let value = pixel.replace('px', '');
            return (diff + parseInt(value)) + 'px';
        },

        getCurrentBurglar: function () {
            return app.burglarList[app.status.turn];
        },

        getSelectedBlock: function (event) {
            let index = $(event.target).attr('data-index');
            return app.blockList[index];
        },

        move: function (event) {
            let $currentBurglar = $('.burglarCharacter').eq(app.status.turn);
            let $selectedBlock = $(event.target);
            let offset = app.status.turn * 30;

            $currentBurglar.animate({
                left: $selectedBlock.offset().left + offset,
                top: $selectedBlock.offset().top,
            }, 1000, function () {
                app.backgroundInactive();
                app.removeBlinkBlock();
                app.nextTurn();
            });
        },
        
        nextTurn: function () {
            app.status.turn++;

            if (app.status.turn === 3) {
                app.status.turn = 0;

                if (app.status.burglarTurn) {
                    app.status.burglarTurn = false;
                    app.status.policeTurn = true;
                } else if (app.status.policeTurn) {
                    app.status.policeTurn = false;
                    app.status.burglarTurn = true;
                }
            }

            app.rollDie();
        },
        
        hideJewelryAtBuilding: function (event) {
            let index = $(event.target).attr('data-index');
            let building = this.buildingList[index];
            building.classObject.blink = false;
            Vue.set(this.buildingList, index, building);

            let $target;

            if (app.status.hidePoliceMode) {
                $target = $('.hiddenPolice');
                building.hasHiddenPolice = true;
            } else {
                $target = $('.jewelry').eq(app.status.hideJewelryCount);
                building.jewelryIndex = app.status.hideJewelryCount;
            }

            $target.show();

            $target.animate({
                left: $(event.target).offset().left + 50,
                top: $(event.target).offset().top + 25,
            }, 1000, function () {
                if (!app.status.hidePoliceMode) {
                    app.status.hideJewelryCount++;
                }

                if (app.status.hideJewelryCount === 2) {
                    if (app.status.hidePoliceMode) {
                        app.readyToPlay();
                    } else {
                        app.status.hidePoliceMode = true;
                    }
                }
            });
        },

        rollDie: function () {
            $('.turnImage').attr('src', 'image/burglar/' + app.status.turn + '.png');

            let $turnModal = $('#turnModal').modal();

            if (die == null) {
                die = new Die(function (count) {
                    $turnModal.modal('hide');

                    let currentBurglar = app.burglarList[app.status.turn];
                    let resultList = [];

                    app.go(count, currentBurglar.position, currentBurglar.position, resultList);

                    app.backgroundActive();

                    app.blinkBlock(resultList);
                });

                $('#die').append(die.$element);
            }
        },
        
        readyToPlay: function () {
            app.background.classObject.backgroundActive = false;
            app.resetBuilding();

            app.burglarList.forEach((target) => target.styleObject.display = 'block');
            app.policeList.forEach((target) => target.styleObject.display = 'block');
            app.jewelryList.forEach((target) => target.styleObject.display = 'none');
            app.hiddenPolice.styleObject.display = 'none';

            app.rollDie();
        },

        removeBlinkBlock: function (indexList) {
            app.blockList.forEach(block => block.classObject.blink = false);
        },

        blinkBlock: function (indexList) {
            indexList.forEach(index => app.blockList[index].classObject.blink = true);
        },

        backgroundActive: function () {
            data.background.classObject.backgroundActive = true;
        },

        backgroundInactive: function () {
            data.background.classObject.backgroundActive = false;
        },

        go: function(count, previousPosition, currentPosition, resultList) {
            console.dir(count, previousPosition, currentPosition, resultList)
            
            if (app.status.burglarTurn) {
                let currentBlock = app.blockList
                    .filter(target => target.index === currentPosition)[0];

                let currentIndex = currentBlock.index;

                if (count === 0) {
                    resultList.push(currentIndex);
                    return;
                }

                let linkList = currentBlock.linkList;

                for (const link of linkList) {
                    if (link !== previousPosition) {
                        app.go(count - 1, currentPosition, link, resultList);
                    }
                }
            }
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
                return `경찰은 ${block.move}으로 이동`;
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
                    start: block.start,
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

let $jewelryModal = $('#jewelryModal').modal();

$('.hide-jewelry-button').on('click', () => {
    app.backgroundActive();
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