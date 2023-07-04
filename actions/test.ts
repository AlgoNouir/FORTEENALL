import { Action } from "../forteenall/actions";

export default class Test extends Action {
    GET(req, h) {
        return "hello forteenall in Action";
    }
}
