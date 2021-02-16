import {writable} from "svelte/store";
import config from './config.js'
import { shuffle, random } from './util.js'

const resourceList = [];

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

let numberList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
numberList = shuffle(numberList);

resourceList.map((resource, index) => {
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
            left = config.cell.width + config.cell.width * index;
        } else if (3 <= index && index <= 6) {
            left = config.cell.width / 2 + config.cell.width * (index - 3);
            top = 3 * config.cell.height / 4;
        } else if (7 <= index && index <= 11) {
            left = config.cell.width * (index - 7);
            top = 2 * (3 * config.cell.height / 4);
        } else if (12 <= index && index <= 15) {
            left = config.cell.width / 2 + config.cell.width * (index - 12);
            top = 3 * (3 * config.cell.height / 4);
        } else if (16 <= index && index <= 18) {
            left = config.cell.width * (index - 15);
            top = 4 * (3 * config.cell.height / 4);
        }

        resource.left = left;
        resource.top = top;

        return resource;
    });

const { subscribe, set, update } = writable(resourceList);

const resourceListStore = {
    subscribe
};

export default resourceListStore;