import {writable} from "svelte/store";
import config from './config.js'
import { getDisplay } from './util.js'

const castleList = [];

for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 11; j++) {
        if (i === 0 || i === 5) {
            if (j >= 2 && j <= 8) {
                let top = 0;

                if (i === 5) {
                    top = i * (3 * config.cell.height / 4);
                }

                if (j % 2 === i % 2) {
                    top += config.cell.height / 4
                }

                castleList.push({
                    left: j * (config.cell.width / 2) - config.castle.width / 2,
                    top: top - config.castle.height / 2,
                    ripple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 1 || i === 4) {
            if (j >= 1 && j <= 9) {
                let top = (3 * config.cell.height / 4);

                if (i === 4) {
                    top = i * (3 * config.cell.height / 4);
                }

                if (j % 2 === i % 2) {
                    top += config.cell.height / 4
                }

                const constructable = j >= 3 && j <= 7;

                castleList.push({
                    left: j * (config.cell.width / 2) - config.castle.width / 2,
                    top: top - config.castle.height / 2,
                    ripple: constructable,
                    constructable: constructable,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 2 || i === 3) {
            let top = 2 * (3 * config.cell.height / 4);

            if (i === 3) {
                top = i * (3 * config.cell.height / 4);
            }

            if (j % 2 === i % 2) {
                top += config.cell.height / 4
            }

            const constructable = j >= 2 && j <= 8;

            castleList.push({
                left: j * (config.cell.width / 2) - config.castle.width / 2,
                top: top - config.castle.height / 2,
                ripple: constructable,
                constructable: constructable,
                empty: true,
                i,
                j
            });
        }
    }
}

const { subscribe, set, update } = writable(castleList);

export const castleListStore = {
    subscribe,

    setRippleDisabled: update(list => {
        return list.map(castle => {
            castle.ripple = false;
            return castle;
        });
    })
};