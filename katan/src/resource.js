import katanStore from './katan.js'
import jQuery from 'jquery';
import {random} from "./util";
import {recomputePlayer} from "./player";

export const animateMoveResource = (option) => {
    option = Object.assign({
        count: 1,
        speed: 1000,
        callback: () => {}
    }, option);

    console.log('>>> option', option);

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

    setTimeout(() => {
        const animationCss = Object.assign({
            left: targetOffset.left + 'px',
            top: targetOffset.top + 'px'
        }, option.animationCss);

        newResourceItem.animate(animationCss,
            option.speed,
            () => {
                newResourceItem.remove();
                option.callback();
            });
    }, ((option.count - 1) * 1000) + 10)
};

export const moveResource = (number) => katanStore.update(katan => {
    let matchResourceCount = 0;
    let moveResourceCount = 0;

    katan.resourceList
        .filter(resource => resource.number === number)
        .filter(resource => !resource.buglar)
        .forEach(resource => {
            resource.castleIndexList.forEach(castleIndex => {
                const castle = katan.castleList[castleIndex];
                const playerIndex = castle.playerIndex;

                if (playerIndex !== -1) {
                    matchResourceCount++;
                    resource.show = true;

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
    let count = 1;

    if (castle.city) {
        count = 2;
    }

    katan.playerList[playerIndex].resource[resource.type] += count;


    recomputePlayer();
    return katan;
});

export const takeResource = () => katanStore.update(katan => {
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

        animateMoveResource({
            sourceClass,
            targetClass,
            count: 1,
            callback: () => {
                updateTakeResource(resource);
                katanStore.unsetKnightMode();

                if (katan.isGetResourceFormOtherPlayer) {
                    katan.getResourceCount += 1;

                    if (katan.getResourceCount === 1) {
                        takeResource();
                    } else if (katan.getResourceCount > 1) {
                        katan.isGetResourceFormOtherPlayer = false;
                        katan.getResourceCount = 0;
                        katanStore.doActionAndTurn();
                    }
                } else {
                    katanStore.doActionAndTurn();
                }
            }
        });
    } else {
        if (katan.isGetResourceFormOtherPlayer) {
            katan.isGetResourceFormOtherPlayer = false;
            katan.getResourceCount = 0;
        }

        katanStore.unsetKnightMode();
        katanStore.doActionAndTurn();
    }

    return katan;
});

const updateTakeResource = (resource) => katanStore.update(katan => {
    const player = katanStore.getActivePlayer();
    const other = katanStore.getOtherPlayer(katan);

    other.resource[resource.type] = other.resource[resource.type] - 1;
    player.resource[resource.type] = player.resource[resource.type] + 1;

    return katan;
});