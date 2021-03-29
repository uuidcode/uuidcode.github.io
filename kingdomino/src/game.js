import {writable} from "svelte/store";
import {shuffle} from "./util";

const setResource = (resource, resourceType) => {
    gameObject.resourceTypeList.forEach(item => {
        resource[item] = item === resourceType;
    });

    return resource;
};

const gameObject = {
    resourceTypeList: [
        'sea',
        'forest',
        'mud',
        'cave',
        'field',
        'wheat'
    ],
    resourceCardList:[]
};

let totalResourceTypeList = [];
let totalCrownList = [];

for (let i = 0; i < 16; i++) {
    gameObject.resourceTypeList
        .forEach(item => {
            totalResourceTypeList.push(item);
            totalCrownList.push(0);
        })
}

totalCrownList[0] = 3;
totalCrownList[1] = 3;

totalCrownList[2] = 2;
totalCrownList[3] = 2;
totalCrownList[4] = 2;
totalCrownList[5] = 2;

totalCrownList[6] = 1;
totalCrownList[7] = 1;
totalCrownList[8] = 1;
totalCrownList[9] = 1;
totalCrownList[10] = 1;
totalCrownList[11] = 1;
totalCrownList[12] = 1;
totalCrownList[13] = 1;

totalResourceTypeList = shuffle(totalResourceTypeList);
totalCrownList = shuffle(totalCrownList);

for (let i = 0; i < 48; i++) {
    const resourceList = [];

    for (let j = 0; j < 2; j++) {
        let resource = {
            crown: totalCrownList.pop()
        };

        resource = setResource(resource, totalResourceTypeList.pop());

        resourceList.push(resource);
    }

    gameObject.resourceCardList.push({
        resourceList
    });
}

export default writable(gameObject)