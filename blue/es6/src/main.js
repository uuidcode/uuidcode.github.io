import { Flag } from './flag.js'
const flag = Flag.of();
console.log(flag.setCode('test').getCode());