import katanStore from './katan.js'
import {setNewCastleRippleEnabled} from "./card";
import {setRoadRippleEnabled} from "./road";

const setHideCastle = () => katanStore.update(katan => {
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

const setNewCityRippleEnabled = () => katanStore.update(katan => {
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

const endMakeCastle = () => katanStore.update(katan => {
    katan.isMakeCastle = false;
    katanStore.doActionAndTurn();
    return katan;
});

const endMakeCity = (castleIndex) => katanStore.update(katan => {
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

export const setCastleRippleDisabled = () => katanStore.update(katan => {
    katan.castleList = katan.castleList.map(castle => {
        castle.ripple = false;
        return castle;
    });

    return katan;
});

export const castleClickable = (katan, castleIndex) => {
    const player = katanStore.getActivePlayer();
    const castle = katan.castleList[castleIndex];

    if (katan.isMakeCity) {
        if (castle.city || castle.playerIndex !== player.index) {
            return false;
        }
    } else {
        if (castle.playerIndex !== -1) {
            return false;
        }
    }

    return true;
};

export const clickMakeCastle = (castleIndex) => katanStore.update(katan => {
    if (!castleClickable(katan, castleIndex)) {
        return katan;
    }

    const player = katanStore.getActivePlayer();
    setCastle(castleIndex, player.index);
    setHideCastle();
    setCastleRippleDisabled();

    if (katan.isMakeCastle) {
        endMakeCastle();
    } else if (katan.isMakeCity){
        endMakeCity(castleIndex);
    } else {
        setRoadRippleEnabled(castleIndex);
    }

    return katan;
});

const setCastle = (castleIndex, playerIndex) => katanStore.update(katan => {
    let castle = katan.castleList[castleIndex];
    castle.playerIndex = playerIndex;
    castle.pick = false;

    if (katan.isMakeCity) {
        castle.title = '도시';
    } else {
        castle.title = '마을';
    }

    const player = katan.playerList[playerIndex];
    player.pickCastle += 1;
    katan.time = new Date().getTime();

    if (katan.isMakeCity) {
        player.resource.wheat -= 2;
        player.resource.iron -= 3;

        player.point.castle -= 1;
        player.point.city += 2;

        player.construction.castle += 1;
        player.construction.city -= 1;

        katan.castleList = katan.castleList
            .map(castle => {
                if (castle.index === castleIndex) {
                    castle.city = true;
                }

                return castle;
            });
    } else {
        if (katan.isStart) {
            player.resource.tree -= 1;
            player.resource.mud -= 1;
            player.resource.sheep -= 1;
            player.resource.wheat -= 1;
        }

        player.point.castle += 1;

        player.construction.castle -= 1;
    }

    if (castle.port.tradable) {
        if (castle.port.type === 'all') {
            katan.resourceTypeList
                .forEach(resourceType => {
                    if (player.trade[resourceType.type].count > castle.port.trade) {
                        player.trade[resourceType.type].count = castle.port.trade;
                    }
                });
        } else {
            player.trade[castle.port.type].count = castle.port.trade;
        }
    }

    return katan;
});

export const showConstructableCastle = () => katanStore.update(katan => {
    katan.message = '마을을 만들곳을 클릭하세요';

    katan.castleList = katan.castleList.map(castle => {
        if (castle.constructable && castle.playerIndex === -1) {
            let linkedCastleLength = castle.castleIndexList
                .filter(castleIndex => katan.castleList[castleIndex].playerIndex !== -1)
                .length;

            if (linkedCastleLength === 0) {
                castle.show = true;
                castle.hide = false;
            }
        }

        return castle;
    });

    return katan;
});