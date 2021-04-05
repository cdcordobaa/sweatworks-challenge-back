export const toCamelCase = (e: string): string => {
    return e.replace(/_([a-z])/g, g => g[1].toUpperCase());
};

export const toSnakeCase = (e: string): string => {
    const matched = e.match(/([A-Z])/g);
    return matched
        ? matched
              .reduce((str: any, c: string) => str.replace(new RegExp(c), '_' + c.toLowerCase()), e)
              .substring(e.slice(0, 1).match(/([A-Z])/g) ? 1 : 0)
        : e;
};

export const objToSnake = (inputObj: Object): Object => {
    return Object.keys(inputObj).reduce((acc, key) => {
        return { ...acc, [toSnakeCase(key)]: inputObj[key] };
    }, {});
};

export const objToCamel = (inputObj: Object): Object => {
    return Object.keys(inputObj).reduce((acc: Object, key: string) => {
        return { ...acc, [toCamelCase(key)]: inputObj[key] };
    }, {});
};
