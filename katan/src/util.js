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