import {$} from './config'
import {Name} from './name'

const $body = $('body');
const $element = Name.of().setName('test').render();
$body.append($element);