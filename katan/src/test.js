import {setRoad} from "./road";
import {get} from "svelte/store";
import katan from "./katan";

test("setRoad", () => {
    setRoad(0, 0);
    expect(get(katan).playerList[0].construction.road).toEqual(14);
    expect(get(katan).playerList[1].construction.road).toEqual(15);
});