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

export const sleep = second => {
    let now = new Date().getTime();
    while(new Date().getTime() < now + second * 1000) {}
};

export const shuffle = list => {
    return list.sort(random());
};

export const random = () => {
    return () => Math.random() - 0.5;
};

