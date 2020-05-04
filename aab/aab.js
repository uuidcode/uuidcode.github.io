let die = null;
let countForDebug = null;

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
        linkList: [1, 3, 4],
        linkDirectionList: ['down', 'up', 'left']
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
        move: 2,
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
        linkDirectionList: ['down', 'up', 'left'],
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
        trick: true,
        linkDirectionList: ['right', 'left', 'up']
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
        styleObject: {
            left: '1600px',
            top: '500px',
        },
        linkList: [16, 18]
    },
    {
        index: 18,
        styleObject: {
            left: '1500px',
            top: '500px',
        },
        linkList: [17, 33],
        mission: true,
        move: 2
    },
    {
        index: 19,
        styleObject: {
            left: '1400px',
            top: '400px',
        },
        linkList: [15, 20],
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
    },
    {
        index: 24,
        styleObject: {
            left: '1300px',
            top: '350px',
        },
        linkList: [20],
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
        linkList: [18, 32]
    },
    {
        index: 34,
        styleObject: {
            left: '1200px',
            top: '500px',
        },
        linkList: [32, 35],
        run: true,
        move: 4
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
        styleObject: {
            left: '900px',
            top: '500px',
        },
        move: 43,
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
        linkList: [22, 43]
    },
    {
        index: 43,
        styleObject: {
            left: '900px',
            top: '400px',
        },
        linkList: [42, 44],
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
    },
    {
        index: 53,
        styleObject: {
            left: '1300px',
            top: '100px',
        },
        linkList: [52],
        onlyBurglar: true,
        buildingIndex: 3
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
        linkDirectionList: ['down', 'up', 'left'],
        mission: true,
        move: 3
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
        trick: true,
        linkDirectionList: ['down', 'right', 'left']
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
        styleObject: {
            left: '900px',
            top: '0px',
        },
        linkList: [77, 79],
        changePosition: true,
        move: 95
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
        linkList: [81, 83, 131],
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
        mission: true,
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
        linkList: [99, 116],
        linkDirectionList: ['right', 'left']
    },
    {
        index: 101,
        styleObject: {
            left: '400px',
            top: '700px',
        },
        linkList: [100, 102],
        linkDirectionList: ['down', 'up']
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
        linkDirectionList: ['down', 'right', 'up'],
        send: true
    },
    {
        index: 103,
        styleObject: {
            left: '500px',
            top: '650px',
        },
        linkList: [102],
        onlyBurglar: true,
        buildingIndex: 4
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
        trick: true,
        linkDirectionList: ['right', 'left', 'down']
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
        move: 2
    },
    {
        index: 110,
        styleObject: {
            left: '0px',
            top: '600px',
        },
        linkList: [109, 111],
        trick: true,
        linkDirectionList: ['up', 'down'],
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
        trick: true,
        linkDirectionList: ['left', 'right']
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
        linkList: [107],
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
        linkList: [118, 120]
    },
    {
        index: 120,
        styleObject: {
            left: '0px',
            top: '400px',
        },
        linkList: [119, 121],
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
        trick: true,
        linkDirectionList: ['left', 'right', 'up']
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
                left: '100px',
                top: '0px',
                backgroundImage: 'url(image/jewelry/0.jpg)'

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
                left: '150px',
                top: '0px',
                backgroundImage: 'url(image/jewelry/1.jpg)'
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
            left: '200px',
            top: '0px'
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
        escape: false,
        catch: false,
        hideJewelryMode: false,
        hideJewelryCount: 0,
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
        blockPathList: [],
        runMode: false,
        runModeComplete: false,
        runCount: 0
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
            return $('.policeCharacter').eq(app.status.turn);
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

        setTrickDirection: function (block, direction) {
            block.trickDirection = direction;

            if (direction === "up") {
                block.trickDirectionIcon = "▲";
            } else if (direction === "down") {
                block.trickDirectionIcon = "▼";
            } else if (direction === "left") {
                block.trickDirectionIcon = "◀";
            } else if (direction === "right") {
                block.trickDirectionIcon = "▶";
            }
        },

        processTrickDirection: function (selectedBlock) {
            let $trickModal = $('#trickModal').modal();

            $('.btn-trick').off('click')
                .on('click', function (event) {
                    let direction = $(this).attr('data-trick-direction');
                    app.setTrickDirection(selectedBlock, direction);
                    $trickModal.modal('hide');
                    app.status.trickCount--;
                    app.removeBlinkBlock();
                    app.status.trickMode = false;
                    app.backgroundInactive();

                    setTimeout(function () {
                        app.nextTurn();
                    }, 500);
                });
        },

        checkGameOver: function () {
            if (app.burglarList.filter(burglar => burglar.arrested).length === 3) {
                alert('경찰 승리');
                location.reload();
            }
        },

        arrestBurglar: function (burglar) {
            let $currentBurglar = app.getBurglarElement(burglar.index);

            $currentBurglar.animate({
                left: burglar.index * 30,
                top: 70
            }, 500, function () {
                burglar.arrested = true;
                burglar.position = 135;

                app.checkGameOver();
            });
        },
        
        catchBurglarWithPathList: function (pathList) {
            app.burglarList.filter(burglar => pathList.includes(burglar.position))
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

            if ($block.find('.jewelry').length === 2) {
                alert('도둑 승리');
                location.reload();
            }

            setTimeout(function () {
                app.blinkJewelry(currentBurglar.jewelryIndex, false);

                if (callNextTurn) {
                    app.nextTurn();
                }
            }, 1000)
        },
        
        move: function (selectedBlock) {
            let $selectedBlockElement = app.getBlockElement(selectedBlock.index);

            if (app.status.trickMode) {
                this.processTrickDirection(selectedBlock);
                return;
            }

            let $currentCharacter = app.getCurrentCharacterElement();
            let offset = app.status.turn * 30;

            let left = $selectedBlockElement.offset().left + offset;
            let top = $selectedBlockElement.offset().top;

            if (app.status.runMode) {
                left = $currentCharacter.offset().left;
                top = $currentCharacter.offset().top;
            }

            $currentCharacter.animate({
                left: left,
                top: top,
            }, 500, function () {
                app.getCurrentCharacter().position = selectedBlock.index;
                app.backgroundInactive();
                app.removeBlinkBlock();
                app.removeRippleCharacter();

                app.removeTrick(selectedBlock);
                app.removeTrickList();

                let pathList = app.status.blockPathList
                    .filter(target => target.index === selectedBlock.index)
                    .map(target => target.path)[0];
                
                console.log('>>> pathList', pathList);

                if (app.status.policeTurn && !app.status.runMode && !app.status.runModeComplete) {
                    if (app.status.movePoliceMode ||
                        app.status.changePoliceMode ||
                        app.status.missionPoliceMode) {
                        pathList = [selectedBlock.index];
                    }

                    app.catchBurglarWithPathList(pathList);
                }

                $('.trick').removeClass('blink');

                if (app.status.runMode) {
                    app.status.blockPathList = [];

                    app.go(app.status.runCount, app.status.runCount, selectedBlock.index, selectedBlock.index, []);

                    app.backgroundActive();

                    let blockIndexList = app.status.blockPathList
                        .map(target => target.index);

                    app.blinkBlock(blockIndexList);
                    app.status.runMode = false;
                    app.status.runModeComplete = true;
                    return;
                } else if (app.status.changeBurglarMode) {
                    app.status.changeBurglarMode = false;
                    app.nextTurn();
                } else if (app.status.changePoliceMode && !app.status.runModeComplete) {
                    app.status.changePoliceMode = false;
                    app.nextTurn();
                } else if (app.status.missionBurglarMode) {
                    app.status.missionBurglarMode = false;
                    app.nextTurn();
                } else if (app.status.missionPoliceMode && !app.status.runModeComplete) {
                    app.status.missionPoliceMode = false;
                    app.nextTurn();
                } else if (app.status.moveBurglarMode) {
                    app.status.moveBurglarMode = false;
                    app.nextTurn();
                } else if (app.status.movePoliceMode && !app.status.runModeComplete) {
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
                } else if (selectedBlock.changePolice && app.status.policeTurn && !app.status.runModeComplete) {
                    let indexList = app.blockList.filter(target => target.changePolice)
                        .filter(target => target.index !== selectedBlock.index)
                        .map(target => target.index);

                    app.backgroundActive();
                    app.blinkBlock(indexList);
                    app.status.changePoliceMode = true;
                } else if (selectedBlock.moveBurglar && app.status.burglarTurn) {
                    app.status.moveBurglarMode = true;
                    app.moveByIndex(selectedBlock.move);
                } else if (selectedBlock.movePolice && app.status.policeTurn && !app.status.runModeComplete) {
                    app.status.movePoliceMode = true;
                    app.moveByIndex(selectedBlock.move);
                } else if (selectedBlock.mission && app.status.burglarTurn) {
                    app.status.missionBurglarMode = true;
                    app.moveByIndex(pathList[pathList.length - selectedBlock.move - 1]);
                } else if (selectedBlock.mission && app.status.policeTurn && !app.status.runModeComplete) {
                    app.status.missionPoliceMode = true;
                    app.moveByIndex(pathList[pathList.length - selectedBlock.move - 1]);
                } else if (selectedBlock.run && app.status.policeTurn && !app.status.runModeComplete) {
                    app.status.runCount = selectedBlock.move;
                    app.status.runMode = true;
                    app.backgroundActive();

                    let indexList = app.burglarList
                        .filter(target => !target.arrested)
                        .map(target => target.position);

                    app.blinkBlock(indexList);
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
                    app.nextTurn();
                } else if (selectedBlock.goHome) {
                    let $burglarStartBlock = $('.block[data-index=0]');
                    let $policeStartBlock = $('.block[data-index=135]');

                    $('.policeCharacter').each(function () {
                        $(this).animate({
                            left: $policeStartBlock.offset().left + 30 * $(this).attr('data-index'),
                            top: $policeStartBlock.offset().top
                        }, 1000);
                    });

                    var count = 0;

                    let $burglarCharacter = $('.burglarCharacter');
                    
                    console.log('>>> $burglarCharacter.length', $burglarCharacter.length);
                    
                    $burglarCharacter.each(function () {
                        $(this).animate({
                            left: $burglarStartBlock.offset().left + 30 * $(this).attr('data-index'),
                            top: $burglarStartBlock.offset().top
                        }, 1000, function () {
                            count++;

                            if (count == 3) {
                                app.burglarList.forEach(bruglar => app.checkSteal(bruglar, false));
                                app.nextTurn();
                            }
                        });
                    });
                } else if (selectedBlock.onlyBurglar) {
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

                app.status.runModeComplete = false;
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

        catchBurglar: function (event) {
            let index = $(event.target).attr('data-index');
            let burglar = app.burglarList.filter(target => target.index == index)[0];
            app.catchBurglarWithPathList([burglar.position]);
            app.removeRippleCharacter();
            app.nextTurn();
        },

        resetTrickIndexList: function () {
            app.status.trickIndexList = [];
        },

        removeTrick: function (selectedBlock) {
            selectedBlock.trickDirection = null;
            selectedBlock.trickDirectionIcon = null;
        },

        removeTrickList: function (selectedBlock) {
            app.status.trickIndexList.map(index => app.getBlock(index))
                .forEach(target => app.removeTrick(target));

            app.resetTrickIndexList();
        },

        threat: function (callback) {
            let currentJewelryList = app.jewelryList
                .filter(jewelry => jewelry.steal === false);

            if (currentJewelryList.length > 0) {
                let currentJewelry = currentJewelryList[0];
                let index = currentJewelry.index;
                let $jewelry = $('.jewelry').eq(index).show();

                currentJewelry.classObject.blink = true;

                setTimeout(() => {
                    alert('확인하였습니까?');
                    callback();
                    currentJewelry.classObject.blink = false;
                    $jewelry.hide();
                    app.status.threatCount = 1;
                }, 3000);

                return;
            }

            callback();
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
                $target = $('.jewelry').eq(app.status.hideJewelryCount);
                building.jewelryIndex = app.status.hideJewelryCount;
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
                    app.blinkJewelry(app.status.hideJewelryCount, false);

                    if (app.status.hideJewelryCount === 0) {
                        app.blinkJewelry(app.status.hideJewelryCount + 1, true);
                    }

                    app.status.hideJewelryCount++;
                }

                if (app.status.hideJewelryCount === 2) {
                    if (app.status.hidePoliceMode) {
                        if (confirm('이대로 진행하시겠습니다까?')) {
                            app.readyToPlay();
                        } else {
                            location.reload();
                        }
                    } else {
                        app.status.hidePoliceMode = true;
                        app.hiddenPolice.classObject.roundBlink = true;
                    }
                }
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

            app.hideTurnModal();

            $newTurnImage.animate({
                left: $currentCharacterElement.offset().left,
                top: $currentCharacterElement.offset().top,
                width: '30px',
                height: '30px'
            }, 500, function () {
                $newTurnImage.remove();

                callback();
            });
        },

        hideTurnModal: function () {
            app.getTurnModalElement().modal('hide');
        },

        getTurnModalElement: function () {
            return $('#turnModal');
        },

        rollDie: function () {
            $('.turnImage').attr('src', app.getCharacterImage());

            let $turnModal = app.getTurnModalElement().modal();
            let $restCountButton = $('.btn-rest-count');
            let $restButton = $('.btn-rest');
            let $trickButton = $('.btn-select-block-for-trick');
            let $arrestTile = $('.arrest-title');

            $restCountButton.hide();
            $restButton.hide();
            $trickButton.hide();
            $arrestTile.hide();

            let currentBurglar = app.getCurrentBurglar();

            if (app.status.burglarTurn) {
                $restCountButton.text(`쉰 횟수: ${currentBurglar.rest}`).show();
                let currentBlock = app.getBlock(currentBurglar.position);

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
                let currentPosition = app.getCurrentCharacter().position;
                let currentBlock = app.getBlock(currentPosition);

                if (currentBlock.arrest) {
                    $arrestTile
                        .text('주사위를 던져 ' + currentBlock.dice + '이면 도둑을 체포할 수 있습니다.')
                        .show();
                }
            }

            let $die = $('#die');

            if (die == null) {
                die = new Die(function (count) {
                    if (countForDebug) {
                        count = countForDebug;
                    }

                    app.moveToTurn(function () {
                        if (app.status.policeTurn) {
                            let currentPolice = app.getCurrentPolice();
                            let currentBlock = app.getBlock(currentPolice.position);

                            if (currentBlock.arrest) {
                                if (currentBlock.dice === count) {
                                    alert('도둑을 체포합니다.\n체포할 도둑을 선택하세요.');

                                    app.status.catch = true;

                                    app.burglarList.filter(target => target.arrested === false)
                                        .forEach(target => {
                                            target.classObject.burglarRipple = true;
                                            target.classObject.selectable = true;
                                            Vue.set(app.burglarList, target.index, target);
                                        });
                                } else {
                                    alert('도둑을 체포하지 못했습니다.');
                                }

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

                        let currentCharacter = app.getCurrentCharacter();
                        app.status.blockPathList = [];

                        app.go(count, count, currentCharacter.position, currentCharacter.position, []);

                        app.backgroundActive();

                        let blockIndexList = app.status.blockPathList
                            .map(target => target.index);

                        app.blinkBlock(blockIndexList);

                        app.status.trickIndexList.forEach(index => {
                            $('.block[data-index=' + index + ']')
                                .find('.trick')
                                .addClass('blink');
                        });

                        if (app.status.burglarTurn) {
                            currentCharacter.classObject.burglarRipple = true;
                        } else {
                            currentCharacter.classObject.policeRipple = true;
                        }
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

        readyToPlay: function () {
            app.background.classObject.backgroundActive = false;
            app.resetBuilding();

            app.burglarList.forEach((target) => target.styleObject.display = 'block');
            app.policeList.forEach((target) => target.styleObject.display = 'block');
            app.jewelryList.forEach((target) => target.styleObject.display = 'none');
            app.hiddenPolice.styleObject.display = 'none';

            app.rollDie();
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
            list.forEach(target => target.classObject.blink = false);
        },

        removeRipple: function (list) {
            list.forEach(target => target.classObject.burglarRipple = false);
            list.forEach(target => target.classObject.policeRipple = false);
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

            if (app.status.policeTurn) {
                if (currentBlock.onlyBurglar) {
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

        getDirection: function(block) {
            if (block.backward) {
                return '뒤';
            }

            return "앞";
        },
        getSubTitle: function (block) {
            const direction = this.getDirection(block);

            if (block.mission) {
                return `${block.move}칸 뒤로 가서 지시에 따른다.`;
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
            } else if (block.send) {
                return `도둑은 보석을 동료에게 넘겨준다`;
            } else if (block.tunnel || block.changePosition) {
                return `${block.move}로 이동`;
            }

            return block.subTitle;
        }
    },
    created: function () {
        this.blockList = this.blockList.map((block) => {
            if (block.buildingIndex === undefined) {
                block.buildingIndex = null;
            }

            return {
                ...block,
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

    app.blinkJewelry(app.status.hideJewelryCount, true)

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
