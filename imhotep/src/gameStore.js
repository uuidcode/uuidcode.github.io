import {writable} from "svelte/store";
import game from "./game"

const { subscribe, set, update } = writable(game);

let gameStore = {
    subscribe,
    set,
    update
};

const u = (callback) => {
    update(game => {
        callback(game);
        return game;
    });
};

gameStore = {
    ...gameStore,
    moveStone: (targetStone, x, y) => {
        console.log('>>> targetStone', targetStone);

        u((game) => {
            const player = game.playerList[game.currentPlayerIndex];
            player.stoneList = player.stoneList
                .map(stone => {
                    if (stone.index === targetStone.index) {
                        stone.style = `transform: translate(${x}px, ${y}px);`
                    }

                    return stone;
                })
        });
    }
}

export default gameStore;