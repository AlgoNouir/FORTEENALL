export type pathType = {
    [key: string]: pathType | actionType;
};

export type actionType = Function;

const director = (path: pathType, last: string = ""): [string, Function][] => {
    let result: [string, Function][] = [];

    Object.entries(path).map(([endpoint, value]) => {
        if (typeof value === "object") {
            result = [...result, ...director(value, `${last}/${endpoint}`)];
        } else {
            result = [...result, [`${last}/${endpoint}/`, value]];
        }
    });

    return result;
};

export default function (path: pathType) {
    console.log(director(path));
}
