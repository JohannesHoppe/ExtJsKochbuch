var setTargets = function() {
    var link, i = 0;
        while (link = document.links[i++]) {
            if (link.href.indexOf('http://') !== -1) {
            link.target = '_blank';
        }
    }
}

Ext.onReady(setTargets);