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
                    if (index === 0) {
                        const left = boat.element.offsetLeft - boat.element.clientLeft;
                        const top = 0;
                        stone.style = `left: ${index * 50}px;transform: translate(${left}px, ${top}px);`
                        stone.status = 'loaded';
                        stone.animating = true;
                        stone.element.addEventListener('transitionend', () => gameStore.loadEnd(stone, boat));
                    }

                    return stone;
                })

            return game;
        });
    },
    loadEnd: (stone, boat) => {
        if (stone.animating === false) {
            return;
        }

        update(game => {
            const player = gameStore.currentPlayer(game);

            const stone = player.stoneList.pop();

            player.stoneList = player.stoneList
                .filter((stone, index) => index !== 0)

            game.boatList = game.boatList
                .map(currentBoat => {
                    if (currentBoat.index === boat.index) {
                        currentBoat.stoneList = [...currentBoat.stoneList, stone]
                            .map((currentStone, i) => currentStone.style = `left:${50 * i}px`)
                    }

                    return currentBoat;
                })

            return game;
        });

        stone.animating = false;

        stone.element.removeEventListener('transitionend', () => gameStore.loadEnd(stone));
    },
    currentPlayer: (game) => {
        return game.playerList[game.currentPlayerIndex];
    }
}

export default gameStore;