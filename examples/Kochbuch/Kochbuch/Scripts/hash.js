// from: https://github.com/javve/hash.js
// ... and a little bit hacked here and there

(function (window, undefined) {
"use strict";

var hash = (function() {

    var keyValueSeperator = "/";
    var paramSeperator = "&";

    var fromHash = function() {

        var params, paramsObject = {};

        // hack
        if (window.location.hash) {
            params = window.location.hash.replace(/^\#!|#/, "").split(paramSeperator);
        } else {
            params = [];
        }
         
        for(var i = 0; i < params.length; i++) {
            var a = params[i].split(keyValueSeperator);
            paramsObject[a[0]] =  decodeURIComponent(a[1]);
        }
        return paramsObject;
    };

    var toHash = function(params) {
        var str = [];
        for(var p in params) {
            str.push(p + keyValueSeperator + encodeURIComponent(params[p]));
        }
        window.location.hash = "!" + str.join(paramSeperator);
    };

    return {
        get: function(param) {
            var params = fromHash();
            if (param) {
                return params[param];
            } else {
                return params;
            }
        },
        add: function(newParams) {
            var params = fromHash();
            for (var p in newParams) {
                params[p] = newParams[p];
            }
            toHash(params);
        },
        remove: function(removeParams) {
            removeParams = (typeof(removeParams)=='string') ? [removeParams] : removeParams;
            var params = fromHash();
            for (var i = 0; i < removeParams.length; i++) {
                delete params[removeParams[i]];
            }
            toHash(params);
        },
        clear: function() {
            toHash({});
        }
    };
})();

window.hash = hash;
})(window);