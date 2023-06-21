import { Action } from "../forteenall/actions";
import { IncomingMessage, ServerResponse } from "http";

export default class Test {
    public GET(req: IncomingMessage, res: ServerResponse): void {
        res.writeHead(200);
        res.write("hello forteenall action!");
        res.end();
    }
}
