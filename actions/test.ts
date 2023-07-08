import { Action, Response, Render } from "../forteenall/actions";
import TestView from "../views/test";

export default class Test extends Action {
    GET() {
        return new Render(TestView);
    }
}
