const katan = {
    dice: [6, 6],
    playerList: [
        {
            turn: true,
            resource: {
                tree: 0,
                mud: 0,
                wheat: 0,
                sheep: 0,
                iron: 0
            }
        },
        {
            turn: false,
            resource: {
                tree: 0,
                mud: 0,
                wheat: 0,
                sheep: 0,
                iron: 0
            }
        }
    ]
};

function random() {
    return () => Math.random() - 0.5;
}

function shuffle(list) {
    return list.sort(random());
}

let resourceList = [];

resourceList.push({
    type: 'dessert'
});

for (let i = 0; i < 4; i++) {
    resourceList.push({
        type: 'tree'
    });

    resourceList.push({
        type: 'iron'
    });

    resourceList.push({
        type: 'sheep'
    });
}

for (let i = 0; i < 3; i++) {
    resourceList.push({
        type: 'mud'
    });

    resourceList.push({
        type: 'wheat'
    });
}

katan.resourceList = resourceList;

katan.turn = () => {
    katan.playerList
        .forEach(player => {
            player.turn = !player.turn
        });
};

let numberList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
numberList = shuffle(numberList);

katan.resourceList = katan.resourceList
    .map((resource, index) => {
        if (resource.type === 'dessert') {
            resource.number = 7;
        } else {
            resource.number = numberList.pop();
        }

        return resource;
    })
    .sort(random())
    .map((resource, index) => {
        let left = 0;
        let top = 0;

        if (0 <= index && index <= 2) {
            left = 100 + 100 * index;
        } else if (3 <= index && index <= 6) {
            left = 50 + 100 * (index - 3);
            top = 100;
        } else if (7 <= index && index <= 11) {
            left = 100 * (index - 7);
            top = 200;
        } else if (12 <= index && index <= 15) {
            left = 50 + 100 * (index - 12);
            top = 300;
        } else if (16 <= index && index <= 18) {
            left = 100 * (index - 15);
            top = 400;
        }

        resource.left = left;
        resource.top = top;

        return resource;
    });

export default katan;