export function toStyle (styleObject) {
    let style = '';

    Object.entries(styleObject)
        .forEach(([key, value]) => {
            style += `${key}:${value};`
        });

    return style;
}
