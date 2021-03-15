import jQuery from "jquery";
import katanStore from "./katan";

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

export const random = () => {
    return () => Math.random() - 0.5;
};

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
};

export const move = (option) => {
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
                newResourceItem.remove();
                return resolve();
            });
    }));
};