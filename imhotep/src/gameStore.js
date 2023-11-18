import {writable} from "svelte/store";
import game from "./game"

const { subscribe, set, update } = writable(game);

let gameStore = {
    subscribe,
    set,
    update
};

gameStore = {
    ...gameStore,
    load: (boat) => {
        update(game => {
            const player = gameStore.currentPlayer(game);

            player.stoneList = player.stoneList
                .map((stone, index) => {
                    if (stone.status === 'ready') {
                        const left = boat.element.offsetLeft - boat.element.clientLeft;
                        const top = 0;
                        stone.style = `left: ${index * 50}px;transform: translate(${left}px, ${top}px);`
                        stone.status = 'loaded';
                        stone.left = left;
                        stone.top = top;
                        loadedCount++;
                    } else {
                        stone.style = `left: ${(index - 1) * 50}px`;
                    }

                    return stone;
                })

            return game;
        });
    },
    loadEnd: (boat) => {
        update(game => {
            const player = gameStore.currentPlayer(game);

            player.stoneList = player.stoneList
                .map((stone, index) => {
                    if (index === 0) {
                        const left = boat.element.offsetLeft - boat.element.clientLeft;
                        const top = 0;
                        stone.style = `left: ${index * 50}px;transform: translate(${left}px, ${top}px);`
                    } else {
                        stone.style = `left: ${(index - 1) * 50}px`;
                    }

                    console.log('>>> stone', stone);

                    return stone;
                })

            return game;
        });
    },
    currentPlayer: (game) => {
        return game.playerList[game.currentPlayerIndex];
    }
}

export default gameStore;