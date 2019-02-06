import {$} from './config'
import {Flag} from './flag'

const $body = $('body');
const $element = Flag.of().setCode('kr').render();
$body.append($element);