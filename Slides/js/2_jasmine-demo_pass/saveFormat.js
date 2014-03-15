(function($){
    $.saveFormat = function (txt) {

        $(arguments).each(function (i, item) {
            if (i > 0) {
                item = ($('<div/>').text(item).html());
                txt = txt.replace("{" + (i - 1) + "}", item);
            }
        });
        return txt;
    };
})(window.jQuery);