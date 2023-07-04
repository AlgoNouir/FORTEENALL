import { IncomingMessage, ServerResponse } from "http";

export class Action {
    config: {
        [key: string]: any;
    };

    // type of all uppercase (method) is function
    [key: Uppercase<string>]: (
        req: IncomingMessage,
        res: ServerResponse
    ) => string;

    constructor(config: any) {
        this.config = config;
    }
}
