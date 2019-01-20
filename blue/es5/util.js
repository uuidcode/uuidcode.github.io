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
    }
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
        array.push('<hr>');
        array.push(board.getBlockHtml(name));
        return util.getDescriptionHtml(array);
    },

    createBuildingCostGoldenKey: function (name, priceList) {
        return {
            name: name,
            priceList : priceList,
            description: function () {
            var html = $('#buildingPriceTemplate').html();

            for (var i = 0; i < this.priceList.length; i++) {
                html = html.replace(util.getBuildCode(i), this.priceList[i]);
            }

            return name + '를 각 건물별로 아래와 같이 지불하세요.' + html;
        },
            run: function () {
                board.getCurrentPlayer().payForBuilding(this.priceList, name);
            }
        }
    },

    getDescriptionAndFromToHtml: function (array, from, to) {
        var descriptionHtml = this.getDescriptionHtml(array);
        var fromBlock = board.getTargetBlock(from);
        var toBlock = board.getTargetBlock(to);
        var html = $('#fromToTemplate').html();
        html = html.replace('fromImage', fromBlock.getImageUrl());
        html = html.replace('toImage', toBlock.getImageUrl());
        return descriptionHtml + '<hr>' + html;
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

    getBuildCode: function (index) {
        if (index == 0) {
            return 'hotel';
        } else if (index == 1) {
            return 'building';
        } else if (index == 2) {
            return 'villa';
        }

        return null;
    }
};