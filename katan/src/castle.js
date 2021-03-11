import katanStore from './katan.js'

export const setHideCastle = () => katanStore.update(katan => {
    katan.castleList =  katan.castleList
        .map(castle => {
            if (castle.playerIndex === -1) {
                castle.show = false;
                castle.hide = true;
            }

            return castle;
        });

    return katan;
});

export const setNewCityRippleEnabled = () => katanStore.update(katan => {
    const player = katanStore.getActivePlayer();

    katan.castleList = katan.castleList.map(castle => {
        if (castle.playerIndex === player.index &&
            castle.city === false) {
            castle.ripple = true;
            castle.hide = false;
            castle.show = true;
        }

        return castle;
    });

    return katan;
});

export const endMakeCastle = () => katanStore.update(katan => {
    katan.isMakeCastle = false;
    katanStore.doActionAndTurn();
    return katan;
});

export const endMakeCity = (castleIndex) => katanStore.update(katan => {
    katan.isMakeCity = false;
    katanStore.doActionAndTurn();
    return katan;
});