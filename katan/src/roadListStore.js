import {writable} from "svelte/store";
import config from './config.js'

const roadList = [];

for (let i = 0; i <= 11; i++) {
    for (let j = 0; j <= 20; j++) {
        if (i === 0 || i === 11) {
            if (j === 5 || j === 7 || j === 9 || j === 11 || j === 13 || j === 15) {
                let top = getLoadTop(i, 11, 1, 31);

                roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    loadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 1 || i === 10) {
            if (j === 4 || j === 8 || j === 12 || j === 16) {
                let top = getLoadTop(i, 10, 4, 28);

                roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    loadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j

                });
            }
        } else if (i === 2 || i === 9) {
            if (j === 3 || j === 5 || j === 7 || j === 9 ||
                j === 11 || j === 13 || j === 15 || j === 17) {
                let top = getLoadTop(i, 9, 7, 25);

                roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    loadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 3 || i === 8) {
            if (j === 2 || j === 6 || j === 10 || j === 14 || j === 18) {

                let top = getLoadTop(i, 8, 10, 22);

                roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    loadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 4 || i === 7) {
            if (j === 1 || j === 3 || j === 5 || j === 7 || j === 9 ||
                j === 11 || j === 13 || j === 15 || j === 17 || j === 19) {

                let top = getLoadTop(i, 7, 13, 19);

                roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    loadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 5) {
            if (j === 0 || j === 4 || j === 8 || j === 12 || j === 16 || j === 20) {

                let top = getLoadTopBySingle(8);

                roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    loadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        }
    }
}

const { subscribe, set, update } = writable(roadList);

const roadListStore = {
    subscribe,

    setRippleEnabled: update(list => {
        return list.map(road => {
            road.ripple = true;
            return road;
        });
    })
};

export default roadListStore;