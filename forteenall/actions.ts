import { IncomingMessage, ServerResponse } from "http";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";

export class Action {
    config: {
        [key: string]: any;
    };

    // type of all uppercase (method) is function
    [key: Uppercase<string>]: (
        req: IncomingMessage,
        res: ServerResponse
    ) => Response | Render;

    constructor(config: any) {
        this.config = config;
    }
}

// send json data with header and etc.
export class Response {
    data: string;
    constructor(message: string | any) {
        this.data = message;
    }
}

// fot render the react code in forntend
export class Render {
    data: () => React.ReactNode;
    constructor(view: () => React.ReactNode) {
        this.data = view;
    }

    async render(response: any) {
        const { pipe } = renderToPipeableStream(
            (await import("../views/test")).default,
            {
                bootstrapScripts: ["/index.ts"],
                onShellReady() {
                    response.setHeader("content-type", "text/html");
                    pipe(response);
                },
            }
        );
    }
}
