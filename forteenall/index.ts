import { createServer } from "http";

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
            result = [...result, [`${last}/${endpoint}`, value]];
        }
    });

    return result;
};

export default function (path: pathType) {
    const paths = director(path);
    createServer((req, res) => {
        console.log(req.url);

        if (req.url !== undefined && paths.map((p) => p[0]).includes(req.url)) {
            console.log("i got url");
            res.write("ok");
            res.end();
        } else {
            res.write("not ok");
            res.end();
        }
    }).listen(3000, () => "hello world");
}
