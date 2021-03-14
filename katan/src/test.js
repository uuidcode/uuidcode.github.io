import {sleep} from "./util";

test("sleep", () => {
    console.log('1');
    sleep(1000);
    console.log('2');
});