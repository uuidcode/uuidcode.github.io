import katanStore from './katan.js'
import jQuery from 'jquery';
import {random, shuffle} from "./util";
import {recomputePlayer} from "./player";
import config from "./config";

export const createResourceList = () => {
    let resourceList = [];

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

    resourceList.forEach(resource => {
        resource.hide = true;
        resource.show = false;
        resource.numberRipple = false;
    });

    let numberList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    numberList = shuffle(numberList);

    resourceList = resourceList
        .map((resource, index) => {
            if (resource.type === 'dessert') {
                resource.number = 7;
                resource.numberIndex = 1;
            } else {
                resource.number = numberList.pop();

                if (resource.number === 2 || resource.number === 12) {
                    resource.numberIndex = 1;
                } else {
                    if (numberList.includes(resource.number)) {
                        resource.numberIndex = 1;
                    } else {
                        resource.numberIndex = 2;
                    }
                }
            }

            resource.burglar = false;

            if (resource.number === 7) {
                resource.burglar = true;
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
            resource.index = index;

            if (resource.index === 0) {
                resource.castleIndexList = [0, 1, 2, 8, 9, 10];
            } else if (resource.index === 1) {
                resource.castleIndexList = [2, 3, 4, 10, 11, 12];
            } else if (resource.index === 2) {
                resource.castleIndexList = [4, 5, 6, 12, 13, 14];
            } else if (resource.index === 3) {
                resource.castleIndexList = [7, 8, 9, 17, 18, 19];
            } else if (resource.index === 4) {
                resource.castleIndexList = [9, 10, 11, 19, 20, 21];
            } else if (resource.index === 5) {
                resource.castleIndexList = [11, 12, 13, 21, 22, 23];
            } else if (resource.index === 6) {
                resource.castleIndexList = [13, 14, 15, 23, 24, 25];
            } else if (resource.index === 7) {
                resource.castleIndexList = [16, 17, 18, 27, 28, 29];
            } else if (resource.index === 8) {
                resource.castleIndexList = [18, 19, 20, 29, 30, 31];
            } else if (resource.index === 9) {
                resource.castleIndexList = [20, 21, 22, 31, 32, 33];
            } else if (resource.index === 10) {
                resource.castleIndexList = [22, 23, 24, 33, 34, 35];
            } else if (resource.index === 11) {
                resource.castleIndexList = [24, 25, 26, 35, 36, 37];
            } else if (resource.index === 12) {
                resource.castleIndexList = [28, 29, 30, 38, 39, 40];
            } else if (resource.index === 13) {
                resource.castleIndexList = [30, 31, 32, 40, 41, 42];
            } else if (resource.index === 14) {
                resource.castleIndexList = [32, 33, 34, 42, 43, 44];
            } else if (resource.index === 15) {
                resource.castleIndexList = [34, 35, 36, 44, 45, 46];
            } else if (resource.index === 16) {
                resource.castleIndexList = [39, 40, 41, 47, 48, 49];
            } else if (resource.index === 17) {
                resource.castleIndexList = [41, 42, 43, 49, 50, 51];
            } else if (resource.index === 18) {
                resource.castleIndexList = [43, 44, 45, 51, 52, 53];
            }

            return resource;
        });
    
    return resourceList;
};

export const animateMoveResource = (option) => {
    return new Promise((resolve => {
        option = Object.assign({
            count: 1,
            speed: 1000,
            callback: () => {}
        }, option);

        const sourceItem = jQuery('.' + option.sourceClass);
        const visible = katanStore.isVisible(sourceItem);

        if (!visible) {
            sourceItem.show();
        }

        const targetItem = jQuery('.' + option.targetClass);
        const sourceOffset = sourceItem.offset();
        const targetOffset = targetItem.offset();

        const body = jQuery('body');
        const newResourceItem = sourceItem.clone()
            .removeClass(option.sourceClass);

        newResourceItem.appendTo(body)
            .css({
                left: sourceOffset.left + 'px',
                top: sourceOffset.top + 'px',
                position: 'absolute'
            });

        if (!visible) {
            sourceItem.hide();
        }

        const animationCss = Object.assign({
            left: targetOffset.left + 'px',
            top: targetOffset.top + 'px'
        }, option.animationCss);

        newResourceItem.animate(animationCss,
            option.speed,
            () => {
                console.log('>>> animateMoveResource');
                newResourceItem.remove();
                return resolve();
            });
    }));
};

export const moveResource = (number) => katanStore.update(katan => {
    let matchResourceCount = 0;
    let moveResourceCount = 0;

    katan.resourceList
        .filter(resource => resource.number === number)
        .filter(resource => !resource.burglar)
        .forEach(resource => {
            resource.castleIndexList.forEach(castleIndex => {
                const castle = katan.castleList[castleIndex];
                const playerIndex = castle.playerIndex;

                if (playerIndex !== -1) {
                    resource.show = true;

                    let resourceCount = 1;

                    if (castle.city) {
                        resourceCount = 2
                    }

                    for (let i = 0; i < resourceCount; i++) {
                        matchResourceCount++;

                        animateMoveResource({
                            sourceClass: `resource_${resource.index}`,
                            targetClass: `player_${playerIndex}_${resource.type}`,
                            count: matchResourceCount,
                            callback: () => {
                                updateResource(castle, playerIndex, resource);
                                moveResourceCount++;
                            }
                        });
                    }
                }
            });
        });

    if (matchResourceCount > 0) {
        const interval = setInterval(() => {
            if (moveResourceCount === matchResourceCount) {
                clearInterval(interval);
                katanStore.doActionAndTurn();
            }
        }, 100);
    } else {
        katanStore.doActionAndTurn();
    }

    return katan;
});

export const updateResource = (castle, playerIndex, resource) => katanStore.update(katan => {
    katan.playerList[playerIndex].resource[resource.type] += 1;
    recomputePlayer();
    return katan;
});

export const takeResource = () => {
    katanStore.update(async (katan) => {
        const other = katanStore.getOtherPlayer(katan);

        let resourceTypeList = katan.resourceTypeList
            .map(resourceType => {
                return {
                    type: resourceType.type,
                    count: other.resource[resourceType.type]
                }
            });

        resourceTypeList = resourceTypeList
            .filter(item => item.count > 0)
            .sort(random());

        if (resourceTypeList.length > 0) {
            const resource = resourceTypeList[0];
            const player = katanStore.getActivePlayer();

            const playerIndex = player.index;
            const otherPlayerIndex = other.index;

            const sourceClass = `player_${otherPlayerIndex}_${resource.type}`;
            const targetClass = `player_${playerIndex}_${resource.type}`;

            await animateMoveResource({
                sourceClass,
                targetClass
            });
        }

        if (katan.isGetResourceFormOtherPlayer) {
            katan.isGetResourceFormOtherPlayer = false;
        } else if (katan.isBurglarMode) {
            katan.isBurglarMode = false;
        } else if (katan.isKnightMode) {
            katan.isKnightMode = false;
        }

        return katan;
    });
};

const updateTakeResource = (resource) => katanStore.update(katan => {
    const player = katanStore.getActivePlayer();
    const other = katanStore.getOtherPlayer(katan);

    other.resource[resource.type] = other.resource[resource.type] - 1;
    player.resource[resource.type] = player.resource[resource.type] + 1;

    return katan;
});