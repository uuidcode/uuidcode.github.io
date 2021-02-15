export const camelToDash = str => str.replace(/([A-Z])/g, val => `-${val.toLowerCase()}`);

export function toStyle (styleObject) {
    let style = '';

    Object.entries(styleObject)
        .forEach(([key, value]) => {
            let cssKey = camelToDash(key);
            style += `${cssKey}:${value};`
        });

    return style;
}
