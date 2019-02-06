import {$} from './config'
import {Price} from './price'

const $body = $('body');
const $element = Price.of().setPrice(100000).render();
$body.append($element);