    var mouseWidth = 250;
    var mouseHeight = 250;
    var alphabetWidth = 150;
    var alphabetHeight = 200;
    var width = 0;
    var height = 0;
    var matrix = [];
    var started = false;
    var allAlphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var backgroundIndex = random(17) + 1;
    var alphabetSpriteIndex = random(15) + 1;
    var alphabetSprite = './images/alphabet' + alphabetSpriteIndex + ".png";
    var word = wordList[random(wordList.length)];

    console.log('backgroundIndex', backgroundIndex);
    console.log('alphabetSpriteIndex', alphabetSpriteIndex);
    console.log('alphabetSprite', alphabetSprite);
    console.log('word', word);

    jQuery(document).ready(function() {
        width = jQuery(window).width();
        height = jQuery(window).height();
        console.log('width', width);
        console.log('height', height);

        setTimeout(function () {
            started = true;
            jQuery('div.alphabet').css({
                opacity: 0
            });

            jQuery('body').append('<div id=\"mouse\"><div id=\"mouseShadow\"></div>');
            jQuery('#mouse').css({
                width: mouseWidth,
                height: mouseHeight,
                left: (width - mouseWidth)/2,
                top: (height - mouseHeight)/2
            });
            jQuery('#mouseShadow').css({
                width: mouseWidth,
                height: mouseHeight,
            });
        }, 3000);

        console.log('backgroundIndex', backgroundIndex);

        jQuery('body').css({
            background: 'url("./images/background' + backgroundIndex + '.png") no-repeat center center fixed'
        });

        for (var i = 0; i < height; i++) {
            var row = [];
            for (var j = 0; j < width; j++) {
                if (i < alphabetHeight) {
                    row.push(1);
                } else {
                    row.push(0);
                }
            }
            matrix.push(row)
        }

        jQuery(window).resize(resize);
        resize();

        jQuery(document).on('mousemove', function(e){
            if (!started) {
                return;
            }

            jQuery('#mouse').css({
                left: e.pageX - mouseWidth/2,
                top: e.pageY - mouseWidth/2
            });

            var alphabet = jQuery('div.alphabet[status="none"]');
            alphabet.each(function() {
                var item = jQuery(this);
                var offset = item.position();
                var isVisible = false;

                isVisible = contain(offset, e, item);

                if (isVisible) {
                    var x = e.pageX - offset.left;
                    var y = e.pageY - offset.top;
                    var clipPath = 'circle(' + mouseWidth/2 + 'px at ' + x + 'px ' + y + 'px)';
                    console.log('clipPath', clipPath);

                    item.css({
                        'opacity': 1,
                        '-webkit-clip-path': clipPath,
                        'clip-path': clipPath
                    });

                    jQuery("#mp3_" + item.attr('letter'))[0].play();

                } else {
                    item.css({
                        opacity: 0,
                        '-webkit-clip-path': '',
                        'clip-path': ''
                    });
                }
            })
        });

        for (var i = 0; i < allAlphabetArray.length; i++) {
            jQuery('body')
                .append(
                    jQuery('<audio></audio>')
                    .attr('id', 'mp3_' + allAlphabetArray[i])
                    .append(
                        jQuery('<source></source>')
                            .attr('src', './mp3/' + allAlphabetArray[i] + ".mp3")));

        }

        jQuery('body')
            .append(
            jQuery('<audio></audio>')
                .attr('id', 'mp3_' + word)
                .append(
                jQuery('<source></source>')
                    .attr('src', './mp3/' + word + ".mp3")));

        var alphabetArray = word.split('');

        for (var i = 0; i < alphabetArray.length; i++) {
            var spriteX = -1 * (alphabetArray[i].charCodeAt(0) - 65)%13 * alphabetWidth;
            var spriteY = -1 * Math.floor((alphabetArray[i].charCodeAt(0) - 65)/13) * alphabetHeight;

            var alphabet = jQuery('<div/>')
                .attr('class', 'alphabet')
                .attr('status', 'none')
                .attr('index', i)
                .attr('letter', alphabetArray[i])
                .css({
                    fontSize: alphabetHeight,
                    background: 'url("' + alphabetSprite + '") ' + spriteX + 'px ' + spriteY + 'px'
                });

            jQuery('body').append(alphabet);
            alphabet.fadeOut().fadeIn().fadeOut().fadeIn().fadeOut().fadeIn();

            var completeRegion =
                jQuery('<div>')
                    .css({
                        background: 'white',
                        opacity: 0.7,
                        margin: '10px',
                        width: alphabetWidth - 20,
                        height: alphabetHeight - 20,
                        position: 'absolute',
                        left: i * alphabetWidth + 'px',
                        top: '0px',
                        zIndex: 50
                    })
                    .attr('index', i)
                    .attr('class', 'complete');

            jQuery('body').append(completeRegion);

            var left = 0;
            var top = 0;

            for (var j = 0; j < 10000; j++) {
                left = random(width - alphabetWidth) + 1;
                top = random(height - alphabetHeight) + 1;
                console.log('random');

                if (!duplicated(left, top)) {
                    break;
                }
            }

            setMatrix(left, top);

            alphabet.css({
                left: left,
                top: top,
                width: alphabetWidth,
                height: alphabetHeight,
                opacity: 1
            })
        }

        jQuery('body').on('click', function (e) {
            if (!started) {
                return;
            }

            var alphabet = jQuery('div.alphabet[status="none"]');
            var selected = false;

            alphabet.each(function() {
                var item = jQuery(this);
                var offset = item.position();

                if (!selected && contain(offset, e, item)) {
                    selected = true;
                    console.log('click');
                    item.show();
                    item.css({
                        opacity: 1
                    });
                    item.attr('status', 'selected');

                    var index = parseInt(jQuery(this).attr('index'), 10);

                    item.css({
                        '-webkit-clip-path': '',
                        'clip-path': ''
                    });

                    item.animate({
                        left: index * alphabetWidth,
                        top: 0
                    }, 200, function () {
                        jQuery('div.complete[index=' + index + ']').remove();

                        if (jQuery('div.alphabet[status="none"]').size() == 0) {
                            jQuery('#mp3_' + word)[0].play();

                            var imageDiv = jQuery('<div></div>');
                            var imageItem =
                                jQuery('<img>')
                                    .attr('src', './images/' + word + ".png");
                            imageDiv
                                .attr('id', 'modalForm')
                                .hide()
                                .append(imageItem);

                            jQuery('body').append(imageDiv);

                            $("#modalForm").modal({
                                fadeDuration: 100
                            });

                            $('#mouse').remove();
                        }
                    });
                }
            });
        });
    });

    function duplicated(left, top) {
        for (var i = left; i < left + alphabetWidth; i++) {
            for (var j = top; j < top + alphabetHeight; j++) {
                if (matrix[j][i] == 1) {
                    return true;
                }
            }
        }

        return false;
    }

    function setMatrix(left, top) {
        for (var i = left; i < left + alphabetWidth; i++) {
            for (var j = top; j < top + alphabetHeight; j++) {
                matrix[j][i] = 1;
            }
        }
    }

    function closeCallback() {
        window.location.reload();
    }

    function resize() {
        jQuery('#backgroundLayer')
            .height(jQuery(window).height())
            .width(jQuery(window).width());
    }

    function random(num) {
        return Math.floor(Math.random() * num);
    }

    function contain(offset, e, item) {
        var w = mouseWidth/3;
        if (offset.left - w <= e.pageX && e.pageX <= offset.left + item.width() + w) {
            if (offset.top - w <= e.pageY && e.pageY <= offset.top + item.height() + w) {
                return true;
            }
        }
        return false;
    }
