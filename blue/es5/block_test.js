console.log('>>> 1');
var data = Block.list[1];
console.log('>>> 2');
var block = new Block(1, data);
console.log('>>> 3');
$('body').append(block.$element);
console.log('>>> 4');
