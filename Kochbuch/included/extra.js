var setTargets = function() {
    var link, i = 0;   
    while (link = document.links[i++]) {
        if (link.href.indexOf('http://') !== -1) {
            link.target = '_blank';
        }
    }
}

var addCaption = function() {
       
    Ext.select('img').each(function(value) {

        var text = value.getAttribute('alt');
        
        if (text) {
        
        value.wrap({
                tag: 'figure',
            }).parent().createChild({
                tag: 'figcaption',
                html: text
            });
        }        
    });
}

Ext.onReady(setTargets);
Ext.onReady(addCaption);