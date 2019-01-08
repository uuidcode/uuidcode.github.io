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

    setOnClick: function (selector, callback) {
        $('body').off('click', selector)
            .on('click', selector, function () {
                callback($(this));
            });
    },

    getModal: function (selector) {
        var $modal = $(selector).modal();
        var position = board.die.$ui.offset();

        $modal.find('.modal-dialog').css({
            position: 'absolute',
            left: position.left + 20,
            top: position.top,
            width: 600
        });

        return $modal
            .on('hide.bs.modal', function () {
                $(this).remove();
            });
    }
};