let die = null;
let sound = null;

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
        linkList: [1],
        linkDirectionList: ['up']
    },
    {
        index: 1,
        styleObject: {
            left: '1800px',
            top: '650px',
        },
        threat: true,
        linkList: [0, 2],
        linkDirectionList: ['down', 'up']
    },
    {
        index: 2,
        styleObject: {
            left: '1800px',
            top: '600px',
        },
        trick: true,
        linkList: [1, 3, 4],
        linkDirectionList: ['down', 'up', 'left']
    },
    {
        index: 3,
        styleObject: {
            left: '1800px',
            top: '550px',
        },
        linkList: [2, 10],
        linkDirectionList: ['down', 'up']
    },
    {
        index: 4,
        styleObject: {
            left: '1700px',
            top: '600px',
        },
        linkList: [2, 5],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 5,
        styleObject: {
            left: '1600px',
            top: '600px',
        },
        linkList: [4, 6],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 6,
        styleObject: {
            left: '1500px',
            top: '600px',
        },
        mission: true,
        move: 4,
        forward: true,
        directionLinkList: [
            [7, 8, 9, 25, 26, 27, 92],
            [0, 1, 2, 3, 4, 5, 10, 11, 16]
        ],
        linkList: [5, 7],
        linkDirectionList: ['right', 'down']
    },
    {
        index: 7,
        styleObject: {
            left: '1500px',
            top: '650px',
        },
        linkList: [6, 8],
        linkDirectionList: ['up', 'down']
    },
    {
        index: 8,
        styleObject: {
            left: '1500px',
            top: '700px',
        },
        linkList: [7, 9],
        linkDirectionList: ['up', 'down']
    },
    {
        index: 9,
        styleObject: {
            left: '1500px',
            top: '750px',
        },
        linkList: [8, 25],
        linkDirectionList: ['up', 'left']
    },
    {
        index: 10,
        styleObject: {
            left: '1800px',
            top: '500px',
        },
        linkList: [3, 11, 16],
        trick: true,
        linkDirectionList: ['down', 'up', 'left'],
        changeBurglar: true
    },
    {
        index: 11,
        styleObject: {
            left: '1800px',
            top: '450px',
        },
        linkList: [10, 12],
        linkDirectionList: ['down', 'up']
    },
    {
        index: 12,
        styleObject: {
            left: '1800px',
            top: '400px',
        },
        linkList: [11, 13, 62],
        trick: true,
        linkDirectionList: ['down', 'left', 'up']
    },
    {
        index: 13,
        styleObject: {
            left: '1700px',
            top: '400px',
        },
        linkList: [12, 14],
        linkDirectionList: ['right', 'left'],
        stop: true
    },
    {
        index: 14,
        styleObject: {
            left: '1600px',
            top: '400px',
        },
        linkList: [13, 15],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 15,
        styleObject: {
            left: '1500px',
            top: '400px',
        },
        linkList: [14, 19, 54],
        trick: true,
        linkDirectionList: ['right', 'left', 'up']
    },
    {
        index: 16,
        styleObject: {
            left: '1700px',
            top: '500px',
        },
        linkList: [10, 17],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 17,
        styleObject: {
            left: '1600px',
            top: '500px',
        },
        linkList: [16, 18],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 18,
        styleObject: {
            left: '1500px',
            top: '500px',
        },
        linkList: [17, 33],
        linkDirectionList: ['right', 'left'],
        drop: true
    },
    {
        index: 19,
        styleObject: {
            left: '1400px',
            top: '400px',
        },
        linkList: [15, 20],
        linkDirectionList: ['right', 'left'],
        run: true,
        move: 1
    },
    {
        index: 20,
        styleObject: {
            left: '1300px',
            top: '400px',
        },
        linkList: [19, 21, 24],
        trick: true,
        linkDirectionList: ['right', 'left', 'up']
    },
    {
        index: 21,
        styleObject: {
            left: '1200px',
            top: '400px',
        },
        linkList: [20, 22],
        linkDirectionList: ['right', 'left'],
        goHome: true
    },
    {
        index: 22,
        styleObject: {
            left: '1100px',
            top: '400px',
        },
        linkList: [21, 23, 42],
        trick: true,
        linkDirectionList: ['right', 'up', 'left']
    },
    {
        index: 23,
        styleObject: {
            left: '1100px',
            top: '350px',
        },
        linkList: [22, 47],
        linkDirectionList: ['down', 'up'],
    },
    {
        index: 24,
        styleObject: {
            left: '1300px',
            top: '350px',
        },
        linkList: [20],
        linkDirectionList: ['down'],
        onlyBurglar: true,
        buildingIndex: 0
    },
    {
        index: 25,
        styleObject: {
            left: '1400px',
            top: '750px',
        },
        linkList: [9, 26],
        linkDirectionList: ['right', 'left'],
        goHome: true
    },
    {
        index: 26,
        styleObject: {
            left: '1300px',
            top: '750px',
        },
        linkList: [25, 27, 92],
        trick: true,
        linkDirectionList: ['right', 'up', 'left']
    },
    {
        index: 27,
        styleObject: {
            left: '1300px',
            top: '700px',
        },
        linkList: [26, 28],
        linkDirectionList: ['down', 'up'],
    },
    {
        index: 28,
        styleObject: {
            left: '1300px',
            top: '650px',
        },
        linkList: [27, 29],
        linkDirectionList: ['down', 'up'],
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
        trick: true,
        linkDirectionList: ['down', 'left', 'up']
    },
    {
        index: 30,
        styleObject: {
            left: '1200px',
            top: '600px',
        },
        linkList: [29],
        linkDirectionList: ['right'],
        onlyBurglar: true,
        buildingIndex: 1
    },
    {
        index: 31,
        styleObject: {
            left: '1300px',
            top: '550px',
        },
        linkList: [29, 32],
        linkDirectionList: ['down', 'up'],
        stop: true
    },
    {
        index: 32,
        styleObject: {
            left: '1300px',
            top: '500px',
        },
        linkList: [31, 33, 34],
        trick: true,
        linkDirectionList: ['down', 'right', 'left']
    },
    {
        index: 33,
        styleObject: {
            left: '1400px',
            top: '500px',
        },
        linkList: [18, 32],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 34,
        styleObject: {
            left: '1200px',
            top: '500px',
        },
        linkList: [32, 35],
        linkDirectionList: ['right', 'left'],
        run: true,
        move: 4
    },
    {
        index: 35,
        styleObject: {
            left: '1100px',
            top: '500px',
        },
        linkList: [34, 36],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 36,
        styleObject: {
            left: '1000px',
            top: '500px',
        },
        linkList: [35, 37],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 37,
        styleObject: {
            left: '900px',
            top: '500px',
        },
        move: 43,
        linkList: [36, 38],
        linkDirectionList: ['right', 'left'],
        changePosition: true
    },
    {
        index: 38,
        styleObject: {
            left: '800px',
            top: '500px',
        },
        linkList: [37, 39],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 39,
        styleObject: {
            left: '700px',
            top: '500px',
        },
        linkList: [38, 40],
        linkDirectionList: ['right', 'up']
    },
    {
        index: 40,
        styleObject: {
            left: '700px',
            top: '450px',
        },
        linkList: [39, 41],
        linkDirectionList: ['down', 'up']
    },
    {
        index: 41,
        styleObject: {
            left: '700px',
            top: '400px',
        },
        linkList: [40, 44, 45, 91],
        trick: true,
        linkDirectionList: ['down', 'right', 'up', 'left']
    },
    {
        index: 42,
        styleObject: {
            left: '1000px',
            top: '400px',
        },
        linkList: [22, 43],
        linkDirectionList: ['right', 'left'],
    },
    {
        index: 43,
        styleObject: {
            left: '900px',
            top: '400px',
        },
        linkList: [42, 44],
        linkDirectionList: ['right', 'left'],
        changePosition: true,
        move: 37
    },
    {
        index: 44,
        styleObject: {
            left: '800px',
            top: '400px',
        },
        linkList: [41, 43],
        linkDirectionList: ['left', 'right'],
        stop: true
    },
    {
        index: 45,
        styleObject: {
            left: '700px',
            top: '350px',
        },
        linkList: [41, 46],
        linkDirectionList: ['down', 'up']
    },
    {
        index: 46,
        styleObject: {
            left: '700px',
            top: '300px',
        },
        linkList: [45],
        linkDirectionList: ['down'],
        onlyBurglar: true,
        buildingIndex: 2
    },
    {
        index: 47,
        styleObject: {
            left: '1100px',
            top: '300px',
        },
        linkList: [23, 48],
        linkDirectionList: ['down', 'up'],
        police: true,
        changePolice: true
    },
    {
        index: 48,
        styleObject: {
            left: '1100px',
            top: '250px',
        },
        linkList: [47, 49],
        linkDirectionList: ['down', 'up'],
        threat: true
    },
    {
        index: 49,
        styleObject: {
            left: '1100px',
            top: '200px',
        },
        linkList: [48, 50],
        linkDirectionList: ['down', 'right']
    },
    {
        index: 50,
        styleObject: {
            left: '1200px',
            top: '200px',
        },
        linkList: [49, 51],
        linkDirectionList: ['left', 'right']
    },
    {
        index: 51,
        styleObject: {
            left: '1300px',
            top: '200px',
        },
        linkList: [50, 52, 64],
        trick: true,
        linkDirectionList: ['left', 'up', 'right']
    },
    {
        index: 52,
        styleObject: {
            left: '1300px',
            top: '150px',
        },
        linkList: [51, 53],
        linkDirectionList: ['down', 'up'],
    },
    {
        index: 53,
        styleObject: {
            left: '1300px',
            top: '100px',
        },
        linkList: [52],
        linkDirectionList: ['down'],
        onlyBurglar: true,
        buildingIndex: 3
    },
    {
        index: 54,
        styleObject: {
            left: '1500px',
            top: '350px',
        },
        linkList: [15, 55],
        linkDirectionList: ['down', 'up'],
    },
    {
        index: 55,
        styleObject: {
            left: '1500px',
            top: '300px',
        },
        linkList: [54, 56],
        linkDirectionList: ['down', 'up'],
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
        linkDirectionList: ['down', 'up'],
        moveBurglar: true,
        move: 63
    },
    {
        index: 57,
        styleObject: {
            left: '1500px',
            top: '200px',
        },
        linkList: [56, 58, 54],
        trick: true,
        linkDirectionList: ['down', 'up', 'left'],
        mission: true,
        forward: true,
        move: 5,
        directionLinkList: [
            [47, 48, 49, 50, 51, 64],
            [58, 59, 60, 61, 73, 74, 65, 66],
            [55, 55, 54, 15, 19, 20, 14, 13]
        ]
    },
    {
        index: 58,
        styleObject: {
            left: '1500px',
            top: '150px',
        },
        linkList: [57, 59],
        linkDirectionList: ['down', 'up']
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
        linkDirectionList: ['down', 'right', 'left'],
        trick: true
    },
    {
        index: 62,
        styleObject: {
            left: '1800px',
            top: '350px',
        },
        linkList: [12, 63],
        linkDirectionList: ['down', 'up'],
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
        linkDirectionList: ['down', 'up'],
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
        linkDirectionList: ['left', 'right'],
        arrest: true,
        dice: 3
    },
    {
        index: 65,
        styleObject: {
            left: '1600px',
            top: '0px',
        },
        linkList: [61, 66],
        linkDirectionList: ['left', 'right']
    },
    {
        index: 66,
        styleObject: {
            left: '1700px',
            top: '0px',
        },
        linkList: [65, 67],
        linkDirectionList: ['left', 'right']
    },
    {
        index: 67,
        styleObject: {
            left: '1800px',
            top: '0px',
        },
        linkList: [66, 72],
        trick: true,
        linkDirectionList: ['left', 'down']
    },
    {
        index: 68,
        styleObject: {
            left: '1800px',
            top: '250px',
        },
        linkList: [63, 69, 129],
        tunnel: true,
        move: 129,
        trick: true,
        linkDirectionList: ['left', 'up', 'right']
    },
    {
        index: 69,
        styleObject: {
            left: '1800px',
            top: '200px',
        },
        linkList: [68, 70],
        linkDirectionList: ['up', 'down']
    },
    {
        index: 70,
        styleObject: {
            left: '1800px',
            top: '150px',
        },
        linkList: [69, 71],
        linkDirectionList: ['up', 'down'],
        changePolice: true
    },
    {
        index: 71,
        styleObject: {
            left: '1800px',
            top: '100px',
        },
        linkList: [70, 72],
        linkDirectionList: ['up', 'down']
    },
    {
        index: 72,
        styleObject: {
            left: '1800px',
            top: '50px',
        },
        linkList: [67, 71],
        linkDirectionList: ['up', 'down']
    },
    {
        index: 73,
        styleObject: {
            left: '1400px',
            top: '0px',
        },
        linkList: [61, 74],
        changeBurglar: true,
        linkDirectionList: ['right', 'left']
    },
    {
        index: 74,
        styleObject: {
            left: '1300px',
            top: '0px',
        },
        linkList: [73, 75],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 75,
        styleObject: {
            left: '1200px',
            top: '0px',
        },
        linkList: [74, 76],
        linkDirectionList: ['right', 'left'],
        stop: true
    },
    {
        index: 76,
        styleObject: {
            left: '1100px',
            top: '0px',
        },
        linkList: [75, 77],
        linkDirectionList: ['right', 'left'],
    },
    {
        index: 77,
        styleObject: {
            left: '1000px',
            top: '0px',
        },
        linkList: [76, 78],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 78,
        styleObject: {
            left: '900px',
            top: '0px',
        },
        linkList: [77, 79],
        linkDirectionList: ['right', 'left'],
        changePosition: true,
        move: 95
    },
    {
        index: 79,
        styleObject: {
            left: '800px',
            top: '0px',
        },
        linkList: [78, 80],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 80,
        styleObject: {
            left: '700px',
            top: '0px',
        },
        linkList: [79, 81],
        linkDirectionList: ['right', 'left'],
        search: true,
        buildingIndex: 2
    },
    {
        index: 81,
        styleObject: {
            left: '600px',
            top: '0px',
        },
        linkList: [80, 82],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 82,
        styleObject: {
            left: '500px',
            top: '0px',
        },
        linkList: [81, 83],
        linkDirectionList: ['right', 'down'],
        changeBurglar: true
    },
    {
        index: 83,
        styleObject: {
            left: '500px',
            top: '50px',
        },
        linkList: [82, 84, 131],
        trick: true,
        linkDirectionList: ['up', 'down', 'left']
    },
    {
        index: 84,
        styleObject: {
            left: '500px',
            top: '100px',
        },
        linkList: [83, 85],
        linkDirectionList: ['up', 'down'],
        changeBurglar: true
    },
    {
        index: 85,
        styleObject: {
            left: '500px',
            top: '150px',
        },
        linkList: [84, 86, 130],
        trick: true,
        linkDirectionList: ['up', 'down', 'left']
    },
    {
        index: 86,
        styleObject: {
            left: '500px',
            top: '200px',
        },
        linkList: [85, 87],
        linkDirectionList: ['up', 'down'],
        mission: true,
        move: 2
    },
    {
        index: 87,
        styleObject: {
            left: '500px',
            top: '250px',
        },
        linkList: [86, 88],
        linkDirectionList: ['up', 'down']
    },
    {
        index: 88,
        styleObject: {
            left: '500px',
            top: '300px',
        },
        linkList: [87, 89],
        linkDirectionList: ['up', 'down']
    },
    {
        index: 89,
        styleObject: {
            left: '500px',
            top: '350px',
        },
        linkList: [88, 90],
        linkDirectionList: ['up', 'down'],
        arrest: true,
        dice: 6
    },
    {
        index: 90,
        styleObject: {
            left: '500px',
            top: '400px',
        },
        linkList: [89, 91, 124],
        move: 98,
        trick: true,
        linkDirectionList: ['up', 'right', 'left'],
        movePolice: true
    },
    {
        index: 91,
        styleObject: {
            left: '600px',
            top: '400px',
        },
        linkList: [41, 90],
        linkDirectionList: ['right', 'left'],
        moveBurglar: true,
        move: 97
    },
    {
        index: 92,
        styleObject: {
            left: '1200px',
            top: '750px',
        },
        linkList: [26, 93],
        linkDirectionList: ['right', 'left'],
    },
    {
        index: 93,
        styleObject: {
            left: '1100px',
            top: '750px',
        },
        linkList: [92, 94],
        linkDirectionList: ['right', 'left'],
        changePolice: true
    },
    {
        index: 94,
        styleObject: {
            left: '1000px',
            top: '750px',
        },
        linkList: [93, 95],
        linkDirectionList: ['right', 'left'],
    },
    {
        index: 95,
        styleObject: {
            left: '900px',
            top: '750px',
        },
        linkList: [94, 96],
        linkDirectionList: ['right', 'left'],
        changePosition: true,
        move: 86
    },
    {
        index: 96,
        styleObject: {
            left: '800px',
            top: '750px',
        },
        linkList: [95, 97],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 97,
        styleObject: {
            left: '700px',
            top: '750px',
        },
        linkList: [96, 98],
        linkDirectionList: ['right', 'left'],
        moveBurglar: true,
        move: 91,
    },
    {
        index: 98,
        styleObject: {
            left: '600px',
            top: '750px',
        },
        linkList: [97, 99],
        linkDirectionList: ['right', 'left'],
        movePolice: true,
        move: 90

    },
    {
        index: 99,
        styleObject: {
            left: '500px',
            top: '750px',
        },
        linkList: [98, 100],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 100,
        styleObject: {
            left: '400px',
            top: '750px',
        },
        linkList: [99, 101],
        linkDirectionList: ['right', 'up']
    },
    {
        index: 101,
        styleObject: {
            left: '400px',
            top: '700px',
        },
        linkList: [102],
        linkDirectionList: ['up']
    },
    {
        index: 102,
        styleObject: {
            left: '400px',
            top: '650px',
        },
        linkList: [103, 104],
        burglar: true,
        trick: true,
        linkDirectionList: ['right', 'up'],
        pass: true
    },
    {
        index: 103,
        styleObject: {
            left: '500px',
            top: '650px',
        },
        linkList: [102],
        linkDirectionList: ['left'],
        onlyBurglar: true,
        buildingIndex: 4
    },
    {
        index: 104,
        styleObject: {
            left: '400px',
            top: '600px',
        },
        linkList: [105],
        linkDirectionList: ['up']
    },
    {
        index: 105,
        styleObject: {
            left: '400px',
            top: '550px',
        },
        linkList: [106],
        linkDirectionList: ['left']
    },
    {
        index: 106,
        styleObject: {
            left: '300px',
            top: '550px',
        },
        linkList: [107],
        linkDirectionList: ['left']
    },
    {
        index: 107,
        styleObject: {
            left: '200px',
            top: '550px',
        },
        linkList: [108, 117],
        linkDirectionList: ['left', 'down'],
        trick: true
    },
    {
        index: 108,
        styleObject: {
            left: '100px',
            top: '550px',
        },
        linkList: [109],
        linkDirectionList: ['left'],
        changeBurglar: true
    },
    {
        index: 109,
        styleObject: {
            left: '0px',
            top: '550px',
        },
        linkList: [110, 118],
        linkDirectionList: ['down', 'up'],
        mission: true,
        move: 4,
        forward: true,
        directionLinkList: [
            [108, 107, 117, 106, 105, 104, 102],
            [118, 119, 120, 121, 125, 126, 122, 123]
        ],
    },
    {
        index: 110,
        styleObject: {
            left: '0px',
            top: '600px',
        },
        linkList: [111],
        linkDirectionList: ['down'],
        trick: true
    },
    {
        index: 111,
        styleObject: {
            left: '0px',
            top: '650px',
        },
        linkList: [112],
        linkDirectionList: ['down']
    },
    {
        index: 112,
        styleObject: {
            left: '0px',
            top: '700px',
        },
        linkList: [113],
        linkDirectionList: ['down'],
        threat: true
    },
    {
        index: 113,
        styleObject: {
            left: '0px',
            top: '750px',
        },
        linkList: [114],
        linkDirectionList: ['right'],
        goHome: true
    },
    {
        index: 114,
        styleObject: {
            left: '100px',
            top: '750px',
        },
        linkList: [115],
        linkDirectionList: ['right'],
        changeBurglar: true
    },
    {
        index: 115,
        styleObject: {
            left: '200px',
            top: '750px',
        },
        linkList: [116],
        linkDirectionList: ['right'],
        trick: true
    },
    {
        index: 116,
        styleObject: {
            left: '300px',
            top: '750px',
        },
        linkList: [100],
        linkDirectionList: ['right']
    },
    {
        index: 117,
        styleObject: {
            left: '200px',
            top: '600px',
        },
        linkList: [107],
        linkDirectionList: ['up'],
        onlyBurglar: true,
        buildingIndex: 5
    },
    {
        index: 118,
        styleObject: {
            left: '0px',
            top: '500px',
        },
        linkList: [109, 119],
        trick: true,
        linkDirectionList: ['down', 'up']
    },
    {
        index: 119,
        styleObject: {
            left: '0px',
            top: '450px',
        },
        linkList: [118, 120],
        linkDirectionList: ['down', 'up']
    },
    {
        index: 120,
        styleObject: {
            left: '0px',
            top: '400px',
        },
        linkList: [119, 121],
        linkDirectionList: ['down', 'right'],
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
        linkList: [120, 122],
        linkDirectionList: ['left', 'right', 'up'],
        trick: true,
    },
    {
        index: 122,
        styleObject: {
            left: '200px',
            top: '400px',
        },
        linkList: [121, 123],
        linkDirectionList: ['left', 'right']
    },
    {
        index: 123,
        styleObject: {
            left: '300px',
            top: '400px',
        },
        linkList: [122, 124],
        linkDirectionList: ['left', 'right'],
        skip: true
    },
    {
        index: 124,
        styleObject: {
            left: '400px',
            top: '400px',
        },
        linkList: [90, 123],
        linkDirectionList: ['right', 'left'],
        changeBurglar: true
    },
    {
        index: 125,
        styleObject: {
            left: '100px',
            top: '350px',
        },
        linkList: [121, 126],
        linkDirectionList: ['down', 'up']
    },
    {
        index: 126,
        styleObject: {
            left: '100px',
            top: '300px',
        },
        linkList: [125, 127],
        linkDirectionList: ['down', 'up'],
        goHome: true
    },
    {
        index: 127,
        styleObject: {
            left: '100px',
            top: '250px',
        },
        linkList: [126, 128],
        linkDirectionList: ['down', 'up'],
        changeBurglar: true
    },
    {
        index: 128,
        styleObject: {
            left: '100px',
            top: '200px',
        },
        linkList: [127, 129],
        linkDirectionList: ['down', 'left']
    },
    {
        index: 129,
        styleObject: {
            left: '0px',
            top: '200px',
        },
        linkList: [68, 128],
        linkDirectionList: ['left', 'right'],
        tunnel: true,
        move: 68
    },
    {
        index: 130,
        styleObject: {
            left: '400px',
            top: '150px',
        },
        linkList: [85],
        linkDirectionList: ['right'],
        onlyBurglar: true,
        buildingIndex: 6
    },
    {
        index: 131,
        styleObject: {
            left: '400px',
            top: '50px',
        },
        linkList: [83, 132],
        linkDirectionList: ['right', 'left'],
        threat: true
    },
    {
        index: 132,
        styleObject: {
            left: '300px',
            top: '50px',
        },
        linkList: [131, 133],
        linkDirectionList: ['right', 'left'],
        changePolice: true
    },
    {
        index: 133,
        styleObject: {
            left: '200px',
            top: '50px',
        },
        linkList: [132, 134],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 134,
        styleObject: {
            left: '100px',
            top: '50px',
        },
        linkList: [133, 135],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 135,
        title: '경찰서',
        styleObject: {
            left: '0px',
            top: '0px'
        },
        linkList: [134],
        linkDirectionList: ['right'],
        start: true,
        police: true
    }
];

