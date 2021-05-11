import jQuery from "jquery";

export const camelToDash = str => str.replace(/([A-Z])/g, val => `-${val.toLowerCase()}`);

export const getDisplay = condition => {
    if (condition === true) {
        return 'show';
    }

    return 'hide';
};

export function toStyle (styleObject) {
    let style = '';

    Object.entries(styleObject)
        .forEach(([key, value]) => {
            let cssKey = camelToDash(key);
            style += `${cssKey}:${value};`
        });

    return style;
}

export const shuffle = list => {
    return list.sort(random());
};

export const cloneAndShuffle = list => {
    return [...list].sort(random());
};

export const random = () => {
    return () => Math.random() - 0.5;
};

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
};

export const move = (option) => {
    console.log('>>> move option', option);

    return new Promise((resolve => {
        option = Object.assign({
            count: 1,
            speed: 1000,
            callback: () => {}
        }, option);

        const sourceItem = jQuery('.' + option.sourceClass);
        sourceItem.show();

        const targetItem = jQuery('.' + option.targetClass);
        const sourceOffset = sourceItem.offset();
        const targetOffset = targetItem.offset();

        const body = jQuery('body');
        const newResourceItem = sourceItem.clone()
            .removeClass(option.sourceClass);

        const initCss = Object.assign({
            left: sourceOffset.left + 'px',
            top: sourceOffset.top + 'px',
            position: 'absolute',
            zIndex: 2000
        }, option.initCss);

        newResourceItem.appendTo(body)
            .css(initCss);

        const animationCss = Object.assign({
            left: targetOffset.left + 'px',
            top: targetOffset.top + 'px'
        }, option.animationCss);

        newResourceItem.animate(animationCss,
            option.speed,
            () => {
                newResourceItem.remove();
                return resolve();
            });
    }));
};