var blockData = Block.list[1];
var block = new Block(1, blockData);
var building = new Building(block);
$('body').append(building.$element);