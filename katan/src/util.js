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