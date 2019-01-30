if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

(function($) {
    $.fn.showModal = function () {
        return $(this).modal('show');
    };

    $.fn.hideModal = function () {
        return $(this).modal('hide');
    };

    $.fn.removeModalWhenClose = function () {
        $(this).on('hide.bs.modal', function () {
            $(this).remove();
        });
    };

    $.fn.setOnClick = function (callback, context) {
        return $(this).on('click', function () {
            callback.bind(context)($(this));
        });
    };
})(jQuery);

var util = {
    toAmount: function (name) {
        var match = name.match('([0-9]+)만원');

        if (match && match.length == 2) {
            return parseInt(match[1]) * 10000;
        }

        match = name.match('([0-9]+)만');

        var sum = 0;

        if (match && match.length == 2) {
            sum = parseInt(match[1]) * 10000;
        }

        match = name.match('([0-9]+)천원');

        if (match && match.length == 2) {
            sum += parseInt(match[1]) * 1000;
        }

        return sum;
    },

    getPayMessage: function (amount) {
        return util.toDisplayAmount(amount) + '을 주고 삽니다.'
    },

    toDisplayAmount: function (amount) {
        if (amount == 0) {
            return '0원';
        }

        var tenThousand = Math.floor(amount / 10000);
        var remainder = amount - tenThousand * 10000;
        var thousand = remainder / 1000;

        if (tenThousand > 0 && thousand > 0) {
            return tenThousand + '만 ' + thousand + '천원';
        } else if (tenThousand == 0 && thousand > 0) {
            return thousand + '천원';
        } else if (tenThousand > 0 && thousand == 0) {
            return tenThousand + '만원';
        }

        return '';
    },
    
    setOnClick: function (selector, callback) {
        $('body').off('click', selector)
            .on('click', selector, function () {
                callback($(this));
            });
    },

    getDescriptionHtml: function (array) {
        return array.join('<br>');
    },

    getDescriptionWithImageHtml: function (array, name) {
        if (board) {
            array.push('<hr>');
            array.push(board.getBlockHtml(name));
        }

        return util.getDescriptionHtml(array);
    },

    getDescriptionAndFromToHtml: function (array, from, to) {
        var descriptionHtml = this.getDescriptionHtml(array);
        var fromBlock = board.getTargetBlock(from);
        var toBlock = board.getTargetBlock(to);

        var template = Handlebars.compile(util.getFromToTemplate());
        var result = template(({
            fromBlock: fromBlock,
            toBlock: toBlock,
        }));

        return `${descriptionHtml}<hr>${result}`;
    },

    getFromToTemplate : function () {
        return `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-6 m-auto text-center">
                        <img src="{{fromBlock.getImageUrl}}" width="100%">
                    </div>
                    <div class="col-md-6 m-auto text-center">
                        <img src="{{toBlock.getImageUrl}}" width="100%">
                    </div>
                </div>
            </div>
        `;
    },

    getModal: function (selector) {
        var $modal = null;

        if ($.type(selector) === "string") {
            $modal = $(selector);
        } else {
            $modal = selector;
        }

        $modal.modal();

        var position = null;

        try {
            position = board.die.$element.offset();
        } catch (e) {
            position = {
                left: 0,
                top: 0
            };
        }

        $modal.find('.modal-dialog').css({
            position: 'absolute',
            left: position.left + 20,
            top: position.top,
            minWidth: 600,
            maxHeight: 800
        });

        return $modal
            .on('hide.bs.modal', function () {
                $(this).remove();
            });
    },

    getImageUrl: function (image) {
        return '../image/' + image;
    },

    getBuildName: function (index) {
        if (index == 0) {
            return '호텔';
        } else if (index == 1) {
            return '빌딩';
        } else if (index == 2) {
            return '별장';
        }

        return null;
    },


    shuffle: function(array) {
        var counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            var index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            var temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    },

    copy: function(src) {
        var target = {};

        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                target[prop] = src[prop];
            }
        }

        return target;
    }
};

Handlebars.registerHelper('amount', function (number) {
    return util.toDisplayAmount(number);
});

Handlebars.JavaScriptCompiler.prototype.nameLookup = function(parent, name, type) {
    if (parent === "helpers") {
        if (Handlebars.JavaScriptCompiler.isValidJavaScriptVariableName(name))
            return parent + "." + name;
        else
            return parent + "['" + name + "']";
    }

    if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
    } else if (Handlebars.JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        // ( typeof parent.name === "function" ? parent.name() : parent.name)
        var field = `${parent}.${name}`;
        return `(typeof ${field} === 'function' ?  ${field}() : ${field})`;
    } else {
        return parent + "['" + name + "']";
    }
};