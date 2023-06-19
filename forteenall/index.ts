import { createServer } from "http";
import { Action } from "./actions";

export type pathType = {
    [key: string]: pathType | typeof Action;
};

const director = (
    path: pathType,
    last: string = "",
    methods: string[] = []
): [string, Action, string[]][] => {
    let result: [string, Action, string[]][] = [];

    Object.entries(path).map(([endpoint, value]) => {
        if (typeof value === "object") {
            // if value of endpoint is not an Action
            // directing again and set on result
            result = [...result, ...director(value, `${last}/${endpoint}`)];
        } else if (typeof value === "function") {
            // if value === action type

            // set up action
            const tmp = new value({});

            // get action method supports
            const methods = Object.getOwnPropertyNames(
                Object.getPrototypeOf(tmp)
            ).filter((method) => method.toUpperCase() === method);

            result = [...result, [`${last}/${endpoint}`, tmp, methods]];
        }
    });

    return result;
};

export default function (path: pathType) {
    const paths = director(path);
    console.log(paths);

    createServer((req, res) => {
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
