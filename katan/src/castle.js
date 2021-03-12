import katanStore from './katan.js'
import {setNewCastleRippleEnabled} from "./card";

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

export const getPossibleCastleIndexList = (katan) => {
    return katan.castleList
        .filter(castle => castle.playerIndex === -1)
        .map(castle => {
            const castleLength = castle.castleIndexList
                .filter(castleIndex => katan.castleList[castleIndex].playerIndex === -1)
                .length;

            if (castleLength === castle.castleIndexList.length) {
                const castleLength = castle.roadIndexList
                    .filter(roadIndex => {
                        const road = katan.roadList[roadIndex];
                        return road.playerIndex === katan.playerIndex
                    })
                    .length;

                if (castleLength > 0) {
                    return castle.index;
                }
            }

            return -1;
        })
        .filter(index => index >= 0);
};

export const makeCastle = () => katanStore.update(katan => {
        katan.isMakeCastle = true;
        setNewCastleRippleEnabled();

        return katan;
});

export const makeCity = () => katanStore.update(katan => {
    katan.isMakeCity = true;
    setNewCityRippleEnabled();

    return katan;
});