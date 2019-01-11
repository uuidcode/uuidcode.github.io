window.odometerOptions = {
    duration: 1000
};

(function($) {
    $.fn.showModal = function () {
        $(this).modal('show');
    };

    $.fn.hideModal = function () {
        $(this).modal('hide');
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
        array.push('<hr>');
        array.push(board.getBlockHtml(CONCORDE));
        return util.getDescriptionHtml(array);
    },

    getModal: function (selector) {
        var $modal = $(selector).modal();
        var position = board.die.$ui.offset();

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
    }
};