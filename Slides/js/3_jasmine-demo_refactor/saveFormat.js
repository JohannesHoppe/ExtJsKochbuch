(function($) {

    var htmlEncode = function(input) {
        return ($('<div/>').text(input).html());
    };

    $.saveFormat = function (txt) {
        $.each(arguments, function (i, item) {
            if (i > 0) {
                item = htmlEncode(item);
                txt = txt.replace("{" + (i - 1) + "}", item);
            }
        });
        return txt;
    };
})(window.jQuery);