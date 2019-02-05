import { Flag } from './flag.js'
import { Player } from './player.js'
const flag = Flag.of();
console.log(flag.setCode('test').getCode());
const player = Player.of();
console.log(player.setIndex(1).getIndex());