let data = {
    jewelryList: [
        {
            index: 0,
            styleObject: {
                left: '820px',
                top: '200px',
                backgroundImage: 'url(image/jewelry/0.jpg)'
            },
            originStyleObject: {
                left: '820px',
                top: '200px',
            },
            classObject: {
                jewelry: true,
                hideJewelry: true
            },
            steal: false
        },
        {
            index: 1,
            styleObject: {
                left: '920px',
                top: '200px',
                backgroundImage: 'url(image/jewelry/1.jpg)'
            },
            originStyleObject: {
                left: '920px',
                top: '200px',
            },
            classObject: {
                jewelry: true,
                hideJewelry: true
            },
            steal: false
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
                backgroundImage: 'url(image/building/0.png)'
            },
            hasHiddenPolice: false,
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
                backgroundImage: 'url(image/building/1.png)'
            },
            hasHiddenPolice: false,
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
                backgroundImage: 'url(image/building/2.png)'
            },
            hasHiddenPolice: false,
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
                backgroundImage: 'url(image/building/3.png)'
            },
            hasHiddenPolice: false,
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
                backgroundImage: 'url(image/building/4.png)'
            },
            hasHiddenPolice: false,
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
                backgroundImage: 'url(image/building/5.png)'
            },
            hasHiddenPolice: false,
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
                backgroundImage: 'url(image/building/6.png)'
            },
            hasHiddenPolice: false,
            classObject: {}
        }
    ],
    policeList:[
        {
            index: 0,
            styleObject: {
                left: '0',
                top: '0',
                backgroundImage: 'url(image/police/0.png)',
            },
            classObject: {},
            position: 135,
            skip: false
        },
        {
            index: 1,
            styleObject: {
                left: '30px',
                top: '0',
                backgroundImage: 'url(image/police/1.png)'
            },
            classObject: {},
            position: 135,
            skip: false
        },
        {
            index: 2,
            styleObject: {
                left: '60px',
                top: '0',
                backgroundImage: 'url(image/police/2.png)'
            },
            classObject: {},
            position: 135,
            skip: false
        }
    ],
    hiddenPolice: {
        styleObject: {
            left: '1020px',
            top: '200px'
        },
        classObject: {
            hiddenPolice: true
        }
    },
    burglarList:[
        {
            index: 0,
            styleObject: {
                left: '1800px',
                top: '700px',
                backgroundImage: 'url(image/burglar/0.png)'
            },
            classObject: {},
            position: 0,
            rest: 0,
            arrested: false,
            skip: false
        },
        {
            index: 1,
            styleObject: {
                left: '1830px',
                top: '700px',
                backgroundImage: 'url(image/burglar/1.png)'
            },
            classObject: {},
            position: 0,
            rest: 0,
            arrested: false,
            skip: false
        },
        {
            index:2,
            styleObject: {
                left: '1860px',
                top: '700px',
                backgroundImage: 'url(image/burglar/2.png)'
            },
            classObject: {},
            position: 0,
            rest: 0,
            arrested: false,
            skip: false
        }
    ],
    blockList: blockList,
    status: {
        rolling: false,
        restartMode: false,
        passMode: false,
        arrestMode: false,
        start: false,
        escape: false,
        catch: false,
        hideJewelryMode: false,
        hideJewelryIndex: 0,
        hidePoliceMode: false,
        policeTurn: false,
        burglarTurn: true,
        changeBurglarMode: false,
        changePoliceMode: false,
        moveBurglarMode: false,
        movePoliceMode: false,
        missionBurglarMode: false,
        missionPoliceMode: false,
        turn: 0,
        stealJewelryCount: 0,
        threatCount: 0,
        trickCount: 10,
        trickMode: false,
        trickIndexList: [],
        checkIndexList: [],
        blockPathList: [],
        runMode: false,
        runModeComplete: false,
        runCount: 0,
        checkCount: 6,
        checkMode: false,

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

        getCurrentPolice: function () {
            return app.policeList[app.status.turn];
        },

        getCurrentBurglarElement: function () {
            return $('.burglarCharacter').filter(function () {
                return $(this).attr('data-index') == app.status.turn;
            });
        },

        getJewelryElement: function (index) {
            return $('.jewelry').filter(function () {
                return $(this).attr('data-index') == index;
            });
        },

        getBurglarElement: function (index) {
            return $('.burglarCharacter[data-index=' + index + ']');
        },

        getBlockElement: function (index) {
            return $('.block[data-index=' + index + ']')
        },

        getCurrentPoliceElement: function () {
            return $('.policeCharacter').filter(function () {
                return $(this).attr('data-index') == app.status.turn;
            });
        },

        getCurrentCharacterElement: function () {
            if (app.status.burglarTurn) {
                return app.getCurrentBurglarElement();
            }

            return app.getCurrentPoliceElement();
        },

        getClickedBlock: function (event) {
            return $(event.target).closest('.block');
        },

        getSelectedBlock: function (event) {
            let index = app.getClickedBlock(event).attr('data-index');
            index = parseInt(index);
            return app.blockList.filter(block => block.index === index)[0];
        },

        checkGameOver: function () {
            if (app.burglarList.filter(burglar => burglar.arrested).length === 3) {
                app.playWinPoliceSound();
                alert('경찰 승리');
                location.reload();
            }

            if (app.getBlockElement(0).find('.jewelry').length === 2) {
                app.playWinBurglarSound();
                alert('도둑 승리');
                location.reload();
            }
        },

        arrestBurglar: function (burglar) {
            if (app.status.policeTurn) {
                let $currentPolice = app.getCurrentPoliceElement();
                let currentPolice = app.getCurrentPolice();

                $currentPolice.animate({
                    left: currentPolice.index * 30,
                    top: 0
                }, 500, function () {
                    currentPolice.position = 135;
                });
            }

            let $currentBurglar = app.getBurglarElement(burglar.index);

            $currentBurglar.animate({
                left: burglar.index * 30,
                top: 70
            }, 500, function () {
                burglar.arrested = true;
                burglar.position = 135;

                app.checkGameOver();
            });

            if (app.collectJewelry(burglar)) {
                app.status.restartMode = true;
            }
        },
        
        catchBurglarWithPathList: function (pathList) {
            app.burglarList
                .filter(burglar => !burglar.arrested)
                .filter(burglar => pathList.includes(burglar.position))
                .forEach(burglar => {
                    app.arrestBurglar(burglar);
                })
        },

        checkSteal: function (currentBurglar, callNextTurn) {
            if (currentBurglar.jewelryIndex == null) {
                return;
            }

            let $jewelry = app.getJewelryElement(currentBurglar.jewelryIndex);
            let $block = app.getBlockElement(0);

            $jewelry.appendTo($block).css({
                width: 30,
                height: 30,
                top: 70,
                left: currentBurglar.jewelryIndex * 30
            });

            app.blinkJewelry(currentBurglar.jewelryIndex, true);

            app.checkGameOver();

            setTimeout(function () {
                app.blinkJewelry(currentBurglar.jewelryIndex, false);
                currentBurglar.jewelryIndex = null;

                if (callNextTurn) {
                    app.nextTurn();
                }
            }, 1000)
        },

        getSoundClass: function () {
            let sound = "burglar";

            if (app.status.policeTurn) {
                sound = "police";
            }

            return sound + app.status.turn + '-sound';
        },

        playArrestSound: function () {
            app.playSound('arrest');
        },

        playConfirmJewelrySound: function () {
            app.playSound('confirm-jewelry');
        },

        playSelectBurglarSound: function () {
            app.playSound('select-burglar');
        },

        playNotArrestSound: function () {
            app.playSound('not-arrest');
        },

        playChangeSound: function () {
            app.playSound('change');
        },

        playWinPoliceSound: function () {
            app.playSound('win-police');
        },

        playWinBurglarSound: function () {
            app.playSound('win-burglar');
        },

        playRestartSound: function () {
            app.playSound('restart');
        },

        playHideJewelrySound: function () {
            app.playSound('hide-jewelry');
        },

        playHidePoliceSound: function () {
            app.playSound('hide-police');
        },

        playStartSound: function () {
            app.playSound('start');
        },

        pausePlayStartSound: function () {
            app.pauseSound('start');
        },

        playThrowSound: function () {
            // app.playSound('throw');
        },

        playDieSound: function () {
            app.playSound('die');
        },

        playMoveSound: function () {
            app.playSound('move');
        },

        getAudio: function (className) {
            return $('.' + className + '-sound').get(0)
        },

        playSound: function (className) {
            if (sound != null) {
                sound.currentTime = 0;
                sound.pause();
            }

            sound = app.getAudio(className);
            sound.play();
        },

        pauseSound: function (className) {
            let audio = app.getAudio(className);
            audio.currentTime = 0;
            audio.pause();
        },

        pauseCurrentSound: function () {
            let audio = app.getAudio(className);
            audio.currentTime = 0;
            audio.pause();
        },

        updateBlock: function (selectedBlock) {
            Vue.set(app.blockList, selectedBlock.index, selectedBlock);
        },

        animateCharacter: function (selectedBlock, callback) {
            console.log('>>> selectedBlock', selectedBlock);

            let $currentCharacter = app.getCurrentCharacterElement();
            let $selectedBlockElement = app.getBlockElement(selectedBlock.index);
            let offset = app.status.turn * 30;
            let left = $selectedBlockElement.offset().left + offset;
            let top = $selectedBlockElement.offset().top;

            if (app.status.runMode) {
                callback();
                return;
            }

            $currentCharacter.animate({
                left: left,
                top: top,
            }, 500, function () {
                if (callback) {
                    callback();
                }
            });
        },

        playClickBlockSound: function () {
            app.playSound('click-block');
        },

        playPassJewelrySound: function () {
            app.playSound('pass-jewelry');
        },
        
        move: function (selectedBlock) {
            let currentPosition = app.getCurrentCharacter().position;
            let $selectedBlockElement = app.getBlockElement(selectedBlock.index);
            let $currentCharacter = app.getCurrentCharacterElement();

            $('.' + app.getSoundClass()).get(0).play();

            if (app.status.checkMode) {
                selectedBlock.check = true;
                Vue.set(app.blockList, selectedBlock.index, selectedBlock);
                app.status.checkMode = false;
                app.removeBlinkBlock();
                app.nextTurn();
                return;
            }

            app.animateCharacter(selectedBlock, function () {
                app.getCurrentCharacter().position = selectedBlock.index;
                app.removeBlinkBlock();
                app.removeRippleCharacter();

                app.removeTrick(selectedBlock);
                app.removeTrickList();

                app.removeCheck(selectedBlock);
                app.removeCheckList();

                console.log('>>> app.status.blockPathList', app.status.blockPathList);

                let pathList = app.status.blockPathList
                    .filter(target => target.index === selectedBlock.index)
                    .map(target => target.path)[0];

                app.status.blockPathList = [];

                if (app.status.policeTurn &&
                    !app.status.runMode &&
                    !app.status.runModeComplete) {

                    if (app.status.movePoliceMode ||
                        app.status.changePoliceMode ||
                        app.status.missionPoliceMode) {
                        pathList = [selectedBlock.index];
                    }

                    app.catchBurglarWithPathList(pathList);
                }

                $('.trick').removeClass('blink');
                $('.check').removeClass('blink');

                if (app.status.runModeComplete) {
                    app.catchBurglarWithPathList([selectedBlock.index]);
                    app.status.runModeComplete = false;
                    app.nextTurn();
                } else if (selectedBlock.drop && app.status.burglarTurn) {
                    let currentBurglar = app.getCurrentBurglar();

                    if (app.collectJewelry(currentBurglar)) {
                        app.status.restartMode = true;
                    } else {
                        app.nextTurn();
                    }
                } else if (selectedBlock.pass) {
                    let currentBurglar = app.getCurrentBurglar();

                    if (currentBurglar.jewelryIndex != null) {
                        let currentBurglarList = app.burglarList
                            .filter(target => !target.arrested)
                            .filter(target => target.jewelryIndex == null)
                            .filter(target => target.index !== currentBurglar.index);

                        if (currentBurglarList.length > 0) {
                            app.playPassJewelrySound();

                            currentBurglarList.forEach((target) => {
                                target.classObject.burglarRipple = true;
                                target.classObject.selectable = true;
                                Vue.set(app.burglarList, target.index, target);
                            });

                            app.status.passMode = true;
                        } else {
                            alert('보석을 넘겨줄 도둑이 없습니다.');
                        }
                    } else {
                        alert('보석이 없습니다.');
                        app.nextTurn();
                    }
                } else if (selectedBlock.check && app.status.burglarTurn) {
                    selectedBlock.check = false;
                    app.updateBlock(selectedBlock);
                    app.nextTurn();
                } else if (app.status.runMode) {
                    app.status.blockPathList = [];

                    app.go(app.status.runCount, app.status.runCount, selectedBlock.index, selectedBlock.index, []);

                    let blockIndexList = app.status.blockPathList
                        .map(target => target.index);

                    app.blinkBlock(blockIndexList);

                    app.playMoveSound();

                    app.status.runMode = false;
                    app.status.runModeComplete = true;
                } else if (app.status.changeBurglarMode) {
                    app.status.changeBurglarMode = false;
                    app.nextTurn();
                } else if (app.status.changePoliceMode) {

                    app.status.changePoliceMode = false;
                    app.nextTurn();
                } else if (app.status.missionBurglarMode) {
                    app.status.missionBurglarMode = false;
                    app.nextTurn();
                } else if (app.status.missionPoliceMode) {

                    app.status.missionPoliceMode = false;
                    app.nextTurn();
                } else if (app.status.moveBurglarMode) {
                    app.status.moveBurglarMode = false;
                    app.nextTurn();
                } else if (app.status.movePoliceMode) {

                    app.status.movePoliceMode = false;
                    app.nextTurn();
                } else if (selectedBlock.threat) {
                    if (app.status.policeTurn) {
                        app.nextTurn();
                    } else {
                        app.threat(app.nextTurn);
                    }
                } else if (selectedBlock.changeBurglar && app.status.burglarTurn) {
                    let indexList = app.blockList.filter(target => target.changeBurglar)
                        .filter(target => target.index !== selectedBlock.index)
                        .map(target => target.index);

                    app.backgroundActive();
                    app.blinkBlock(indexList);
                    app.status.changeBurglarMode = true;
                    app.playChangeSound();
                } else if (selectedBlock.changePolice && app.status.policeTurn) {

                    let indexList = app.blockList.filter(target => target.changePolice)
                        .filter(target => target.index !== selectedBlock.index)
                        .map(target => target.index);

                    app.blinkBlock(indexList);
                    app.status.changePoliceMode = true;
                    app.playChangeSound();
                } else if (selectedBlock.moveBurglar && app.status.burglarTurn) {
                    app.status.moveBurglarMode = true;
                    app.moveByIndex(selectedBlock.move);
                } else if (selectedBlock.movePolice && app.status.policeTurn ) {
                    app.status.movePoliceMode = true;
                    app.moveByIndex(selectedBlock.move);
                } else if (selectedBlock.mission && app.status.burglarTurn) {
                    if (selectedBlock.forward) {
                        for (let i = 0; i < selectedBlock.directionLinkList.length; i++) {
                            let link = selectedBlock.directionLinkList[i];

                            if (link.includes(currentPosition)) {
                                app.goAndBlink(selectedBlock.move, link);
                            }
                        }
                    } else {
                        app.status.missionBurglarMode = true;
                        app.moveByIndex(pathList[pathList.length - selectedBlock.move - 1]);
                    }
                } else if (selectedBlock.mission && app.status.policeTurn) {

                    app.status.missionPoliceMode = true;
                    app.moveByIndex(pathList[pathList.length - selectedBlock.move - 1]);
                } else if (selectedBlock.run && app.status.policeTurn) {

                    app.status.runCount = selectedBlock.move;
                    app.status.runMode = true;

                    let indexList = app.burglarList
                        .filter(target => !target.arrested)
                        .map(target => target.position);

                    app.blinkBlock(indexList);
                    app.playClickBlockSound();
                } else if (selectedBlock.skip) {
                    let currentCharacter = app.getCurrentCharacter();
                    currentCharacter.skip = true;
                    app.nextTurn();
                } else if (selectedBlock.index === 0) {
                    let currentBurglar = app.getCurrentBurglar();

                    if (currentBurglar.jewelryIndex != null) {
                        app.checkSteal(currentBurglar, true);
                    } else {
                        app.nextTurn();
                    }
                } else if (selectedBlock.arrest) {
                    app.status.turn--;
                    app.playArrestSound();
                    app.nextTurn();
                    app.status.arrestMode = true;
                } else if (selectedBlock.goHome) {
                    let $burglarStartBlock = $('.block[data-index=0]');
                    let $policeStartBlock = $('.block[data-index=135]');

                    let policeCount = 0;

                    $('.policeCharacter')
                        .each(function () {
                        $(this).animate({
                            left: $policeStartBlock.offset().left + 30 * $(this).attr('data-index'),
                            top: $policeStartBlock.offset().top
                        }, 1000, function () {
                            policeCount++;

                            if (policeCount === 3) {
                                app.policeList.forEach(police => police.position = 135);
                            }
                        });
                    });

                    let burglarCount = 0;

                    let $burglarCharacter = $('.burglarCharacter')
                        .filter(function () {
                            let index = $(this).attr('data-index');
                            return !app.burglarList[index].arrested;
                        });

                    let notArrestBurglarCount = $burglarCharacter.length;

                    $burglarCharacter.each(function () {
                        let index = $(this).attr('data-index');

                        $(this).animate({
                            left: $burglarStartBlock.offset().left + 30 * index,
                            top: $burglarStartBlock.offset().top
                        }, 1000, function () {
                            app.burglarList[index].position = 0;

                            burglarCount++;

                            if (notArrestBurglarCount === burglarCount) {
                                app.burglarList.forEach(burglar => {
                                    app.checkSteal(burglar, false);
                                });

                                app.nextTurn();
                            }
                        });
                    });
                } else if (selectedBlock.onlyBurglar || selectedBlock.search) {
                    if (app.status.policeTurn) {
                        app.nextTurn();
                        return;
                    }

                    let buildingIndex = selectedBlock.buildingIndex;

                    if (buildingIndex != null) {
                        let building = app.getBuilding(buildingIndex);
                        let jewelryIndex = building.jewelryIndex;

                        if (jewelryIndex != null) {
                            let burglar = app.getCurrentBurglar();
                            burglar.jewelryIndex = jewelryIndex;

                            building.jewelryIndex = null;

                            let jewelry = app.getJewelry(jewelryIndex);
                            jewelry.steal = true;

                            let $jewelry = $('.jewelry')
                                .filter(function () {
                                    return $(this).attr('data-index') == jewelryIndex;
                                })
                                .show();

                            app.blinkJewelry(jewelryIndex, true);

                            setTimeout(function () {
                                app.blinkJewelry(jewelryIndex, false);
                                jewelry.classObject.steal = true;
                                Vue.set(app.jewelryList, jewelryIndex, jewelry);

                                $jewelry.css({
                                    left: 0,
                                    top: 0
                                });

                                app.getCurrentBurglarElement().append($jewelry);

                                setTimeout(function () {
                                    app.nextTurn();
                                }, 1000);
                            }, 1000);
                        } else {
                            if (building.hasHiddenPolice) {
                                app.hiddenPolice.classObject.roundBlink = true;
                                let $hiddenPolice = $('.hiddenPolice').show();

                                setTimeout(function () {
                                    let burglar = app.getCurrentBurglar();
                                    app.arrestBurglar(burglar);
                                    $hiddenPolice.remove();

                                    setTimeout(function () {
                                        app.nextTurn();
                                    }, 2000)
                                }, 2000);
                            } else {
                                alert('보석이 없습니다.');
                                app.nextTurn();
                            }
                        }
                    }
                } else {
                    app.nextTurn();
                }
            });
        },

        moveByIndex: function (index) {
            let selectedBlock = app.getBlock(index);
            app.move(selectedBlock);
        },

        moveByEvent: function (event) {
            let selectedBlock = app.getSelectedBlock(event);
            app.move(selectedBlock);
        },

        clickBurglar: function (event) {
            let index = $(event.target).attr('data-index');
            let burglar = app.burglarList
                .filter(target => target.index == index)[0];

            if (app.status.arrestMode) {
                app.arrestBurglar(burglar);
                app.removeRippleCharacter();
                app.nextTurn();
                app.status.arrestMode = false;
            } else if (app.status.passMode) {
                burglar.jewelryIndex = app.getCurrentBurglar().jewelryIndex;
                app.getCurrentBurglar().jewelryIndex = null;

                let $jewelry = app.getCurrentBurglarElement().find('.jewelry');
                app.getBurglarElement(index).append($jewelry);

                app.removeRippleCharacter();
                app.status.passMode = false;

                app.checkSteal(burglar, true);
            }
        },

        resetTrickIndexList: function () {
            app.status.trickIndexList = [];
        },

        resetCheckIndexList: function () {
            app.status.checkIndexList = [];
        },

        removeTrick: function (selectedBlock) {
            selectedBlock.trickDirection = null;
            $('.trick-modal[data-block-index=' + selectedBlock.index + ']').remove();
        },

        removeCheck: function (selectedBlock) {
            selectedBlock.check = false;
            app.updateBlock(selectedBlock);
        },

        removeTrickList: function () {
            app.status.trickIndexList.map(index => app.getBlock(index))
                .forEach(target => app.removeTrick(target));

            app.resetTrickIndexList();
        },

        removeCheckList: function () {
            app.status.checkIndexList.map(index => app.getBlock(index))
                .forEach(target => app.removeTrick(target));

            app.resetCheckIndexList();
        },

        threat: function (callback) {
            if (app.status.threatCount > 0) {
                return;
            }

            let currentJewelryList = app.jewelryList
                .filter(jewelry => jewelry.steal === false);

            if (currentJewelryList.length > 0) {
                let currentJewelry = currentJewelryList[0];
                let index = currentJewelry.index;
                let $jewelry = $('.jewelry[data-index=' + index + ']').show();

                currentJewelry.classObject.blink = true;

                app.playConfirmJewelrySound();

                setTimeout(() => {
                    app.nextTurn();
                    currentJewelry.classObject.blink = false;
                    $jewelry.hide();
                    app.status.threatCount = 1;
                }, 3000);
            }
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

            app.status.rolling = false;

            app.rollDie();
        },

        blinkJewelry: function (index, blink) {
            let jewelry = app.jewelryList[index];
            jewelry.classObject.roundBlink = blink;
            Vue.set(app.jewelryList, index, jewelry);
        },

        hideAtBuilding: function (event) {
            let index = $(event.target).attr('data-index');
            let building = this.buildingList[index];
            building.classObject.blink = false;
            Vue.set(this.buildingList, index, building);

            let $target;

            if (app.status.hidePoliceMode) {
                $target = $('.hiddenPolice');
                building.hasHiddenPolice = true;
            } else {
                let jewelryBuildingList = app.buildingList
                    .filter(target => target.jewelryIndex === app.status.hideJewelryIndex);

                if (jewelryBuildingList.length !== 0) {
                    app.status.hideJewelryIndex++;
                }

                $target = $('.jewelry[data-index=' + app.status.hideJewelryIndex + ']');
                building.jewelryIndex = app.status.hideJewelryIndex;
                Vue.set(this.buildingList, index, building);
            }

            $target.show();

            $target.animate({
                left: $(event.target).offset().left + 25,
                top: $(event.target).offset().top + 25,
            }, 500, function () {
                if (app.status.hidePoliceMode) {
                    app.hiddenPolice.classObject.blink = false;
                } else {
                    let currentJewelry = app.jewelryList[app.status.hideJewelryIndex];
                    currentJewelry.styleObject.left = $target.offset().left + 'px';
                    currentJewelry.styleObject.top = $target.offset().top + 'px';

                    app.blinkJewelry(app.status.hideJewelryIndex, false);

                    if (app.status.hideJewelryIndex === 0) {
                        let jewelryBuildingList = app.buildingList
                            .filter(target => target.jewelryIndex === app.status.hideJewelryIndex + 1);

                        console.log('>>> jewelryBuildingList.length', jewelryBuildingList.length);

                        if (jewelryBuildingList.length > 0) {
                            app.blinkJewelry(app.status.hideJewelryIndex + 1, true);
                            app.status.hideJewelryIndex = 2;
                        } else {
                            app.status.hideJewelryIndex = 1;
                        }
                    } else {
                        app.status.hideJewelryIndex = 2;
                    }
                }

                if (app.status.hideJewelryIndex === 1) {
                    app.playHideJewelrySound();
                } else if (app.status.hideJewelryIndex === 2) {
                    let hiddenPoliceBuildingList = app.buildingList.filter(target => target.hasHiddenPolice);

                    if (hiddenPoliceBuildingList.length > 0) {
                        app.playRestartSound();
                        app.initStartButton();
                    } else {
                        app.playHidePoliceSound();
                        app.status.hidePoliceMode = true;
                        app.hiddenPolice.classObject.roundBlink = true;
                    }
                }
            });
        },

        initStartButton: function () {
            $('.start-game-button').prop('disabled', false)
                .on('click', function () {
                    app.readyToPlay();
                });
            $('.hide-jewelry-button').prop('disabled', false)
                .on('click', function () {
                    location.reload();
                });
        },

        getTurnType: function () {
            if (app.status.policeTurn) {
                return 'police';
            }

            return 'burglar';
        },

        getCharacterImage: function () {
            let turnType = app.getTurnType();
            return `image/${turnType}/${app.status.turn}.png`;
        },

        getCurrentCharacter: function () {
            if (app.status.burglarTurn) {
                return app.getCurrentBurglar();
            }

            return app.getCurrentPolice();
        },

        isOnlyBurglar: function (block) {
            return block.onlyBurglar;
        },

        isRestable: function (block) {
            return app.isOnlyBurglar(block) || block.index === 0;
        },

        moveToTurn: function (callback) {
            let $turnImage = $('.turnImage');
            let $newTurnImage = $turnImage.clone().appendTo('body');
            let $currentCharacterElement = app.getCurrentCharacterElement();

            $newTurnImage.css({
                position: 'absolute',
                left: $turnImage.offset().left,
                top: $turnImage.offset().top
            });

            $newTurnImage.animate({
                left: $currentCharacterElement.offset().left,
                top: $currentCharacterElement.offset().top,
                width: '30px',
                height: '30px'
            }, 1000, function () {
                $newTurnImage.remove();
                app.rippleCharacter();
                
                if (callback) {
                    callback();
                }
            });
        },

        rippleCharacter: function () {
            if (app.status.burglarTurn) {
                let currentBurglar = app.getCurrentBurglar();
                currentBurglar.classObject.burglarRipple = true;
                Vue.set(app.burglarList, app.status.turn, currentBurglar);
            } else {
                let currentPolice = app.getCurrentPolice();
                currentPolice.classObject.policeRipple = true;
                Vue.set(app.policeList, app.status.turn, currentPolice);
            }
        },

        hideTurnModal: function () {
            app.getTurnModalElement().modal('hide');
        },

        getTurnModalElement: function () {
            return $('#turnModal');
        },

        burglar0: function () {
            app.status.burglarTurn = true;
            app.status.policeTurn = false;
            app.status.turn = 0;
        },

        burglar1: function () {
            app.status.burglarTurn = true;
            app.status.policeTurn = false;
            app.status.turn = 1;
        },

        burglar2: function () {
            app.status.burglarTurn = true;
            app.status.policeTurn = false;
            app.status.turn = 2;
        },

        police0: function () {
            app.status.burglarTurn = false;
            app.status.policeTurn = true;
            app.status.turn = 0;
        },

        police1: function () {
            app.status.burglarTurn = false;
            app.status.policeTurn = true;
            app.status.turn = 1;
        },

        police2: function () {
            app.status.burglarTurn = false;
            app.status.policeTurn = true;
            app.status.turn = 2;
        },

        disabled: function ($target) {
            $target.prop('disabled', true);
        },

        enabled: function ($target) {
            $target.prop('disabled', false);
        },
        
        rollDie: function () {
            setTimeout(function () {
                app.playThrowSound();
            }, 500);

            $('.turnImage').attr('src', app.getCharacterImage());

            let $turnModal = app.getTurnModalElement().modal();
            let $restCountButton = $('.btn-rest-count');
            let $restButton = $('.btn-rest');
            let $trickButton = $('.btn-select-block-for-trick');
            let $arrestTile = $('.arrest-title');
            let $checkButton = $('.btn-check');
            let $checkComment = $('.check-comment');

            $restCountButton.hide();
            $restButton.hide();
            $trickButton.hide();
            $arrestTile.hide();
            $checkComment.hide();

            let currentBurglar = app.getCurrentBurglar();

            if (app.status.burglarTurn) {
                $checkButton.hide();
                let message = '남은 휴식: ' + (3 - currentBurglar.rest) + '<br>';
                message += '남은 속임수: ' + app.status.trickCount;

                $restCountButton.html(message)
                    .show();

                let currentBlock = app.getBlock(currentBurglar.position);

                $restButton.show();

                if (app.isRestable(currentBlock)) {
                    app.enabled($restButton);
                } else {
                    app.disabled($restButton);
                }

                $restButton.off('click')
                    .on('click', function () {
                        currentBurglar.rest++;
                        $turnModal.modal('hide');
                        app.removeBlinkCharacter();
                        app.nextTurn();
                    });

                if (app.isRestable(currentBlock)) {
                    $restButton.show()
                        .off('click')
                        .on('click', function () {
                            currentBurglar.rest++;
                            $turnModal.modal('hide');
                            app.removeBlinkCharacter();
                            app.nextTurn();
                        });
                }

                if (currentBurglar.position === 135) {
                    if (currentBurglar.arrested) {
                        $arrestTile
                            .text('주사위를 던져 1이면 탈출합니다.')
                            .show()
                    }
                }

                if (app.status.trickCount > 0) {
                    $trickButton.show()
                        .off('click')
                        .on('click', function () {
                            $turnModal.modal('hide');
                            app.backgroundActive();

                            let indexList = app.blockList.filter(target => target.trick)
                                .filter(target => target.trickDirection === null)
                                .map(target => target.index);

                            app.blinkBlock(indexList);
                            app.status.trickMode = true;
                        });
                }
            } else {
                $checkComment.show();
                $checkComment.text(`${app.status.checkCount}번 검문 할 수 있습니다.`);

                if (app.status.checkCount === 0) {
                    $checkComment.text('검문할 수 없습니다.');
                    app.disabled($checkButton);
                }

                $checkButton.show()
                    .off('click')
                    .on('click', function () {
                        let burglarPositionList = app.burglarList.map(target => target.position);

                        let blockIndexList = app.blockList.filter(target => !target.onlyBurglar)
                            .filter(target => target.index !== 0 )
                            .filter(target => target.index !== 135 )
                            .filter(target => !burglarPositionList.includes(target.index))
                            .filter(target => !target.check)
                            .map(target => target.index);

                        app.status.checkMode = true;
                        app.blinkBlock(blockIndexList);
                        app.status.checkCount--;
                    });

                let currentPosition = app.getCurrentCharacter().position;
                let currentBlock = app.getBlock(currentPosition);
            }

            let position = app.getCurrentCharacter().position;
            let block = app.getBlock(position);
            
            app.moveToTurn();

            let $die = $('#die');

            if (die == null) {
                die = new Die(function (count) {
                    app.moveToTurn(function () {
                        count = app.getDiceCount(count);

                        if (app.status.policeTurn) {
                            let currentPolice = app.getCurrentPolice();
                            let currentBlock = app.getBlock(currentPolice.position);

                            if (app.status.arrestMode) {

                                if (currentBlock.dice == count) {
                                    app.playSelectBurglarSound();

                                    app.status.catch = true;

                                    app.burglarList.filter(target => target.arrested === false)
                                        .forEach(target => {
                                            target.classObject.burglarRipple = true;
                                            target.classObject.selectable = true;
                                            Vue.set(app.burglarList, target.index, target);
                                        });
                                } else {
                                    app.playNotArrestSound();
                                    app.removeRippleCharacter();
                                    app.nextTurn();
                                }

                                app.status.arrestMode = false;

                                return;
                            }
                        } else {
                            let currentBurglar = app.getCurrentBurglar();
                            let currentBlock = app.getBlock(currentBurglar.position);

                            if (currentBlock.index === 135) {
                                if (count === 1) {
                                    alert('탙출합니다.\n주사위를 다시 던지세요.');
                                    app.status.turn--;
                                    app.status.escape = true;
                                    app.nextTurn();
                                    return;
                                } else {
                                    alert('탙출하지 못했습니다.');
                                    app.nextTurn();
                                    return;
                                }
                            }
                        }

                        app.goAndBlink(count);
                    });
                });

                $die.append(die.$element);
            }

            if (app.getCurrentCharacter().skip) {
                setTimeout(function () {
                    alert('1회 휴식합니다.');
                    app.getCurrentCharacter().skip = false;
                    app.nextTurn();
                }, 500);
            }
        },

        getDiceCount: function (count) {
            let countForDebug = $('#countForDebug').val();

            if (countForDebug !== '0') {
                count = countForDebug;
            }

            return count;
        },

        goAndBlink: function (count, filter) {
            filter = filter || [];
            let currentCharacter = app.getCurrentCharacter();
            app.status.blockPathList = [];

            app.go(count, count, currentCharacter.position, currentCharacter.position, []);

            let blockIndexList = app.status.blockPathList
                .filter(target => !filter.includes(target.index))
                .map(target => target.index);

            if (blockIndexList.length === 1) {
                app.moveByIndex(blockIndexList[0]);
                return;
            }

            app.blinkBlock(blockIndexList);

            app.playMoveSound();

            app.status.trickIndexList
                .filter(index => !filter.includes(index))
                .forEach(index => {
                $('.block[data-index=' + index + ']')
                    .find('.trick')
                    .addClass('blink');
            });

            app.status.checkIndexList
                .filter(index => !filter.includes(index))
                .forEach(index => {
                    $('.block[data-index=' + index + ']')
                        .find('.check')
                        .addClass('blink');
                });

            if (app.status.burglarTurn) {
                currentCharacter.classObject.burglarRipple = true;
            } else {
                currentCharacter.classObject.policeRipple = true;
            }
        },
        
        readyToPlay: function () {
            $('.start-game-button').hide();
            $('.hide-comment').hide();
            $('.hide-jewelry-button').hide();
            $('.start-comment').hide();
            $('.player-info').show();
            $('.btn-rest').show();
            $('.btn-select-block-for-trick').show();
            $('#die').show();

            app.resetBuilding();

            app.burglarList.forEach((target) => {
                return target.styleObject.display = 'block';
            });

            app.policeList.forEach((target) => {
                return target.styleObject.display = 'block';
            });

            app.jewelryList.forEach((target, index) => {
                if (app.status.start && target.steal === false) {
                    target.styleObject.display = 'none';
                    Vue.set(app.jewelryList, index, target);
                    let jewelry = app.jewelryList[index];
                } else {
                    target.styleObject.display = 'none';
                }
            });

            app.hiddenPolice.styleObject.display = 'none';
            app.status.start = true;

            if (app.status.restartMode) {
                app.nextTurn();
                app.status.restartMode = false;
            } else {
                app.rollDie();
            }
        },

        removeBlinkBlock: function () {
            app.removeBlink(app.blockList);
        },

        removeBlinkCharacter: function () {
            app.removeBlink(app.burglarList);
            app.removeBlink(app.policeList);
        },

        removeRippleCharacter: function () {
            app.removeRipple(app.burglarList);
            app.removeRipple(app.policeList);
        },

        removeBlink: function (list) {
            list.forEach((target, index) => {
                target.classObject.blink = false;
                Vue.set(list, index, target);
            });
        },

        removeRipple: function (list) {
            list.forEach((target, index) => {
                target.classObject.policeRipple = false;
                target.classObject.burglarRipple = false;
                target.classObject.selectable = false;
                Vue.set(list, index, target)
            });
        },

        blinkBlock: function (indexList) {
            indexList.forEach(index => {
                let block = app.blockList[index];
                block.classObject.blink = true;
                Vue.set(app.blockList, index, block);
            });
        },

        backgroundActive: function () {
            data.background.classObject.backgroundActive = true;
        },

        backgroundInactive: function () {
            data.background.classObject.backgroundActive = false;
        },

        getBlock: function (currentPosition) {
            return app.blockList
                .filter(target => target.index === currentPosition)[0];
        },

        getBuilding: function (currentPosition) {
            return app.buildingList
                .filter(target => target.index === currentPosition)[0];
        },

        getJewelry: function (currentPosition) {
            return app.jewelryList
                .filter(target => target.index === currentPosition)[0];
        },

        go: function(originCount, count, previousPosition, currentPosition, path) {
            path.push(currentPosition);

            let currentBlock = app.getBlock(currentPosition);

            if (app.status.burglarTurn && currentBlock.check) {
                app.status.checkIndexList.push(currentBlock.index);
            }

            if (app.status.policeTurn) {
                if (currentBlock.onlyBurglar) {
                    return;
                }

                if (currentPosition === 0 && previousPosition === 1) {
                    return;
                }
            }

            if (app.status.burglarTurn) {
                if (currentBlock.onlyBurglar) {
                    if (originCount !== count) {
                        app.status.blockPathList.push({
                            index: currentPosition,
                            path: path
                        });

                        return;
                    }
                }

                if (currentBlock.check) {
                    app.status.blockPathList.push({
                        index: currentPosition,
                        path: path
                    });

                    return;
                }
            }

            if (!app.status.runMode) {
                if (currentBlock.stop) {
                    if (originCount !== count) {
                        app.status.blockPathList.push({
                            index: currentPosition,
                            path: path
                        });

                        return;
                    }
                }
            }

            if (!app.status.runMode) {
                if (currentPosition === 135 && previousPosition === 134) {
                    if (app.status.policeTurn) {
                        app.status.blockPathList.push({
                            index: currentPosition,
                            path: path
                        });

                        return;
                    }
                }
            }

            if (currentPosition === 0 && previousPosition === 1) {
                if (app.status.burglarTurn) {
                    app.status.blockPathList.push({
                        index: currentPosition,
                        path: path
                    });

                    return;
                }
            }

            if (count === 0) {
                app.status.blockPathList.push({
                    index: currentPosition,
                    path: path
                });

                return;
            }

            let linkList = currentBlock.linkList;

            for (let i = 0; i < linkList.length; i++) {
                let link = linkList[i];

                if (app.status.burglarTurn) {
                    if (link !== previousPosition) {
                        app.go(originCount, count - 1, currentPosition, link, [...path]);
                    }
                } else if (app.status.policeTurn) {
                    if (currentBlock.trickDirection === null || app.status.runMode) {
                        if (link !== previousPosition) {
                            app.go(originCount, count - 1, currentPosition, link, [...path]);
                        }
                    } else {
                        if (currentBlock.trickDirection === currentBlock.linkDirectionList[i]) {
                            app.status.trickIndexList.push(currentBlock.index);
                            app.go(originCount, count - 1, currentPosition, link, [...path]);
                        }
                    }
                }
            }
        },

        cloneCanvas: function ($source, $target) {
            let oldCanvas = $source.find('canvas').get(0);
            let newCanvas = $target.find('canvas').get(0);
            let context = newCanvas.getContext('2d');

            newCanvas.width = oldCanvas.width;
            newCanvas.height = oldCanvas.height;

            context.drawImage(oldCanvas, 0, 0);
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
                let moveDirection = '뒤';

                if (block.forward) {
                    moveDirection = '앞으';
                }

                return `${block.move}칸 ${moveDirection}로 가서 지시에 따른다.`;
            } else if (block.arrest) {
                return `경찰은 ${block.dice}이 나오면 도둑 한명 체포`;
            } else if (block.search) {
                return `밑에 있는 건물을 뒤져라`;
            } else if (block.skip) {
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
                return `도둑은 보석이 있는 건물 알 수 있다`;
            } else if (block.goHome) {
                return `도둑은 아지트로 경찰은 경찰서로`;
            } else if (block.pass) {
                return `도둑은 보석을 동료에게 넘겨준다`;
            } else if (block.drop) {
                return `보석을 떨어뜨렸다. 보석을 다시 숨김니다.`;
            } else if (block.tunnel || block.changePosition) {
                return `${block.move}로 이동`;
            }

            return block.subTitle;
        },

        collectJewelry: function (burglar) {
            let jewelryIndex = burglar.jewelryIndex;

            if (jewelryIndex == null) {
                return false;
            }

            burglar.jewelryIndex = null;

            let jewelry = app.jewelryList[jewelryIndex];
            jewelry.classObject.steal = false;
            jewelry.classObject.roundBlink = true;
            jewelry.styleObject.left = jewelry.originStyleObject.left;
            jewelry.styleObject.top = jewelry.originStyleObject.top;
            jewelry.styleObject.display = 'block';

            Vue.set(app.jewelryList, jewelryIndex, jewelry);

            let $jewelry = $('.jewelry[data-index=' + jewelryIndex + ']');

            $jewelry.appendTo($('#app')).animate({
                left: jewelry.originStyleObject.left,
                top: jewelry.originStyleObject.top
            });

            $('.hide-comment').show();
            $('.modal-footer .btn').hide();
            $('#die').hide();
            $('.start-game-button').show();
            $('.player-info').hide();
            $('.btn-check').hide();

            app.buildingList.filter(target => target.jewelryIndex === jewelryIndex)
                .forEach(target => target.jewelryIndex = null);

            data.status.hideJewelryMode = true;
            data.status.hidePoliceMode = false;
            data.status.hideJewelryIndex = 0;

            for (let i = 0; i < app.buildingList.length; i++) {
                let building = app.buildingList[i];
                
                if (building.jewelryIndex == null && building.hasHiddenPolice === false) {
                    building.classObject.blink = true;
                    Vue.set(app.buildingList, i, building);
                }
            }

            return true;
        },

        showTrickDirection: function (event) {
            if (!app.status.trickMode) {
                return;
            }

            let selectedBlock = app.getSelectedBlock(event);

            if (selectedBlock.trickDirection != null) {
                return;
            }

            let offset = $(event.target).offset();

            $('#trickModal.live .direction').addClass('disabled');

            selectedBlock.linkDirectionList.forEach(target => {
                $('#trickModal.live')
                    .find('#' + target)
                    .removeClass('disabled');
            });

            selectedBlock.linkList.forEach((target, index) => {
                if (app.blockList[target].onlyBurglar) {
                    let currentDirection = selectedBlock.linkDirectionList[index];

                    $('#trickModal.live')
                        .find('#' + currentDirection)
                        .addClass('disabled');
                }
            });

            $('#trickModal.live')
                .css({
                    left: offset.left,
                    top: offset.top
                })
                .attr('data-block-index', selectedBlock.index)
                .show();
        },
    },

    created: function () {
        this.blockList = this.blockList.map((block) => {
            if (block.buildingIndex === undefined) {
                block.buildingIndex = null;
            }

            return {
                ...block,
                check: false,
                subTitle: this.getSubTitle(block),
                trickDirection: null,
                trickDirectionIcon: '',
                jewelryIndex: null,
                classObject: {
                    burglar: block.burglar ||
                        block.moveBurglar ||
                        block.changeBurglar ||
                        block.search ||
                        block.onlyBurglar ||
                        block.threat ||
                        block.drop ||
                        block.pass,
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

$(document.body).curvedArrow({
    p0x: 750,
    p0y: 60,
    p1x: 750,
    p1y: 50,
    p2x: 750,
    p2y: 190,
    strokeStyle: 'rgba(255, 192, 203, 1)'
});

$('#left').curvedArrow({
    p0x: 20,
    p0y: 12,
    p1x: 20,
    p1y: 12,
    p2x: 5,
    p2y: 12,
    lineWidth: 5,
    size: 15,
    strokeStyle: 'rgba(255, 192, 203, 1)'
});

$('#up').curvedArrow({
    p0x: 12,
    p0y: 20,
    p1x: 12,
    p1y: 20,
    p2x: 12,
    p2y: 5,
    lineWidth: 5,
    size: 15,
    strokeStyle: 'rgba(255, 192, 203, 1)'
});

$('#down').curvedArrow({
    p0x: 12,
    p0y: 5,
    p1x: 12,
    p1y: 5,
    p2x: 12,
    p2y: 20,
    lineWidth: 5,
    size: 15,
    strokeStyle: 'rgba(255, 192, 203, 1)'
});

$('#right').curvedArrow({
    p0x: 5,
    p0y: 12,
    p1x: 5,
    p1y: 12,
    p2x: 20,
    p2y: 12,
    lineWidth: 5,
    size: 15,
    strokeStyle: 'rgba(255, 192, 203, 1)'
});

$(document.body).curvedArrow({
    p0x: 350,
    p0y: 720,
    p1x: 400,
    p1y: 680,
    p2x: 350,
    p2y: 630,
    strokeStyle: 'rgba(133, 255, 133, 1)'
});

$(document.body).curvedArrow({
    p0x: 150,
    p0y: 630,
    p1x: 100,
    p1y: 680,
    p2x: 150,
    p2y: 720,
    strokeStyle: 'rgba(133, 255, 133, 1)'
});

$(document.body).curvedArrow({
    p0x: 275,
    p0y: 575,
    p1x: 275,
    p1y: 575,
    p2x: 225,
    p2y: 575,
    strokeStyle: 'rgba(133, 255, 133, 1)'
});

$(document.body).curvedArrow({
    p0x: 225,
    p0y: 775,
    p1x: 275,
    p1y: 775,
    p2x: 275,
    p2y: 775,
    strokeStyle: 'rgba(133, 255, 133, 1)'
});

$(document.body).curvedArrow({
    p0x: 475,
    p0y: 775,
    p1x: 525,
    p1y: 775,
    p2x: 525,
    p2y: 775,
    strokeStyle: 'rgba(133, 255, 133, 1)'
});

$(document.body).curvedArrow({
    p0x: 450,
    p0y: 775,
    p1x: 450,
    p1y: 775,
    p2x: 450,
    p2y: 725,
    strokeStyle: 'rgba(133, 255, 133, 1)'
});

$(document.body).curvedArrow({
    p0x: 50,
    p0y: 560,
    p1x: 50,
    p1y: 560,
    p2x: 50,
    p2y: 520,
    strokeStyle: 'rgba(133, 255, 133, 1)'
});

$(document.body).curvedArrow({
    p0x: 50,
    p0y: 590,
    p1x: 50,
    p1y: 590,
    p2x: 50,
    p2y: 620,
    strokeStyle: 'rgba(133, 255, 133, 1)'
});

let $jewelryModal = $('#jewelryModal');
app.backgroundActive();

app.blinkJewelry(app.status.hideJewelryIndex, true);

data.status.hideJewelryMode = true;

for (let i = 0; i < app.buildingList.length; i++) {
    let building = app.buildingList[i];
    building.classObject.blink = true;
    Vue.set(app.buildingList, i, building);
}

let jewelry = app.jewelryList[app.status.hideJewelryIndex];
Vue.set(app.jewelryList, app.status.hideJewelryIndex, jewelry);

$('body').on('click', '.debug-container .btn-default', function () {
    if ($(this).hasClass('burglar0')) {
        app.status.burglarTurn = true;
        app.status.policeTurn = false;
        app.status.turn = 0;
    } else if ($(this).hasClass('burglar1')) {
        app.status.burglarTurn = true;
        app.status.policeTurn = false;
        app.status.turn = 1;
    } else if ($(this).hasClass('burglar2')) {
        app.status.burglarTurn = true;
        app.status.policeTurn = false;
        app.status.turn = 2;
    } else if ($(this).hasClass('police0')) {
        app.status.burglarTurn = false;
        app.status.policeTurn = true;
        app.status.turn = 0;
    } else if ($(this).hasClass('police1')) {
        app.status.burglarTurn = false;
        app.status.policeTurn = true;
        app.status.turn = 1;
    } else if ($(this).hasClass('police2')) {
        app.status.burglarTurn = false;
        app.status.policeTurn = true;
        app.status.turn = 2;
    }

    app.removeBlinkBlock();
    app.rollDie();
});

$('#trickModal.live .direction').on('click', function () {
    if ($(this).hasClass('disabled')) {
        return;
    }

    let direction = $(this).attr('id');
    let $parent = $(this).closest('#trickModal');

    let blockIndex = $parent.attr('data-block-index');
    let $newDirection = $parent.clone().removeClass('live');

    $('#trickModal.live').hide();

    $parent.find('.direction')
        .each(function (index, element) {
            let $target = $newDirection.find('.direction').eq(index);
            app.cloneCanvas($(element), $target);
        });
    
    $newDirection.find('.direction')
       .off('click')
       .css({
           visibility: 'hidden'
       });

    $newDirection.find('#' + direction).css({
       visibility: 'visible'
    }).addClass('installed');

    $('body').append($newDirection);

    app.status.trickCount--;
    app.removeBlinkBlock();
    app.status.trickMode = false;
    app.blockList[blockIndex].trickDirection = direction;

    setTimeout(function () {
        app.nextTurn();
    }, 500);
});