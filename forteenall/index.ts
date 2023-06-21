import { Logger } from "@tsed/logger";
import { createServer } from "http";
import { Action } from "./actions";

const logger = new Logger("REQ");
logger.appenders.set("request", {
    type: "console",
    layout: {
        type: "pattern",
        pattern: "%z > %[ %d{yyyy/MM/dd hh:mm:ss} %]  %m",
    },
    level: ["info"],
});

export type pathType = {
    [key: string]: pathType | typeof Action;
};

const director = (
    path: pathType,
    last: string = ""
): { [key: string]: [Action, string[]] } => {
    let result: { [key: string]: [Action, string[]] } = {};

    Object.entries(path).map(([endpoint, value]) => {
        if (typeof value === "object") {
            // if value of endpoint is not an Action
            // directing again and set on result
            result = { ...result, ...director(value, `${last}/${endpoint}`) };
        } else if (typeof value === "function") {
            // if value === action type

            // set up action
            const tmp = new value({});

            // get action method supports
            const methods = Object.getOwnPropertyNames(
                Object.getPrototypeOf(tmp)
            ).filter((method) => method.toUpperCase() === method);

            result = { ...result, [`${last}/${endpoint}`]: [tmp, methods] };
        }
    });

    return result;
};

export default function (path: pathType) {
    logger.warn("start server ...");
    const paths = director(path);
    logger.warn("set path done.");

    console.log(paths);

    createServer((req, res) => {
        const log = `(${req.method}) ${req.url} - `;
        if (req.url !== undefined && paths[req.url] !== undefined) {
            logger.info(log, "ok");

            res.write("ok");
            res.end();
        } else {
            logger.error(log, "not ok");

            res.write("not ok");
            res.end();
        }
    }).listen(3000, () =>
        logger.warn("start deployment server on http://localhost:3000")
    );
}
