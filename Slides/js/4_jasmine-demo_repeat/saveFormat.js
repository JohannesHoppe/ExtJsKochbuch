(function($) {
    var htmlEncode = function(input) {
        return ($('<div/>').text(input).html());
    };

    $.saveFormat = function () {
        var args = Array.prototype.slice.call(arguments);
        var txt = args.shift();

        $.each(args, function (i, item) {
            item = htmlEncode(item);
            txt = txt.replace("{" + i + "}", item);
        });
        return txt;
    };
})(window.jQuery);